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

  const rawData = await prisma.$queryRaw`
WITH Punches AS (
  SELECT
    p.mIdCard,
    p.machineType,
    p.timestamp AS ts,
    ROW_NUMBER() OVER (PARTITION BY p.mIdCard, p.machineType ORDER BY p.timestamp ASC) AS rn_asc,
    ROW_NUMBER() OVER (PARTITION BY p.mIdCard, p.machineType ORDER BY p.timestamp DESC) AS rn_desc,
    COUNT(*) OVER (PARTITION BY p.mIdCard, p.machineType) AS cnt
  FROM PunchData p
  WHERE DATE(p.timestamp) = ${date} 
),
Attendance AS (
  SELECT
    mIdCard,
    -- IN
    MIN(CASE WHEN machineType='IN' AND rn_asc=1 THEN ts END) AS inTimeIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=2 THEN ts END) AS firstBreakInIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=3 THEN ts END) AS eveningBreakInIn,

    -- OUT
    MAX(CASE WHEN machineType='OUT' AND rn_desc=1 THEN ts END) AS outTimeOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=2 THEN ts END) AS eveningBreakOutOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=3 THEN ts END) AS firstBreakOutOut,

    -- BOTH (only if multiple punches)
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=1 AND cnt >= 1 THEN ts END) AS inTimeBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=2 AND cnt >= 3 THEN ts END) AS firstBreakOutBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=3 AND cnt >= 3 THEN ts END) AS firstBreakInBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=4 AND cnt >= 4 THEN ts END) AS eveningBreakOutBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=5 AND cnt >= 5 THEN ts END) AS eveningBreakInBoth,
    MAX(CASE WHEN machineType='IN / OUT' AND rn_desc=1 AND cnt >= 2 THEN ts END) AS outTimeBoth

  FROM Punches
  GROUP BY mIdCard
)
SELECT
  e.id,
  COALESCE(a.mIdCard, e.mIdCard) AS mIdCard,
  -- final COALESCE merge
  COALESCE(a.inTimeIn, a.inTimeBoth) AS inTime,
  COALESCE(a.firstBreakOutOut, a.firstBreakOutBoth) AS firstBreakOut,
  COALESCE(a.firstBreakInIn, a.firstBreakInBoth) AS firstBreakIn,
  COALESCE(a.eveningBreakOutOut, a.eveningBreakOutBoth) AS eveningBreakOut,
  COALESCE(a.eveningBreakInIn, a.eveningBreakInBoth) AS eveningBreakIn,
  COALESCE(a.outTimeOut, a.outTimeBoth) AS outTime,
  CASE WHEN a.mIdCard IS NULL THEN 'Absent' ELSE 'Present' END AS status

FROM Employee e
LEFT JOIN Attendance a ON e.mIdCard = a.mIdCard
ORDER BY e.id;

`;

  // Map to desired output format
  const data = rawData.map((row) => ({
    mIdCard: row.mIdCard,
    // uid: row.uid,

    inTime: row.inTime || null,
    firstBreakOut: row.firstBreakOut || null,
    firstBreakIn: row.firstBreakIn || null,
    eveningBreakOut: row.eveningBreakOut || null,
    eveningBreakIn: row.eveningBreakIn || null,
    outTime: row.outTime || null,
    status: row.status,
  }));

  return { data };
}

export { get };
