import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllBrand, postBrand, updateBrand } from "./brand.controllers";
const router = express.Router();

// Create, Get Brand
router
  .route("/")
  .get(findAllBrand)
  .post(verifyToken("brand_post"), postBrand)
  .patch(verifyToken("brand_patch"), updateBrand);

export const BrandRoutes = router;
