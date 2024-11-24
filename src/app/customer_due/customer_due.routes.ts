import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardCustomerDue, postCustomerDue, updateCustomerDue } from "./customer_due.controllers";
const router = express.Router();

// Create, Get CustomerDue
router
  .route("/")
  .post(verifyToken, postCustomerDue)
  .patch(verifyToken, updateCustomerDue);

// get all CustomerDue in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCustomerDue);

export const CustomerDueRoutes = router;
