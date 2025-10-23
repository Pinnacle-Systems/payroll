// import express from "express";
// import { createServer } from "http";
// import ZKAttendanceClient from "zk-attendance-sdk";
// import moment from "moment-timezone";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const WEB_PORT = process.env.WEB_PORT || 3000;
// const app = express();
// const httpServer = createServer(app);

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   })
// );
// app.use(express.json());

// // Device configuration
// const DEVICES = [
//   { ip: "192.168.1.50", port: 4370, name: "Pinnacle" },
// ];

// // ----------------------
// // ZKAttendance SDK Connection Management
// // ----------------------
// let currentZk = null;
// let currentDevice = null;

// async function connectToDevice(device) {
//   // Disconnect from current device if connected
//   if (currentZk) {
//     try {
//       await currentZk.disconnect();
//       console.log(`🔌 Disconnected from ${currentDevice.name}`);
//     } catch (err) {
//       console.error(`Error disconnecting from ${currentDevice.name}:`, err);
//     }
//     currentZk = null;
//     currentDevice = null;
//   }

//   console.log(`🔗 Connecting to ${device.name} at ${device.ip}:${device.port}...`);

//   const zk = new ZKAttendanceClient(device.ip, device.port);

//   try {
//     await zk.createSocket();
//     console.log(`✅ Connected to ${device.name}`);
//     currentZk = zk;
//     currentDevice = device;
//     return zk;
//   } catch (err) {
//     console.error(`❌ Failed to connect to ${device.name}:`, err);
//     throw err;
//   }
// }

// async function disconnectCurrentDevice() {
//   if (currentZk) {
//     try {
//       await currentZk.disconnect();
//       console.log(`🔌 Disconnected from ${currentDevice.name}`);
//     } catch (err) {
//       console.error(`Error disconnecting from ${currentDevice.name}:`, err);
//     }
//     currentZk = null;
//     currentDevice = null;
//   }
// }

// // ----------------------
// // Database Operations
// // ----------------------
// async function savePunchesToDB(punches, deviceIP) {
//   if (!punches.length) return;

//   const batchSize = 5000;

//   for (let i = 0; i < punches.length; i += batchSize) {
//     const batch = punches.slice(i, i + batchSize);
//     const mIdCards = [...new Set(batch.map(p => parseInt(p.mIdCard)))];

//     const employees = await prisma.employee.findMany({
//       where: { mIdCard: { in: mIdCards } },
//     });

//     const employeeMap = Object.fromEntries(employees.map(e => [e.mIdCard, e.id]));

//     const ips = [...new Set(batch.map(p => p.machineIP))];
//     const machineGrid = await prisma.machineInOutGrid.findMany({
//       where: { machineIP: { in: ips } },
//     });

//     const machineMap = Object.fromEntries(machineGrid.map(m => [m.machineIP, m.machineTypeOne]));

//     await prisma.punchData.createMany({
//       data: batch.map(p => {
//         const [day, month, year] = p.date.split("-");
//         const formattedDate = `${year}-${month}-${day}`;

//         return {
//           mIdCard: parseInt(p.mIdCard),
//           timestamp: new Date(`${formattedDate}T${p.time}`),
//           machineIP: p.machineIP || "",
//           machineType: machineMap[p.machineIP] || "UNKNOWN",
//           employeeId: employeeMap[parseInt(p.mIdCard)] || null,
//         };
//       }),
//       skipDuplicates: true,
//     });
//   }
// }

// // ----------------------
// // Fetch punches from all devices sequentially
// // ----------------------
// async function fetchPunchesFromAllDevices(fromDate, toDate) {
//   const allPunches = [];

//   for (const device of DEVICES) {
//     console.log(`\n📥 Fetching punches from ${device.name}...`);

//     try {
//       const zk = await connectToDevice(device);

//       // getAttendances may differ — handle both array and object responses
//       let logs;
//       try {
//         logs = await zk.getAttendances();
//       } catch (err) {
//         console.error(`⚠️ Error during getAttendances:`, err);
//         throw err;
//       }

//       console.log("Raw logs received:", logs);

//       const logArray = Array.isArray(logs)
//         ? logs
//         : logs?.data || [];

//       const fromTs = moment(fromDate, "DD-MM-YYYY").startOf("day").valueOf();
//       const toTs = moment(toDate, "DD-MM-YYYY").endOf("day").valueOf();

//       const punches = logArray
//         .filter(log => {
//           const logTs = moment(log.recordTime).valueOf();
//           return logTs >= fromTs && logTs <= toTs;
//         })
//         .map(log => ({
//           mIdCard: parseInt(log.deviceUserId),
//           date: moment(log.recordTime).tz("Asia/Kolkata").format("DD-MM-YYYY"),
//           time: moment(log.recordTime).tz("Asia/Kolkata").format("HH:mm:ss"),
//           machineIP: device.ip,
//         }));

//       console.log(`✅ Found ${punches.length} punches from ${device.name}`);

//       // await savePunchesToDB(punches, device.ip);

//       allPunches.push(...punches);

//       await disconnectCurrentDevice();
//       await new Promise(res => setTimeout(res, 2000));
//     } catch (err) {
//       console.error(`❌ Failed to fetch from ${device.name}:`, err);
//       await disconnectCurrentDevice();
//     }
//   }

//   return allPunches;
// }

// // ----------------------
// // API
// // ----------------------
// app.get("/api/punches", async (req, res) => {
//   const { fromDate, toDate } = req.query;
//   if (!fromDate || !toDate)
//     return res.status(400).json({ success: false, error: "fromDate and toDate required" });

//   try {
//     const punches = await fetchPunchesFromAllDevices(fromDate, toDate);
//     res.json({
//       success: true,
//       data: punches,
//       message: `Fetched ${punches.length} punches from ${DEVICES.length} devices`,
//     });
//   } catch (err) {
//     console.error("Error in /api/punches:", err);
//     res.status(500).json({ success: false, error: "Failed to fetch punches from devices" });
//   }
// });

// app.get("/api/devices", (req, res) => {
//   res.json({
//     success: true,
//     devices: DEVICES.map(device => ({
//       ...device,
//       status: currentDevice?.ip === device.ip ? "connected" : "disconnected",
//     })),
//   });
// });

// // ----------------------
// // Start server
// // ----------------------
// httpServer.listen(WEB_PORT, () => {
//   console.log(`Web interface available at http://localhost:${WEB_PORT}`);
//   console.log(
//     `Monitoring ${DEVICES.length} devices: ${DEVICES.map(d => d.name).join(", ")}`
//   );
// });

// // ----------------------
// // Cleanup
// // ----------------------
// process.on("SIGINT", async () => {
//   console.log("Closing all ZKAttendance connections...");
//   await disconnectCurrentDevice();
//   httpServer.close();
//   process.exit();
// });
// server.js
import express from "express";
import { createServer } from "http";
import moment from "moment-timezone";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import ZKLibTCP from './ZKLibTCP.js';

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

// ----------------------
// Device configuration
// ----------------------
const DEVICES = [
  { ip: "192.168.1.50", port: 4370, name: "Pinnacle" },
  // add more devices here
];

// ----------------------
// ZKLibTCP Connection Management
// ----------------------
let currentZk = null;
let currentDevice = null;

async function connectToDevice(device) {
  if (currentZk) await disconnectCurrentDevice();

  console.log(`🔗 Connecting to ${device.name} at ${device.ip}:${device.port}...`);

  const zk = new ZKLibTCP(device.ip, device.port, 1200000); // 20 min timeout

  try {
    await zk.createSocket();
    await zk.connect(); // required to establish session
    console.log(`✅ Connected to ${device.name}`);
    currentZk = zk;
    currentDevice = device;
    return zk;
  } catch (err) {
    console.error(`❌ Failed to connect to ${device.name}:`, err?.message || err);
    throw err;
  }
}

async function disconnectCurrentDevice() {
  if (currentZk) {
    try {
      await currentZk.disconnect();
      console.log(`🔌 Disconnected from ${currentDevice.name}`);
    } catch (err) {
      console.error(`Error disconnecting from ${currentDevice.name}:`, err?.message || err);
    }
    currentZk = null;
    currentDevice = null;
  }
}

// ----------------------
// Database Operations
// ----------------------
async function savePunchesToDB(punches) {
  if (!punches.length) return;

  const batchSize = 5000;

  for (let i = 0; i < punches.length; i += batchSize) {
    const batch = punches.slice(i, i + batchSize);
    const mIdCards = [...new Set(batch.map(p => parseInt(p.mIdCard)))];

    const employees = await prisma.employee.findMany({
      where: { mIdCard: { in: mIdCards } },
    });
    const employeeMap = Object.fromEntries(employees.map(e => [e.mIdCard, e.id]));

    const ips = [...new Set(batch.map(p => p.machineIP))];
    const machineGrid = await prisma.machineInOutGrid.findMany({
      where: { machineIP: { in: ips } },
    });
    const machineMap = Object.fromEntries(machineGrid.map(m => [m.machineIP, m.machineTypeOne]));

    await prisma.punchData.createMany({
      data: batch.map(p => {
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

// ----------------------
// Fetch punches from all devices sequentially
// ----------------------
async function fetchPunchesFromAllDevices(fromDate, toDate) {
  const allPunches = [];

  for (const device of DEVICES) {
    console.log(`\n📥 Fetching punches from ${device.name}...`);

    try {
      const zk = await connectToDevice(device);

      const logs = await zk.getSmallAttendanceLogs(1000); // use batching
      const logArray = logs?.data || [];

      const fromTs = moment(fromDate, "DD-MM-YYYY").startOf("day").valueOf();
      const toTs = moment(toDate, "DD-MM-YYYY").endOf("day").valueOf();

      const punches = logArray
        .filter(log => {
          const logTs = moment(log.recordTime).valueOf();
          return logTs >= fromTs && logTs <= toTs;
        })
        .map(log => ({
          mIdCard: parseInt(log.deviceUserId),
          date: moment(log.recordTime).tz("Asia/Kolkata").format("DD-MM-YYYY"),
          time: moment(log.recordTime).tz("Asia/Kolkata").format("HH:mm:ss"),
          machineIP: device.ip,
        }));

      console.log(`✅ Found ${punches.length} punches from ${device.name}`);

      await savePunchesToDB(punches); // save to DB
      allPunches.push(...punches);

      await disconnectCurrentDevice();
      await new Promise(res => setTimeout(res, 2000));
    } catch (err) {
      console.error(`❌ Failed to fetch from ${device.name}:`, err?.message || err);
      await disconnectCurrentDevice();
    }
  }

  return allPunches;
}

// ----------------------
// API Endpoints
// ----------------------
app.get("/api/punches", async (req, res) => {
  const { fromDate, toDate } = req.query;
  if (!fromDate || !toDate)
    return res.status(400).json({ success: false, error: "fromDate and toDate required" });

  try {
    const punches = await fetchPunchesFromAllDevices(fromDate, toDate);
    res.json({
      success: true,
      data: punches,
      message: `Fetched ${punches.length} punches from ${DEVICES.length} devices`,
    });
  } catch (err) {
    console.error("Error in /api/punches:", err);
    res.status(500).json({ success: false, error: "Failed to fetch punches from devices" });
  }
});

app.get("/api/devices", (req, res) => {
  res.json({
    success: true,
    devices: DEVICES.map(device => ({
      ...device,
      status: currentDevice?.ip === device.ip ? "connected" : "disconnected",
    })),
  });
});

// ----------------------
// Start server
// ----------------------
httpServer.listen(WEB_PORT, () => {
  console.log(`Web interface available at http://localhost:${WEB_PORT}`);
  console.log(
    `Monitoring ${DEVICES.length} devices: ${DEVICES.map(d => d.name).join(", ")}`
  );
});

// ----------------------
// Cleanup
// ----------------------
process.on("SIGINT", async () => {
  console.log("Closing all ZKLibTCP connections...");
  await disconnectCurrentDevice();
  httpServer.close();
  process.exit();
});
