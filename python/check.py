from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from sqlalchemy import func
from database import SessionLocal
from models import PythonPunchData, MachineInOutGrid, Employee
from zk import ZK
import socket

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/fetch-logs")
async def fetch_logs(from_date: str = Query(...), to_date: str = Query(...)):
    """
    ✅ Smart Incremental Fetch (Efficient for Large Logs)
    Steps:
      1️⃣ Fetch logs from machine once.
      2️⃣ Filter only requested date range.
      3️⃣ For each day:
            - If DB empty → bulk insert all logs for that day.
            - Else → insert only new logs after last timestamp.
      4️⃣ Return logs from DB for that range.
    """
    db = SessionLocal()
    conn = None
    MACHINE_IP = "192.168.1.50"

    try:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d")
        to_dt = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)
        print("📅 Fetch logs between:", from_dt, "→", to_dt)

        # ---- Connect to machine once ----
        try:
            socket.setdefaulttimeout(10)
            zk = ZK(MACHINE_IP, port=4370, timeout=10)
            conn = zk.connect()
            all_logs = conn.get_attendance()
            print(f"✅ Connected to machine, got {len(all_logs)} logs")
        except Exception as e:
            print(f"⚠️ Device connection failed: {e}")
            all_logs = []

        # ---- Filter logs only within the requested range ----
        filtered_logs = [
            log for log in all_logs if from_dt <= log.timestamp < to_dt
        ]

        # ---- Get machine info (to fill in DB fields) ----
        machine_info = (
            db.query(MachineInOutGrid)
            .filter(MachineInOutGrid.machineIp == MACHINE_IP)
            .first()
        )
        machineInOutGridId = machine_info.id if machine_info else None
        machineType = machine_info.machineTypeOne if machine_info else None

        total_new = 0
        current = from_dt

        # ---- Process logs per day ----
        while current < to_dt:
            start_dt = current.replace(hour=0, minute=0, second=0, microsecond=0)
            end_dt = current.replace(hour=23, minute=59, second=59, microsecond=999999)
            logs_for_day = [log for log in filtered_logs if start_dt <= log.timestamp <= end_dt]

            if not logs_for_day:
                current += timedelta(days=1)
                continue

            # ---- Check existing logs for that day ----
            existing_logs = (
                db.query(PythonPunchData)
                .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
                .order_by(PythonPunchData.timestamp.asc())
                .all()
            )

            log_objects = []

            if not existing_logs:
                # 🚀 DB empty → bulk insert all logs for the day
                for log in logs_for_day:
                    employee = (
                        db.query(Employee)
                        .filter(Employee.mIdCard == str(log.user_id))
                        .first()
                    )
                    employeeId = employee.id if employee else None

                    log_objects.append(
                        PythonPunchData(
                            mIdCard=str(log.user_id),
                            timestamp=log.timestamp,
                            machineIP=MACHINE_IP,
                            machineInOutGridId=machineInOutGridId,
                            machineType=machineType,
                            employeeId=employeeId,
                        )
                    )

            else:
                # 🚀 Insert only new logs (after last saved timestamp)
                last_saved_ts = (
                    db.query(func.max(PythonPunchData.timestamp))
                    .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
                    .scalar()
                )

                new_logs = [log for log in logs_for_day if log.timestamp > last_saved_ts]

                for log in new_logs:
                    exists = (
                        db.query(PythonPunchData)
                        .filter_by(mIdCard=str(log.user_id), timestamp=log.timestamp)
                        .first()
                    )
                    if not exists:
                        employee = (
                            db.query(Employee)
                            .filter(Employee.mIdCard == str(log.user_id))
                            .first()
                        )
                        employeeId = employee.id if employee else None

                        log_objects.append(
                            PythonPunchData(
                                mIdCard=str(log.user_id),
                                timestamp=log.timestamp,
                                machineIP=MACHINE_IP,
                                machineInOutGridId=machineInOutGridId,
                                machineType=machineType,
                                employeeId=employeeId,
                            )
                        )

            # ✅ Bulk save for both cases
            if log_objects:
                db.bulk_save_objects(log_objects)
                db.commit()
                total_new += len(log_objects)
                print(f"💾 Inserted {len(log_objects)} new logs for {start_dt.date()}")

            current += timedelta(days=1)

        # ✅ Fetch all logs for the requested range
        all_logs_db = (
            db.query(PythonPunchData)
            .filter(PythonPunchData.timestamp.between(from_dt, to_dt))
            .order_by(PythonPunchData.timestamp.asc())
            .all()
        )

        return {
            "success": True,
            "from_date": from_date,
            "to_date": to_date,
            "total_new": total_new,
            "count": len(all_logs_db),
            "source": "machine" if all_logs else "database",
            "message": f"Synced {len(all_logs_db)} records between {from_date} and {to_date}",
            "data": [
                {
                    "mIdCard": log.mIdCard,
                    "timestamp": log.timestamp.isoformat(),
                    "machineIP": log.machineIP,
                    "machineType": log.machineType,
                    "machineInOutGridId": log.machineInOutGridId,
                    "employeeId": log.employeeId,
                }
                for log in all_logs_db
            ],
        }

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}

    finally:
        if conn:
            try:
                conn.disconnect()
            except Exception:
                pass
        db.close()
