import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllExpense } from "./expense.controllers";
const router = express.Router();

// Create, Get Expense
router
  .route("/")
  .get(verifyToken, findAllExpense)

export const ExpenseRoutes = router;
