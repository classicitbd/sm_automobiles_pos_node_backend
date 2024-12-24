import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllSaleTarget,
  findAUserAllSaleTarget,
  findAUserASaleTargetDetails,
  findAUserASaleTargetReport,
  postSaleTarget,
  updateSaleTarget,
} from "./sale_target.controllers";
const router = express.Router();

// Create, Get SaleTarget
router
  .route("/")
  .get(findAllSaleTarget)
  .post(verifyToken("sale_target_post"), postSaleTarget)
  .patch(verifyToken("sale_target_patch"), updateSaleTarget);

// find a user all SaleTarget
router
  .route("/a_sale_target_report/:sale_target_id")
  .get(findAUserASaleTargetReport);

// find a user all SaleTarget details
router
  .route("/a_sale_target_details/:sale_target_id")
  .get(findAUserASaleTargetDetails);

// find a user all SaleTarget
router.route("/:user_id").get(findAUserAllSaleTarget);

export const SaleTargetRoutes = router;
