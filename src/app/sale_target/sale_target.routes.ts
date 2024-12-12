import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllSaleTarget,
  findAUserAllSaleTarget,
  findAUserASaleTargetReport,
  postSaleTarget,
  updateSaleTarget,
} from "./sale_target.controllers";
const router = express.Router();

// Create, Get SaleTarget
router
  .route("/")
  .get(findAllSaleTarget)
  .post(verifyToken, postSaleTarget)
  .patch(verifyToken, updateSaleTarget);

// find a user all SaleTarget
router
  .route("a_sale_target_report/:sale_target_id")
  .get(verifyToken, findAUserASaleTargetReport);

// find a user all SaleTarget
router.route("/:user_id").get(verifyToken, findAUserAllSaleTarget);

export const SaleTargetRoutes = router;
