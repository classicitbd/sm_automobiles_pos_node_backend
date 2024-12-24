import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardSupplier,
  findAllSupplier,
  postSupplier,
  updateSupplier,
} from "./supplier.controllers";
const router = express.Router();

// Create, Get Supplier
router
  .route("/")
  .get(findAllSupplier)
  .post(verifyToken("supplier_post"), postSupplier)
  .patch(verifyToken("supplier_patch"), updateSupplier)

// get all Supplier in dashboard
router.route("/dashboard").get(verifyToken("supplier_dashboard_show"), findAllDashboardSupplier);

export const SupplierRoutes = router;
