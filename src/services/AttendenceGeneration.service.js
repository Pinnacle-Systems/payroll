
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Utility functions
function timeToMinutes(timeStr) {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
}

function parseDuration(duration) {
  if (!duration) return 0;
  const [h, m, s] = duration?.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
}
function safeEval(expr) {
  try {
    return Function(`"use strict"; return (${expr})`)();
  } catch {
    return 0;
  }
}
function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 60);

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function timeStrToMinutes(timeStr) {
  const [h, m, s] = timeStr?.split(":").map(Number);
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
function timeStrToHours(timeStr) {
  const [h, m, s] = timeStr.split(":")?.map(Number);
  return h + m / 60 + (s ? s / 3600 : 0);
}
function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}
const formatTime = (totalSec) => {
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
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
  END AS status ,
    -- ✅ NEW: Collect all punches into JSON array
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'timestamp', p.timestamp
      )
    )
    FROM PythonPunchData p
    WHERE p.mIdCard = e.mIdCard AND DATE(p.timestamp) = ${date}
  ) AS punchesArray

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

    formulaResult: 0, // default value
    punches:
      typeof row.punchesArray === "string"
        ? JSON.parse(row.punchesArray)
        : row.punchesArray || [],

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

    // const punchesTime = punches.map(p => p.timestamp.toISOString().split("T")[1].substr(0, 8));
    // ✅ Combine all punches safely, converting Date → HH:MM:SS
    // const punchesTime = [
    //   emp.inTime,
    //   emp.firstBreakIn,
    //   emp.firstBreakOut,
    //   emp.lunchBreakIn,
    //   emp.lunchBreakOut,
    //   emp.eveningBreakIn,
    //   emp.eveningBreakOut,
    //   emp.outTime
    // ]
    //   .filter(Boolean) // remove null/undefined
    //   .map(t => {
    //     if (t instanceof Date) {
    //       // Extract HH:MM:SS from Date
    //       return t.toISOString().split("T")[1].substring(0, 8);
    //     } else if (typeof t === "string") {
    //       // In case it's already a string like "09:05:12"
    //       return t.substring(0, 8);
    //     } else {
    //       return String(t).substring(0, 8);
    //     }
    //   });

    const punchesTime = (emp?.punches || [])?.map(p => {
      const ts = p.timestamp;
      if (!ts) return null;

      const dateObj = new Date(ts);
      if (isNaN(dateObj)) return null;

      // ✅ Format in local time (HH:mm:ss)
      return dateObj.toLocaleTimeString("en-GB", { hour12: false });
    })?.filter(Boolean);


    console.log(punchesTime, "punchesTime");

    const quarterValues = {};
    const hourlyValues = {};  // hourly formula values


    // Loop through each quarter and filter punches
    emp.quarters?.forEach((q, index) => {
      if (q.pickFrom !== "SHIFTCALC") return;


      const fromMinutes = timeStrToMinutes(q.from);
      const toMinutes = timeStrToMinutes(q.to);
      const ftGrace = q.ftMins ?? 0; // nullish coalescing operator
      const ttGrace = q.ttMins ?? 0;
      const fromMins = fromMinutes - ftGrace;
      let toMins = toMinutes + ttGrace;

      // If this is the last quarter, allow unlimited late punches
      const isLastQuarter = index === emp.quarters.length - 2;
      console.log(isLastQuarter, "isLastQuarter");

      if (isLastQuarter) {
        toMins = Infinity; // or a reasonable cap if needed
        console.log(`  (Last Quarter) Extended tolerance: now accepting punches up until ANY time`);
      }
      // const fromMins = timeStrToMinutes(q.from) - 30;
      // const toMins = timeStrToMinutes(q.to) + 15;
      // Convert to readable time strings
      const originalFromStr = q.from;
      const originalToStr = q.to;
      const toleratedFromStr = minutesToTimeStr(fromMins);
      const toleratedToStr = minutesToTimeStr(toMins);

      console.log(`Employee ${emp.firstName} - Quarter ${q.name}:`);
      console.log(`Original window: ${originalFromStr} to ${originalToStr}`);
      console.log(`Window: ${minutesToTimeStr(fromMins)} to ${isLastQuarter ? "∞" : minutesToTimeStr(toMins)}`);
      console.log(`Tolerance applied: -${ftGrace} mins, +${ttGrace} mins`);
      console.log(`New window with tolerance: ${toleratedFromStr} to ${toleratedToStr}`);


      const quarterPunches = punchesTime?.filter(time => {
        const punchMins = timeStrToMinutes(time);


        return punchMins >= fromMins && punchMins <= toMins;
      })
      if (quarterPunches?.length) {
        const punchMinsArray = quarterPunches?.map(timeStrToMinutes);
        const minPunch = Math.min(...punchMinsArray);
        const maxPunch = Math.max(...punchMinsArray);
        const workedMins = maxPunch - minPunch;

        // Log the punches used
        const minPunchStr = minutesToTimeStr(minPunch);
        const maxPunchStr = minutesToTimeStr(maxPunch);
        console.log(`Employee ${emp.firstName} - Quarter ${q.name}:`);
        console.log(`Punches within window: ${quarterPunches.join(", ")}`);
        console.log(`First punch: ${minPunchStr}`);
        console.log(`Last punch: ${maxPunchStr}`);
        const workedSeconds = Math.round(workedMins * 60);
        const durationStr = secondsToHms(workedSeconds);
        console.log(`  Worked duration: ${durationStr} (${workedMins.toFixed(2)} mins)`);


        const totalHours = timeStrToHours(q.total); // e.g., "04:30:00" → 4.5
        const totalMins = totalHours * 60;

        // Return total hours if workedMins >= totalMins, else 0
        const value = workedMins >= totalMins ? totalHours : 0;
        const finalValue = roundToHalf(value);
        console.log(`Employee ${emp.firstName} - Quarter ${q.name} value = ${finalValue}`);
        quarterValues[q.name] = finalValue;

      } else {
        console.log(`Employee ${emp.firstName} - Quarter ${q.name} has no punches in range`);
        quarterValues[q.name] = 0; // no punches = 0

      }

    })

    const formulas = emp.quarters?.filter(q => q?.formula)?.map(q => q?.formula);

    if (formulas?.length) {
      // Combine formulas if multiple, or just take the first one
      let formulaExpr = formulas?.join(";");
      for (const [qName, val] of Object?.entries(quarterValues)) {
        const re = new RegExp(`\\b${qName}\\b`, "g");
        formulaExpr = formulaExpr.replace(re, val);
      }

      const formulaResult = safeEval(formulaExpr);
      emp.formulaResult = formulaResult;
      console.log(`Employee ${emp.firstName} - Formula result:`, formulaResult);
    }

    // Before hourly calculation

    // Before hourly calculation
    if (!shiftItem) {
      console.log(`No shiftTemplateItem found for employee ${emp.firstName}`);
      emp.hourlyWorkedTime = "00:00:00";
      emp.rawWorkedTime = "00:00:00"; // also set raw
      continue; // skip hourly calculation
    }

    // Attach it to employee
    emp.shiftTemplateItem = shiftItem;

    if (punchesTime?.length) {
      const timeToSeconds = (timeStr) => {
        const [h, m, s] = timeStr?.split(':')?.map(Number);
        return h * 3600 + m * 60 + s;
      };

      // ---- 1️⃣ Raw worked time (without breaks) ----
      let rawSeconds = 0;
      for (let i = 0; i < punchesTime.length - 1; i += 2) {
        const inTime = punchesTime[i];
        const outTime = punchesTime[i + 1];
        const inSecs = timeToSeconds(inTime);
        const outSecs = timeToSeconds(outTime);
        if (outSecs > inSecs) rawSeconds += outSecs - inSecs;
      }
      emp.rawWorkedTime = formatTime(rawSeconds); // store raw worked time

      // ---- 2️⃣ Hourly worked time (with breaks applied) ----
      let totalSeconds = rawSeconds; // start from raw worked seconds

      const breaks = [
        { out: emp.shiftTemplateItem.fbOut, in: emp.shiftTemplateItem.fbIn }, // morning
        { out: emp.shiftTemplateItem.lunchBst, in: emp.shiftTemplateItem.lunchBET }, // lunch
        { out: emp.shiftTemplateItem.sbOut, in: emp.shiftTemplateItem.sbIn } // evening
      ];

      // Only add breaks if employee has punches
      if (punchesTime.length) {
        breaks.forEach((brk) => {
          if (!brk.out || !brk.in) return; // skip if no break defined
          const breakStart = timeToSeconds(brk.out);
          const breakEnd = timeToSeconds(brk.in);
          const breakDuration = breakEnd - breakStart;

          // Check if any punch overlaps with break window
          const hasPunchDuringShift = punchesTime.some(t => {
            const secs = timeToSeconds(t);
            return secs <= breakEnd; // any punch before or during break
          });

          if (hasPunchDuringShift) {
            totalSeconds += breakDuration; // always add full break
          }
          // else: no punches → skip break
        });
      }
      const formattedTime = formatTime(totalSeconds);
      console.log(`Employee ${emp.firstName} - Worked Time with breaks = ${formattedTime}`);
      console.log(`Employee ${emp.firstName} - Raw Worked Time = ${emp.rawWorkedTime}`);

      // Save directly on employee object
      emp.hourlyWorkedTime = formattedTime;
    } else {
      console.log(`Employee ${emp.firstName} has no punches`);
      emp.hourlyWorkedTime = "00:00:00";
      emp.rawWorkedTime = "00:00:00";
    }


  }
  return { data };
}

export { get };
