import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllIncome } from "./income.controllers";
const router = express.Router();

// Create, Get Income
router
  .route("/")
  .get(verifyToken("income_show"), findAllIncome)

export const IncomeRoutes = router;
