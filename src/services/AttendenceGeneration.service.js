import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function get(searchParams) {
  const { date } = searchParams;

  if (!date) {
    throw new Error("date are required");
  }

  const [year, month, day] = date.split("-");

  // Create start and end of day in IST
  const startIST = new Date(`${year}-${month}-${day}T00:00:00+05:30`);
  const endIST = new Date(`${year}-${month}-${day}T23:59:59+05:30`);

  const data = await prisma.punchData.findMany({
    where: {
      timestamp: {
        gte: startIST,
        lte: endIST,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return { data };
}

export { get };
