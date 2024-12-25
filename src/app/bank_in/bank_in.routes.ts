import express from "express";
import { findAllBankInDataForABank } from "./bank_in.controllers";
const router = express.Router();

// Create, Get BankIn
router
    .route("/")
    .get(findAllBankInDataForABank)

export const BankInRoutes = router;
