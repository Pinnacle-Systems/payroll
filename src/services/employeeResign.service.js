import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";
import { getDateFromDateTime, getYearShortCode, getYearShortCodeForFinYear } from "../utils/helper.js";

import { getTableRecordWithId } from "../utils/helperQueries.js";
import { getFinYearStartTimeEndTime } from "../utils/finYearHelper.js";

const prisma = new PrismaClient();

async function getNextDocId(branchId, shortCode, startTime, endTime, docId) {
  let lastObject = await prisma.employeeResign.findFirst({
    where: {
      branchId: parseInt(branchId),
      // AND: [
      //   { createdAt: { gte: startTime } },
      //   { createdAt: { lte: endTime } },
      // ],
    },
    orderBy: { id: "desc" },
  });

  const branchObj = await getTableRecordWithId(branchId, "branch");

  let newDocId = `${branchObj.branchCode}${getYearShortCode(
    new Date()
  )}/EMP/RES/1`;

  if (lastObject) {
    newDocId = `${branchObj.branchCode}${getYearShortCode(new Date())}/EMP/RES/${
      parseInt(lastObject.docId.split("/").at(-1)) + 1
    }`;
  }

  return newDocId;
}


async function get(req) {
  const { companyId, active, branchId, finYearId, serachDocNo } = req.query;
  let finYearDate = await getFinYearStartTimeEndTime(finYearId);
  const shortCode = finYearDate
    ? getYearShortCodeForFinYear(finYearDate?.startTime, finYearDate?.endTime)
    : "";
  let newDocId = await getNextDocId(
    branchId,
    shortCode,
    finYearDate?.startTime,
    finYearDate?.endTime
  );
  const data = await prisma.employeeResign.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,
      active: active ? Boolean(active) : undefined,
    },
    include: {
      Employee: {
        select: {
          firstName: true,
          id: true,
          joiningDate: true,
          aadharNo: true,
          idNumber: true,
          department: true,
          designation: true,
          mobileNumber: true,
        },
      },
    },
        orderBy: { id: "desc" },

  });

  return { statusCode: 0, data, nextDocId: newDocId };
}

async function getOne(id) {
  const childRecord = 0;
  const data = await prisma.employeeResign.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      Employee: {
        select: {
          firstName: true,
          id: true,
          joiningDate: true,
          aadharNo: true,
          idNumber: true,
          department: true,
          designation: true,
          mobileNumber: true,
        },
      },
    },
  });
  if (!data) return NoRecordFound("employeeResign");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { companyId, active } = req.query;
  const { searchKey } = req.params;
  const data = await prisma.employeeResign.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,
      active: active ? Boolean(active) : undefined,
      OR: [
        {
          name: {
            contains: searchKey,
          },
        },
        {
          code: {
            contains: searchKey,
          },
        },
      ],
    },
  });
  return { statusCode: 0, data: data };
}

async function create(body) {
  const {
    employeeId,

    date,

    lastWorkingDate,
    joinAgain,
    leaveReason,
    remarks,
    companyId,
    finYearId,
    branchId,
  } = await body;
  let finYearDate = await getFinYearStartTimeEndTime(finYearId);
  const shortCode = finYearDate
    ? getYearShortCodeForFinYear(finYearDate?.startTime, finYearDate?.endTime)
    : "";
  let docId = await getNextDocId(
    branchId,
    shortCode,
    finYearDate?.startTime,
    finYearDate?.endTime,
    
  );
  const data = await prisma.employeeResign.create({
    data: {
      branchId: branchId ? parseInt(branchId) : undefined,
      companyId: companyId ? parseInt(companyId) : undefined,
      employeeId: employeeId ? parseInt(employeeId) : undefined,
      docId: docId,
      date: date ? new Date(date) : null,
      lastWorkingDate: lastWorkingDate ? new Date(lastWorkingDate) : null,
      joinAgain: joinAgain ? joinAgain : "",
      leaveReason: leaveReason ? leaveReason : "",
      remarks: remarks ? remarks : "",
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const {
    employeeId,

    date,

    lastWorkingDate,
    joinAgain,
    leaveReason,
    remarks,
  } = await body;
  const dataFound = await prisma.employeeResign.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("employeeResign");
  const data = await prisma.employeeResign.update({
    where: {
      id: parseInt(id),
    },
    data: {
       employeeId: employeeId ? parseInt(employeeId) : undefined,
      
      date: date ? new Date(date) : null,
      lastWorkingDate: lastWorkingDate ? new Date(lastWorkingDate) : null,
      joinAgain: joinAgain ? joinAgain : "",
      leaveReason: leaveReason ? leaveReason : "",
      remarks: remarks ? remarks : "",
    },
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.employeeResign.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
