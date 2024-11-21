import express from "express";
import { FileUploadHelper } from "../../helpers/image.upload";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardExpense, postExpense, updateExpense } from "./expense.controllers";
const router = express.Router();

// Create, Get Expense
router
  .route("/")
  .post(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "expense_voucher", maxCount: 1 }]),
    postExpense
  )
  .patch(
    verifyToken,
    FileUploadHelper.ImageUpload.fields([{ name: "expense_voucher", maxCount: 1 }]),
    updateExpense
  )

// get all Expense in Dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardExpense);

export const ExpenseRoutes = router;
