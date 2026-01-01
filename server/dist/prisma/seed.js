"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error("DATABASE_URL not found in process.env!");
    process.exit(1); // Stop the script if DATABASE_URL is missing
}
console.log("DATABASE_URL detected:", databaseUrl);
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
// const prisma = new PrismaClient();
// Create a Postgres pool
const pool = new pg_1.Pool({
    connectionString: databaseUrl,
});
// Export adapter for PrismaClient
exports.adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter: exports.adapter });
async function deleteAllData(orderedFileNames) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
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
        const model = prisma[modelName];
        if (model) {
            await model.deleteMany({});
            console.log(`Cleared data from ${modelName}`);
        }
        else {
            console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`);
        }
    }
}
async function main() {
    const dataDirectory = path_1.default.join(__dirname, "seedData");
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
        const filePath = path_1.default.join(dataDirectory, fileName);
        const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
        const model = prisma[modelName];
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
//# sourceMappingURL=seed.js.map