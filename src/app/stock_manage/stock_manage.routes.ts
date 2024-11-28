import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllStockDetailsInAProduct,
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
router.route("/:product_id").get(findAllStockDetailsInAProduct);

export const StockManageRoutes = router;
