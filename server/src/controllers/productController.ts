import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
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

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const whereClause = search
      ? {
          name: {
            contains: search, // Only add if search exists
          },
        }
      : {};
    const products = await prisma.products.findMany({
      where: whereClause,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};
