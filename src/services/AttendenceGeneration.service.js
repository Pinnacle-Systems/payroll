
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Utility functions
function timeToMinutes(timeStr) {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
}

function parseDuration(duration) {
  if (!duration) return 0;
  const [h, m, s] = duration.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
}
function safeEval(expr) {
  try {
    return Function(`"use strict"; return (${expr})`)();
  } catch {
    return 0;
  }
}
function timeStrToMinutes(timeStr) {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
}

function minutesToTimeStr(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = Math.floor(mins % 60).toString().padStart(2, "0");
  const s = Math.floor((mins % 1) * 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
function toISTTimeStr(date) {
  const istOffset = 5.5 * 60; // IST in minutes
  const utcMinutes = date.getUTCMinutes() + date.getUTCHours() * 60;
  const istTotalMinutes = utcMinutes + istOffset;

  const h = Math.floor(istTotalMinutes / 60) % 24;
  const m = Math.floor(istTotalMinutes % 60);
  const s = date.getUTCSeconds();

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function minutesToHHMMSS(minutes) {
  const totalSeconds = Math.floor(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
function getLocalTimeStr(timestamp) {
  const ts = new Date(timestamp);
  // Convert to IST (+05:30)
  const istOffset = 5 * 60 + 30; // 5 hours 30 mins
  const istTime = new Date(ts.getTime() + istOffset * 60 * 1000);

  const h = istTime.getUTCHours().toString().padStart(2, "0");
  const m = istTime.getUTCMinutes().toString().padStart(2, "0");
  const s = istTime.getUTCSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

async function get(searchParams) {
  const { date } = searchParams;
  if (!date) throw new Error("Date is required");

  const rawData = await prisma.$queryRaw`
WITH Punches AS (
  SELECT
    p.mIdCard,
    p.machineType,
    p.timestamp AS ts,
    ROW_NUMBER() OVER (PARTITION BY p.mIdCard, p.machineType ORDER BY p.timestamp ASC) AS rn_asc,
    ROW_NUMBER() OVER (PARTITION BY p.mIdCard, p.machineType ORDER BY p.timestamp DESC) AS rn_desc,
    COUNT(*) OVER (PARTITION BY p.mIdCard, p.machineType) AS cnt
  FROM PythonPunchData p
  WHERE DATE(p.timestamp) = ${date}
),
Attendance AS (
  SELECT
    mIdCard,

    -- IN punches
    MIN(CASE WHEN machineType='IN' AND rn_asc=1 THEN ts END) AS inTimeIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=2 THEN ts END) AS firstBreakInIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=3 THEN ts END) AS lunchBreakInIn,
    MIN(CASE WHEN machineType='IN' AND rn_asc=4 THEN ts END) AS eveningBreakInIn,

    -- OUT punches
    MAX(CASE WHEN machineType='OUT' AND rn_desc=1 THEN ts END) AS outTimeOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=2 THEN ts END) AS eveningBreakOutOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=3 THEN ts END) AS lunchBreakOutOut,
    MAX(CASE WHEN machineType='OUT' AND rn_desc=4 THEN ts END) AS firstBreakOutOut,

    -- BOTH punches 
    
        -- ✅ BOTH punches corrected order
    
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=1 THEN ts END) AS inTimeBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=2 THEN ts END) AS firstBreakOutBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=3 THEN ts END) AS firstBreakInBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=4 THEN ts END) AS lunchBreakOutBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=5 THEN ts END) AS lunchBreakInBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=6 THEN ts END) AS eveningBreakOutBoth,
    MIN(CASE WHEN machineType='IN / OUT' AND rn_asc=7 THEN ts END) AS eveningBreakInBoth,
    MAX(CASE WHEN machineType='IN / OUT' THEN ts END) AS outTimeBoth,



    -- ✅ first & last punch for total worked time (regardless of category)
    MIN(ts) AS firstPunch,
    MAX(ts) AS lastPunch,
    COUNT(*) AS totalPunches

  FROM Punches
  GROUP BY mIdCard
)
SELECT
  e.id,
  e.mIdCard,
  e.firstName,
    d.name AS departmentName,
  des.name AS designationName,
  sh.id AS shiftId,
  sh.name AS shiftName,
    sti.id AS shiftTemplateId,   -- <<< add this


  -- ✅ In-time: always take first available punch
  COALESCE(a.inTimeIn, a.inTimeBoth, a.firstPunch) AS inTime,

  -- ✅ Out-time: only if there’s more than one punch
  CASE
    WHEN a.totalPunches > 1 THEN COALESCE(a.outTimeOut, a.outTimeBoth, a.lastPunch)
    ELSE NULL
  END AS outTime,

  COALESCE(a.firstBreakOutOut, a.firstBreakOutBoth) AS firstBreakOut,
  COALESCE(a.firstBreakInIn, a.firstBreakInBoth) AS firstBreakIn,
  COALESCE(a.lunchBreakOutBoth) AS lunchBreakOut,
  COALESCE(a.lunchBreakInBoth) AS lunchBreakIn,
  COALESCE(a.eveningBreakOutOut, a.eveningBreakOutBoth) AS eveningBreakOut,
  COALESCE(a.eveningBreakInIn, a.eveningBreakInBoth) AS eveningBreakIn,

  -- ✅ Worked time logic
  CASE
    WHEN a.totalPunches > 1 THEN
      TIME_FORMAT(
        SEC_TO_TIME(
          TIMESTAMPDIFF(
            SECOND,
            CONVERT_TZ(a.firstPunch, '+00:00', '+05:30'),
            CONVERT_TZ(a.lastPunch, '+00:00', '+05:30')
          )
        ),
        '%H:%i:%s'
      )
    ELSE '00:00:00'
  END AS totalWorkedTime,

  CASE
    WHEN a.totalPunches > 1 THEN
      TIMESTAMPDIFF(
        MINUTE,
        CONVERT_TZ(a.firstPunch, '+00:00', '+05:30'),
        CONVERT_TZ(a.lastPunch, '+00:00', '+05:30')
      )
    ELSE 0
  END AS totalMinutes,
  -- ✅ Overtime hours (accurate, aligned to IST)
  CASE
    WHEN a.totalPunches > 1 THEN
      (
        SELECT 
          CASE 
            WHEN CONVERT_TZ(a.lastPunch, '+00:00', '+05:30') >
                 CONVERT_TZ(
                   CAST(CONCAT(${date}, ' ', TIME_FORMAT(s.endTime, '%H:%i:%s')) AS DATETIME),
                   '+00:00',
                   '+05:30'
                 )
            THEN 
              TIME_FORMAT(
                SEC_TO_TIME(
                  TIMESTAMPDIFF(
                    SECOND,
                    CONVERT_TZ(
                      CAST(CONCAT(${date}, ' ', TIME_FORMAT(s.endTime, '%H:%i:%s')) AS DATETIME),
                      '+00:00',
                      '+05:30'
                    ),
                    CONVERT_TZ(a.lastPunch, '+00:00', '+05:30')
                  )
                ),
                '%H:%i:%s'
              )
            ELSE '00:00:00'
          END
        FROM ShiftTemplateItems s
        WHERE s.shiftCommonTemplateId = e.shiftCommonTemplateId
        LIMIT 1
      )
    ELSE '00:00:00'
  END AS otHours,


  CASE 
    WHEN a.mIdCard IS NULL THEN 'Absent'
    WHEN EXISTS (
      SELECT 1
      FROM ShiftTemplateItems s
      WHERE s.shiftCommonTemplateId = e.shiftCommonTemplateId
        AND TIME_FORMAT(COALESCE(a.inTimeIn, a.inTimeBoth), '%H:%i')
            BETWEEN TIME_FORMAT(s.toleranceInBeforeStart, '%H:%i')
                AND TIME_FORMAT(s.toleranceInAfterEnd, '%H:%i')
        AND (
            ( s.inNextDay = 'No'
              AND TIME(COALESCE(a.outTimeOut, a.outTimeBoth))
                  > TIME(s.toleranceOutBeforeStart)
              AND COALESCE(a.outTimeOut, a.outTimeBoth)
                  < (
                       SELECT CONCAT(
                         DATE_ADD(${date}, INTERVAL 1 DAY), ' ',
                         TIME_FORMAT(next_s.toleranceInBeforeStart, '%H:%i:%s')
                       )
                       FROM ShiftTemplateItems next_s
                       WHERE next_s.shiftCommonTemplateId = s.shiftCommonTemplateId
                       LIMIT 1
                     )
            )
             OR
             ( s.inNextDay = 'Yes'
               AND TIME_FORMAT(COALESCE(a.outTimeOut, a.outTimeBoth), '%H:%i')
                   BETWEEN TIME_FORMAT(s.toleranceOutBeforeStart, '%H:%i')
                       AND TIME_FORMAT(s.toleranceOutAfterEnd, '%H:%i')
             )
        )
    ) THEN 'Regular'
    ELSE 'Irregular'
  END AS status 

FROM Employee e
LEFT JOIN Attendance a ON e.mIdCard = a.mIdCard
LEFT JOIN Department d ON e.departmentId = d.id
LEFT JOIN Designation des ON e.designationId = des.id
LEFT JOIN ShiftTemplateItems sti ON sti.shiftCommonTemplateId = e.shiftCommonTemplateId
LEFT JOIN Shift sh ON sh.id = sti.shiftId

ORDER BY e.id;

`;

  const data = rawData?.map((row) => ({
    mIdCard: row.mIdCard,
    firstName: row.firstName,
    departmentName: row.departmentName || null,
    designationName: row.designationName || null,
    shiftId: row.shiftId || null,
    shiftName: row.shiftName || null,
    inTime: row.inTime || null,
    firstBreakOut: row.firstBreakOut || null,
    firstBreakIn: row.firstBreakIn || null,
    lunchBreakOut: row.lunchBreakOut || null,
    lunchBreakIn: row.lunchBreakIn || null,
    eveningBreakOut: row.eveningBreakOut || null,
    eveningBreakIn: row.eveningBreakIn || null,
    outTime: row.outTime || null,
    status: row.status,
    totalWorkedTime: row.totalWorkedTime,
    totalMinutes: row.totalMinutes || 0,
    otHours: row.otHours || 0,
    shiftTemplateId: row.shiftTemplateId || null, // add this

    shiftCount: 0, // placeholder, we’ll calculate below
        formulaResult: 0, // default value


  }));
  for (const emp of data) {
    if (!emp.shiftTemplateId) continue; // skip if no shift template

    // Fetch the shift template item including its QuarterDetails
    const shiftItem = await prisma.shiftTemplateItems.findUnique({
      where: { id: emp.shiftTemplateId },
      include: { QuarterDetails: true }, // fetch nested quarters
    });

    if (!shiftItem || !shiftItem.QuarterDetails) continue;

    // For now, just attach the quarters to the employee object
    emp.quarters = shiftItem.QuarterDetails;
    const punches = await prisma.pythonPunchData.findMany({
      where: {
        mIdCard: emp.mIdCard,
        timestamp: {
          gte: new Date(`${date}T00:00:00+05:30`),
          lte: new Date(`${date}T23:59:59+05:30`),
        },
      },
      orderBy: { timestamp: "asc" },
    });

    if (!punches.length) {
      console.log(`Employee ${emp.firstName} has no punches on ${date}`);
      continue;
    }

    const punchesTime = punches.map(p => p.timestamp.toISOString().split("T")[1].substr(0, 8));

    // const punchesTime = punches.map(p => toISTTimeStr(new Date(p.timestamp)));

    const quarterValues = {};

    // Loop through each quarter and filter punches
    for (const q of emp.quarters) {
      if (q.pickFrom !== "SHIFTCALC") continue; // ignore formulas for now



      const fromMins = timeStrToMinutes(q.from) - 30;
      const toMins = timeStrToMinutes(q.to) + 30;

      const quarterPunches = punchesTime.filter(time => {
        const punchMins = timeStrToMinutes(time);


        return punchMins >= fromMins && punchMins <= toMins;
      })
      if (quarterPunches.length) {
        const punchMinsArray = quarterPunches.map(timeStrToMinutes);
        const workedMins = Math.max(...punchMinsArray) - Math.min(...punchMinsArray);
        const totalMins = timeStrToMinutes(q.total);

        const value = workedMins >= totalMins ? 4.5 : 0;
        quarterValues[q.name] = value;
        console.log(`Employee ${emp.firstName} - Quarter ${q.name} punches:`, quarterPunches);


        console.log(`${q.name} value = ${value}`);

      } else {
        console.log(`Employee ${emp.firstName} - Quarter ${q.name} has no punches in range`);
        quarterValues[q.name] = 0; // no punches = 0
      console.log(`${q.name} value = 0`);

      }

    }
    const formulas = emp.quarters
      .filter(q => q.formula)
      .map(q => q.formula);

    if (formulas.length) {
      // Combine formulas if multiple, or just take the first one
      let formulaExpr = formulas.join(";");
      for (const [qName, val] of Object.entries(quarterValues)) {
        const re = new RegExp(`\\b${qName}\\b`, "g");
        formulaExpr = formulaExpr.replace(re, val);
      }

      const formulaResult = safeEval(formulaExpr);
            emp.formulaResult = formulaResult;

      console.log(`Employee ${emp.firstName} - Formula result:`, formulaResult);
    }



  }
  return { data };
}

export { get };
