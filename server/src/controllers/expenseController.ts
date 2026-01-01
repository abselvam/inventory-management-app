import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Pool } from "pg";

// const prisma = new PrismaClient();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL not found in process.env!");
  process.exit(1);
}

// Create a Postgres pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Export adapter for PrismaClient
export const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export const getExpensesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        orderBy: {
          date: "desc",
        },
      }
    );
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );
    res.json(expenseByCategorySummary);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving expenses by category" });
  }
};
