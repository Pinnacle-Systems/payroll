import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get(searchParams) {
  const { date } = searchParams;
  if (!date) throw new Error("Date is required");

  const rawData = await prisma.$queryRaw`
WITH BreakPunches AS (
  SELECT 
    e.id AS empId,
    e.firstName,
    e.mIdCard,
    sti.shiftId,
    sti.fbOut,
    sti.fbIn,
    sti.shiftCommonTemplateId,
    p.timestamp AS punchTime,
    p.machineType
  FROM Employee e
  JOIN ShiftTemplateItems sti 
    ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
  LEFT JOIN PythonPunchData p 
    ON p.mIdCard = e.mIdCard
    AND DATE(p.timestamp) = ${date}
),
BreakEval AS (
  SELECT 
    empId,
    mIdCard,
    firstName,
    shiftId,
    fbOut,
    fbIn,
    MIN(punchTime) AS firstBreakOut,
    MAX(punchTime) AS firstBreakIn,
    COUNT(punchTime) AS punchCount,
    TIMESTAMPDIFF(MINUTE, MIN(punchTime), MAX(punchTime)) AS breakDuration
  FROM BreakPunches
  WHERE 
    TIME(punchTime) BETWEEN fbOut AND ADDTIME(fbIn, '00:30:00')
  GROUP BY empId, mIdCard, firstName, shiftId, fbOut, fbIn
)
SELECT 
  e.mIdCard,
  e.firstName,
  sh.name AS shiftName,
  sti.fbOut,
  sti.fbIn,
  be.firstBreakOut,
  be.firstBreakIn,
  be.breakDuration,
  CASE 
    WHEN be.punchCount IS NULL THEN 'No Punches Available'
    WHEN be.punchCount = 1 THEN 'Only One Punch Available'
    WHEN be.breakDuration <= 20 THEN 'Correct Break'
    ELSE 'Delayed Break'
  END AS breakStatus
FROM Employee e
LEFT JOIN ShiftTemplateItems sti 
  ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
LEFT JOIN BreakEval be 
  ON be.mIdCard = e.mIdCard
LEFT JOIN Shift sh 
  ON sh.id = sti.shiftId
ORDER BY e.id;
`;

  const data = rawData?.map((row) => ({
    mIdCard: row.mIdCard,
    firstName: row.firstName,
    shiftName: row.shiftName || null,
    fbOut: row.fbOut,
    fbIn: row.fbIn,
    firstBreakOut: row.firstBreakOut,
    firstBreakIn: row.firstBreakIn,
    breakDuration: row.breakDuration || 0,
    breakStatus: row.breakStatus,
  }));

  return { data };
}

export { get };
