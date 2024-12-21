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
import { UserGetMeRoutes } from "../app/getme/getme.routes";
import { ProductRoutes } from "../app/product/product.routes";
import { StockManageRoutes } from "../app/stock_manage/stock_manage.routes";
import { OrderRoutes } from "../app/order/order.routes";
import { ProductUnitRoutes } from "../app/productUnit/unit.routes";
import { SiteSettingRoutes } from "../app/site_setting/site_setting.routes";
import { SaleTargetRoutes } from "../app/sale_target/sale_target.routes";
import { CheckRoutes } from "../app/customer_payment/check.routes";
import { ExpenseRoutes } from "../app/expense/expense.routes";
import { SupplierMoneyAddRoutes } from "../app/supplier_add_money/supplier_money_add.routes";
import { BankInRoutes } from "../app/bank_in/bank_in.routes";
import { BankOutRoutes } from "../app/bank_out/bank_out.routes";
import { IncomeRoutes } from "../app/income/income.routes";
import { ProductPriceUpdateHistoryRoutes } from "../app/product_price_update_history/product_price_update_history.routes";
import { CashRoutes } from "../app/cash/cash.routes";
import { CashBalanceUpdateHistoryRoutes } from "../app/cashBalanceUpdateHistory/cashBalanceUpdateHistory.routes";
import { BankBalanceUpdateHistoryRoutes } from "../app/bankBalanceUpdateHistory/bankBalanceUpdateHistory.routes";

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
    path: "/cash",
    route: CashRoutes,
  },
  {
    path: "/cash_balance_update_history",
    route: CashBalanceUpdateHistoryRoutes,
  },
  {
    path: "/bank_balance_update_history",
    route: BankBalanceUpdateHistoryRoutes,
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
    path: "/bank_out",
    route: BankOutRoutes,
  },
  {
    path: "/supplier_payment",
    route: SupplierPaymentRoutes,
  },
  {
    path: "/supplier_money_add_history",
    route: SupplierMoneyAddRoutes,
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
    path: "/product_price_update_history",
    route: ProductPriceUpdateHistoryRoutes,
  },
  {
    path: "/stock_manage",
    route: StockManageRoutes,
  },
  {
    path: "/expense",
    route: ExpenseRoutes,
  },
  {
    path: "/income",
    route: IncomeRoutes,
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
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
