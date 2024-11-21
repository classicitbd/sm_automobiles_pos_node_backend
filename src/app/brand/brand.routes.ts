import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllBrand,
  findAllDashboardBrand,
  postBrand,
  updateBrand,
} from "./brand.controllers";
const router = express.Router();

// Create, Get Brand
router.route("/").get(findAllBrand).post(postBrand).patch(updateBrand);

// get all brand in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardBrand);

export const BrandRoutes = router;
