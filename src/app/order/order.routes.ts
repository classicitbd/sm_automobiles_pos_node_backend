import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllAccountOrder,
  findAllACustomerOrder,
  findAllAROrder,
  findAllDashboardOrder,
  findAllManagementOrder,
  findAllOrderInAProduct,
  findAllOutOfWarehouseOrder,
  findAllProfitOrder,
  findAllSelfOrder,
  findAllSelfOrderWithPagination,
  findAllWarehouseOrder,
  findAOrder,
  postOrder,
  updateOrder,
} from "./order.controllers";
const router = express.Router();

// Create, Get Order
router
  .route("/")
  .get(findAllACustomerOrder)
  .post(verifyToken("order_post"), postOrder)
  .patch(verifyToken("order_patch"), updateOrder);

// get all Order in dashboard
router.route("/dashboard").get(verifyToken("order_dashboard_show"), findAllDashboardOrder);

// get all Order in AR
router.route("/ar_order").get(verifyToken("customer_ar_show"), findAllAROrder);

// Find All profit Order in account
router.route("/profit").get(verifyToken("profit_show"), findAllProfitOrder);

// get all Order in management
router.route("/management_order").get(verifyToken("management_order_show"), findAllManagementOrder);

// get all Order in Account
router.route("/account_order").get(verifyToken("account_order_show"), findAllAccountOrder);

// get all Order in warehouse
router.route("/warehouse_order").get(verifyToken("warehouse_order_show"), findAllWarehouseOrder);

// get all Order in out of warehouse
router
  .route("/out_of_warehouse_order")
  .get(verifyToken("out_of_warehouse_order_show"), findAllOutOfWarehouseOrder);

// get all self Order for create a payment
router
  .route("/self_order_with_pagination/:order_publisher_id")
  .get(findAllSelfOrderWithPagination);

// get all self Order for create a payment
router.route("/self_order/:order_publisher_id").get(findAllSelfOrder);

// Find all  OrderInAProduct
router.route("/product_order/:product_id").get(findAllOrderInAProduct);

// get a order
router.route("/:_id").get(findAOrder);

export const OrderRoutes = router;
