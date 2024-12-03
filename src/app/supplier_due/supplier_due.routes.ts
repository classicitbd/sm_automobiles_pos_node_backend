import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardSupplierDue, findASupplierDueHistory, postSupplierDue, updateSupplierDue } from "./supplier_due.controllers";
const router = express.Router();

// Create, Get SupplierDue
router
  .route("/")
  .get(verifyToken, findASupplierDueHistory)
  .post(verifyToken, postSupplierDue)
  .patch(verifyToken, updateSupplierDue);

// get all SupplierDue in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardSupplierDue);

export const SupplierDueRoutes = router;
