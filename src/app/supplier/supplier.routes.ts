import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  deleteASupplierInfo,
  findAllDashboardSupplier,
  findAllSelfDashboardSupplier,
  findAllSupplier,
  postSupplier,
  updateSupplier,
} from "./supplier.controllers";
const router = express.Router();

// Create, Get Supplier
router
  .route("/")
  .get(findAllSupplier)
  .post(verifyToken, postSupplier)
  .patch(verifyToken, updateSupplier)
  .delete(verifyToken, deleteASupplierInfo);

// get all Supplier in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardSupplier);

// get all Self Supplier in dashboard
router.route("/:panel_owner_id").get(verifyToken, findAllSelfDashboardSupplier);

export const SupplierRoutes = router;
