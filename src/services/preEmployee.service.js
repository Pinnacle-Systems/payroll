import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get() {
  const data = await prisma.preEmployee.findMany();
  console.log(data, "data--");

  return {
    statusCode: 0,
    data,
  };
}

async function create(req) {
  const {
    firstName,
    gender,
    dob,
    maritalStatus,
    religion,
    aadharNo,
    panNo,
    email,
    mobileNumber,
    presentAddress,
  } = req.body;

  console.log(req.body, "req.body");

    const lastEmployee = await prisma.preEmployee.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });
  const nextId = lastEmployee ? lastEmployee.id + 1 : 1;
  const docId = `EMP-${nextId.toString().padStart(5, '0')}`

  const data = await prisma.preEmployee.create({
    data: {
      firstName: firstName ? firstName : "",
      docId,
      gender: gender ? gender : "",

      dob: dob ? new Date(dob) : null,
      mobileNumber: mobileNumber ? mobileNumber : null,
      email: email ? email : "",
      maritalStatus: maritalStatus ? maritalStatus : "",

      religion: religion ? religion : "",
      aadharNo: aadharNo ? aadharNo : "",
      panNo: panNo ? panNo : "",

      presentAddress: presentAddress?.address || null,
    },
  });
  return { statusCode: 0, data };
}

export { get, create };
