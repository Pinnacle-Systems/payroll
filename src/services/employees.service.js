import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";
import { exclude, base64Tobuffer } from "../utils/helper.js";
import { getFinYearStartTimeEndTime } from "../utils/finYearHelper.js";
import { getTableRecordWithId } from "../utils/helperQueries.js";

const prisma = new PrismaClient();

const xprisma = prisma.$extends({
  result: {
    employee: {
      imageBase64: {
        needs: { image: true },
        compute(employee) {
          return employee.image
            ? new Buffer(employee.image, "binary").toString("base64")
            : null;
        },
      },
    },
  },
});

async function getPaginated(req) {
  const { pageNumber, dataPerPage, branchId, active, searchKey } = req.query;
  const totalCount = await xprisma.employee.count({
    where: {
      branchId: branchId ? parseInt(branchId) : undefined,
      active: active ? Boolean(active) : undefined,
      OR: [
        {
          name: {
            contains: searchKey,
          },
        },
        {
          regNo: {
            contains: searchKey,
          },
        },
        {
          EmployeeCategory: {
            name: {
              contains: searchKey,
            },
          },
        },
        {
          chamberNo: {
            contains: searchKey,
          },
        },
      ],
    },
  });
  const data = await prisma.employee.findMany({
    skip: (parseInt(pageNumber) - 1) * parseInt(dataPerPage),
    take: parseInt(dataPerPage),
    where: {
      branchId: branchId ? parseInt(branchId) : undefined,
      active: active ? Boolean(active) : undefined,
      OR: [
        {
          name: {
            contains: searchKey,
          },
        },
        {
          regNo: {
            contains: searchKey,
          },
        },
        {
          EmployeeCategory: {
            name: {
              contains: searchKey,
            },
          },
        },
        {
          chamberNo: {
            contains: searchKey,
          },
        },
      ],
    },
    include: {
      EmployeeCategory: true,
    },
  });
  return {
    statusCode: 0,
    data: data.map((d) => exclude({ ...d }, ["image"])),
    totalCount,
  };
}
async function getEmployeeId(branchId, startTime, endTime) {
  let lastObject = await prisma.employee.findFirst({
    where: {
      branchId: parseInt(branchId),

      // AND: [
      //   {
      //     createdBy: {
      //       gte: startTime,
      //     },
      //   },
      //   {
      //     createdBy: {
      //       lte: endTime,
      //     },
      //   },
      // ],
    },
    orderBy: {
      id: "desc",
    },
  });
  console.log(lastObject, "lastObject");

  const code = "EMP";
  const branchObj = await getTableRecordWithId(branchId, "branch");
  let newDocId = `${branchObj.branchCode}/${code}/1`;

  if (lastObject) {
    newDocId = `${branchObj.branchCode}/${code}/${
      parseInt(lastObject.regNo.split("/").at(-1)) + 1
    }`;
  }
  return newDocId;
}

async function get(req) {
  const { branchId, active, employeeCategory, finYearId, companyId } =
    req.query;
  const data = await xprisma.employee.findMany({
    where: {
      // branchId: branchId ? parseInt(branchId) : undefined,
      active: active ? Boolean(active) : undefined,
      // EmployeeCategory: {
      //     name: employeeCategory
      // }
    },
    include: {
      department: {
        select: {
          name: true,
        },
      },
      EmployeeCategory: true,
    },
  });

  let finYearDate = await getFinYearStartTimeEndTime(finYearId);
  console.log(finYearDate, "finYearDate");
  let Regno = finYearDate
    ? await getEmployeeId(
        branchId,
        finYearDate?.startDateStartTime,
        finYearDate?.endDateEndTime
      )
    : "";
  return {
    statusCode: 0,
    data: data.map((item) => exclude({ ...item }, ["image"])),
    Regno,
  };
}

async function getOne(id) {
  const data = await xprisma.employee.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      // permCity: {
      //   select: {
      //     id: true,
      //   },
      // },
      // localCity: {
      //   select: {
      //     id: true,
      //   },
      // },
      department: {
        select: {
          id: true,
        },
      },
      EmployeeCategory: true,
    },
  });
  if (!data) return NoRecordFound("Employee");
  return { statusCode: 0, data: exclude({ ...data }, ["image"]) };
}

async function getSearch(req) {
  const searchKey = req.params.searchKey;
  const { branchId, active } = req.query;
  const data = await xprisma.employee.findMany({
    where: {
      branchId: branchId ? parseInt(branchId) : undefined,
      active: active ? Boolean(active) : undefined,
      OR: [
        {
          name: {
            contains: searchKey,
          },
        },
        {
          regNo: {
            contains: searchKey,
          },
        },
        {
          department: {
            name: {
              contains: searchKey,
            },
          },
        },
        {
          chamberNo: {
            contains: searchKey,
          },
        },
      ],
    },
    include: {
      department: {
        select: {
          name: true,
        },
      },
      EmployeeCategory: true,
    },
  });
  return {
    statusCode: 0,
    data: data.map((item) => exclude({ ...item }, ["image"])),
  };
}

async function create(req) {
  const {
    branchId,
    employeeType,
    middleName,
    firstName,
    lastName,
    fatherName,
    motherName,
    gender,
    disability,
    identificationMark,
    dob,
    bloodGroup,
    height,
    weight,
    maritalStatus,

    joiningDate,
    departmentId,
    employeeCategoryId,
    payCategory,
    idNumber,
    desiginationId,
    shiftTemplateId,
    pf,
    esi,
    salary,
    salaryMethod,

    religion,
    aadharNo,
    panNo,
    esiNo,
    pfNo,
    uanNo,
    email,

    presentAddress,
    permanentAddress,
    bankDetails,
    educationDetails,
    familyDetails,
  } = await req.body;

  console.log(JSON.parse(presentAddress?.address),"req.body");
  

  const data = await prisma.employee.create({
    data: {
      branchId: branchId ? parseInt(branchId) : null,
      shiftTemplateId: shiftTemplateId ? parseInt(shiftTemplateId) : null,
      employeeCategoryId: employeeCategoryId
        ? parseInt(employeeCategoryId)
        : null,
      designationId: desiginationId ? parseInt(desiginationId) : null,
      departmentId: departmentId ? parseInt(departmentId) : null,
      employeeType,
      firstName,
      middleName,
      lastName,
      fatherName,
      motherName,
      gender,
      disability,
      identificationMark,
      dob: dob ? new Date(dob) : null,
      bloodGroup,
      height,
      weight,
      maritalStatus,

      joiningDate: joiningDate ? new Date(joiningDate) : null,

      payCategory,
      idNumber,
      pf,
      esi,
      salary,
      salaryMethod,

      religion,
      aadharNo,
      panNo,
      esiNo,
      pfNo,
      email,
      uanNo,
      presentAddress: presentAddress?.address  ? JSON.parse(presentAddress?.address) : "",
      presentVillage: presentAddress?.village || "",
      presentCityId: presentAddress?.cityId
        ? parseInt(presentAddress.cityId)
        : null,
      presentStateId: presentAddress?.stateId
        ? parseInt(presentAddress.stateId)
        : null,
      presentCountryId: presentAddress?.countryId
        ? parseInt(presentAddress.countryId)
        : null,
      presentPincode: presentAddress?.pincode || "",
      presentMobile: presentAddress?.mobile || "",

      permanentAddress:
        permanentAddress?.address || presentAddress?.address || "",
      permanentVillage:
        permanentAddress?.village || presentAddress?.village || "",
      permanentCityId: permanentAddress?.cityId
        ? parseInt(permanentAddress.cityId)
        : presentAddress?.cityId
        ? parseInt(presentAddress.cityId)
        : null,
      permanentStateId: permanentAddress?.stateId
        ? parseInt(permanentAddress.stateId)
        : presentAddress?.stateId
        ? parseInt(presentAddress.stateId)
        : null,
      permanentCountryId: permanentAddress?.countryId
        ? parseInt(permanentAddress.countryId)
        : presentAddress?.countryId
        ? parseInt(presentAddress.countryId)
        : null,
      permanentPincode:
        permanentAddress?.pincode || presentAddress?.pincode || "",
      permanentMobile: permanentAddress?.mobile || presentAddress?.mobile || "",
    },
  });
  return { statusCode: 0, data: exclude({ ...data }, ["image"]) };
}

async function update(id, req) {
  const {
    employeeType,
    middleName,
    lastName,
    fatherName,
    motherName,
    gender,
    disability,
    identificationMark,
    dob,
    bloodGroup,
    height,
    weight,
    maritalStatus,
    joiningDate,
    department,
    employeeCategoryId,
    payCategory,
    idNumber,
    desiginationId,
    shiftTemplateId,
    pf,
    esi,
    salary,
    aadharNo,
    panNo,
    esiNo,
    pfNo,
    uanNo,
    presentAddress,
    presentCity,
    presentVillage,
    presentState,
    presentCountry,
    prsentPincode,
    presentMobile,
    currentAddress,
    currentCity,
    currentVillage,
    currentState,
    currentCountry,
    currentPincode,
    currentMobile,
  } = await req.body;

  const dataFound = await prisma.employee.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!dataFound) return NoRecordFound("Employee");
  const data = await prisma.employee.update({
    where: {
      id: parseInt(id),
    },
    data: {
      branchId: branchId ? parseInt(branchId) : null,
      shiftTemplateId: shiftTemplateId ? parseInt(shiftTemplateId) : null,
      employeeCategoryId: employeeCategoryId
        ? parseInt(employeeCategoryId)
        : null,
      desiginationId: desiginationId ? parseInt(desiginationId) : null,
      employeeType,

      middleName,
      lastName,
      fatherName,
      motherName,
      gender,
      disability,
      identificationMark,
      dob,
      bloodGroup,
      height,
      weight,
      maritalStatus,
      joiningDate,
      department,

      payCategory,
      idNumber,

      pf,
      esi,
      salary,
      aadharNo,
      panNo,
      esiNo,
      pfNo,
      uanNo,

      presentAddress,
      presentCity,
      presentVillage,
      presentState,
      presentCountry,
      prsentPincode,
      presentMobile,
      currentAddress,
      currentCity,
      currentVillage,
      currentState,
      currentCountry,
      currentPincode,
      currentMobile,
    },
  });
  return { statusCode: 0, data: exclude({ ...data }, ["image"]) };
}

async function remove(id) {
  const data = await prisma.employee.delete({
    where: {
      id: parseInt(id),
    },
  });
  return { statusCode: 0, data };
}

export { get, getPaginated, getOne, getSearch, create, update, remove };
