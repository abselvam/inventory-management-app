import dotenv from "dotenv";
dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL not found in process.env!");
  process.exit(1); // Stop the script if DATABASE_URL is missing
}
console.log("DATABASE_URL detected:", databaseUrl);
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// const prisma = new PrismaClient();

// Create a Postgres pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Export adapter for PrismaClient
export const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  // for (const modelName of modelNames) {
  //   const model: any = prisma[modelName as keyof typeof prisma];
  //   if (model) {
  //     await model.deleteMany({});
  //     console.log(`Cleared data from ${modelName}`);
  //   } else {
  //     console.error(
  //       `Model ${modelName} not found. Please ensure the model name is correctly specified.`
  //     );
  //   }
  // }
  for (const modelName of modelNames.reverse()) {
    // REVERSE order
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "products.json",
    "users.json",
    "expenses.json",
    "sales.json",
    "purchases.json",
    "expenseSummary.json", // <- seed parent first
    "expenseByCategory.json", // <- then seed child
    "salesSummary.json",
    "purchaseSummary.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
