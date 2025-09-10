import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  const { companyId, active } = req.query;
  const data = await prisma.bloodGroupMaster.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,
      active: active ? Boolean(active) : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = await prisma.employee.count({
    where: {bloodGroupId: parseInt(id) },
  });
  const data = await prisma.bloodGroupMaster.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!data) return NoRecordFound("bloodGroupMaster");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { companyId, active } = req.query;
  const { searchKey } = req.params;
  const data = await prisma.bloodGroupMaster.findMany({
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
  const { bloodGroupName, postive, bgFamily, active, companyId, branchId } =
    await body;
  const data = await prisma.bloodGroupMaster.create({
    data: {
      bloodGroupName: bloodGroupName ? bloodGroupName : "",
      postive: postive ? postive : "",
      bgFamily: bgFamily ? bgFamily : "",
      active,
      companyId: companyId ? parseInt(companyId) : undefined,
      branchId: branchId ? parseInt(branchId) : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const { bloodGroupName, postive, bgFamily, active, companyId, branchId } =
    await body;
  const dataFound = await prisma.bloodGroupMaster.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("bloodGroupMaster");
  const data = await prisma.bloodGroupMaster.update({
    where: {
      id: parseInt(id),
    },
    data: {
      bloodGroupName: bloodGroupName ? bloodGroupName : "",
      postive: postive ? postive : "",
      bgFamily: bgFamily ? bgFamily : "",
      active,
      companyId: companyId ? parseInt(companyId) : undefined,
      branchId: branchId ? parseInt(branchId) : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.bloodGroupMaster.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
