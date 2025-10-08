
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
