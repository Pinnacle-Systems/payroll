import express from "express";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import net from "net";
import ZKLib from "node-zklib";
import moment from "moment-timezone";
import cors from "cors";

const WEB_PORT = process.env.WEB_PORT || 3000; // Web UI

const app = express();
const httpServer = createServer(app);
app.use(cors({
  origin: "*", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
const ESSL_DEVICE_IP = "192.168.1.50";
const ESSL_DEVICE_PORT = 4370;
// (async () => {
//   const zk = new ZKLib(ESSL_DEVICE_IP, ESSL_DEVICE_PORT, 60000);
//   try {
//     await zk.createSocket();
//     console.log("Connected!");
//     await zk.disconnect();
//   } catch (err) {
//     console.error("Connection test failed:", err);
//   }
// })();

async function fetchPunches(date = null) {
  
  const zk = new ZKLib(ESSL_DEVICE_IP, ESSL_DEVICE_PORT, 30000); 
  try {
    console.log("Connecting to device...");
    await zk.createSocket();

    const users = await zk.getUsers();
    const logs = await zk.getAttendances();

    const filterDate = date || moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

    const punches = (logs.data || [])
      ?.filter(
        (log) =>
          moment(log.recordTime).tz("Asia/Kolkata").format("DD-MM-YYYY") ===
          filterDate
      )
      ?.map((log) => {
        const user = (users.data || [])?.find(
          (u) => u.userId == log.deviceUserId
        );
        return {
          uid: log.deviceUserId,
          name: user?.name || "Unknown",
          date: moment(log.recordTime).tz("Asia/Kolkata").format("DD-MM-YYYY"),
          time: moment(log.recordTime).tz("Asia/Kolkata").format("HH:mm:ss"),
          punchType: log.type === 0 ? "Check-In" : "Check-Out",
          //   punchType: index === 0 ? "Check-In" : "Check-Out", // first punch = IN
        };
      });

    await zk.disconnect();
    return punches;
  } catch (err) {
    console.error("❌ fetchPunches error:", err);
    try {
      await zk.disconnect();
    } catch {}
    throw err;
  }
}

async function safeFetchPunches(date = null) {
  let attempts = 0;
  const maxAttempts = 5;
  const delayMs = 10000;
  while (attempts < maxAttempts) {
    attempts++;
    try {
      return await fetchPunches(date);
    } catch (err) {
      console.error(`fetchPunches attempt ${attempts} failed:`, err.message);
      if (attempts < maxAttempts) {
        console.log(`Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.warn(
          "⚠️ Could not fetch punches after 5 attempts. Returning empty array."
        );
        return []; // no data
      }
    }
  }
}

app.get("/api/punches", async (req, res) => {
    console.log("api Called");
    
  const date = req.query.date;
  const punches = await safeFetchPunches(date);
  res.json({ success: true, data: punches });
});


const wss = new WebSocketServer({ server: httpServer });

let deviceState = {
  connected: false,
  lastData: null,
  lastSeen: null,
};

const esslSocket = new net.Socket();

function connectToESSLDevice() {
  esslSocket.connect(ESSL_DEVICE_PORT, ESSL_DEVICE_IP, () => {
    console.log(
      `Connected to ESSL device at ${ESSL_DEVICE_IP}:${ESSL_DEVICE_PORT}`
    );
    deviceState.connected = true;
    deviceState.lastSeen = new Date();
    broadcastStatus();
  });

  esslSocket.on("data", (data) => {
    console.log("Received from ESSL:", data.toString());
    deviceState.lastData = data.toString();
    deviceState.lastSeen = new Date();
    broadcastStatus();
  });

  esslSocket.on("error", (err) => {
    console.error("ESSL Connection Error:", err);
    deviceState.connected = false;
    broadcastStatus();
    // Attempt reconnect after 5 seconds
    setTimeout(connectToESSLDevice, 5000);
  });

  esslSocket.on("close", () => {
    console.log("Connection to ESSL device closed");
    deviceState.connected = false;
    broadcastStatus();
  });
}

// WebSocket Communication
function broadcastStatus() {
  const status = {
    type: "device_status",
    ...deviceState,
    timestamp: new Date().toISOString(),
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(status));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("New web client connected");
  broadcastStatus(); // Send current status immediately

  ws.on("message", (message) => {
    try {
      const cmd = JSON.parse(message);
      if (cmd.type === "send_command" && cmd.command) {
        sendCommandToESSL(cmd.command);
      }
    } catch (e) {
      console.error("Error processing message:", e);
    }
  });
});

// Send command to ESSL device
function sendCommandToESSL(command) {
  if (esslSocket && deviceState.connected) {
    console.log(`Sending command to ESSL: ${command}`);
    esslSocket.write(command + "\r\n"); // Adjust terminator based on your device protocol
  } else {
    console.error("Cannot send command - device not connected");
  }
}

// API Endpoints
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


// Start server
httpServer.listen(WEB_PORT, () => {
  console.log(`Web interface available at http://192.168.1.50:${WEB_PORT}`);
  connectToESSLDevice();
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("Closing connections...");
  esslSocket.end();
httpServer.close();
  process.exit();
});