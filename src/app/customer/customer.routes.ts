import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardCustomer, postCustomer, updateCustomer } from "./customer.controllers";
const router = express.Router();

// Create, Get Customer
router
  .route("/")
  .post(verifyToken, postCustomer)
  .patch(verifyToken, updateCustomer);

// get all Customer in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCustomer);

export const CustomerRoutes = router;
