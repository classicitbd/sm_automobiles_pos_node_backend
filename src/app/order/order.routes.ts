import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardOrder, findAllSelfOrder, postOrder } from "./order.controllers";
const router = express.Router();

// Create, Get Order
router
  .route("/")
  // .get(findAllOrder)
  .post(verifyToken, postOrder)
// .patch(verifyToken, updateOrder);

// get all Order in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardOrder);

// get all self Order for create a payment
router.route("/self_order/:order_publisher_id").get(findAllSelfOrder);

// get a order
// router.route("/:_id").get(findAOrder);

export const OrderRoutes = router;
