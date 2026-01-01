import dotenv from "dotenv";
dotenv.config();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL not found!");
  process.exit(1);
}

console.log("Starting seed process...");

// Create a Postgres pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Create adapter for PrismaClient
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connected to database");

  const dataDirectory = path.join(__dirname, "seedData");
  const orderedFileNames = [
    "products.json",
    "expenseSummary.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
    "users.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  console.log("Skipping delete phase...");

  console.log("\nSeeding new data...");
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`File missing: ${fileName}`);
      continue;
    }

    try {
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const modelName = path.basename(fileName, path.extname(fileName));
      const model: any = prisma[modelName as keyof typeof prisma];

      if (!model) {
        console.error(`Model ${modelName} not found`);
        continue;
      }

      // Try createMany first
      if (model.createMany && jsonData.length > 0) {
        await model.createMany({
          data: jsonData,
          skipDuplicates: true,
        });
        console.log(`✓ Seeded ${modelName} (${jsonData.length} records)`);
      } else {
        // Fallback to individual creates
        for (const data of jsonData) {
          await model.create({ data });
        }
        console.log(`✓ Seeded ${modelName} (${jsonData.length} records)`);
      }
    } catch (error: any) {
      console.error(`Error with ${fileName}:`, error.message);
    }
  }

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  });
