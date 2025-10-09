const rawData1 = await prisma.$queryRaw`
    SELECT
      uid,
      DATE_FORMAT(MIN(timestamp), '%Y-%m-%d %H:%i:%s') AS inTime,
      DATE_FORMAT(MAX(timestamp), '%Y-%m-%d %H:%i:%s') AS outTime
    FROM PunchData
    WHERE DATE(timestamp) = ${date}
    GROUP BY uid
    ORDER BY uid
  `;
const rawData2 = await prisma.$queryRaw`
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

const rawData3 = await prisma.$queryRaw`
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
        -- MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=1 THEN ts END)
          MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=1 AND cnt >= 1 THEN ts END)

      ) AS inTime,

      -- First Break Out
      COALESCE(
        MAX(CASE WHEN machineType='OUT' AND rn_desc=3 THEN ts END),
        -- MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=2 THEN ts END)
          MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=2 AND cnt >= 3 THEN ts END)

      ) AS firstBreakOut,

      -- First Break In
      COALESCE(
        MIN(CASE WHEN machineType='IN' AND rn_asc=2 THEN ts END),
        -- MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=3 THEN ts END)
          MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=3 AND cnt >= 3 THEN ts END)

      ) AS firstBreakIn,

      -- Evening Break Out
      COALESCE(
        MAX(CASE WHEN machineType='OUT' AND rn_desc=2 THEN ts END),
        -- MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=4 THEN ts END)
          MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=4 AND cnt >= 4 THEN ts END)

      ) AS eveningBreakOut,

      -- Evening Break In
      COALESCE(
        MIN(CASE WHEN machineType='IN' AND rn_asc=3 THEN ts END),
        -- MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=5 THEN ts END)
          MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=5 AND cnt >= 5 THEN ts END)

      ) AS eveningBreakIn,

      -- Out Time
      COALESCE(
        MAX(CASE WHEN machineType='OUT' AND rn_desc=1 THEN ts END),
        -- MAX(CASE WHEN machineType='IN / OUT' AND rn_desc=1 THEN ts END)
          MAX(CASE WHEN machineType='IN / OUT' AND rn_desc=1 AND cnt >= 2 THEN ts END)

      ) AS outTime

    FROM Punches
    GROUP BY uid
    ORDER BY uid;
  `;
const rawData4 = await prisma.$queryRaw`
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
const data = rawData4.map((row) => ({
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
