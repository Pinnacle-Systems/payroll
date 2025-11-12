// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function get(searchParams) {
//   const { date } = searchParams;
//   if (!date) throw new Error("Date is required");

//   const rawData = await prisma.$queryRaw`
// WITH BreakPunches AS (
//   SELECT 
//     e.id AS empId,
//     e.firstName,
//     e.mIdCard,
//     sti.shiftId,
//     sti.fbOut,
//     sti.fbIn,
//     sti.lunchBST,
//     sti.lunchBET,
//     sti.sbOut,
// sti.sbIn,

//     sti.shiftCommonTemplateId,

//     p.timestamp AS punchTime,
//     p.machineType,
//     ${date} AS reportDate 
//   FROM Employee e
//   JOIN ShiftTemplateItems sti 
//     ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
//   LEFT JOIN PythonPunchData p 
//     ON p.mIdCard = e.mIdCard
//     AND DATE(p.timestamp) = ${date}
// ),

// -- ✅ Morning Break Evaluation
// MorningBreakEval AS (
//   SELECT 
//     empId,
//     mIdCard,
//     firstName,
//     shiftId,
//     fbOut,
//     fbIn,
//     MIN(punchTime) AS firstBreakOut,
//     MAX(punchTime) AS firstBreakIn,
//     COUNT(punchTime) AS punchCount,
//     TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS breakDuration
//   FROM BreakPunches
//   WHERE TIME(punchTime) BETWEEN SUBTIME(fbOut, '00:05:00') AND ADDTIME(fbIn, '00:30:00')
//   GROUP BY empId, mIdCard, firstName, shiftId, fbOut, fbIn
// ),

// -- ✅ Lunch Break Evaluation
// LunchBreakEval AS (
//   SELECT 
//     empId,
//     mIdCard,
//     firstName,
//     shiftId,
//     lunchBST,
//     lunchBET,
//     MIN(punchTime) AS lunchBreakOut,
//     MAX(punchTime) AS lunchBreakIn,
//     COUNT(punchTime) AS lunchPunchCount,
//     TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS lunchBreakDuration
//   FROM BreakPunches
//   WHERE TIME(punchTime) BETWEEN lunchBST AND ADDTIME(lunchBET, '00:30:00')
//   GROUP BY empId, mIdCard, firstName, shiftId, lunchBST, lunchBET
// ),


// -- ✅ Evening Break Evaluation
// EveningBreakEval AS (
//   SELECT 
//     empId,
//     mIdCard,
//     firstName,
//     shiftId,
//     sbOut,
//     sbIn,
//     MIN(punchTime) AS eveningBreakOut,
//     MAX(punchTime) AS eveningBreakIn,
//     COUNT(punchTime) AS eveningPunchCount,
//     TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS eveningBreakDuration
//   FROM BreakPunches
//   WHERE TIME(punchTime) BETWEEN SUBTIME(sbOut,'00:05:00') AND ADDTIME(sbIn, '00:30:00')
//   GROUP BY empId, mIdCard, firstName, shiftId, sbOut, sbIn
// )


// SELECT 
//   e.mIdCard,
//   e.firstName,
//   sh.name AS shiftName,
//      d.name AS departmentName,
//   des.name AS designationName,
//   ${date} AS reportDate,
//   -- ✅ Morning Break
//   sti.fbOut,
//   sti.fbIn,
//   mbe.firstBreakOut,
//   mbe.firstBreakIn,
//   mbe.breakDuration,
//   CASE 
//     WHEN mbe.punchCount IS NULL THEN 'No Punches Available'
//     WHEN mbe.punchCount = 1 THEN 'Only One Punch Available'
//     WHEN mbe.breakDuration <= 20 THEN 'Correct Break'
//     ELSE 'Delayed Break'
//   END AS morningBreakStatus,

//   -- ✅ Lunch Break
//   sti.lunchBST,
//   sti.lunchBET,
//   lbe.lunchBreakOut,
//   lbe.lunchBreakIn,
//   lbe.lunchBreakDuration,
//   CASE 
//     WHEN lbe.lunchPunchCount IS NULL THEN 'Lunch No Punches Available'
//     WHEN lbe.lunchPunchCount = 1 THEN 'Only One Punch Available Lunch'
//     WHEN lbe.lunchBreakDuration <= 60 THEN 'Correct Lunch Break'
//     ELSE 'Delayed Lunch Break'
//   END AS lunchBreakStatus,

//   -- ✅ Evening Break
//   sti.sbOut,
//   sti.sbIn,
//   ebe.eveningBreakOut,
//   ebe.eveningBreakIn,
//   ebe.eveningBreakDuration,
//   CASE 
//     WHEN ebe.eveningPunchCount IS NULL THEN 'Evening No Punches Available'
//     WHEN ebe.eveningPunchCount = 1 THEN 'Evening Only One Punch Available'
//     WHEN ebe.eveningBreakDuration <= 20 THEN 'Correct Evening Break'
//     ELSE 'Delayed Evening Break'
//   END AS eveningBreakStatus


// FROM Employee e
// LEFT JOIN ShiftTemplateItems sti 
//   ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
// LEFT JOIN MorningBreakEval mbe 
//   ON mbe.mIdCard = e.mIdCard
// LEFT JOIN LunchBreakEval lbe 
//   ON lbe.mIdCard = e.mIdCard
//   LEFT JOIN EveningBreakEval ebe 
//   ON ebe.mIdCard = e.mIdCard
// LEFT JOIN Department d ON e.departmentId = d.id
// LEFT JOIN Designation des ON e.designationId = des.id
// LEFT JOIN Shift sh 
//   ON sh.id = sti.shiftId
// ORDER BY e.id;
// `;

//   const data = rawData?.map((row) => ({
//     mIdCard: row.mIdCard,
//     firstName: row.firstName,
//     shiftName: row.shiftName || null,
//     departmentName: row.departmentName || null,
//     designationName: row.designationName || null,
//     reportDate: row.reportDate,  // Add the date here

//     // Morning Break
//     fbOut: row.fbOut,
//     fbIn: row.fbIn,
//     firstBreakOut: row.firstBreakOut,
//     firstBreakIn: row.firstBreakIn,
//     breakDuration: row.breakDuration || 0,
//     morningBreakStatus: row.morningBreakStatus,

//     // Lunch Break
//     lunchBST: row.lunchBST,
//     lunchBET: row.lunchBET,
//     lunchBreakOut: row.lunchBreakOut,
//     lunchBreakIn: row.lunchBreakIn,
//     lunchBreakDuration: row.lunchBreakDuration || 0,
//     lunchBreakStatus: row.lunchBreakStatus,

//     // Evening Break
//     sbOut: row.sbOut,
//     sbIn: row.sbIn,
//     eveningBreakOut: row.eveningBreakOut,
//     eveningBreakIn: row.eveningBreakIn,
//     eveningBreakDuration: row.eveningBreakDuration || 0,
//     eveningBreakStatus: row.eveningBreakStatus
//   }));

//   return { data };
// }

// export { get };
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get(searchParams) {
  const { fromDate, toDate } = searchParams;
  if (!fromDate || !toDate) throw new Error("Both fromDate and toDate are required");

  const rawData = await prisma.$queryRaw`
WITH RECURSIVE DateRange AS (
  SELECT DATE(${fromDate}) AS reportDate
  UNION ALL
  SELECT DATE_ADD(reportDate, INTERVAL 1 DAY)
  FROM DateRange
  WHERE reportDate < DATE(${toDate})
),

BreakPunches AS (
  SELECT 
    e.id AS empId,
    e.firstName,
    e.mIdCard,
    sti.shiftId,
    sti.fbOut,
    sti.fbIn,
    sti.lunchBST,
    sti.lunchBET,
    sti.sbOut,
    sti.sbIn,
    p.timestamp AS punchTime,
    DATE(p.timestamp) AS reportDate
  FROM Employee e
  JOIN ShiftTemplateItems sti 
    ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
  LEFT JOIN PythonPunchData p 
    ON p.mIdCard = e.mIdCard
    AND DATE(p.timestamp) BETWEEN ${fromDate} AND ${toDate}
),

-- per-employee-per-day aggregates for each break window
MorningBreakEval AS (
  SELECT 
    empId, mIdCard, DATE(reportDate) AS reportDate,
    MIN(punchTime) AS firstBreakOut,
    MAX(punchTime) AS firstBreakIn,
    COUNT(punchTime) AS punchCount,
    TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS breakDuration
  FROM BreakPunches
  WHERE punchTime IS NOT NULL
    AND TIME(punchTime) BETWEEN SUBTIME(fbOut, '00:05:00') AND ADDTIME(fbIn, '00:30:00')
  GROUP BY empId, mIdCard, DATE(reportDate)
),

LunchBreakEval AS (
  SELECT 
    empId, mIdCard, DATE(reportDate) AS reportDate,
    MIN(punchTime) AS lunchBreakOut,
    MAX(punchTime) AS lunchBreakIn,
    COUNT(punchTime) AS lunchPunchCount,
    TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS lunchBreakDuration
  FROM BreakPunches
  WHERE punchTime IS NOT NULL
    AND TIME(punchTime) BETWEEN lunchBST AND ADDTIME(lunchBET, '00:30:00')
  GROUP BY empId, mIdCard, DATE(reportDate)
),

EveningBreakEval AS (
  SELECT 
    empId, mIdCard, DATE(reportDate) AS reportDate,
    MIN(punchTime) AS eveningBreakOut,
    MAX(punchTime) AS eveningBreakIn,
    COUNT(punchTime) AS eveningPunchCount,
    TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS eveningBreakDuration
  FROM BreakPunches
  WHERE punchTime IS NOT NULL
    AND TIME(punchTime) BETWEEN SUBTIME(sbOut,'00:05:00') AND ADDTIME(sbIn, '00:30:00')
  GROUP BY empId, mIdCard, DATE(reportDate)
)

SELECT 
  e.mIdCard,
  e.firstName,
  sh.name AS shiftName,
  d.name AS departmentName,
  des.name AS designationName,
  dr.reportDate,
    CASE 
    WHEN dr.reportDate = DATE(${fromDate}) THEN 'From Date'
    WHEN dr.reportDate = DATE(${toDate}) THEN 'To Date'
    ELSE 'Intermediate Date'
  END AS dateShowing,
  sti.fbOut,
  sti.fbIn,
  mbe.firstBreakOut,
  mbe.firstBreakIn,
  mbe.breakDuration,
  CASE 
    WHEN mbe.punchCount IS NULL THEN 'No Punches Available'
    WHEN mbe.punchCount = 1 THEN 'Only One Punch Available'
    WHEN mbe.breakDuration <= 20 THEN 'Correct Break'
    ELSE 'Delayed Break'
  END AS morningBreakStatus,
  sti.lunchBST,
  sti.lunchBET,
  lbe.lunchBreakOut,
  lbe.lunchBreakIn,
  lbe.lunchBreakDuration,
  CASE 
    WHEN lbe.lunchPunchCount IS NULL THEN 'Lunch No Punches Available'
    WHEN lbe.lunchPunchCount = 1 THEN 'Only One Punch Available Lunch'
    WHEN lbe.lunchBreakDuration <= 60 THEN 'Correct Lunch Break'
    ELSE 'Delayed Lunch Break'
  END AS lunchBreakStatus,
  sti.sbOut,
  sti.sbIn,
  ebe.eveningBreakOut,
  ebe.eveningBreakIn,
  ebe.eveningBreakDuration,
  CASE 
    WHEN ebe.eveningPunchCount IS NULL THEN 'Evening No Punches Available'
    WHEN ebe.eveningPunchCount = 1 THEN 'Evening Only One Punch Available'
    WHEN ebe.eveningBreakDuration <= 20 THEN 'Correct Evening Break'
    ELSE 'Delayed Evening Break'
  END AS eveningBreakStatus

FROM Employee e
CROSS JOIN DateRange dr
LEFT JOIN ShiftTemplateItems sti ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
LEFT JOIN MorningBreakEval mbe ON mbe.mIdCard = e.mIdCard AND mbe.reportDate = dr.reportDate
LEFT JOIN LunchBreakEval lbe ON lbe.mIdCard = e.mIdCard AND lbe.reportDate = dr.reportDate
LEFT JOIN EveningBreakEval ebe ON ebe.mIdCard = e.mIdCard AND ebe.reportDate = dr.reportDate
LEFT JOIN Department d ON e.departmentId = d.id
LEFT JOIN Designation des ON e.designationId = des.id
LEFT JOIN Shift sh ON sh.id = sti.shiftId

ORDER BY e.id, dr.reportDate;
`;

  const data = rawData?.map((row) => ({
    mIdCard: row.mIdCard,
    firstName: row.firstName,
    shiftName: row.shiftName || null,
    departmentName: row.departmentName || null,
    designationName: row.designationName || null,
    reportDate: row.reportDate,
    dateShowing: row.dateShowing,
    fbOut: row.fbOut,
    fbIn: row.fbIn,
    firstBreakOut: row.firstBreakOut,
    firstBreakIn: row.firstBreakIn,
    breakDuration: row.breakDuration || 0,
    morningBreakStatus: row.morningBreakStatus,
    lunchBST: row.lunchBST,
    lunchBET: row.lunchBET,
    lunchBreakOut: row.lunchBreakOut,
    lunchBreakIn: row.lunchBreakIn,
    lunchBreakDuration: row.lunchBreakDuration || 0,
    lunchBreakStatus: row.lunchBreakStatus,
    sbOut: row.sbOut,
    sbIn: row.sbIn,
    eveningBreakOut: row.eveningBreakOut,
    eveningBreakIn: row.eveningBreakIn,
    eveningBreakDuration: row.eveningBreakDuration || 0,
    eveningBreakStatus: row.eveningBreakStatus
  }));

  return { fromDate, toDate, count: data.length, data };
}

export { get };
