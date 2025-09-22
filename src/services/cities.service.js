import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  const { companyId, active } = req.query;
  const data = await prisma.city.findMany({
    where: {
      state: {
        country: {
          companyId: companyId ? parseInt(companyId) : undefined,
        },
      },
      active: active ? Boolean(active) : undefined,
    },
     include: {
      country: true,
      state:true
    },
  });
  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = await prisma.employee.count({
    where: { presentCityId: parseInt(id) },
  });
  const data = await prisma.city.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!data) return NoRecordFound("City");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { searchKey } = req.params;
  const { companyId, active } = req.query;
  const data = await prisma.city.findMany({
    where: {
      state: {
        country: {
          companyId: companyId ? parseInt(companyId) : undefined,
        },
      },
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
        {
          state: {
            name: {
              contains: searchKey,
            },
          },
        },
      ],
    },
    select: {
      name: true,
      code: true,
      active: true,
      id: true,
      state: {
        select: {
          name: true,
          country: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return { statusCode: 0, data: data };
}

async function create(body) {
  const { name, code, state, branchId, companyId, country } = await body;
  const data = await prisma.city.create({
    data: {
      name,
      code,
      state: {
        connect: { id: parseInt(state) },
      },
      branch: branchId ? { connect: { id: parseInt(branchId) } } : undefined,
      company: companyId ? { connect: { id: parseInt(companyId) } } : undefined,
      country: country ? { connect: { id: parseInt(country) } } : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function update(id, body) {
  const { name, code, active, state ,country} = await body;
  const dataFound = await prisma.city.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("City");
  const data = await prisma.city.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      code,
      active,
      state: {
        connect: { id: parseInt(state) },
      },
      country: country ? { connect: { id: parseInt(country) } } : undefined,
    },
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.city.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
