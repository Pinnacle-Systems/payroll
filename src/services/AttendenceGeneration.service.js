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
  const rawData = await prisma.$queryRaw`
  SELECT uid,
         MIN(CASE WHEN rn = 1 THEN ts END) AS inTime,
         MIN(CASE WHEN rn = 2 THEN ts END) AS firstBreakOut,
         MIN(CASE WHEN rn = 3 THEN ts END) AS firstBreakIn,
         MAX(CASE WHEN rn = cnt THEN ts END) AS outTime,
         MAX(CASE WHEN rn = cnt-1 THEN ts END) AS eveningBreakIn,
         MAX(CASE WHEN rn = cnt-2 THEN ts END) AS eveningBreakOut
  FROM (
      SELECT 
          uid,
          timestamp AS ts,
          ROW_NUMBER() OVER (PARTITION BY uid ORDER BY timestamp) AS rn,
          COUNT(*) OVER (PARTITION BY uid) AS cnt
      FROM PunchData
      WHERE DATE(timestamp) = ${date}
  ) t
  GROUP BY uid
  ORDER BY uid
`;

  const data = rawData.map((row) => ({
    uid: row.uid,
    inTime: row.inTime, // MySQL DATETIME format
    firstBreakOut: row.firstBreakOut, // 2nd punch
    firstBreakIn: row.firstBreakIn, // 3rd punch

    eveningBreakOut: row.eveningBreakOut, // 3rd last punch
    eveningBreakIn: row.eveningBreakIn,
    outTime: row.outTime,
  }));

  return { data };
}

export { get };
