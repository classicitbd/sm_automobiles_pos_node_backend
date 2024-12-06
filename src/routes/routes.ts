import express from "express";
import { ImageUploadRoutes } from "../helpers/frontend/imageUpload/imageUpload.routes";
import { UserRegRoutes } from "../app/user/admin.routes";
import { SupplierRoutes } from "../app/supplier/supplier.routes";
import { BrandRoutes } from "../app/brand/brand.routes";
import { CategoryRoutes } from "../app/category/category.routes";
import { BankRoutes } from "../app/bank/bank.routes";
import { RoleRoutes } from "../app/role/role.routes";
import { CustomerRoutes } from "../app/customer/customer.routes";
import { SupplierPaymentRoutes } from "../app/supplier_payment/supplier_payment.routes";
import { CustomerDueRoutes } from "../app/customer_due/customer_due.routes";
import { CustomerPaymentRoutes } from "../app/customer_payment/customer_payment.routes";
import { UserGetMeRoutes } from "../app/getme/getme.routes";
import { ProductRoutes } from "../app/product/product.routes";
import { StockManageRoutes } from "../app/stock_manage/stock_manage.routes";
import { OrderRoutes } from "../app/order/order.routes";
import { ProductUnitRoutes } from "../app/productUnit/unit.routes";
import { SiteSettingRoutes } from "../app/site_setting/site_setting.routes";
import { SaleTargetRoutes } from "../app/sale_target/sale_target.routes";
import { BankInRoutes } from "../app/bank_in/bank_in.routes";
import { CheckRoutes } from "../app/check/check.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/product_unit",
    route: ProductUnitRoutes,
  },
  {
    path: "/site_setting",
    route: SiteSettingRoutes,
  },
  {
    path: "/user",
    route: UserRegRoutes,
  },
  {
    path: "/sale_target",
    route: SaleTargetRoutes,
  },
  {
    path: "/supplier",
    route: SupplierRoutes,
  },
  {
    path: "/bank",
    route: BankRoutes,
  },
  {
    path: "/bank_in",
    route: BankInRoutes,
  },
  {
    path: "/supplier_payment",
    route: SupplierPaymentRoutes,
  },
  {
    path: "/customer",
    route: CustomerRoutes,
  },
  {
    path: "/check",
    route: CheckRoutes,
  },

  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/stock_manage",
    route: StockManageRoutes,
  },


  


  {
    path: "/order",
    route: OrderRoutes,
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
    path: "/customer_due",
    route: CustomerDueRoutes,
  },
  {
    path: "/customer_payment",
    route: CustomerPaymentRoutes,
  },
  {
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
