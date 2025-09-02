import { PrismaClient } from "@prisma/client";
import { NoRecordFound } from "../configs/Responses.js";
import { exclude, base64Tobuffer } from "../utils/helper.js";
import { getFinYearStartTimeEndTime } from "../utils/finYearHelper.js";
import { getTableRecordWithId } from "../utils/helperQueries.js";
import { logging } from "googleapis/build/src/apis/logging/index.js";

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
  console.log("API Calls");

  const data = await prisma.employee.findMany({
    where: {
      branchId: branchId ? parseInt(branchId) : undefined,
      // active: active ? Boolean(active) : undefined,
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
      shiftTemplate: { select: { name: true } }, // optional
      designation: { select: { name: true } }, // optional
      presentCity: { select: { name: true } }, // optional
      permanentCity: { select: { name: true } }, // optional
      presentState: { select: { name: true } }, // optional
      permanentState: { select: { name: true } }, // optional
      presentCountry: { select: { name: true } }, // optional
      permanentCountry: { select: { name: true } },
      EmployeeCategory: true,
      EmployeeBankDetails: true, // include all bank details
      EmployeeEducationdetails: true, // include all education details
      EmployeeFamilyDetails: true,
    },
  });
  console.log(data, "apidata");

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
      shiftTemplate: { select: { name: true } }, // optional
      designation: { select: { name: true } }, // optional
      presentCity: { select: { name: true } }, // optional
      permanentCity: { select: { name: true } }, // optional
      presentState: { select: { name: true } }, // optional
      permanentState: { select: { name: true } }, // optional
      presentCountry: { select: { name: true } }, // optional
      permanentCountry: { select: { name: true } },
      EmployeeCategory: true,
      EmployeeBankDetails: true, // include all bank details
      EmployeeEducationdetails: true, // include all education details
      EmployeeFamilyDetails: true,
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
  const presentAddressObj = presentAddress ? JSON.parse(presentAddress) : {};
  const permanentAddressObj = permanentAddress
    ? JSON.parse(permanentAddress)
    : {};

  console.log(req.body, "form");

  const data = await prisma.employee.create({
    data: {
      // branchId: branchId ? parseInt(branchId) : null,
      // shiftTemplateId: shiftTemplateId ? parseInt(shiftTemplateId) : null,
      // employeeCategoryId: employeeCategoryId
      //   ? parseInt(employeeCategoryId)
      //   : null,
      // designationId: desiginationId ? parseInt(desiginationId) : null,
      // departmentId: departmentId ? parseInt(departmentId) : null,
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

      presentAddress: presentAddressObj.address || "",
      presentVillage: presentAddressObj.village || "",
      // presentCityId: presentAddressObj.cityId
      //   ? parseInt(presentAddressObj.cityId)
      //   : null,
      // presentStateId: presentAddressObj.stateId
      //   ? parseInt(presentAddressObj.stateId)
      //   : null,
      // presentCountryId: presentAddressObj.countryId
      //   ? parseInt(presentAddressObj.countryId)
      //   : null,
      presentPincode: presentAddressObj.pincode || "",
      presentMobile: presentAddressObj.mobile || "",

      permanentAddress: permanentAddressObj.address || "",
      permanentVillage: permanentAddressObj.village || "",
      // permanentCityId: permanentAddressObj.cityId
      //   ? parseInt(permanentAddressObj.cityId)
      //   : null,
      // permanentStateId: permanentAddressObj.stateId
      //   ? parseInt(permanentAddressObj.stateId)
      //   : null,
      // permanentCountryId: permanentAddressObj.countryId
      //   ? parseInt(permanentAddressObj.countryId)
      //   : null,
      permanentPincode: permanentAddressObj.pincode || "",
      permanentMobile: permanentAddressObj.mobile || "",

      Branch: branchId ? { connect: { id: parseInt(branchId) } } : undefined,
      shiftTemplate: shiftTemplateId
        ? { connect: { id: parseInt(shiftTemplateId) } }
        : undefined,
      designation: desiginationId
        ? { connect: { id: parseInt(desiginationId) } }
        : undefined,
      department: departmentId
        ? { connect: { id: parseInt(departmentId) } }
        : undefined,
      EmployeeCategory: employeeCategoryId
        ? { connect: { id: parseInt(employeeCategoryId) } }
        : undefined,
      presentCity: presentAddressObj.cityId
        ? { connect: { id: parseInt(presentAddressObj.cityId) } }
        : undefined,
      presentState: presentAddressObj.stateId
        ? { connect: { id: parseInt(presentAddressObj.stateId) } }
        : undefined,
      presentCountry: presentAddressObj.countryId
        ? { connect: { id: parseInt(presentAddressObj.countryId) } }
        : undefined,
      permanentCity: permanentAddressObj.cityId
        ? { connect: { id: parseInt(permanentAddressObj.cityId) } }
        : undefined,
      permanentState: permanentAddressObj.stateId
        ? { connect: { id: parseInt(permanentAddressObj.stateId) } }
        : undefined,
      permanentCountry: permanentAddressObj.countryId
        ? { connect: { id: parseInt(permanentAddressObj.countryId) } }
        : undefined,
      EmployeeBankDetails: {
        create: JSON.parse(bankDetails).map((b) => ({
          bankName: b.bankName,
          branchName: b.branchName,
          accountNumber: b.accountNumber,
          ifscCode: b.ifscCode,
        })),
      },
      EmployeeEducationdetails: {
        create: JSON.parse(educationDetails).map((e) => ({
          courseName: e.courseName,
          universityName: e.universityName,
          institutionName: e.institutionName,
          yearOfPass: e.yearOfPass,
        })),
      },
      EmployeeFamilyDetails: {
        create: JSON.parse(familyDetails).map((f) => ({
          name: f.name,
          dob: f.dob ? new Date(f.dob) : null,
          age: f.age ? parseInt(f.age) : null,
          relationShip: f.relationShip,
          occupation: f.occupation,
          nominee: f.nominee,
        })),
      },
    },
  });
  return { statusCode: 0, data: exclude({ ...data }, ["image"]) };
}

async function update(id, req) {
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
    familyDetails
  } = await req.body;

   const presentAddressObj = presentAddress ? JSON.parse(presentAddress) : {};
  const permanentAddressObj = permanentAddress
    ? JSON.parse(permanentAddress)
    : {};

  console.log(req.body, "form");

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
      // branchId: branchId ? parseInt(branchId) : null,
      // shiftTemplateId: shiftTemplateId ? parseInt(shiftTemplateId) : null,
      // employeeCategoryId: employeeCategoryId
      //   ? parseInt(employeeCategoryId)
      //   : null,
      // designationId: desiginationId ? parseInt(desiginationId) : null,
      // departmentId: departmentId ? parseInt(departmentId) : null,
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

      presentAddress: presentAddressObj.address || "",
      presentVillage: presentAddressObj.village || "",
      // presentCityId: presentAddressObj.cityId
      //   ? parseInt(presentAddressObj.cityId)
      //   : null,
      // presentStateId: presentAddressObj.stateId
      //   ? parseInt(presentAddressObj.stateId)
      //   : null,
      // presentCountryId: presentAddressObj.countryId
      //   ? parseInt(presentAddressObj.countryId)
      //   : null,
      presentPincode: presentAddressObj.pincode || "",
      presentMobile: presentAddressObj.mobile || "",

      permanentAddress: permanentAddressObj.address || "",
      permanentVillage: permanentAddressObj.village || "",
      // permanentCityId: permanentAddressObj.cityId
      //   ? parseInt(permanentAddressObj.cityId)
      //   : null,
      // permanentStateId: permanentAddressObj.stateId
      //   ? parseInt(permanentAddressObj.stateId)
      //   : null,
      // permanentCountryId: permanentAddressObj.countryId
      //   ? parseInt(permanentAddressObj.countryId)
      //   : null,
      permanentPincode: permanentAddressObj.pincode || "",
      permanentMobile: permanentAddressObj.mobile || "",

      Branch: branchId ? { connect: { id: parseInt(branchId) } } : undefined,
      shiftTemplate: shiftTemplateId
        ? { connect: { id: parseInt(shiftTemplateId) } }
        : undefined,
      designation: desiginationId
        ? { connect: { id: parseInt(desiginationId) } }
        : undefined,
      department: departmentId
        ? { connect: { id: parseInt(departmentId) } }
        : undefined,
      EmployeeCategory: employeeCategoryId
        ? { connect: { id: parseInt(employeeCategoryId) } }
        : undefined,
      presentCity: presentAddressObj.cityId
        ? { connect: { id: parseInt(presentAddressObj.cityId) } }
        : undefined,
      presentState: presentAddressObj.stateId
        ? { connect: { id: parseInt(presentAddressObj.stateId) } }
        : undefined,
      presentCountry: presentAddressObj.countryId
        ? { connect: { id: parseInt(presentAddressObj.countryId) } }
        : undefined,
      permanentCity: permanentAddressObj.cityId
        ? { connect: { id: parseInt(permanentAddressObj.cityId) } }
        : undefined,
      permanentState: permanentAddressObj.stateId
        ? { connect: { id: parseInt(permanentAddressObj.stateId) } }
        : undefined,
      permanentCountry: permanentAddressObj.countryId
        ? { connect: { id: parseInt(permanentAddressObj.countryId) } }
        : undefined,
      EmployeeBankDetails: {
        deleteMany: {},
        create: JSON.parse(bankDetails).map((b) => ({
          bankName: b.bankName,
          branchName: b.branchName,
          accountNumber: b.accountNumber,
          ifscCode: b.ifscCode,
        })),
      },
      EmployeeEducationdetails: {
        deleteMany: {},
        create: JSON.parse(educationDetails).map((e) => ({
          courseName: e.courseName,
          universityName: e.universityName,
          institutionName: e.institutionName,
          yearOfPass: e.yearOfPass,
        })),
      },
      EmployeeFamilyDetails: {
        deleteMany: {},
        create: JSON.parse(familyDetails).map((f) => ({
          name: f.name,
          dob: f.dob ? new Date(f.dob) : null,
          age: f.age ? parseInt(f.age) : null,
          relationShip: f.relationShip,
          occupation: f.occupation,
          nominee: f.nominee,
        })),
      },
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
