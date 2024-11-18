import express from "express";
import { FileUploadHelper } from "../../helpers/image.upload";
import { verifyToken } from "../../middlewares/verify.token";
import {
  deleteABrandInfo,
  findAllBrand,
  findAllDashboardBrand,
  postBrand,
  updateBrand,
} from "./brand.controllers";
const router = express.Router();

// Create, Get Brand
router
  .route("/")
  .get(findAllBrand)
  .post(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "brand_logo", maxCount: 1 }]),
    postBrand
  )
  .patch(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "brand_logo", maxCount: 1 }]),
    updateBrand
  )
  .delete(verifyToken, deleteABrandInfo);

// get all brand in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardBrand);

export const BrandRoutes = router;
