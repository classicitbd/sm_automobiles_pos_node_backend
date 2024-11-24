import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardCustomerPayment, postCustomerPayment, updateCustomerPayment } from "./customer_payment.controllers";
const router = express.Router();

// Create, Get CustomerPayment
router
  .route("/")
  .post(verifyToken, postCustomerPayment)
  .patch(verifyToken, updateCustomerPayment);

// get all CustomerPayment in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCustomerPayment);

export const CustomerPaymentRoutes = router;
