// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// let poInwardReturnItemsCount = await prisma.poInwardReturnItems.count({
//     where: {
//         poItemsId: 75
//     }
// })
// console.log(poInwardReturnItemsCount)

// prismaClient.js
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // Optional: logs queries & warnings
  });

globalForPrisma.prisma = prisma;

module.exports = { prisma };