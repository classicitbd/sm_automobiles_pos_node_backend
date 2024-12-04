import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardProductUnit,
  findAllProductUnit,
  postProductUnit,
  updateProductUnit,
} from "./unit.controllers";
const router = express.Router();

// Create, Get ProductUnit
router
  .route("/")
  .get(findAllProductUnit)
  .post(verifyToken, postProductUnit)
  .patch(verifyToken, updateProductUnit);

// get all ProductUnit in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardProductUnit);

export const ProductUnitRoutes = router;
