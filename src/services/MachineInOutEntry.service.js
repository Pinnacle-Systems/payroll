import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";

const prisma = new PrismaClient();

async function get(req) {
  const { companyId, branchId, finYearId, searchDocId } = req.query;

  const data = await prisma.machineInOutEntry.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,

      docId: Boolean(searchDocId)
        ? {
            contains: searchDocId,
          }
        : undefined,
    },
    include: {
      MachineInOutGrid: true,
    },

    orderBy: { id: "desc" },
  });

  return { statusCode: 0, data };
}

async function getOne(id) {
  const childRecord = 0;
  const data = await prisma.machineInOutEntry.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      MachineInOutGrid: true,
    },
  });
  if (!data) return NoRecordFound("MachineInOutEntry");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { searchKey } = req.params;
  const { companyId, active } = req.query;
  const data = await prisma.machineInOutEntry.findMany({
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
  const { branchId, machineInOutGrid, companyId, branchCode } = await body;

  let data;

  await prisma.$transaction(async (tx) => {
    data = await tx.machineInOutEntry.create({
      data: {
        branchId: branchId ? parseInt(branchId) : undefined,
        companyId: companyId ? parseInt(companyId) : undefined,
        branchCode: branchCode ? branchCode : "",

        MachineInOutGrid:
          machineInOutGrid?.length > 0
            ? {
                create: machineInOutGrid?.map((item) => ({
                  date: item?.date ? new Date(item?.date) : null,
                  machineTypeOne: item?.machineTypeOne
                    ? item?.machineTypeOne
                    : "",
                  machineIP: item?.machineIP ? item?.machineIP : "",
                  machineNo: item?.machineNo ? parseInt(item?.machineNo) : 0,
                  machineTypeTwo: item?.machineTypeTwo
                    ? item?.machineTypeTwo
                    : "",
                  currentMachine: item?.currentMachine
                    ? item?.currentMachine
                    : "",
                  default: item?.default ? item?.default : "",
                  notes: item?.notes ? item?.notes : "",
                })),
              }
            : undefined,
      },
    });
  });

  return { statusCode: 0, data };
}

async function updatecompanyPayStructure(tx, payDetails, data) {
  console.log(data, "data");

  let removedItems = data?.payDetails?.filter((oldItem) => {
    let result = payDetails?.find((newItem) => newItem.id === oldItem.id);
    if (result) return false;
    return true;
  });

  let removedItemsId = removedItems.map((item) => parseInt(item.id));
  await tx.payDetails.deleteMany({
    where: {
      id: {
        in: removedItemsId,
      },
    },
  });

  const promises = payDetails.map(async (item) => {
    if (item?.id) {
      return await tx.payDetails.update({
        where: {
          id: parseInt(item.id),
        },
        data: {
          payComponentId: item?.payComponentId
            ? parseInt(item?.payComponentId)
            : undefined,
          lop: item?.lop ?? "",
          pf: item?.pf ?? "",
          esi: item?.esi ?? "",
          pickFrom: item?.pickFrom ?? "",
        },
      });
    } else {
      return await tx.payDetails.create({
        data: {
          payComponentId: item?.payComponentId
            ? parseInt(item?.payComponentId)
            : undefined,
          lop: item?.lop ?? "",
          pf: item?.pf ?? "",
          esi: item?.esi ?? "",
          pickFrom: item?.pickFrom ?? "",
        },
      });
    }
  });
  return Promise.all(promises);
}

async function update(id, body) {
  const { branchId, machineInOutGrid, companyId, branchCode } = await body;
  const dataFound = await prisma.machineInOutEntry.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("machineInOutEntry");

  let data;
  await prisma.$transaction(async (tx) => {
    data = await tx.machineInOutEntry.update({
      where: {
        id: parseInt(id),
      },
      data: {
        branchId: branchId ? parseInt(branchId) : undefined,
        companyId: companyId ? parseInt(companyId) : undefined,
        branchCode: branchCode ? branchCode : "",

        MachineInOutGrid:
          machineInOutGrid?.length > 0
            ? {
                deleteMany: {},
                create: machineInOutGrid?.map((item) => ({
                  date: item?.date ? new Date(item?.date) : null,
                  machineTypeOne: item?.machineTypeOne
                    ? item?.machineTypeOne
                    : "",
                  machineIP: item?.machineIP ? item?.machineIP : "",
                  machineNo: item?.machineNo ? parseInt(item?.machineNo) : 0,
                  machineTypeTwo: item?.machineTypeTwo
                    ? item?.machineTypeTwo
                    : "",
                  currentMachine: item?.currentMachine
                    ? item?.currentMachine
                    : "",
                  default: item?.default ? item?.default : "",
                  notes: item?.notes ? item?.notes : "",
                })),
              }
            : undefined,
      },
    });
    // await updatecompanyPayStructure(tx, payDetails, data);
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.machineInOutEntry.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
