import express from "express";
import { FileUploadHelper } from "../../helpers/image.upload";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardProduct,
  findAllProduct,
  findAProductDetails,
  postProduct,
  updateProduct,
} from "./product.controllers";
const router = express.Router();

// Create, Get Product
router
  .route("/")
  .get(findAllProduct)
  .post(
    verifyToken("product_post"),
    FileUploadHelper.ImageUpload.fields([
      { name: "product_image", maxCount: 1 },
    ]),
    postProduct
  )
  .patch(
    verifyToken("product_patch"),
    FileUploadHelper.ImageUpload.fields([
      { name: "product_image", maxCount: 1 },
    ]),
    updateProduct
  );

// get all Product in Dashboard
router.route("/dashboard").get(verifyToken("product_dashboard_show"), findAllDashboardProduct);

// get a Product details
router.route("/:product_id").get(findAProductDetails);

export const ProductRoutes = router;
