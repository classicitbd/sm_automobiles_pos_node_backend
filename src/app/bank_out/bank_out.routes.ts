import express from "express";
import { findAllBankOutDataForABank } from "./bank_out.controllers";
const router = express.Router();

// Create, Get BankOut
router
    .route("/")
    .get(findAllBankOutDataForABank)

export const BankOutRoutes = router;
