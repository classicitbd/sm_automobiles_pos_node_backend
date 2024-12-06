import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardSupplierPayment,
  findAllPaidSupplierPayment,
  findAllUnPaidSupplierPayment,
  findASupplierPaymentHistory,
  postSupplierPayment,
} from "./supplier_payment.controllers";
const router = express.Router();

// Create, Get SupplierPayment
router
  .route("/")
  .get(verifyToken, findASupplierPaymentHistory)
  .post(verifyToken, postSupplierPayment);

// get all Paid SupplierPayment in paid
router.route("/paid_payment_list").get(verifyToken, findAllPaidSupplierPayment);

// get all unPaid SupplierPayment in unpaid
router.route("/unpaid_payment_list").get(verifyToken, findAllUnPaidSupplierPayment);

// get all SupplierPayment in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardSupplierPayment);

export const SupplierPaymentRoutes = router;
