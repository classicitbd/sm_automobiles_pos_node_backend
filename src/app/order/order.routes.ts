import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllACustomerOrder, findAllDashboardOrder, findAllManagementOrder, findAllSelfOrder, findAllWarehouseOrder, postOrder, updateOrder } from "./order.controllers";
const router = express.Router();

// Create, Get Order
router
  .route("/")
  .get(verifyToken, findAllACustomerOrder)
  .post(verifyToken, postOrder)
  .patch(verifyToken, updateOrder);

// get all Order in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardOrder);

// get all Order in management
router.route("/management_order").get(verifyToken, findAllManagementOrder);

// get all Order in warehouse
router.route("/warehouse_order").get(verifyToken, findAllWarehouseOrder);

// get all self Order for create a payment
router.route("/self_order/:order_publisher_id").get(findAllSelfOrder);

// get a order
// router.route("/:_id").get(findAOrder);

export const OrderRoutes = router;
