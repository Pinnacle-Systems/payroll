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
          department: true,
          designation: true
        },
      },
      LeaveOPeningBalanceGrid: true
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
          department: true,
          designation: true
        },
      },
      LeaveOPeningBalanceGrid: true
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
    userId,
    employeeId,
    companyId,
    branchId,
    leaveopeningBalanceGrid
  } = await body;
  const data = await prisma.leaveOPeningBalance.create({
    data: {
      branchId: branchId ? parseInt(branchId) : undefined,
      companyId: companyId ? parseInt(companyId) : undefined,
      createdById: userId ? parseInt(userId) : undefined,
      finYearId: finYearId ? parseInt(finYearId) : undefined,
      employeeId: employeeId ? parseInt(employeeId) : undefined,
      LeaveOPeningBalanceGrid: leaveopeningBalanceGrid?.length > 0 ? {
        create: leaveopeningBalanceGrid?.map((data) => ({
          leaveId: data?.leaveId ? parseInt(data?.leaveId) : undefined,
          openingBalance: data?.openingBalance ? parseInt(data?.openingBalance) : 0,

        }))
      } : undefined
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const { finYearId, employeeId, leaveopeningBalanceGrid, userId } = await body;
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
      updatedById: userId ? parseInt(userId) : undefined,
      finYearId: finYearId ? parseInt(finYearId) : undefined,
      employeeId: employeeId ? parseInt(employeeId) : undefined,
      LeaveOPeningBalanceGrid: leaveopeningBalanceGrid?.length
        ? {
          // Delete removed rows
          deleteMany: {
            id: {
              notIn: leaveopeningBalanceGrid
                .filter((item) => item.id)
                .map((item) => parseInt(item.id)),
            },
          },
          // Update existing rows
          update: leaveopeningBalanceGrid
            .filter((item) => item.id)
            .map((item) => ({
              where: { id: parseInt(item.id) },
              data: {
                leaveId: item?.leaveId ? parseInt(item?.leaveId) : undefined,
                openingBalance: item?.openingBalance ? parseInt(item?.openingBalance) : 0,
              },
            })),
          // Create new rows
          create: leaveopeningBalanceGrid
            .filter((item) => !item.id)
            .map((item) => ({
                  leaveId: item?.leaveId ? parseInt(item?.leaveId) : undefined,
                openingBalance: item?.openingBalance ? parseInt(item?.openingBalance) : 0,
            })),
        }
        : undefined,

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
