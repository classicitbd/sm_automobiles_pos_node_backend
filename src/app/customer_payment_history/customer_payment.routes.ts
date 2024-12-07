import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findACustomerPaymentHistory } from "./customer_payment.controllers";
const router = express.Router();

// Get CustomerPayment history
router
  .route("/")
  .get(verifyToken, findACustomerPaymentHistory)

export const CustomerPaymentRoutes = router;
