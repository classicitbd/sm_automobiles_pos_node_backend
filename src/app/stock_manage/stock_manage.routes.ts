import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllStockDetailsInAProduct,
  findASupplierAllStockDetails,
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
router.route("/supplier_stock/:supplier_id").get(findASupplierAllStockDetails);

// get all StockManage in dashboard
router.route("/:product_id").get(findAllStockDetailsInAProduct);

export const StockManageRoutes = router;
