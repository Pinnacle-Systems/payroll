import express from "express";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import net from "net";
import ZKLib from "node-zklib";
import moment from "moment-timezone";
import cors from "cors";

const WEB_PORT = process.env.WEB_PORT || 3000;
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const ESSL_DEVICE_IP = "192.168.1.50";
const ESSL_DEVICE_PORT = 4370;

// =====================
// Optimized Punch Fetch
// =====================
async function fetchPunchesRange(fromDate, toDate) {
  const zk = new ZKLib(ESSL_DEVICE_IP, ESSL_DEVICE_PORT, 120000); // 2 min timeout
  try {
    console.log("Connecting to device...");
    await zk.createSocket();

    const users = await zk.getUsers();
    const logs = await zk.getAttendances();

    // Map users for fast lookup
    const usersMap = {};
    (users.data || []).forEach(u => usersMap[u.userId] = u.name);

    const fromTs = moment(fromDate, "DD-MM-YYYY").startOf("day").valueOf();
    const toTs = moment(toDate, "DD-MM-YYYY").endOf("day").valueOf();

    const punches = (logs.data || [])
      .filter(log => {
        const logTs = moment(log.recordTime).valueOf();
        return logTs >= fromTs && logTs <= toTs;
      })
      .map(log => ({
        uid: log.deviceUserId,
        name: usersMap[log.deviceUserId] || "Unknown",
        date: moment(log.recordTime).tz("Asia/Kolkata").format("DD-MM-YYYY"),
        time: moment(log.recordTime).tz("Asia/Kolkata").format("HH:mm:ss"),
        punchType: log.type === 0 ? "Check-In" : "Check-Out",
      }));

    await zk.disconnect();
    return punches;
  } catch (err) {
    console.error("❌ fetchPunchesRange error:", err);
    try { await zk.disconnect(); } catch {}
    throw err;
  }
}

// Retry wrapper
async function safeFetchPunchesRange(fromDate, toDate) {
  let attempts = 0;
  const maxAttempts = 5;
  const delayMs = 10000;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      return await fetchPunchesRange(fromDate, toDate);
    } catch (err) {
      console.error(`fetchPunchesRange attempt ${attempts} failed:`, err.message);
      if (attempts < maxAttempts) {
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        console.warn("⚠️ Could not fetch punches after max attempts. Returning empty array.");
        return [];
      }
    }
  }
}

// =====================
// API Endpoints
// =====================
app.get("/api/punches", async (req, res) => {
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ success: false, error: "fromDate and toDate required (format DD-MM-YYYY)" });
  }

  const punches = await safeFetchPunchesRange(fromDate, toDate);
  res.json({ success: true, data: punches });
});

app.get("/api/status", (req, res) => {
  res.json({
    ...deviceState,
    deviceIp: ESSL_DEVICE_IP,
    devicePort: ESSL_DEVICE_PORT,
  });
});

app.post("/api/command", (req, res) => {
  if (req.body.command) {
    sendCommandToESSL(req.body.command);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Command required" });
  }
});

// =====================
// WebSocket & Device TCP
// =====================
const wss = new WebSocketServer({ server: httpServer });

let deviceState = {
  connected: false,
  lastData: null,
  lastSeen: null,
};

const esslSocket = new net.Socket();

function connectToESSLDevice() {
  esslSocket.connect(ESSL_DEVICE_PORT, ESSL_DEVICE_IP, () => {
    console.log(`Connected to ESSL device at ${ESSL_DEVICE_IP}:${ESSL_DEVICE_PORT}`);
    deviceState.connected = true;
    deviceState.lastSeen = new Date();
    broadcastStatus();
  });

  esslSocket.on("data", (data) => {
    deviceState.lastData = data.toString();
    deviceState.lastSeen = new Date();
    broadcastStatus();
  });

  esslSocket.on("error", (err) => {
    console.error("ESSL Connection Error:", err);
    deviceState.connected = false;
    broadcastStatus();
    setTimeout(connectToESSLDevice, 5000);
  });

  esslSocket.on("close", () => {
    console.log("Connection to ESSL device closed");
    deviceState.connected = false;
    broadcastStatus();
  });
}

function broadcastStatus() {
  const status = {
    type: "device_status",
    ...deviceState,
    timestamp: new Date().toISOString(),
  };

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(status));
  });
}

wss.on("connection", (ws) => {
  console.log("New web client connected");
  broadcastStatus();

  ws.on("message", (message) => {
    try {
      const cmd = JSON.parse(message);
      if (cmd.type === "send_command" && cmd.command) sendCommandToESSL(cmd.command);
    } catch (e) {
      console.error("Error processing message:", e);
    }
  });
});

function sendCommandToESSL(command) {
  if (esslSocket && deviceState.connected) {
    console.log(`Sending command to ESSL: ${command}`);
    esslSocket.write(command + "\r\n");
  } else {
    console.error("Cannot send command - device not connected");
  }
}

// =====================
// Start server
// =====================
httpServer.listen(WEB_PORT, () => {
  console.log(`Web interface available at http://${ESSL_DEVICE_IP}:${WEB_PORT}`);
  connectToESSLDevice();
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("Closing connections...");
  esslSocket.end();
  httpServer.close();
  process.exit();
});
