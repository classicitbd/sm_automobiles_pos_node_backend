import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardProductPriceUpdateHistory } from "./product_price_update_history.controllers";
const router = express.Router();

// Create, Get ProductPriceUpdateHistory
router.route("/").get(verifyToken, findAllDashboardProductPriceUpdateHistory);

export const ProductPriceUpdateHistoryRoutes = router;
