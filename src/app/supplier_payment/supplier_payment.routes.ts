import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardSupplierPayment,
  findASupplierPaymentHistory,
  postSupplierPayment,
} from "./supplier_payment.controllers";
const router = express.Router();

// Create, Get SupplierPayment
router
  .route("/")
  .get(verifyToken, findASupplierPaymentHistory)
  .post(verifyToken, postSupplierPayment);

// get all SupplierPayment in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardSupplierPayment);

export const SupplierPaymentRoutes = router;
