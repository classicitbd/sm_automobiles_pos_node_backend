import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardOrder, findAOrder, postOrder, updateOrder } from "./order.controllers";
const router = express.Router();

// Create, Get Order
router
  .route("/")
  .post(verifyToken, postOrder)
  .patch(verifyToken, updateOrder);

// get all Order in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardOrder);

// get a order
router.route("/:_id").get(findAOrder);

export const OrderRoutes = router;
