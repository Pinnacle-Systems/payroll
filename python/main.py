
# from fastapi import FastAPI, Query
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# from sqlalchemy import func
# from database import SessionLocal
# from models import PythonPunchData
# from zk import ZK
# import socket

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/fetch-logs")
# async def fetch_logs(
#     from_date: str = Query(...),
#     to_date: str = Query(...)
# ):
#     """
#     ✅ Logic:
#       1️⃣ If no data for date → fetch all logs from machine, save & return.
#       2️⃣ If data exists → check last saved timestamp; fetch only new logs after it.
#       3️⃣ If no new logs → return existing DB data.
#     """
#     db = SessionLocal()
#     conn = None

#     try:
#         # ---- 1️⃣ Parse date inputs ----
#         from_dt = datetime.strptime(from_date, "%Y-%m-%d")
#         to_dt = datetime.strptime(to_date, "%Y-%m-%d")

#         # Treat both dates as single-day request
#         start_dt = from_dt.replace(hour=0, minute=0, second=0, microsecond=0)
#         end_dt = from_dt.replace(hour=23, minute=59, second=59, microsecond=999999)
#         date_str = from_dt.strftime("%Y-%m-%d")

#         # ---- 2️⃣ Fetch existing records for that date ----
#         existing_logs = (
#             db.query(PythonPunchData)
#             .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
#             .order_by(PythonPunchData.timestamp.asc())
#             .all()
#         )

#         # ---- CASE 1: No data for date → fetch all from machine ----
#         if not existing_logs:
#             try:
#                 socket.setdefaulttimeout(5)
#                 zk = ZK("192.168.1.50", port=4370, timeout=5)
#                 conn = zk.connect()
#                 logs = conn.get_attendance()
#             except Exception as e:
#                 return {
#                     "success": False,
#                     "error": f"Failed to connect to device: {e}"
#                 }

#             # Filter only logs for requested date
#             logs_for_date = [log for log in logs if start_dt <= log.timestamp <= end_dt]

#             # Save logs for that date
#             for log in logs_for_date:
#                 db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp))
#             db.commit()

#             return {
#                 "success": True,
#                 "source": "machine",
#                 "message": f"Fetched and saved {len(logs_for_date)} logs for {date_str}.",
#                 "count": len(logs_for_date),
#                 "data": [
#                     {"mIdCard": l.user_id, "timestamp": l.timestamp.isoformat()}
#                     for l in logs_for_date
#                 ],
#             }

#         # ---- CASE 2: Data exists → check for new punches ----
#         last_saved_ts = (
#             db.query(func.max(PythonPunchData.timestamp))
#             .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
#             .scalar()
#         )

#         try:
#             socket.setdefaulttimeout(5)
#             zk = ZK("192.168.1.50", port=4370, timeout=5)
#             conn = zk.connect()
#             logs = conn.get_attendance()
#         except Exception as e:
#             # Device unreachable → return DB data only
#             return {
#                 "success": True,
#                 "source": "database",
#                 "message": f"Device unreachable, returning {len(existing_logs)} saved records.",
#                 "count": len(existing_logs),
#                 "data": [
#                     {"mIdCard": r.mIdCard, "timestamp": r.timestamp.isoformat()}
#                     for r in existing_logs
#                 ],
#             }

#         # Filter logs for same date after last saved timestamp
#         new_logs = [
#             log for log in logs
#             if start_dt <= log.timestamp <= end_dt and log.timestamp > last_saved_ts
#         ]

#         # ---- CASE 3: Save new punches only ----
#         new_count = 0
#         for log in new_logs:
#             exists = db.query(PythonPunchData).filter_by(
#                 mIdCard=str(log.user_id), timestamp=log.timestamp
#             ).first()
#             if not exists:
#                 db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp))
#                 new_count += 1

#         db.commit()

#         # Fetch final merged data for the date
#         all_logs = (
#             db.query(PythonPunchData)
#             .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
#             .order_by(PythonPunchData.timestamp.asc())
#             .all()
#         )

#         # ---- Return message based on new logs ----
#         if new_count == 0:
#             msg = f"No new logs found for {date_str}. Returning {len(all_logs)} records."
#             src = "database"
#         else:
#             msg = f"Saved {new_count} new logs. Total {len(all_logs)} records for {date_str}."
#             src = "machine"

#         return {
#             "success": True,
#             "source": src,
#             "message": msg,
#             "new_count": new_count,
#             "count": len(all_logs),
#             "data": [
#                 {"mIdCard": r.mIdCard, "timestamp": r.timestamp.isoformat()}
#                 for r in all_logs
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
# from sqlalchemy import func
# from database import SessionLocal
# from models import PythonPunchData
# from zk import ZK
# import socket

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/fetch-logs")
# async def fetch_logs(from_date: str = Query(...), to_date: str = Query(...)):
#     """
#      Smart Incremental Fetch (Supports Date Ranges)
#     Logic:
#       1 For each date between from_date → to_date:
#           - If no DB records: fetch all logs from device for that date.
#           - If DB has records: fetch logs after last saved timestamp.
#       2 Only save new (non-duplicate) logs.
#       3 Return all logs (across range) in a single combined list.
#     """
#     db = SessionLocal()
#     conn = None

#     try:
#         from_dt = datetime.strptime(from_date, "%Y-%m-%d")
#         to_dt = datetime.strptime(to_date, "%Y-%m-%d")

#         # ---- Connect to device once ----
#         try:
#             socket.setdefaulttimeout(10)
#             zk = ZK("192.168.1.50", port=4370, timeout=10)
#             conn = zk.connect()
#             all_machine_logs = conn.get_attendance()
#         except Exception as e:
#             all_machine_logs = []
#             print(f"⚠️ Device connection failed: {e}")

#         total_new = 0

#         # Iterate day-by-day for incremental update
#         current = from_dt
#         while current <= to_dt:
#             start_dt = current.replace(hour=0, minute=0, second=0, microsecond=0)
#             end_dt = current.replace(hour=23, minute=59, second=59, microsecond=999999)

#             existing_logs = (
#                 db.query(PythonPunchData)
#                 .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
#                 .order_by(PythonPunchData.timestamp.asc())
#                 .all()
#             )

#             if not existing_logs:
#                 if all_machine_logs:
#                     logs_for_date = [
#                         log for log in all_machine_logs if start_dt <= log.timestamp <= end_dt
#                     ]
#                     for log in logs_for_date:
#                         db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp))
#                     db.commit()
#                     total_new += len(logs_for_date)
#             else:
#                 last_saved_ts = (
#                     db.query(func.max(PythonPunchData.timestamp))
#                     .filter(PythonPunchData.timestamp.between(start_dt, end_dt))
#                     .scalar()
#                 )

#                 if all_machine_logs:
#                     new_logs = [
#                         log
#                         for log in all_machine_logs
#                         if start_dt <= log.timestamp <= end_dt and log.timestamp > last_saved_ts
#                     ]
#                     for log in new_logs:
#                         exists = (
#                             db.query(PythonPunchData)
#                             .filter_by(mIdCard=str(log.user_id), timestamp=log.timestamp)
#                             .first()
#                         )
#                         if not exists:
#                             db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp))
#                             total_new += 1
#                     db.commit()

#             current += timedelta(days=1)

#         #  After syncing all dates → return all combined logs from DB
#         all_logs = (
#             db.query(PythonPunchData)
#             .filter(PythonPunchData.timestamp.between(from_dt, to_dt + timedelta(days=1)))
#             .order_by(PythonPunchData.timestamp.asc())
#             .all()
#         )

#         return {
#             "success": True,
#             "from_date": from_date,
#             "to_date": to_date,
#             "total_new": total_new,
#             "count": len(all_logs),
#             "source": "machine" if all_machine_logs else "database",
#             "message": f"Synced logs from {from_date} to {to_date}. Total: {len(all_logs)}",
#             "data": [
#                 {"mIdCard": log.mIdCard, "timestamp": log.timestamp.isoformat()}
#                 for log in all_logs
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
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from sqlalchemy import func
from database import SessionLocal
from models import PythonPunchData
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

    try:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d")
        to_dt = datetime.strptime(to_date, "%Y-%m-%d") + timedelta(days=1)

        # ---- Connect once ----
        try:
            socket.setdefaulttimeout(10)
            zk = ZK("192.168.1.50", port=4370, timeout=10)
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

        total_new = 0
        current = from_dt

        # ---- Process day by day ----
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

            if not existing_logs:
                for log in logs_for_day:
                    db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp))
                db.commit()
                total_new += len(logs_for_day)
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
                        db.add(PythonPunchData(mIdCard=str(log.user_id), timestamp=log.timestamp))
                        total_new += 1
                db.commit()

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
            "to_date": to_date[:-9],  # remove extra day from +1
            "total_new": total_new,
            "count": len(all_logs_db),
            "source": "machine" if all_logs else "database",
            "message": f"Synced logs from {from_date} to {to_date[:-9]}. Total {len(all_logs_db)} records.",
            "data": [
                {"mIdCard": log.mIdCard, "timestamp": log.timestamp.isoformat()}
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
            except Exception:
                pass
        db.close()
