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
    console.log("argumnts : ", branchId, shortCode, startTime, endTime, isTaxBill);

    let lastObject = await prisma.payFrequency.findFirst({
        where: {
            branchId: parseInt(branchId),
        },
        orderBy: {
            id: "desc",
        },
    });

    const code = "SHF/TEM"

    const branchObj = await getTableRecordWithId(branchId, "branch");
    // let newDocId = `${branchObj.branchCode}/${shortCode}/${code}/1`;
    let newDocId = `${code}/1`;
    if (lastObject) {
        newDocId = `${code}/${parseInt(lastObject.docId.split("/").at(-1)) + 1
            }`;
    }


    return newDocId;
}

async function get(req) {
    const { companyId, active, branchId, finYearId, searchDocId, } = req.query;

    console.log(companyId, active, finYearId, "received");

    const data = await prisma.payFrequency.findMany({
        where: {
            //   companyId: companyId ? parseInt(companyId) : undefined,
            //   active: active ? Boolean(active) : undefined,
            docId: Boolean(searchDocId)
                ? {
                    contains: searchDocId,
                }
                : undefined,
        },
    });
    let finYearDate = await getFinYearStartTimeEndTime(finYearId);

    console.log(finYearDate, "finyear--");


    const shortCode = finYearDate
        ? getYearShortCodeForFinYear(
            finYearDate?.startDateStartTime,
            finYearDate?.endDateEndTime
        )
        : "";
    // let newDocId = finYearDate
    //     ? await getNextDocId(
    //         branchId,
    //         shortCode,
    //         finYearDate?.startDateStartTime,
    //         finYearDate?.endDateEndTime,
    //         // isTaxBill
    //     )
    //     : "";

    return { statusCode: 0, data };
}

async function getOne(id) {
    const childRecord = 0;
    const data = await prisma.payFrequency.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            PayFrequencyItems: true
        }
    });
    if (!data) return NoRecordFound("hRCommonTemplate");
    return { statusCode: 0, data: { ...data, ...{ childRecord } } };
}

async function getSearch(req) {
    const { searchKey } = req.params;
    const { companyId, active } = req.query;
    const data = await prisma.payFrequency.findMany({
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
        name,
        branchId,
        companyId,
        active,
        description,
        docId,
        finYearId,
        payFrequencyType = [],
    } = body;

    let data;

    await prisma.$transaction(async (tx) => {
        data = await tx.payFrequency.create({
            data: {
                name,
                description,
                docId,
                finYearId: finYearId ? parseInt(finYearId) : undefined,
                branchId: branchId ? parseInt(branchId) : undefined,
                companyId: companyId ? parseInt(companyId) : undefined,
                active: active ? Boolean(active) : undefined,

                payFrequencyType: {
                    create: payFrequencyType.map((type) => ({
                        payFrequencyType: type.payFrequencyType,
                        PayFrequencyItems: {
                            create: type.PayFrequencyItems.map((item) => ({
                                startDate: item?.startDate ? new Date(item.startDate) : undefined,
                                endDate: item?.endDate ? new Date(item.endDate) : undefined,
                                salaryDate: item?.salaryDate ? new Date(item.salaryDate) : undefined,
                                notes: item?.notes || null,
                            })),
                        },
                    })),
                },
            },
        });
    });

    return { statusCode: 0, data };
}

async function update(id, body) {
    const { name, branchId, companyId, active, description, docId, payFrequencyItems } = await body;
    const dataFound = await prisma.payFrequency.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!dataFound) return NoRecordFound("shiftTempalte");

    let data;
    await prisma.$transaction(async (tx) => {
        data = await tx.payFrequency.update({
            data: {
                // docId: docId,
                // branchId: branchId ? parseInt(branchId) : undefined,
                // companyId: companyId ? parseInt(companyId) : undefined,
                active: active ? Boolean(active) : undefined,




                payFrequencyItems:
                    payFrequencyItems?.length > 0
                        ? {
                            update: payFrequencyItems?.map((item) => ({
                                startDate: item?.startDate ? item.startDate : undefined,
                                endDate: item?.endDate ? item.endDate : undefined,
                                salaryDate: item?.salaryDate ? item.salaryDate : undefined,
                                notes: item?.notes ? item.notes : undefined,
                            })),
                        }
                        : undefined,


            },
        });
    });
    return { statusCode: 0, data };
}

async function remove(id) {
    const data = await prisma.payFrequency.delete({
        where: {
            id: parseInt(id),
        },
    });
    return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove };
