// import express from "express";
// import { createServer } from "http";
// import ZKLib from "node-zklib";
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

//   //   { ip: "192.168.101.241", port: 4370, name: "Device-101-241" },
//   //   { ip: "192.168.101.242", port: 4370, name: "Device-101-242" },
//   //   { ip: "192.168.103.241", port: 4370, name: "Device-241" },
//   //   { ip: "192.168.103.244", port: 4370, name: "Device-244" },
//   //   { ip: "192.168.103.245", port: 4370, name: "Device-245" },
//   //   { ip: "192.168.103.246", port: 4370, name: "Device-246" },
//   //   { ip: "192.168.103.247", port: 4370, name: "Device-247" },
//   //   { ip: "192.168.103.248", port: 4370, name: "Device-248" },
//   // Add more devices as needed
// ];

// // ----------------------
// // ZKLib Connection Management
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
//       console.error(
//         `Error disconnecting from ${currentDevice.name}:`,
//         err.message
//       );
//     }
//     currentZk = null;
//     currentDevice = null;
//   }

//   console.log(
//     `🔗 Connecting to ${device.name} at ${device.ip}:${device.port}...`
//   );

//   const zk = new ZKLib(device.ip, device.port, 30000);
//   try {
//     await zk.createSocket();
//     console.log(`✅ Connected to ${device.name}`);
//     currentZk = zk;
//     currentDevice = device;
//     return zk;
//   } catch (err) {
//     console.error(`❌ Failed to connect to ${device.name}:`, err.message);
//     throw err;
//   }
// }

// async function disconnectCurrentDevice() {
//   if (currentZk) {
//     try {
//       await currentZk.disconnect();
//       console.log(`🔌 Disconnected from ${currentDevice.name}`);
//     } catch (err) {
//       console.error(
//         `Error disconnecting from ${currentDevice.name}:`,
//         err.message
//       );
//     }
//     currentZk = null;
//     currentDevice = null;
//   }
// }

// // ----------------------
// // Database Operations
// // ----------------------

// async function savePunchesToDB(punches, deviceIP) {
//   if (punches.length === 0) return;

//   const batchSize = 5000;
//   for (let i = 0; i < punches.length; i += batchSize) {
//     const batch = punches.slice(i, i + batchSize);
//     await prisma.punchData.createMany({
//       data: batch.map((p) => {
//         const [day, month, year] = p.date.split("-");
//         const formattedDate = `${year}-${month}-${day}`;

//         return {
//           uid: parseInt(p.uid),
//           timestamp: new Date(`${formattedDate}T${p.time}`),
//           machineIP: deviceIP,
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
//       // Connect to current device
//       const zk = await connectToDevice(device);

//       // Fetch data from device
//       // const users = await zk.getUsers();
//       const logs = await zk.getAttendances();

//       const fromTs = moment(fromDate, "DD-MM-YYYY").startOf("day").valueOf();
//       const toTs = moment(toDate, "DD-MM-YYYY").endOf("day").valueOf();
//       console.log(fromTs, toTs, "fromTs,toTs");
//       const punches = (logs.data || [])
//         .filter((log) => {
//           const logTs = moment(log.recordTime).valueOf();
//           return logTs >= fromTs && logTs <= toTs;
//         })
//         .map((log) => ({
//           uid: log.deviceUserId,
//           date: moment(log.recordTime).tz("Asia/Kolkata").format("DD-MM-YYYY"),
//           time: moment(log.recordTime).tz("Asia/Kolkata").format("HH:mm:ss"),
//           machineIP: device.ip,
//         }));

//       console.log(`✅ Found ${punches.length} punches from ${device.name}`);

//       if (punches.length > 0) {
//         await savePunchesToDB(punches, device.ip);
//       }

//       allPunches.push(...punches);

//       // Disconnect from current device immediately after fetching
//       await disconnectCurrentDevice();

//       // Small delay before connecting to next device
//       await new Promise((res) => setTimeout(res, 1000));
//     } catch (err) {
//       console.error(`❌ Failed to fetch from ${device.name}:`, err.message);
//       // Continue to next device even if current one fails
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
//     return res
//       .status(400)
//       .json({ success: false, error: "fromDate and toDate required" });

//   try {
//     const punches = await fetchPunchesFromAllDevices(fromDate, toDate);
//     res.json({
//       success: true,
//       data: punches,
//       message: `Fetched ${punches.length} punches from ${DEVICES.length} devices`,
//     });
//   } catch (err) {
//     console.error("Error in /api/punches:", err);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch punches from devices",
//     });
//   }
// });

// // ----------------------
// // Device status endpoint
// // ----------------------
// app.get("/api/devices", (req, res) => {
//   res.json({
//     success: true,
//     devices: DEVICES.map((device) => ({
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
//     `Monitoring ${DEVICES.length} devices: ${DEVICES.map((d) => d.name).join(
//       ", "
//     )}`
//   );
// });

// // ----------------------
// // Cleanup
// // ----------------------
// process.on("SIGINT", async () => {
//   console.log("Closing all ZKLib connections...");
//   await disconnectCurrentDevice();
//   httpServer.close();
//   process.exit();
// });
