import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  const { companyId, active } = req.query;
  const data = await prisma.leaveCode.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,
      active: active ? Boolean(active) : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = await prisma.leaveOPeningBalanceGrid.count({
    where: { leaveId: parseInt(id) },
  });
  const data = await prisma.leaveCode.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!data) return NoRecordFound("leaveCode");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { companyId, active } = req.query;
  const { searchKey } = req.params;
  const data = await prisma.leaveCode.findMany({
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
  const { name, code, days, companyId, active, branchId, userId, finYearId } = await body;
  const data = await prisma.leaveCode.create({
    data: {
      name,
      code,
      active,
      days: days ? parseInt(days) : undefined,
      branchId: branchId ? parseInt(branchId) : undefined,
      companyId: companyId ? parseInt(companyId) : undefined,
      finYearId: finYearId ? parseInt(finYearId) : undefined,
      createdById: userId ? parseInt(userId) : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const { name, code, active, days, userId } = await body;
  const dataFound = await prisma.leaveCode.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("leaveCode");
  const data = await prisma.leaveCode.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      code,
      active,
      days: days ? parseInt(days) : undefined,
      updatedById: userId ? parseInt(userId) : undefined,

    },
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.leaveCode.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
