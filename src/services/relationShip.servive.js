import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  const { companyId, active } = req.query;
  const data = await prisma.relationShip.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,
      // active: active ? Boolean(active) : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = 0;
  const data = await prisma.relationShip.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!data) return NoRecordFound("relationShip");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { companyId, active } = req.query;
  const { searchKey } = req.params;
  const data = await prisma.relationShip.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,
      // active: active ? Boolean(active) : undefined,
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
  const { name, active, companyId, branchId } = await body;
  const data = await prisma.relationShip.create({
    data: {
      name: name ? name : "",
      companyId: companyId ? parseInt(companyId) : undefined,
      branchId: branchId ? parseInt(branchId) : undefined,
      active,
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const { name, active, companyId, branchId  } = await body;
  const dataFound = await prisma.relationShip.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("relationShip");
  const data = await prisma.relationShip.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: name ? name : "",
      companyId: companyId ? parseInt(companyId) : undefined,
      branchId: branchId ? parseInt(branchId) : undefined,
      active,
    },
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.relationShip.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
