import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardOrder, postOrder, updateOrder } from "./order.controllers";
const router = express.Router();

// Create, Get Order
router
  .route("/")
  .post(verifyToken, postOrder)
  .patch(verifyToken, updateOrder);

// get all Order in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardOrder);

export const OrderRoutes = router;
