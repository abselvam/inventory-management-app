"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesByCategory = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const prisma_1 = require("../../generated/prisma");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create PrismaClient with adapter
const prisma = new prisma_1.PrismaClient({ adapter });
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