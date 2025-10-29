# from fastapi import FastAPI, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# from zk import ZK
# from datetime import datetime
# from database import SessionLocal
# from models import PythonPunchData
# from sqlalchemy.exc import SQLAlchemyError

# app = FastAPI()

# # Allow React & Node
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # DB session dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# @app.get("/fetch-logs")
# def fetch_logs(from_date: str, to_date: str, db: Session = Depends(get_db)):
#     try:
#         zk = ZK("192.168.1.50", port=4370, timeout=10)
#         conn = zk.connect()
#         logs = conn.get_attendance()
#         conn.disconnect()
#     except Exception as e:
#         return {"success": False, "error": str(e)}

#     from_dt = datetime.strptime(from_date, "%Y-%m-%d").date()
#     to_dt = datetime.strptime(to_date, "%Y-%m-%d").date()

#     filtered_data = []
#     batch = []
#     batch_size = 5000
#     inserted_count = 0

#     try:
#         for l in logs:
#             log_date = l.timestamp.date()
#             if from_dt <= log_date <= to_dt:
#                 record = {
#                     "mIdCard": l.user_id,
#                     "timestamp": l.timestamp,
#                 }

#                 filtered_data.append({
#                     "mIdCard": l.user_id,
#                     "timestamp": str(l.timestamp),
#                 })

#                 batch.append(record)

#                 if len(batch) >= batch_size:
#                     db.bulk_insert_mappings(PythonPunchData, batch)
#                     db.commit()
#                     inserted_count += len(batch)
#                     batch.clear()

#         # Insert remaining
#         if batch:
#             db.bulk_insert_mappings(PythonPunchData, batch)
#             db.commit()
#             inserted_count += len(batch)

#     except SQLAlchemyError as e:
#         db.rollback()
#         return {"success": False, "error": str(e)}

#     return {
#         "success": True,
#         "count": inserted_count,
#         "data": filtered_data,
#     }
# from fastapi import FastAPI, Query
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime, timedelta
# from database import SessionLocal
# from models import PythonPunchData
# from zk import ZK

# app = FastAPI()

# # ✅ CORS setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/fetch-logs")
# async def fetch_logs(from_date: str = Query(...), to_date: str = Query(...)):
#     db = SessionLocal()
#     conn = None  # ✅ ensure defined before try block

#     try:
#         # ✅ Parse the date range
#         from_dt = datetime.strptime(from_date, "%Y-%m-%d")
#         to_dt = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)  # include full day

#         # ✅ Step 1: Check if data already exists in DB
#         existing_data = db.query(PythonPunchData).filter(
#             PythonPunchData.timestamp.between(from_dt, to_dt)
#         ).order_by(PythonPunchData.timestamp.asc()).all()

#         if existing_data:
#             return {
#                 "success": True,
#                 "source": "database",
#                 "message": f"Fetched {len(existing_data)} records from database (no machine connection).",
#                 "count": len(existing_data),
#                 "data": [
#                     {
#                         "id": record.id,
#                         "mIdCard": record.mIdCard,
#                         "timestamp": record.timestamp.isoformat(),
#                     }
#                     for record in existing_data
#                 ],
#             }

#         # ✅ Step 2: Only connect to machine if DB has no data
#         zk = ZK("192.168.1.50", port=4370, timeout=10)
#         try:
#             conn = zk.connect()
#             logs = conn.get_attendance()
#         except Exception as e:
#             return {"success": False, "error": f"Failed to connect to machine: {e}"}

#         if not logs:
#             return {
#                 "success": True,
#                 "source": "machine",
#                 "message": "No logs fetched from machine.",
#                 "count": 0,
#                 "data": [],
#             }

#         # ✅ Step 3: Filter logs for requested date range only
#         filtered_logs = [
#             log for log in logs
#             if from_dt <= log.timestamp < to_dt
#         ]

#         # ✅ Step 4: Save only filtered logs into DB
#         new_records = 0
#         for log in filtered_logs:
#             exists = db.query(PythonPunchData).filter_by(
#                 mIdCard=str(log.user_id),
#                 timestamp=log.timestamp
#             ).first()

#             if not exists:
#                 db.add(PythonPunchData(
#                     mIdCard=str(log.user_id),
#                     timestamp=log.timestamp
#                 ))
#                 new_records += 1

#         db.commit()

#         return {
#             "success": True,
#             "source": "machine",
#             "message": f"Fetched {len(filtered_logs)} logs from machine (filtered by date range). {new_records} new records saved.",
#             "new_records": new_records,
#             "count": len(filtered_logs),
#             "data": [
#                 {"mIdCard": str(log.user_id), "timestamp": log.timestamp.isoformat()}
#                 for log in filtered_logs
#             ],
#         }

#     except Exception as e:
#         db.rollback()
#         return {"success": False, "error": str(e)}

#     finally:
#         if conn:
#             try:
#                 conn.disconnect()
#             except Exception:
#                 pass
#         db.close()
# from fastapi import FastAPI, Query
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime, timedelta
# from database import SessionLocal
# from models import PythonPunchData
# from zk import ZK
# import socket

# app = FastAPI()

# # ✅ CORS setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/fetch-logs")
# async def fetch_logs(from_date: str = Query(...), to_date: str = Query(...)):
#     db = SessionLocal()
#     conn = None

#     try:
#         from_dt = datetime.strptime(from_date, "%Y-%m-%d")
#         to_dt = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)

#         # ✅ STEP 1: Check DB first
#         existing_data = db.query(PythonPunchData).filter(
#             PythonPunchData.timestamp.between(from_dt, to_dt)
#         ).order_by(PythonPunchData.timestamp.asc()).all()

#         if existing_data:
#             return {
#                 "success": True,
#                 "source": "database",
#                 "message": f"Fetched {len(existing_data)} records from database.",
#                 "count": len(existing_data),
#                 "data": [
#                     {
#                         "id": d.id,
#                         "mIdCard": d.mIdCard,
#                         "timestamp": d.timestamp.isoformat(),
#                     }
#                     for d in existing_data
#                 ],
#             }

#         # ✅ STEP 2: Try connecting to ZKTeco safely with timeout
#         zk = ZK("192.168.1.50", port=4370, timeout=10)
#         try:
#             socket.setdefaulttimeout(10)  # global timeout for socket
#             conn = zk.connect()
#             if not conn:
#                 return {"success": False, "error": "Could not connect to machine."}
#             logs = conn.get_attendance()
#         except socket.timeout:
#             return {"success": False, "error": "Connection to machine timed out."}
#         except Exception as e:
#             return {"success": False, "error": f"Failed to connect to machine: {e}"}

#         # ✅ STEP 3: Filter logs for requested date
#         filtered_logs = [log for log in logs if from_dt <= log.timestamp < to_dt]

#         if not filtered_logs:
#             return {
#                 "success": True,
#                 "source": "machine",
#                 "message": "No logs fetched for this date.",
#                 "count": 0,
#                 "data": [],
#             }

#         # ✅ STEP 4: Save only new logs (skip duplicates)
#         new_records = 0
#         for log in filtered_logs:
#             exists = db.query(PythonPunchData).filter_by(
#                 mIdCard=str(log.user_id), timestamp=log.timestamp
#             ).first()
#             if not exists:
#                 db.add(PythonPunchData(
#                     mIdCard=str(log.user_id),
#                     timestamp=log.timestamp
#                 ))
#                 new_records += 1

#         db.commit()

#         return {
#             "success": True,
#             "source": "machine",
#             "message": f"Fetched {len(filtered_logs)} logs from machine and saved {new_records} new records.",
#             "new_records": new_records,
#             "count": len(filtered_logs),
#             "data": [
#                 {"mIdCard": str(log.user_id), "timestamp": log.timestamp.isoformat()}
#                 for log in filtered_logs
#             ],
#         }

#     except Exception as e:
#         db.rollback()
#         return {"success": False, "error": str(e)}

#     finally:
#         if conn:
#             try:
#                 conn.disconnect()
#             except Exception:
#                 pass
#         db.close()