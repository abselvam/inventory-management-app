"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProducts = void 0;
const prisma_1 = require("../../generated/prisma");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create PrismaClient with adapter
const prisma = new prisma_1.PrismaClient({ adapter });
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