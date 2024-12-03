import express from "express";
import { ImageUploadRoutes } from "../helpers/frontend/imageUpload/imageUpload.routes";
import { UserRegRoutes } from "../app/user/admin.routes";
import { SupplierRoutes } from "../app/supplier/supplier.routes";
import { BrandRoutes } from "../app/brand/brand.routes";
import { CategoryRoutes } from "../app/category/category.routes";
import { BankRoutes } from "../app/bank/bank.routes";
import { ExpenseRoutes } from "../app/expense/expense.routes";
import { RoleRoutes } from "../app/role/role.routes";
import { CustomerRoutes } from "../app/customer/customer.routes";
import { SupplierPaymentRoutes } from "../app/supplier_payment/supplier_payment.routes";
import { CustomerDueRoutes } from "../app/customer_due/customer_due.routes";
import { CustomerPaymentRoutes } from "../app/customer_payment/customer_payment.routes";
import { UserGetMeRoutes } from "../app/getme/getme.routes";
import { ProductRoutes } from "../app/product/product.routes";
import { StockManageRoutes } from "../app/stock_manage/stock_manage.routes";
import { OrderRoutes } from "../app/order/order.routes";
import { ProductUnitRoutes } from "../app/showroom/unit.routes";
import { SupplierDueRoutes } from "../app/supplier_due/supplier_due.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/stock_manage",
    route: StockManageRoutes,
  },
  {
    path: "/user",
    route: UserRegRoutes,
  },
  {
    path: "/role",
    route: RoleRoutes,
  },
  {
    path: "/get_me",
    route: UserGetMeRoutes,
  },
  {
    path: "/customer",
    route: CustomerRoutes,
  },
  {
    path: "/customer_due",
    route: CustomerDueRoutes,
  },
  {
    path: "/customer_payment",
    route: CustomerPaymentRoutes,
  },
  {
    path: "/supplier",
    route: SupplierRoutes,
  },
  {
    path: "/supplier_payment",
    route: SupplierPaymentRoutes,
  },
  {
    path: "/supplier_due",
    route: SupplierDueRoutes,
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
    path: "/product_unit",
    route: ProductUnitRoutes,
  },
  {
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
