import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardSupplierPayment, postSupplierPayment, updateSupplierPayment } from "./supplier_payment.controllers";
const router = express.Router();

// Create, Get SupplierPayment
router
  .route("/")
  .post(verifyToken, postSupplierPayment)
  .patch(verifyToken, updateSupplierPayment);

// get all SupplierPayment in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardSupplierPayment);

export const SupplierPaymentRoutes = router;
