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
  WHERE DATE(CONVERT_TZ(p.timestamp, '+00:00', '+05:30')) = ${date} 
),
Attendance AS (
  SELECT
    mIdCard,
    -- IN punches
    MIN(CASE WHEN machineType='IN' AND rn_asc=1 THEN ts END) AS inTimeIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=2 THEN ts END) AS firstBreakInIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=3 THEN ts END) AS eveningBreakInIn,

    -- OUT punches
    MAX(CASE WHEN machineType='OUT' AND rn_desc=1 THEN ts END) AS outTimeOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=2 THEN ts END) AS eveningBreakOutOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=3 THEN ts END) AS firstBreakOutOut,

    -- BOTH punches
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
  e.mIdCard,
  e.firstName,

  COALESCE(CONVERT_TZ(a.inTimeIn, '+00:00', '+05:30'), CONVERT_TZ(a.inTimeBoth, '+00:00', '+05:30')) AS inTime,
  COALESCE(CONVERT_TZ(a.firstBreakOutOut, '+00:00', '+05:30'), CONVERT_TZ(a.firstBreakOutBoth, '+00:00', '+05:30')) AS firstBreakOut,
  COALESCE(CONVERT_TZ(a.firstBreakInIn, '+00:00', '+05:30'), CONVERT_TZ(a.firstBreakInBoth, '+00:00', '+05:30')) AS firstBreakIn,
  COALESCE(CONVERT_TZ(a.eveningBreakOutOut, '+00:00', '+05:30'), CONVERT_TZ(a.eveningBreakOutBoth, '+00:00', '+05:30')) AS eveningBreakOut,
  COALESCE(CONVERT_TZ(a.eveningBreakInIn, '+00:00', '+05:30'), CONVERT_TZ(a.eveningBreakInBoth, '+00:00', '+05:30')) AS eveningBreakIn,
  COALESCE(CONVERT_TZ(a.outTimeOut, '+00:00', '+05:30'), CONVERT_TZ(a.outTimeBoth, '+00:00', '+05:30')) AS outTime,

  CASE 
    WHEN a.mIdCard IS NULL THEN 'Absent'
    WHEN EXISTS (
      SELECT 1
      FROM ShiftTemplateItems s
      WHERE s.shiftCommonTemplateId = e.shiftCommonTemplateId
        AND TIME_FORMAT(CONVERT_TZ(COALESCE(a.inTimeIn, a.inTimeBoth), '+00:00', '+05:30'), '%H:%i')
            BETWEEN TIME_FORMAT(s.toleranceInBeforeStart, '%H:%i')
                AND TIME_FORMAT(s.toleranceInAfterEnd, '%H:%i')


      -- AND (
      --   s.inNextDay = 'No'
      --   OR (
      --     TIME_FORMAT(CONVERT_TZ(COALESCE(a.outTimeOut, a.outTimeBoth), '+00:00', '+05:30'), '%H:%i')
      --     BETWEEN TIME_FORMAT(s.toleranceOutBeforeStart, '%H:%i')
      --         AND TIME_FORMAT(s.toleranceOutAfterEnd, '%H:%i') 
      --   )
      -- )
AND (
    --  ( s.inNextDay = 'No'
    --    AND TIME(CONVERT_TZ(COALESCE(a.outTimeOut, a.outTimeBoth), '+00:00', '+05:30')) <= '23:59:59'
    --  )
     (
  s.inNextDay = 'No'
    AND CONVERT_TZ(COALESCE(a.outTimeOut, a.outTimeBoth), '+00:00', '+05:30')
        <= (
          SELECT CONVERT_TZ(
                   CONCAT(DATE_ADD(${date}, INTERVAL 1 DAY), ' ', TIME_FORMAT(next_s.toleranceInBeforeStart, '%H:%i:%s')),
                   '+00:00', '+05:30'
                 )
        
          FROM ShiftTemplateItems next_s
          WHERE next_s.shiftCommonTemplateId = s.shiftCommonTemplateId
          LIMIT 1
        )
)
     OR
     ( s.inNextDay = 'Yes' 
       AND TIME_FORMAT(CONVERT_TZ(COALESCE(a.outTimeOut, a.outTimeBoth), '+00:00', '+05:30'), '%H:%i')
           BETWEEN TIME_FORMAT(s.toleranceOutBeforeStart, '%H:%i')
               AND TIME_FORMAT(s.toleranceOutAfterEnd, '%H:%i')
     )
)


    ) THEN 'Regular'
    ELSE 'Irregular'
  END AS status 

FROM Employee e
LEFT JOIN Attendance a ON e.mIdCard = a.mIdCard
ORDER BY e.id;
`;

  // Map to desired output format
  const data = rawData.map((row) => ({
    mIdCard: row.mIdCard,
    firstName: row.firstName,
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
