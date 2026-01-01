"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.adapter = void 0;
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
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