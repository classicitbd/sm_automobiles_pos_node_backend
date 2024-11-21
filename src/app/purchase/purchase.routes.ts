import express from "express";
import { FileUploadHelper } from "../../helpers/image.upload";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardPurchase, postPurchase, updatePurchase } from "./purchase.controllers";
const router = express.Router();

// Create, Get Purchase
router
  .route("/")
  .post(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "purchase_voucher", maxCount: 1 }]),
    postPurchase
  )
  .patch(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "purchase_voucher", maxCount: 1 }]),
    updatePurchase
  )

// get all Purchase in Dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardPurchase);

export const PurchaseRoutes = router;
