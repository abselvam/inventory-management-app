import { Request, Response } from "express";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
export declare const adapter: PrismaPg;
export declare const getDashboardMetrics: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=dashboardController.d.ts.map