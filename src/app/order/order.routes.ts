import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllACustomerOrder,
  findAllDashboardOrder,
  findAllManagementOrder,
  findAllOrderInAProduct,
  findAllOutOfWarehouseOrder,
  findAllProfitOrder,
  findAllSelfOrder,
  findAllSelfOrderWithPagination,
  findAllWarehouseOrder,
  postOrder,
  updateOrder,
} from "./order.controllers";
const router = express.Router();

// Create, Get Order
router
  .route("/")
  .get(verifyToken, findAllACustomerOrder)
  .post(verifyToken, postOrder)
  .patch(verifyToken, updateOrder);

// get all Order in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardOrder);

// Find All profit Order in account
router.route("/profit").get(verifyToken, findAllProfitOrder);

// get all Order in management
router.route("/management_order").get(verifyToken, findAllManagementOrder);

// get all Order in warehouse
router.route("/warehouse_order").get(verifyToken, findAllWarehouseOrder);

// get all Order in out of warehouse
router
  .route("/out_of_warehouse_order")
  .get(verifyToken, findAllOutOfWarehouseOrder);

// get all self Order for create a payment
router
  .route("/self_order_with_pagination/:order_publisher_id")
  .get(findAllSelfOrderWithPagination);

// get all self Order for create a payment
router.route("/self_order/:order_publisher_id").get(findAllSelfOrder);

// Find all  OrderInAProduct
router.route("/product_order/:product_id").get(findAllOrderInAProduct);

// get a order
// router.route("/:_id").get(findAOrder);

export const OrderRoutes = router;
