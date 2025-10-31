from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from sqlalchemy import func
from database import SessionLocal
from models import PythonPunchData, MachineInOutGrid, Employee
from zk import ZK
import socket

app = FastAPI()

# ✅ Enable CORS
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
    ✅ Multi-Device Smart Incremental Fetch
    Logic:
      - Loop through all device IPs one by one.
      - Connect → Fetch → Insert → Disconnect.
      - For each day in the range, insert only new punches.
      - Keep old logic for machineInOutGridId and machineTypeOne.
    """

    db = SessionLocal()
    conn = None

    # ✅ Define your device list manually
    DEVICES = [
        {"ip": "192.168.1.50"},
        {"ip": "192.168.1.51"},
        # Add more device IPs here if needed
    ]

    try:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d")
        to_dt = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)

        total_new = 0
        all_logs_db = []

        employees = {e.mIdCard: e.id for e in db.query(Employee).all()}

        for device in DEVICES:
            MACHINE_IP = device["ip"]
            print(f"🔹 Connecting to device {MACHINE_IP}...")

            # ---- Get machine details once ----
            machine_info = (
                db.query(MachineInOutGrid)
                .filter(MachineInOutGrid.machineIp == MACHINE_IP)
                .first()
            )

            machineInOutGridId = machine_info.id if machine_info else None
            machineType = machine_info.machineTypeOne if machine_info else None

            # ---- Try connecting to device ----
            try:
                socket.setdefaulttimeout(10)
                zk = ZK(MACHINE_IP, port=4370, timeout=10)
                conn = zk.connect()
                all_logs = conn.get_attendance()
                print(f"✅ Connected and fetched {len(all_logs)} logs from {MACHINE_IP}")
            except Exception as e:
                all_logs = []
                print(f"⚠️ Device {MACHINE_IP} connection failed: {e}")

            # ✅ Filter only logs in the requested range
            filtered_logs = [
                log for log in all_logs
                if from_dt <= log.timestamp < to_dt
            ]

            current = from_dt
            while current < to_dt:
                start_dt = current.replace(hour=0, minute=0, second=0, microsecond=0)
                end_dt = current.replace(hour=23, minute=59, second=59, microsecond=999999)
                logs_for_day = [log for log in filtered_logs if start_dt <= log.timestamp <= end_dt]
                if not logs_for_day:
                    current += timedelta(days=1)
                    continue

                existing_logs = (
                    db.query(PythonPunchData)
                    .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
                    .order_by(PythonPunchData.timestamp.asc())
                    .all()
                )

                log_objects = []
                if not existing_logs:
                    for log in logs_for_day:
                        employeeId = employees.get(str(log.user_id))
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
                    if log_objects:
                        db.bulk_save_objects(log_objects)
                        db.commit()
                        total_new += len(log_objects)
                else:
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
                            employeeId = employees.get(str(log.user_id))
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
                    if log_objects:
                        db.bulk_save_objects(log_objects)
                        db.commit()
                        total_new += len(log_objects)

                current += timedelta(days=1)

            # ✅ Disconnect safely
            if conn:
                try:
                    conn.disconnect()
                    zk.disable_device()
                    print(f"🔌 Disconnected from {MACHINE_IP}")
                except Exception:
                    pass

        # ✅ Fetch only requested range logs from DB
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
            "message": f"Synced logs from {from_date} to {to_date}. Total {len(all_logs_db)} records.",
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
        return {"success": False, "error": str(e)}

    finally:
        db.close()
