import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllExpense, postExpense } from "./expense.controllers";
import { FileUploadHelper } from "../../helpers/image.upload";
const router = express.Router();

// Create, Get Expense
router
  .route("/")
  .get(verifyToken, findAllExpense)
  .post(verifyToken, FileUploadHelper.ImageUpload.fields([{ name: "expense_voucher", maxCount: 1 }]),
  postExpense)

export const ExpenseRoutes = router;
