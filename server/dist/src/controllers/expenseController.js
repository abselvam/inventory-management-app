"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesByCategory = exports.adapter = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
// const prisma = new PrismaClient();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error("DATABASE_URL not found in process.env!");
    process.exit(1);
}
// Create a Postgres pool
const pool = new pg_1.Pool({
    connectionString: databaseUrl,
});
// Export adapter for PrismaClient
exports.adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter: exports.adapter });
const getExpensesByCategory = async (req, res) => {
    try {
        const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
            ...item,
            amount: item.amount.toString(),
        }));
        res.json(expenseByCategorySummary);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving expenses by category" });
    }
};
exports.getExpensesByCategory = getExpensesByCategory;
//# sourceMappingURL=expenseController.js.map