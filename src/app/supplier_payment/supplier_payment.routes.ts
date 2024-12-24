import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllCheckInSupplierPayment,
  findAllDashboardSupplierPayment,
  findAllPaidSupplierPayment,
  findAllUnPaidSupplierPayment,
  findASupplierPaymentHistory,
  postSupplierPayment,
  updateSupplierPayment,
} from "./supplier_payment.controllers";
const router = express.Router();

// Create, Get SupplierPayment
router
  .route("/")
  .get(findASupplierPaymentHistory)
  .post(verifyToken("supplier_payment_post"), postSupplierPayment)
  .patch(verifyToken("supplier_payment_patch"), updateSupplierPayment);

// get all Paid SupplierPayment in paid
router.route("/paid_payment_list").get(verifyToken("supplier_paid_payment_show"), findAllPaidSupplierPayment);

// get all unPaid SupplierPayment in unpaid
router.route("/unpaid_payment_list").get(verifyToken("supplier_unpaid_payment_show"), findAllUnPaidSupplierPayment);

// Find all CheckIn SupplierPayment
router.route("/check_or_cash_out_payment").get(verifyToken("supplier_check_or_cash_out_payment_show"), findAllCheckInSupplierPayment);

// get all SupplierPayment in dashboard
router.route("/dashboard").get(verifyToken("supplier_payment_dashboard_show"), findAllDashboardSupplierPayment);

export const SupplierPaymentRoutes = router;
