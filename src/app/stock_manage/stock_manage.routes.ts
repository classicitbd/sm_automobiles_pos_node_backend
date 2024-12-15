import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllAPStockDetails,
  findAllDashboardStockDetails,
  findAllStockDetailsInAProduct,
  findASupplierAllStockDetails,
  findASupplierAllStockInvoice,
  postStockManage,
  updateStockManage,
} from "./stock_manage.controllers";
const router = express.Router();

// Create, Get StockManage
router
  .route("/")
  .post(verifyToken, postStockManage)
  .patch(verifyToken, updateStockManage);

// get all StockManage in dashboard
router.route("/dashboard").get(findAllDashboardStockDetails);

// get all StockManage in ap_list
router.route("/ap_list").get(findAllAPStockDetails);

// get all StockManage in supplier
router.route("/supplier_stock/:supplier_id").get(findASupplierAllStockDetails);

// get all StockManage in supplier
router.route("/a_supplier_all_invoice/:supplier_id").get(findASupplierAllStockInvoice);

// get all StockManage in dashboard
router.route("/:product_id").get(findAllStockDetailsInAProduct);

export const StockManageRoutes = router;
