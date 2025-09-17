import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  const { companyId, active } = req.query;
  const data = await prisma.leaveOPeningBalance.findMany({
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
          payCategory: true,
          idNumber: true,
        },
      },
      leave:{
        select:{
          id:true,
          name:true
        }
      }
    },
  });
  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = 0;
  const data = await prisma.leaveOPeningBalance.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      Employee: {
        select: {
          firstName: true,
          id: true,
          joiningDate: true,
          payCategory: true,
          idNumber: true,
        },
      },
    },
  });
  if (!data) return NoRecordFound("leaveOPeningBalance");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { companyId, active } = req.query;
  const { searchKey } = req.params;
  const data = await prisma.leaveOPeningBalance.findMany({
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
    finYearId,
    leaveId,
    employeeId,
    openingBalance,

    companyId,

    branchId,
  } = await body;
  const data = await prisma.leaveOPeningBalance.create({
    data: {
      branchId: branchId ? parseInt(branchId) : undefined,
      companyId: companyId ? parseInt(companyId) : undefined,
      leaveId: leaveId ? parseInt(leaveId) : undefined,
      finYearId: finYearId ? parseInt(finYearId) : undefined,
      employeeId: employeeId ? parseInt(employeeId) : undefined,
      openingBalance: openingBalance ? parseInt(openingBalance) : 0,
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const { finYearId, leaveId, employeeId, openingBalance } = await body;
  const dataFound = await prisma.leaveOPeningBalance.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("leaveOPeningBalance");
  const data = await prisma.leaveOPeningBalance.update({
    where: {
      id: parseInt(id),
    },
    data: {
      leaveId: leaveId ? parseInt(leaveId) : undefined,
      finYearId: finYearId ? parseInt(finYearId) : undefined,
      employeeId: employeeId ? parseInt(employeeId) : undefined,
      openingBalance: openingBalance ? parseInt(openingBalance) : 0,
    },
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.leaveOPeningBalance.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
