import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";
import {
  getDateFromDateTime,
  getYearShortCodeForFinYear,
} from "../utils/helper.js";
import { getTableRecordWithId } from "../utils/helperQueries.js";
import { getFinYearStartTimeEndTime } from "../utils/finYearHelper.js";

const prisma = new PrismaClient();

async function getNextDocId(
  branchId,
  shortCode,
  startTime,
  endTime,
  isTaxBill
) {
  let lastObject = await prisma.pFESIEditor.findFirst({
    where: {
      branchId: parseInt(branchId),
    },
    orderBy: {
      id: "desc",
    },
  });

  const code = "PF/ESI";

  const branchObj = await getTableRecordWithId(branchId, "branch");
  // let newDocId = `${branchObj.branchCode}/${shortCode}/${code}/1`;
  let newDocId = `${code}/1`;
  if (lastObject) {
    newDocId = `${code}/${parseInt(lastObject?.docId?.split("/").at(-1)) + 1}`;
  }

  return newDocId;
}

async function get(req) {
  console.log("pay structute get called");

  const { companyId, active, branchId, finYearId, searchDocId } = req.query;

  console.log(companyId, active, finYearId, "received--");

  const data = await prisma.pFESIEditor.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : undefined,

      docId: Boolean(searchDocId)
        ? {
            contains: searchDocId,
          }
        : undefined,
    },
    include: {
      PfEsiGrid: true,
    },

    orderBy: { id: "desc" },
  });

  console.log(data, "datasending");
  let finYearDate = await getFinYearStartTimeEndTime(finYearId);
  const shortCode = finYearDate
    ? getYearShortCodeForFinYear(
        finYearDate?.startDateStartTime,
        finYearDate?.endDateEndTime
      )
    : "";
  let newDocId = finYearDate
    ? await getNextDocId(
        branchId,
        shortCode,
        finYearDate?.startDateStartTime,
        finYearDate?.endDateEndTime
      )
    : "";

  return { statusCode: 0, nextDocId: newDocId, data };
}

async function getOne(id) {
  const childRecord = 0;
  const data = await prisma.pFESIEditor.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      PfEsiGrid: true,
    },
  });
  if (!data) return NoRecordFound("PFESIEditor");
  return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
  const { searchKey } = req.params;
  const { companyId, active } = req.query;
  const data = await prisma.pFESIEditor.findMany({
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
  const { date, docId, payDetailsId, branchId, pfEsiGrid, companyId } =
    await body;

  let data;

  await prisma.$transaction(async (tx) => {
    data = await tx.pFESIEditor.create({
      data: {
        docId: docId,
        date: date ? new Date(date) : null,
        branchId: branchId ? parseInt(branchId) : undefined,
        companyId: companyId ? parseInt(companyId) : undefined,
        payDetailsId: payDetailsId ? parseInt(payDetailsId) : undefined,

        PfEsiGrid:
          pfEsiGrid?.length > 0
            ? {
                create: pfEsiGrid?.map((item) => ({
                  fromValue: item?.fromValue ? parseFloat(item?.fromValue) : 0,
                  toValue: item?.toValue ? parseFloat(item?.toValue) : 0,
                  percentage: item?.percentage
                    ? parseFloat(item?.percentage)
                    : 0,
                })),
              }
            : undefined,
      },
    });
  });

  return { statusCode: 0, data };
}

async function update(id, body) {
  const { date, docId, payDetailsId, branchId, pfEsiGrid, companyId } =
    await body;
  const dataFound = await prisma.pFESIEditor.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("PFESIEditor");

  let data;
  await prisma.$transaction(async (tx) => {
    data = await tx.pFESIEditor.update({
      where: {
        id: parseInt(id),
      },
      data: {
        docId: docId,
        date: date ? new Date(date) : null,
        branchId: branchId ? parseInt(branchId) : undefined,
        companyId: companyId ? parseInt(companyId) : undefined,
        payDetailsId: payDetailsId ? parseInt(payDetailsId) : undefined,

        PfEsiGrid:
          pfEsiGrid?.length > 0
            ? {
              deleteMany:{},
                create: pfEsiGrid?.map((item) => ({
                  fromValue: item?.fromValue ? parseFloat(item?.fromValue) :0,
                  toValue: item?.toValue ? parseFloat(item?.toValue) : 0,
                  percentage: item?.percentage
                    ? parseFloat(item?.percentage)
                    : 0,
                })),
              }
            : undefined,
      },
    });
  });
  return { statusCode: 0, data };
}

async function remove(id) {
  const data = await prisma.pFESIEditor.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
