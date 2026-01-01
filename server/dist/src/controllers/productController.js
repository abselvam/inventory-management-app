"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProducts = exports.adapter = void 0;
const client_1 = require("@prisma/client");
require("dotenv/config");
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
const getProducts = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=productController.js.map