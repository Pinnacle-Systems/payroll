from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from zk import ZK
from datetime import datetime

app = FastAPI()

# Allow React (localhost:3000) and Node (localhost:5000) to call Python API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/fetch-logs")
def fetch_logs(from_date: str, to_date: str):
    try:
        zk = ZK("192.168.1.50", port=4370, timeout=5)
        conn = zk.connect()
        logs = conn.get_attendance()
        conn.disconnect()
    except Exception as e:
        return {"success": False, "error": str(e)}

    result = []
    for l in logs:
        log_date = str(l.timestamp.date())
        if from_date <= log_date <= to_date:
            result.append({
                "user_id": l.user_id,
                "timestamp": str(l.timestamp),
                "status": l.status
            })

    return {"success": True, "count": len(result), "data": result}
