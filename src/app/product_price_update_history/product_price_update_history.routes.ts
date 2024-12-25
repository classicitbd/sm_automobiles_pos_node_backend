import express from "express";
import { findAllDashboardProductPriceUpdateHistory } from "./product_price_update_history.controllers";
const router = express.Router();

// Create, Get ProductPriceUpdateHistory
router.route("/").get(findAllDashboardProductPriceUpdateHistory);

export const ProductPriceUpdateHistoryRoutes = router;
