import express from "express";
import { ImageUploadRoutes } from "../helpers/frontend/imageUpload/imageUpload.routes";
import { UserRegRoutes } from "../app/user/admin.routes";
import { SupplierRoutes } from "../app/supplier/supplier.routes";
import { BrandRoutes } from "../app/brand/brand.routes";
import { CategoryRoutes } from "../app/category/category.routes";
import { BankRoutes } from "../app/bank/bank.routes";
import { ExpenseRoutes } from "../app/expense/expense.routes";
import { PurchaseRoutes } from "../app/purchase/purchase.routes";
import { ShowroomRoutes } from "../app/showroom/showroom.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRegRoutes,
  },
  {
    path: "/supplier",
    route: SupplierRoutes,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/bank",
    route: BankRoutes,
  },
  {
    path: "/expense",
    route: ExpenseRoutes,
  },
  {
    path: "/purchase",
    route: PurchaseRoutes,
  },
  {
    path: "/showroom",
    route: ShowroomRoutes,
  },
  {
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
