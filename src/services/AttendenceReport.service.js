// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function get(searchParams) {
//   const { inDate, groupBy } = searchParams;

//   if (!inDate || !groupBy) {
//     throw new Error("Both inDate and groupBy are required.");
//   }

//   if (!["department", "designation"].includes(groupBy)) {
//     throw new Error(
//       "Invalid groupBy parameter. Use 'department' or 'designation'."
//     );
//   }

//   const where = {};
//   if (inDate) {
//     const d = new Date(inDate);
//     where.inDate = {
//       gte: new Date(d.setHours(0, 0, 0, 0)),
//       lte: new Date(d.setHours(23, 59, 59, 999)),
//     };
//   }

//   if (searchParams.groupByValue && groupBy) {
//     where[groupBy] = searchParams.groupByValue;
//   }

//   const data = await prisma.attendance.findMany({
//     where,
//     select: {
//       mIdCard: true,
//       empName: true,
//       department: true,
//       designation: true,
//       shiftTemplate: true,
//       inDate: true,
//       inTime: true,
//       outDate: true,
//       outTime: true,
//     },
//     orderBy: { inDate: "asc" },
//   });

//   return data;
// }

// export { get };
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get(searchParams) {
  const { inDate, groupBy, employeeCategoryId } = searchParams;

  if (!inDate || !groupBy || !employeeCategoryId) {
    throw new Error("inDate, groupBy and employeeCategoryId are required");
  }

  if (!["department", "designation"].includes(groupBy)) {
    throw new Error("groupBy must be either 'department' or 'designation'");
  }

  const startOfDay = new Date(new Date(inDate).setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date(inDate).setHours(23, 59, 59, 999));

  const data = await prisma.attendance.findMany({
    where: {
      inDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      Employee: {
        employeeCategoryId: parseInt(employeeCategoryId), 
        active: true,
      },
    },
    select: {
    
      inDate: true,
      inTime: true,
      outDate: true,
      outTime: true,
       Employee: {
        select: {
          firstName: true,
          lastName: true,
          mobileNumber: true,
          department:true,
          designation: true,
          shiftCommonTemplate:true,
          idNumber:true,
          EmployeeCategory:true,
        },
      },
    },
   
  });

  return { data };
}

export { get };
