import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};
