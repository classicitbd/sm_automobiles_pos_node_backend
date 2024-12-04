import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllSaleTarget, postSaleTarget, updateSaleTarget } from "./sale_target.controllers";
const router = express.Router();

// Create, Get SaleTarget
router
  .route("/")
  .get(findAllSaleTarget)
  .post(verifyToken, postSaleTarget)
  .patch(verifyToken, updateSaleTarget);

export const SaleTargetRoutes = router;
