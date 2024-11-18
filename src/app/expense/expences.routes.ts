import express from "express";
import { FileUploadHelper } from "../../helpers/image.upload";
import { verifyToken } from "../../middlewares/verify.token";
import { deleteAExpenceInfo, findAllSelfExpence, postExpence, updateExpence } from "./expences.controllers";
const router = express.Router();

// Create, Get Expence
router
  .route("/")
  .post(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "expence_document", maxCount: 1 }]),
    postExpence
  )
  .patch(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "expence_document", maxCount: 1 }]),
    updateExpence
  )
  .delete(verifyToken, deleteAExpenceInfo);

// get all Expence in Self
router.route("/self_expence").get(verifyToken, findAllSelfExpence);

export const ExpenceRoutes = router;
