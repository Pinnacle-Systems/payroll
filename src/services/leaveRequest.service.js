import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";
import {

    getYearShortCodeForFinYear,
} from "../utils/helper.js";

import { getFinYearStartTimeEndTime } from "../utils/finYearHelper.js";
import { getTableRecordWithId } from "../utils/helperQueries.js";

const prisma = new PrismaClient();
async function getNextDocId(
    branchId,

) {

    let lastObject = await prisma.leaveRequest.findFirst({
        where: {
            branchId: parseInt(branchId),
        },
        orderBy: {
            id: "desc",
        },
    });



    const code = "LEVREQ";

    const branchObj = await getTableRecordWithId(branchId, "branch");
    let newDocId = `${branchObj.branchCode}/${code}/1`;
    if (lastObject) {
        newDocId = `${branchObj.branchCode}/${code}/${parseInt(lastObject.docId.split("/").at(-1)) + 1}`;
    }
    console.log(newDocId, "newDocId");

    return newDocId;
}
async function get(req) {
    const { companyId, branchId, finYearId, searchDocId } = req.query;

    const data = await prisma.leaveRequest.findMany({
        where: {
            companyId: companyId ? parseInt(companyId) : undefined,

            docId: Boolean(searchDocId)
                ? {
                    contains: searchDocId,
                }
                : undefined,
        },
        include: {
            leaveDetails: {
                include: {
                    leave: {         // 👈 include leave name
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            employee: {
                select: {
                    id: true,
                    idNumber: true,
                    department: true,
                    designation: true,
                    firstName: true

                }
            }
        },

        orderBy: { id: "desc" },
    });

    return { statusCode: 0, data };
}

async function getOne(id) {
    const childRecord = 0;
    const data = await prisma.leaveRequest.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            leaveDetails: {
                include: {
                    leave: {         // 👈 include leave name
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }, employee: {
                select: {
                    id: true,
                    idNumber: true,
                    department: true,
                    designation: true,
                    firstName: true

                }
            }
        },
    });
    if (!data) return NoRecordFound("Leave Request");
    const employeeId = data.employeeId;

    // 2️⃣ Fetch **all leave details for this employee**
    const allEmployeeLeaveDetails = await prisma.leaveRequest.findMany({
        where: { employeeId },
        include: {
            leaveDetails: {
                include: {
                    leave: { select: { id: true, name: true } }
                }
            }
        }
    });

    // 3️⃣ Flatten all leaveDetails (because each request has many)
    const flatLeaveDetails = allEmployeeLeaveDetails.flatMap(req => req.leaveDetails);

    // 4️⃣ Group by leaveId + leaveName
    const summaryMap = {};

    flatLeaveDetails.forEach(item => {
        const leaveId = item.leaveId;
        const leaveName = item.leave?.name || "Unknown";
        const countValue = parseFloat(item.count ?? "0") || 0;

        if (!summaryMap[leaveId]) {
            summaryMap[leaveId] = {
                leaveId,
                leaveName,
                totalCount: 0
            };
        }

        summaryMap[leaveId].totalCount += countValue;
    });

    const leaveSummary = Object.values(summaryMap);

    return { statusCode: 0, data: { ...data, leaveSummary, ...{ childRecord } } };
}

async function getSearch(req) {
    const { searchKey } = req.params;
    const { companyId, active } = req.query;
    const data = await prisma.leaveRequest.findMany({
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
    const { branchId, companyId, finYearId, userId, employeeId, leaveDetails, fromDate, toDate, totalDays, date } = await body;
    let finYearDate = await getFinYearStartTimeEndTime(finYearId);
    const shortCode = finYearDate
        ? getYearShortCodeForFinYear(finYearDate?.startTime, finYearDate?.endTime)
        : "";
    let docId = await getNextDocId(
        branchId,
        shortCode,
        finYearDate?.startTime,
        finYearDate?.endTime
    );
    let data;

    await prisma.$transaction(async (tx) => {
        data = await tx.leaveRequest.create({
            data: {
                branchId: branchId ? parseInt(branchId) : undefined,
                companyId: companyId ? parseInt(companyId) : undefined,
                finYearId: finYearId ? parseInt(finYearId) : undefined,
                createdById: userId ? parseInt(userId) : undefined,

                employeeId: employeeId ? parseInt(employeeId) : undefined,
                docId,
                fromDate: fromDate ? new Date(fromDate) : null,
                toDate: toDate ? new Date(toDate) : null,
                date: date ? new Date(date) : null,
                totalDays: totalDays || '',
                leaveDetails:
                    leaveDetails?.length > 0
                        ? {
                            create: leaveDetails?.map((item) => ({
                                startDate: item?.startDate ? new Date(item?.startDate) : null,
                                leaveId: item?.leaveId
                                    ? parseInt(item?.leaveId)
                                    : undefined,
                                shiftTime: item?.shiftTime ? item?.shiftTime : "",
                                notes: item?.notes ? item?.notes : "",
                                count: item?.count || '',
                            })),
                        }
                        : undefined,
            },
        });
    });

    return { statusCode: 0, data };
}



async function update(id, body) {
    const { userId, employeeId, leaveDetails, fromDate, toDate, totalDays, date } = await body;
    const dataFound = await prisma.leaveRequest.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!dataFound) return NoRecordFound("leaveRequest");

    let data;
    await prisma.$transaction(async (tx) => {
        data = await tx.leaveRequest.update({
            where: {
                id: parseInt(id),
            },
            data: {

                employeeId: employeeId ? parseInt(employeeId) : undefined,

                fromDate: fromDate ? new Date(fromDate) : null,
                toDate: toDate ? new Date(toDate) : null,

                updatedById: userId ? parseInt(userId) : undefined,
                date: date ? new Date(date) : null,
                totalDays: totalDays || '',

                leaveDetails: leaveDetails?.length
                    ? {
                        // Delete removed rows
                        deleteMany: {
                            id: {
                                notIn: leaveDetails
                                    .filter((item) => item.id)
                                    .map((item) => parseInt(item.id)),
                            },
                        },
                        // Update existing rows
                        update: leaveDetails
                            .filter((item) => item.id)
                            .map((item) => ({
                                where: { id: parseInt(item.id) },
                                data: {
                                    startDate: item?.startDate ? new Date(item?.startDate) : null,
                                    leaveId: item?.leaveId
                                        ? parseInt(item?.leaveId)
                                        : undefined,
                                    shiftTime: item?.shiftTime ? item?.shiftTime : "",
                                    notes: item?.notes ? item?.notes : "",
                                    count: item?.count || '',
                                },
                            })),
                        // Create new rows
                        create: leaveDetails
                            .filter((item) => !item.id)
                            .map((item) => ({
                                startDate: item?.startDate ? new Date(item?.startDate) : null,
                                leaveId: item?.leaveId
                                    ? parseInt(item?.leaveId)
                                    : undefined,
                                shiftTime: item?.shiftTime ? item?.shiftTime : "",
                                notes: item?.notes ? item?.notes : "",
                                count: item?.count || '',
                                isApproved:
                                    item.isApproved === true
                                        ? true
                                        : item.isApproved === false
                                            ? false
                                            : null,
                            })),
                    }
                    : undefined,
            },
        });

    });
    return { statusCode: 0, data };
}


async function getleavecount(employeeId) {
    if (!employeeId) throw new Error("EmployeeId is required");
    employeeId = parseInt(employeeId);

    const allLeaves = await prisma.leaveCode.findMany({
        select: { id: true, name: true, days: true }
    });

    // 2️⃣ Fetch all leave usage (usedDays)
    const allLeaveDetails = await prisma.leaveDetails.findMany({
        where: {
            isApproved: true,
            leaveRequest: { employeeId }
        },
        select: {
            leaveId: true,
            count: true
        }
    });

    // Build usedDays map
    const usedMap = {};
    allLeaveDetails.forEach(item => {
        const leaveId = item.leaveId;
        if (!usedMap[leaveId]) usedMap[leaveId] = 0;
        usedMap[leaveId] += parseFloat(item.count || 0);
    });

    const openingBalanceParent = await prisma.leaveOPeningBalance.findFirst({
        where: { employeeId },
        include: {
            LeaveOPeningBalanceGrid: true
        }
    });

    const openingMap = {};

    if (openingBalanceParent) {
        openingBalanceParent.LeaveOPeningBalanceGrid?.forEach(item => {
            openingMap[item?.leaveId] = item?.openingBalance || 0;
        });
    }

    const summary = allLeaves.map(leave => {
        const leaveId = leave.id;

        const allowedDays = leave.days || 0;
        const openingBalance = openingMap[leaveId] || 0;
        const usedDays = usedMap[leaveId] || 0;

        return {
            leaveId,
            leaveName: leave.name,
            allowedDays,
            openingBalance,
            usedDays,
            remainingDays: allowedDays + openingBalance - usedDays
        };
    });

    return { statusCode: 0, data: summary };
}



async function remove(id) {
    const data = await prisma.leaveRequest.delete({
        where: {
            id: parseInt(id),
        },
    });
    return { statusCode: 0, data };
}

export { get, getOne, getSearch, create, update, remove, getleavecount };
