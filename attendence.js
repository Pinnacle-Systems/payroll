//  **************************   working code ************

import express from "express";
import { createServer } from "http";
import ZKLib from "node-zklib";
import moment from "moment-timezone";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const WEB_PORT = process.env.WEB_PORT || 3000;
const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const ESSL_DEVICE_IP = "192.168.1.50";
const ESSL_DEVICE_PORT = 4370;

// ----------------------
// Persistent ZKLib Connection
// ----------------------
let zk = null;
let zkConnected = false;

async function connectZKLib() {
  if (zkConnected) return; // already connected
  zk = new ZKLib(ESSL_DEVICE_IP, ESSL_DEVICE_PORT, 120000);
  try {
    await zk.createSocket();
    console.log(
      `✅ Connected to ESSL at ${ESSL_DEVICE_IP}:${ESSL_DEVICE_PORT}`
    );
    zkConnected = true;
  } catch (err) {
    console.error("❌ ZKLib connection failed:", err.message);
    zkConnected = false;
  }
}

// Try connecting at startup
connectZKLib();
// ----------------------
// Fetch punches on request only
// ----------------------

async function savePunchesToDB(punches) {
  const batchSize = 5000;
  for (let i = 0; i < punches.length; i += batchSize) {
    const batch = punches.slice(i, i + batchSize);
    const mIdCards = [...new Set(batch.map((p) => parseInt(p.mIdCard)))];
    const employees = await prisma.employee.findMany({
      where: { mIdCard: { in: mIdCards } },
    });
    const employeeMap = {};
    employees.forEach((e) => {
      employeeMap[e.mIdCard] = e.id; // map mIdCard => employeeId
    });
    const ips = [...new Set(batch.map((p) => p.machineIP))];
    const machineGrid = await prisma.machineInOutGrid.findMany({
      where: { machineIP: { in: ips } },
    });
    const machineMap = {};
    machineGrid.forEach((m) => {
      machineMap[m.machineIP] = m.machineTypeOne
    });
    await prisma.punchData.createMany({
      data: batch.map((p) => {
        const [day, month, year] = p.date.split("-");
        const formattedDate = `${year}-${month}-${day}`;

        return {
          mIdCard: parseInt(p.mIdCard),
          timestamp: new Date(`${formattedDate}T${p.time}`),
          machineIP: p.machineIP || "",
          machineType: machineMap[p.machineIP] || "UNKNOWN",
          employeeId: employeeMap[parseInt(p.mIdCard)] || null,
        };
      }),
      skipDuplicates: true,
    });
  }
}

async function fetchPunches(fromDate, toDate) {
  const maxAttempts = 5;
  const delayMs = 5000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    // await connectZKLib();
    if (!zkConnected) {
      console.log(
        `Attempt ${attempts}: ZKLib not connected, retrying in ${
          delayMs / 1000
        }s...`
      );
      await new Promise((res) => setTimeout(res, delayMs));
      continue;
    }

    try {
      // const users = await zk.getUsers();
      const logs = await zk.getAttendances();
      console.log(logs, "received");

      // const usersMap = {};
      // (users.data || []).forEach(u => usersMap[u.userId] = u.name);

      const fromTs = moment(fromDate, "DD-MM-YYYY").startOf("day").valueOf();
      const toTs = moment(toDate, "DD-MM-YYYY").endOf("day").valueOf();

      console.log(fromTs, toTs, "fromTs,toTs");

      const punches = (logs.data || [])
        .filter((log) => {
          const logTs = moment(log.recordTime).valueOf();

          return logTs >= fromTs && logTs <= toTs;
        })
        .map((log) => {
          // const user = users?.data.find((u) => u.userId === log.deviceUserId);
          return {
            mIdCard: parseInt(log.deviceUserId),
            // name: usersMap[log.deviceUserId] || "Unknown",
            // name: user?.name || "Unknown",

            date: moment(log.recordTime)
              .tz("Asia/Kolkata")
              .format("DD-MM-YYYY"),
            time: moment(log.recordTime).tz("Asia/Kolkata").format("HH:mm:ss"),
            machineIP: log.ip,
            // punchType: log.type === 0 ? "Check-In" : "Check-Out",
          };
        });
      // await savePunchesToDB(punches);

      return punches;
    } catch (err) {
      console.error(`Attempt ${attempts} failed:`, err.message);
      if (attempts < maxAttempts) {
        console.log(`Retrying in ${delayMs / 1000}s...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.warn("⚠️ Max attempts reached. Returning empty array.");
        return [];
      }
    }
  }

  return [];
}

// ----------------------
// API
// ----------------------
app.get("/api/punches", async (req, res) => {
  const { fromDate, toDate } = req.query;
  if (!fromDate || !toDate)
    return res
      .status(400)
      .json({ success: false, error: "fromDate and toDate required" });

  const punches = await fetchPunches(fromDate, toDate);
  res.json({ success: true, data: punches });
});

// ----------------------
// Start server
// ----------------------
httpServer.listen(WEB_PORT, () => {
  console.log(`Web interface available at http://localhost:${WEB_PORT}`);
  connectZKLib(); // connect once at startup, no fetch yet
});

// ----------------------
// Cleanup
// ----------------------
process.on("SIGINT", async () => {
  console.log("Closing ZKLib connection...");
  try {
    zk && (await zk.disconnect());
  } catch {}
  httpServer.close();
  process.exit();
});
