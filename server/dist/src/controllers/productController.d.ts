import { Request, Response } from "express";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
export declare const adapter: PrismaPg;
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
export declare const createProduct: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=productController.d.ts.map