import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllBankOutDataForABank } from "./bank_out.controllers";
const router = express.Router();

// Create, Get BankOut
router
    .route("/")
    .get(verifyToken, findAllBankOutDataForABank)

export const BankOutRoutes = router;
