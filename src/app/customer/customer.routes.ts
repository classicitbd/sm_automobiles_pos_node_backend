import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findACustomer,
  findAllActiveCustomer,
  findAllDashboardCustomer,
  findAllSelfCustomer,
  postCustomer,
  updateCustomer,
} from "./customer.controllers";
const router = express.Router();

// Create, Get Customer, find all active Customer for a specific publisher
router
  .route("/")
  .get(findAllActiveCustomer)
  .post(verifyToken, postCustomer)
  .patch(verifyToken, updateCustomer);

// get all self Customer in dashboard
router.route("/self_customer").get(verifyToken, findAllSelfCustomer);

// get all Customer in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCustomer);

// get a Customer
router.route("/:_id").get(findACustomer);

export const CustomerRoutes = router;
