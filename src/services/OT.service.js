import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  console.log("pay structute get called");

  const { companyId,  } = req.query;

  const data = await prisma.oT.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,

      
    },
    include: {
      OTDetails: true,
    },

    orderBy: { id: "desc" },
  });

  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = 0;
  const data = await prisma.oT.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      OTDetails: true,
    },
  });
  if (!data) return NoRecordFound("Pay Structure");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { searchKey } = req.params;
  const { companyId, active } = req.query;
  const data = await prisma.oT.findMany({
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
  const { date, branchId, oTDetails, companyId } = await body;

  let data;

  await prisma.$transaction(async (tx) => {
    data = await tx.oT.create({
      data: {
        date: date ? new Date(date) : null,
        branchId: branchId ? parseInt(branchId) : undefined,
        companyId: companyId ? parseInt(companyId) : undefined,

        OTDetails:
          oTDetails?.length > 0
            ? {
                create: oTDetails?.map((item) => ({
                  payCode: item?.payCode ? item?.payCode : "",
                  payDescription: item?.payDescription
                    ? item?.payDescription
                    : "",
                })),
              }
            : undefined,
      },
    });
  });

  return { statusCode: 0, data };
}

async function update(id, body) {
  const { date, branchId, oTDetails, companyId } = await body;
  const dataFound = await prisma.oT.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("oT");

  let data;
  await prisma.$transaction(async (tx) => {
    data = await tx.oT.update({
      where: {
        id: parseInt(id),
      },
      data: {
        date: date ? new Date(date) : null,
        branchId: branchId ? parseInt(branchId) : undefined,
        companyId: companyId ? parseInt(companyId) : undefined,

        OTDetails:
          oTDetails?.length > 0
            ? {
                deleteMany: {},
                create: oTDetails?.map((item) => ({
                  payCode: item?.payCode ? item?.payCode : "",
                  payDescription: item?.payDescription
                    ? item?.payDescription
                    : "",
                })),
              }
            : undefined,
      },
    });
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.oT.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
