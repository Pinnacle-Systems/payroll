
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Utility functions

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


function timeStrToHours(timeStr) {
  const [h, m, s] = timeStr.split(":")?.map(Number);
  return h + m / 60 + (s ? s / 3600 : 0);
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
  WHERE 
      p.timestamp >= ${date}
      AND p.timestamp < DATE_ADD(${date}, INTERVAL 1 DAY)
          + INTERVAL (
                SELECT 
                    HOUR(toleranceInBeforeStart)*3600 
                    + MINUTE(toleranceInBeforeStart)*60 
                    + SECOND(toleranceInBeforeStart)
                FROM ShiftTemplateItems 
                LIMIT 1
            ) SECOND
),
Attendance AS (
  SELECT
    mIdCard,

   
  -- IN punches (IN + MANUAL treated as IN)
MIN(CASE WHEN machineType IN ('IN','MANUAL') AND rn_asc=1 THEN ts END) AS inTimeIn,
MIN(CASE WHEN machineType IN ('IN','MANUAL') AND rn_asc=2 THEN ts END) AS firstBreakInIn,
MIN(CASE WHEN machineType IN ('IN','MANUAL') AND rn_asc=3 THEN ts END) AS lunchBreakInIn,
MIN(CASE WHEN machineType IN ('IN','MANUAL') AND rn_asc=4 THEN ts END) AS eveningBreakInIn,


-- OUT punches (OUT + MANUAL treated as OUT)
MAX(CASE WHEN machineType IN ('OUT','MANUAL') AND rn_desc=1 THEN ts END) AS outTimeOut,
MAX(CASE WHEN machineType IN ('OUT','MANUAL') AND rn_desc=2 THEN ts END) AS eveningBreakOutOut,
MAX(CASE WHEN machineType IN ('OUT','MANUAL') AND rn_desc=3 THEN ts END) AS lunchBreakOutOut,
MAX(CASE WHEN machineType IN ('OUT','MANUAL') AND rn_desc=4 THEN ts END) AS firstBreakOutOut,


-- BOTH punches (IN / OUT + MANUAL)
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=1 THEN ts END) AS inTimeBoth,
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=2 THEN ts END) AS firstBreakOutBoth,
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=3 THEN ts END) AS firstBreakInBoth,
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=4 THEN ts END) AS lunchBreakOutBoth,
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=5 THEN ts END) AS lunchBreakInBoth,
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=6 THEN ts END) AS eveningBreakOutBoth,
MIN(CASE WHEN machineType IN ('IN / OUT','MANUAL') AND rn_asc=7 THEN ts END) AS eveningBreakInBoth,
MAX(CASE WHEN machineType IN ('IN / OUT','MANUAL') THEN ts END) AS outTimeBoth,



    -- ✅ first & last punch for total worked time (regardless of category)
    MIN(ts) AS firstPunch,
    MAX(ts) AS lastPunch,
    COUNT(*) AS totalPunches

  FROM Punches
  GROUP BY mIdCard
)
SELECT
  e.id AS employeeId,
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
            ELSE NULL
          END
        FROM ShiftTemplateItems s
        WHERE s.shiftCommonTemplateId = e.shiftCommonTemplateId
        LIMIT 1
      )
    ELSE NULL
  END AS otHours,


  CASE 
    WHEN a.mIdCard IS NULL THEN 'Absent'
    WHEN EXISTS (
      SELECT 1
      FROM ShiftTemplateItems s
      WHERE s.shiftCommonTemplateId = e.shiftCommonTemplateId
        AND TIME_FORMAT(COALESCE(a.inTimeIn, a.inTimeBoth), '%H:%i:%s')
            BETWEEN TIME_FORMAT(s.toleranceInBeforeStart, '%H:%i:%s')
                AND TIME_FORMAT(s.toleranceInAfterEnd, '%H:%i:%s')
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
               AND TIME_FORMAT(COALESCE(a.outTimeOut, a.outTimeBoth), '%H:%i:%s')
                   BETWEEN TIME_FORMAT(s.toleranceOutBeforeStart, '%H:%i:%s')
                       AND TIME_FORMAT(s.toleranceOutAfterEnd, '%H:%i:%s')
             )
        )
    ) THEN 'Regular'
    ELSE 'Irregular'
    
  END AS status ,
    -- ✅ NEW: Collect all punches into JSON array
  (
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'timestamp', p.timestamp ,'isPermission', p.isPermission 
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
WHERE e.active = 1

ORDER BY e.mIdCard;

`;

  const data = rawData?.map((row) => ({
    mIdCard: row.mIdCard,
    employeeId: row.employeeId || null,
    firstName: row.firstName,
    departmentName: row.departmentName || null,
    designationName: row.designationName || null,
    shiftId: row.shiftId || null,
    shiftType: row.shiftName || null,
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
    punches: typeof row.punchesArray === "string" ? JSON.parse(row.punchesArray) : row.punchesArray || [],

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
    // ------------------------------------------------------
    //   PERMISSION HOURS TOTAL (permissionHrs)
    // ------------------------------------------------------
    let totalPermissionSeconds = 0;

    for (const p of punches || []) {
      if (p.isPermission && p.permissionTime) {
        const [h, m, s] = p.permissionTime.split(":").map(Number);
        totalPermissionSeconds += h * 3600 + m * 60 + s;
      }
    }

    // convert back to HH:mm:ss
    const hrs = String(Math.floor(totalPermissionSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalPermissionSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalPermissionSeconds % 60).padStart(2, "0");

    emp.permissionHrs = `${hrs}:${mins}:${secs}`;
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

    let punchesTime = (emp?.punches || [])?.map(p => {
      const ts = p.timestamp
      if (!ts) return null;

      const dateObj = new Date(ts);
      if (isNaN(dateObj)) return null;

      // ✅ Format in local time (HH:mm:ss)
      return dateObj.toLocaleTimeString("en-GB", { hour12: false });
    })?.filter(Boolean);


    console.log(punchesTime, "punchesTime");

    const quarterValues = {};


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
        const halfMins = totalMins / 2;
        const halfHours = totalHours / 2;


        let value = 0;

        if (workedMins >= totalMins) {
          value = totalHours;
        } else if (workedMins > halfMins) {
          value = halfHours; // e.g. 2.25
        } else {
          value = 0;
        }

        // keep precision (2 decimals)
        const finalValue = Number(value.toFixed(2));
        console.log(`Employee ${emp.firstName} - Quarter ${q.name} value = ${finalValue}`);
        quarterValues[q.name] = finalValue;

      }
      else {
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

    if (!shiftItem) {
      console.log(`No shiftTemplateItem found for employee ${emp.firstName}`);
      // emp.hourlyWorkedTime = "00:00:00";
      // emp.rawWorkedTime = "00:00:00"; // also set raw
      continue; // skip hourly calculation
    }

    // Attach it to employee
    emp.shiftTemplateItem = shiftItem;
    emp.breakSummary = {};

    if (punchesTime?.length) {
      const timeToSeconds = (timeStr) => {
        if (!timeStr) return 0; // handle null, undefined, or empty string

        const [h, m, s] = timeStr?.split(':')?.map(Number);
        return h * 3600 + m * 60 + s;
      };
      let punchesInSeconds = punchesTime?.map(timeToSeconds);

      const morningInSec = timeToSeconds(emp.shiftTemplateItem.startTime);

      // Adjust the first punch
      if (punchesInSeconds[0] < morningInSec) {
        punchesInSeconds[0] = morningInSec;
        punchesTime[0] = formatTime(morningInSec);
      }
      let firstPunch = punchesInSeconds[0];

      // Now calculate actual worked time using adjusted punches
      let actualSeconds = 0;
      for (let i = 0; i < punchesTime.length - 1; i += 2) {
        const inSecs = timeToSeconds(punchesTime[i]);
        const outSecs = timeToSeconds(punchesTime[i + 1]);
        if (outSecs > inSecs) actualSeconds += (outSecs - inSecs);
      }

      emp.actualWorkedTime = formatTime(actualSeconds);

      // ---- 1️⃣ Raw worked time (without breaks) ----
      let rawSeconds = 0;
      for (let i = 0; i < punchesTime.length - 1; i += 2) {
        const inTime = punchesTime[i];
        const outTime = punchesTime[i + 1];
        const inSecs = timeToSeconds(inTime);
        const outSecs = timeToSeconds(outTime);
        if (outSecs > inSecs) rawSeconds += outSecs - inSecs;
      }
      const empOTHours = timeToSeconds(emp.otHours)
      console.log(empOTHours, "empOTHours");
      //  SUBTRACT OT HOURS HERE
      rawSeconds = rawSeconds - empOTHours;
      if (rawSeconds < 0) rawSeconds = 0;

      // store adjusted raw worked time
      emp.rawWorkedTime = formatTime(rawSeconds); // store raw worked time




      // ---- 2️⃣ Hourly worked time (with breaks applied) ----
      let totalSeconds = rawSeconds; // start from raw worked seconds
      let breakSeconds = 0;
      let earlySeconds = 0;
      let lateSeconds = 0;

      const moriningInFromTolerance = emp.shiftTemplateItem.toleranceInBeforeStart
      const morningIn = emp.shiftTemplateItem.startTime
      const moriningInToTolerance = emp.shiftTemplateItem.toleranceInAfterEnd
      const eveningInFromTolerance = emp.shiftTemplateItem.toleranceOutBeforeStart
      const eveningIn = emp.shiftTemplateItem.endTime
      const eveningInToTolerance = emp.shiftTemplateItem.toleranceOutAfterEnd



      const morningInFromTol = timeToSeconds(moriningInFromTolerance);
      const morningInToTol = timeToSeconds(moriningInToTolerance);
      const eveningOutFromTol = timeToSeconds(eveningInFromTolerance);
      const eveningOutToTol = timeToSeconds(eveningInToTolerance);
      const eveningOutSec = timeToSeconds(eveningIn);


      const fbout = timeToSeconds(emp.shiftTemplateItem.fbOut)
      const fbIn = timeToSeconds(emp.shiftTemplateItem.fbIn)
      const sbOut = timeToSeconds(emp.shiftTemplateItem.sbOut)
      const sbIn = timeToSeconds(emp.shiftTemplateItem.sbIn)
      const lunchBst = timeToSeconds(emp.shiftTemplateItem.lunchBst)
      const lunchBET = timeToSeconds(emp.shiftTemplateItem.lunchBET)



      // ---- Tolerance windows array ----
      const windows = [
        { key: "inTime", start: morningInFromTol, end: morningInToTol },

        // Break windows
        { key: "firstBreakOut", start: fbout, end: fbIn },
        { key: "firstBreakIn", start: fbIn, end: fbIn },
        { key: "lunchBreakOut", start: lunchBst, end: lunchBET },
        { key: "lunchBreakIn", start: lunchBET, end: lunchBET },
        { key: "eveningBreakOut", start: sbOut, end: sbIn },
        { key: "eveningBreakIn", start: sbIn, end: sbIn },


        { key: "outTime", start: eveningOutFromTol, end: eveningOutToTol },

      ];

      // ---- Check if a punch is inside any tolerance window ----
      const isInAnyWindow = (sec) => windows.some(w => sec >= w.start && sec <= w.end);
      const extractSeconds = (timestamp) => {
        if (!timestamp) return NaN;
        // assume format "YYYY-MM-DD HH:MM:SS..." (space separated)
        const timePart = timestamp.split(" ")[1];              // "13:36:34.000000"
        if (!timePart) return NaN;
        const [h, m, sRaw] = timePart.split(":");
        const s = Math.floor(parseFloat(sRaw || "0"));
        return (+h * 3600) + (+m * 60) + s;
      };

      let finalPunches = [];
      let added = new Set();          // to avoid duplicate timestamps
      let pairedByPrev = new Set();   // indexes that were added as "next" for an outside punch

      const punches = emp?.punches || [];
      const lastPunch = punchesInSeconds[punchesInSeconds.length - 1];

      for (let i = 0; i < punches.length; i++) {

        const p = punches[i];
        if (!p?.timestamp) continue;
        if (i === 0) continue;
        const isLast = (i === punches.length - 1);

        // ❌ Last punch should NEVER start a pair
        if (isLast) continue;
        const sec = extractSeconds(p.timestamp);
        const isOutside = !isInAnyWindow(sec);

        if (isOutside) {
          // Add this outside punch if not already added
          if (!added.has(p.timestamp)) {
            finalPunches.push({
              timestamp: p.timestamp, isPermission: p.isPermission ?? null
            });
            added.add(p.timestamp);
          }
          // Pair with next punch — even if next is last punch (allowed)
          const nextIdx = i + 1;
          const next = punches[nextIdx];
          if (next && !added.has(next.timestamp)) {
            finalPunches.push({
              timestamp: next.timestamp, isPermission: next.isPermission ?? null
            });
            added.add(next.timestamp);
            pairedByPrev.add(nextIdx);
          }
        }


        if (pairedByPrev.has(i)) {

          continue;
        }
      }

      // keep original chronological order (already in order) — finalPunches preserves push order
      emp.breakSummary.outsideTolerance = finalPunches;

      // helper: find which window a second belongs to
      const findWindowKey = (sec) => {
        if (Number.isNaN(sec)) return null;
        const w = windows.find(w => sec >= w.start && sec <= w.end);
        return w ? w.key : null;
      };

      // ---- initialize punchSlots (keep existing mapping)
      const punchSlots = {
        inTime: null,
        firstBreakOut: null,
        firstBreakIn: null,
        lunchBreakOut: null,
        lunchBreakIn: null,
        eveningBreakOut: null,
        eveningBreakIn: null,
        outTime: null,
      };

      // ------------------------------------
      // MAP PUNCHES INTO WINDOWS
      // ------------------------------------

      for (const w of windows) {
        const match = punches.find(p => {
          const sec = extractSeconds(p.timestamp);
          return sec >= w.start && sec <= w.end;
        });
        if (match) punchSlots[w.key] = match.timestamp;
      }
      // ---- if no punches -> empty result and continue
      if (!punches || punches.length === 0) {
        emp.absentTableData = [];
      } else {
        // determine first and last punch objects
        const firstPunchObj = punches[0];
        const lastPunchObj = punches[punches.length - 1];

        const firstSec = extractSeconds(firstPunchObj.timestamp);
        const lastSec = extractSeconds(lastPunchObj.timestamp);

        // classify windows for first & last
        const firstWindow = findWindowKey(firstSec); // e.g., "lunchBreakOut"
        const lastWindow = findWindowKey(lastSec);  // e.g., "outTime"

        // ----- RULES -----
        // Rule A: First = morning IN, Last = lunch window
        const ruleA = (firstWindow === "inTime") && (lastWindow === "lunchBreakOut" || lastWindow === "lunchBreakIn");

        // Rule B: First = lunch window, Last = outTime
        const ruleB = (firstWindow === "lunchBreakOut" || firstWindow === "lunchBreakIn") && (lastWindow === "outTime");



        const isSpecialAbsent = ruleA || ruleB /*|| ruleC*/;

        if (emp.status === "Absent" || isSpecialAbsent) {
          emp.absentTableData = [
            {
              ...punchSlots,                // your existing window-based slots
              allPunches: punches.map(p => ({
                timestamp: p.timestamp,
                isPermission: p.isPermission ?? null
              }))                              // attach all punches here
            }
          ];
        } else {
          emp.absentTableData = [];
        }

        // --- for debugging (optional): attach windows to emp for inspection
        // emp._debug = { firstWindow, lastWindow, firstSec, lastSec, windows };
      }

      const firstPunchObj = emp?.punches?.[0];

      let morningStatus;
      if (firstPunch >= morningInSec && firstPunch <= morningInToTol) {
        morningStatus = {
          status: "On Time",
          punch: firstPunchObj.timestamp,   // <-- FULL TIMESTAMP
          delay: "00:00:00",
          isPermission: firstPunchObj.isPermission ?? null  // <<< add here

        };
      }

      // 2. Late (after tolerance but BEFORE break start)
      else if (firstPunch > morningInToTol && firstPunch < fbout) {
        const lateSeconds = firstPunch - morningInToTol;

        morningStatus = {
          status: "Late Login",
          punch: firstPunchObj.timestamp,   // <-- FULL TIMESTAMP
          delay: formatTime(lateSeconds),
          isPermission: firstPunchObj.isPermission ?? null  // <<< add here

        };
      } else if (firstPunch >= fbout) {
        morningStatus = {
          status: "Late Login",
          punch: firstPunchObj.timestamp,   // <-- FULL TIMESTAMP
          delay: "00:00:00",  // No delay after break start
          isPermission: firstPunchObj.isPermission ?? null  // <<< add here

        };
      }


      emp.breakSummary.morningInOut = morningStatus;
      const lastPunchObj = emp.punches[emp.punches.length - 1];


      // Evening Out Punch
      // Evening Out Punch (no more Extra Work concept)
      let eveningStatus = {
        punch: lastPunchObj.timestamp,    // <-- FULL TIMESTAMP
        delay: "00:00:00",
        isPermission: lastPunchObj.isPermission ?? null  // <<< add here


      };

      if (lastPunch < eveningOutFromTol) {
        // Employee left early → count as delay
        const delaySeconds = eveningOutFromTol - lastPunch;
        eveningStatus.status = "Early Logout";
        eveningStatus.delay = formatTime(delaySeconds);

      } else {
        // On-time or after – no extra work concept
        eveningStatus.status = "On Time";
      }

      // Store it
      emp.breakSummary.eveningInOut = eveningStatus;

      const breaks = [

        { out: emp.shiftTemplateItem.fbOut, in: emp.shiftTemplateItem.fbIn }, // morning
        { out: emp.shiftTemplateItem.lunchBst, in: emp.shiftTemplateItem.lunchBET }, // lunch
        { out: emp.shiftTemplateItem.sbOut, in: emp.shiftTemplateItem.sbIn } // evening
      ];

      if (punchesTime.length >= 1) {
        const [morningBreak, lunchBreak, eveningBreak] = breaks;
        const GRACE_MINUTES = 10;


        // Initialize delay object

        let totalBreakDelaySeconds = 0; // sum of all delays

        const calculateBreak = (breakItem, key) => {

          if (!breakItem.out || !breakItem.in) {
            emp.breakSummary[key] = {
              status: "Break Punch timing not available",
              punches: { out: null, in: null },
              breakDuration: "00:00:00",
              delay: "00:00:00"
            };
            return 0;
          }


          const breakStart = timeToSeconds(breakItem.out);
          const breakEnd = timeToSeconds(breakItem.in);
          const graceEnd = breakEnd + GRACE_MINUTES * 60;

          // Filter punches within break + grace
          const punchesInBreak = punchesTime?.map(t => timeToSeconds(t))?.filter(secs => secs >= breakStart && secs <= graceEnd)
            ?.sort((a, b) => a - b);

          if (punchesInBreak.length === 0) {
            // No punches → ignore break

            emp.breakSummary[key] = {
              status: "No punches",
              punches: { out: null, in: null },
              breakDuration: "00:00:00",
              delay: "00:00:00"
            };

            return 0;
          }

          if (punchesInBreak.length === 1) {
            // Single punch → ignore break, store punch
            const singleTime = formatTime(punchesInBreak[0]);


            emp.breakSummary[key] = {
              status: "Miss punch",
              punch: singleTime,       // actual punch time
              breakDuration: "00:00:00",
              delay: "00:00:00"
            };

            return 0;
          }
          const outSecs = punchesInBreak[0];
          const inSecs = punchesInBreak[1];

          const actualBreak = inSecs - outSecs; // real break duration
          const standardBreak = breakEnd - breakStart; // allowed break duration
          const delay = Math.max(0, actualBreak - standardBreak); // delay if any
          // Delay if returned after official break
          totalBreakDelaySeconds += delay;
          const status = inSecs <= graceEnd ? "On Time" : "Delayed";
          emp.breakSummary[key] = {
            status,
            punches: { out: formatTime(outSecs), in: formatTime(inSecs) },
            breakDuration: formatTime(actualBreak),
            delay: formatTime(delay)  // ← use seconds here instead of minutes
          };
          return actualBreak > 0 ? actualBreak : 0;
        };


        // ---- Morning Break ----
        breakSeconds += calculateBreak(morningBreak, "morning");

        // ---- Lunch Break ----
        breakSeconds += calculateBreak(lunchBreak, "lunch");

        // ---- Evening Break ----
        breakSeconds += calculateBreak(eveningBreak, "evening");


        // Add breakSeconds to raw worked time and subtract delays
        // totalSeconds = rawSeconds + breakSeconds - totalBreakDelaySeconds;
        totalSeconds = rawSeconds + breakSeconds;


        const formattedTime = formatTime(totalSeconds);
        console.log(`Employee ${emp.firstName} - Worked Time with breaks = ${formattedTime}`);
        console.log(`Employee ${emp.firstName} - Raw Worked Time = ${emp.rawWorkedTime}`);
        console.log(`Employee ${emp.firstName} - Break Summary =`, emp.breakSummary);
        emp.hourlyWorkedTime = formattedTime;
        // emp.breakSummary.earlySeconds = formatTime(earlySeconds);
        // emp.breakSummary.lateSeconds = formatTime(lateSeconds);
        // emp.breakSummary.eveningEarlySeconds = formatTime(eveningEarlySeconds);
        // emp.breakSummary.eveningExtraSeconds = formatTime(eveningExtraSeconds);
      } else {
        console.log(`Employee ${emp.firstName} has no punches`);
        emp.hourlyWorkedTime = ""
        emp.rawWorkedTime = "";
        emp.breakSummary = {
          morning: { status: "no punch", punches: { out: null, in: null }, breakDuration: "00:00:00", delay: "00:00:00" },
          lunch: { status: "no punch", punches: { out: null, in: null }, breakDuration: "00:00:00", delay: "00:00:00" },
          evening: { status: "no punch", punches: { out: null, in: null }, breakDuration: "00:00:00", delay: "00:00:00" }
        };
      }
    }
  }
  return { data };
}




async function addAbsentPunches(body) {
  const { updatedAttendence } = body;
  console.log("Received punches:", updatedAttendence);

  const formatted = updatedAttendence.map(item => {
    const local = new Date(item.timestamp.replace(" ", "T"));
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset()); // 👈 FREEZE TIME
    return {
      employeeId: item.employeeId ?? undefined,
      mIdCard: item.mIdCard,
      timestamp: local,   // ✔ exact time saved
      machineType: item.machineType || undefined,
      machineIP: item.machineIP || undefined,
      machineInOutGridId: item.machineInOutGridId || undefined,
      isEditedPunch: item?.isEditedPunch || false,

    }

  });
  const data = await prisma.pythonPunchData.createMany({
    data:
      formatted,
    skipDuplicates: true,


  });
  return { statusCode: 0, data };
}

async function updatePermissionPunches(body) {
  const { data } = body;
  console.log("Received punches:", data);

  for (const entry of data) {
    const { mIdCard, timestamp, isPermission, permissionTime } = entry;

    await prisma.pythonPunchData.updateMany({
      where: {
        mIdCard,
        timestamp: {
          gte: new Date(`${timestamp.slice(0, 19)}.000Z`),
          lte: new Date(`${timestamp.slice(0, 19)}.999Z`),
        },
      },
      data: {
        isPermission,
        permissionTime
      },
    });

  }

  return { statusCode: 0, data };
}

async function updateAbsentPunches(body) {
  const { payload } = body;
  console.log("Received punches:", payload);

  const formatted = payload?.map(item => {
    const local = new Date(item.timestamp.replace(" ", "T"));
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return {
      employeeId: item.employeeId ?? undefined,
      mIdCard: item.mIdCard,
      timestamp: local,   // ✔ exact time saved
      machineType: item.machineType || undefined,
      machineIP: item.machineIP || undefined,
      machineInOutGridId: item.machineInOutGridId || undefined,
      isEditedPunch: item?.isEditedPunch || false,

    }

  });
  const data = await prisma.pythonPunchData.createMany({
    data:
      formatted,
    skipDuplicates: true,


  });
  return { statusCode: 0, data };
}
async function updateSinglePunch(body) {
  const { payload } = body;
  console.log("Receivedsinglepunch:", payload);

  const formatted = payload?.map(item => {
    const local = new Date(item.timestamp.replace(" ", "T"));
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return {
      employeeId: item.employeeId ?? undefined,
      mIdCard: item.mIdCard,
      timestamp: local,   // ✔ exact time saved
      machineType: item.machineType || undefined,
      machineIP: item.machineIP || undefined,
      machineInOutGridId: item.machineInOutGridId || undefined,
      isEditedPunch: item?.isEditedPunch || false,

    }

  });
  const data = await prisma.pythonPunchData.createMany({
    data:
      formatted,
    skipDuplicates: true,


  });
  return { statusCode: 0, data };
}


export { get, addAbsentPunches, updatePermissionPunches, updateAbsentPunches, updateSinglePunch };
