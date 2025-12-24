"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
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
const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=userController.js.map