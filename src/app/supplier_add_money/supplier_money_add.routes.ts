import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findASupplierMoneyAddHistory } from "./supplier_money_add.controllers";
const router = express.Router();

// Create, Get SupplierMoneyAdd
router
  .route("/")
  .get(verifyToken, findASupplierMoneyAddHistory)

export const SupplierMoneyAddRoutes = router;
