// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function get(searchParams) {
//   const { date } = searchParams;

//   if (!date) {
//     throw new Error("date are required");
//   }

//   const [year, month, day] = date.split("-");

//   // Create start and end of day in IST
//   // const startIST = new Date(`${year}-${month}-${day}T00:00:00+05:30`);
//   // const endIST = new Date(`${year}-${month}-${day}T23:59:59+05:30`);
//   const startIST = new Date(`${year}-${month}-${day}T00:00:00`);
//   const endIST = new Date(`${year}-${month}-${day}T23:59:59`);
//   console.log(startIST,'startIST');
//   console.log(endIST,'endIST');

//   const data = await prisma.punchData.findMany({
//     // where: {
//     //   timestamp: {
//     //     gte: startIST,
//     //     lte: endIST,
//     //   },
//     // },
//     orderBy: {
//       timestamp: "asc",
//     },
//   });

//   return { data };
// }

// export { get };
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get(searchParams) {
  const { date } = searchParams;
  if (!date) throw new Error("date is required");

  // const rawData = await prisma.$queryRaw`
  //   SELECT
  //     uid,
  //     DATE_FORMAT(MIN(timestamp), '%Y-%m-%d %H:%i:%s') AS inTime,
  //     DATE_FORMAT(MAX(timestamp), '%Y-%m-%d %H:%i:%s') AS outTime
  //   FROM PunchData
  //   WHERE DATE(timestamp) = ${date}
  //   GROUP BY uid
  //   ORDER BY uid
  // `;
  //   const rawData = await prisma.$queryRaw`
  //   SELECT uid,
  //          MIN(CASE WHEN rn = 1 THEN ts END) AS inTime,
  //          MIN(CASE WHEN rn = 2 THEN ts END) AS firstBreakOut,
  //          MIN(CASE WHEN rn = 3 THEN ts END) AS firstBreakIn,
  //          MAX(CASE WHEN rn = cnt THEN ts END) AS outTime,
  //          MAX(CASE WHEN rn = cnt-1 THEN ts END) AS eveningBreakIn,
  //          MAX(CASE WHEN rn = cnt-2 THEN ts END) AS eveningBreakOut
  //   FROM (
  //       SELECT
  //           uid,
  //           timestamp AS ts,
  //           ROW_NUMBER() OVER (PARTITION BY uid ORDER BY timestamp) AS rn,
  //           COUNT(*) OVER (PARTITION BY uid) AS cnt
  //       FROM PunchData
  //       WHERE DATE(timestamp) = ${date}
  //   ) t
  //   GROUP BY uid
  //   ORDER BY uid
  // `;
  const rawData = await prisma.$queryRaw`
    WITH Punches AS (
      SELECT
        uid,
        machineType,
        timestamp AS ts,
        ROW_NUMBER() OVER (PARTITION BY uid, machineType ORDER BY timestamp ASC) AS rn_asc,
        ROW_NUMBER() OVER (PARTITION BY uid, machineType ORDER BY timestamp DESC) AS rn_desc,
        COUNT(*) OVER (PARTITION BY uid, machineType) AS cnt
      FROM PunchData
      WHERE DATE(timestamp) = ${date}
    )
    SELECT
      uid,

      -- IN time
      COALESCE(
        MIN(CASE WHEN machineType='IN' AND rn_asc=1 THEN ts END),
        MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=1 THEN ts END)
      ) AS inTime,

      -- First Break Out
      COALESCE(
        MAX(CASE WHEN machineType='OUT' AND rn_desc=3 THEN ts END),
        MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=2 THEN ts END)
      ) AS firstBreakOut,

      -- First Break In
      COALESCE(
        MIN(CASE WHEN machineType='IN' AND rn_asc=2 THEN ts END),
        MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=3 THEN ts END)
      ) AS firstBreakIn,

      -- Evening Break Out
      COALESCE(
        MAX(CASE WHEN machineType='OUT' AND rn_desc=2 THEN ts END),
        MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=4 THEN ts END)
      ) AS eveningBreakOut,

      -- Evening Break In
      COALESCE(
        MIN(CASE WHEN machineType='IN' AND rn_asc=3 THEN ts END),
        MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=5 THEN ts END)
      ) AS eveningBreakIn,

      -- Out Time
      COALESCE(
        MAX(CASE WHEN machineType='OUT' AND rn_desc=1 THEN ts END),
        MAX(CASE WHEN machineType='IN / OUT' AND rn_desc=1 THEN ts END)
      ) AS outTime

    FROM Punches
    GROUP BY uid
    ORDER BY uid;
  `;

  const data = rawData.map((row) => ({
    uid: row.uid,
    inTime: row.inTime || null, // MySQL DATETIME format
    firstBreakOut: row.firstBreakOut || null, // 2nd punch
    firstBreakIn: row.firstBreakIn || null, // 3rd punch

    eveningBreakOut: row.eveningBreakOut || null, // 3rd last punch
    eveningBreakIn: row.eveningBreakIn || null,
    outTime: row.outTime || null,
  }));

  return { data };
}

export { get };
