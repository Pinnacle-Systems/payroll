from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from sqlalchemy import func
from database import SessionLocal
from models import PythonPunchData,MachineInOutGrid,Employee
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
    Logic:
      1️⃣ Fetch logs from machine once.
      2️⃣ Filter only requested date range.
      3️⃣ For each day in range:
            - If DB empty: insert all.
            - Else: insert only new punches after last saved timestamp.
      4️⃣ Return all logs (from requested range only).
    """
    db = SessionLocal()
    conn = None
    MACHINE_IP = "192.168.1.50"
    try:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d")
        to_dt = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)
        print("API Called")
        # ---- Connect once ----
        try:
            socket.setdefaulttimeout(10)
            zk = ZK(MACHINE_IP, port=4370, timeout=10)
            conn = zk.connect()
            all_logs = conn.get_attendance()
        except Exception as e:
            all_logs = []
            print(f"⚠️ Device connection failed: {e}")

        # ✅ Filter only logs in the requested range
        filtered_logs = [
            log for log in all_logs
            if from_dt <= log.timestamp < to_dt
        ]
         # ---- Get machine details once ----
        machine_info = (
            db.query(MachineInOutGrid)
            .filter(MachineInOutGrid.machineIp == MACHINE_IP)
            .first()
        )

       

        machineInOutGridId = machine_info.id if machine_info else None
        machineType = machine_info.machineTypeOne if machine_info else None
        employees = {e.mIdCard: e.id for e in db.query(Employee).all()}

        total_new = 0
        current = from_dt

        # ---- Process day by day ----
        while current < to_dt:
            start_dt = current.replace(hour=0, minute=0, second=0, microsecond=0)
            end_dt = current.replace(hour=23, minute=59, second=59, microsecond=999999)
            log_objects = []
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
            
            if not existing_logs:
                
                for log in logs_for_day:

                    # 🔍 Match employee by mIdCard
                    # employee = (
                    #     db.query(Employee)
                    #     .filter(Employee.mIdCard == str(log.user_id))
                    #     .first()
                    # )
                    # employeeId = employee.id if employee else None
                    # employeeId = employees.get(str(log.user_id))  
                    employeeId = employees.get(int(log.user_id))


                #     db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp,machineIP=MACHINE_IP,machineInOutGridId=machineInOutGridId,
                #             machineType=machineType,employeeId=employeeId,))
                # db.commit()
                # total_new += len(logs_for_day)
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
                        # employeeId = employees.get(str(log.user_id))  
                        employeeId = employees.get(int(log.user_id))

                        # employee = (
                        #     db.query(Employee)
                        #     .filter(Employee.mIdCard == str(log.user_id))
                        #     .first()
                        # )
                        # employeeId = employee.id if employee else None
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

                #         db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp,machineIP=MACHINE_IP,machineInOutGridId=machineInOutGridId,
                #             machineType=machineType,employeeId=employeeId))
                #         total_new += 1
                # db.commit()

            current += timedelta(days=1)

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
            "to_date": to_date,  # remove extra day from +1
            "total_new": total_new,
            "count": len(all_logs_db),
            "source": "machine" if all_logs else "database",
            "message": f"Synced logs from {from_date} to {to_date}. Total {len(all_logs_db)} records.",
            "data": [
                {"mIdCard": log.mIdCard, "timestamp": log.timestamp.isoformat(),"machineIP": log.machineIP,"machineType": log.machineType,
                    "machineInOutGridId": log.machineInOutGridId,"employeeId": log.employeeId,}
                for log in all_logs_db
            ],
        }

    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}

    finally:
        if conn:
            try:
                conn.disconnect()
                zk.disable_device()
            except Exception:
                pass
        db.close()
