import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllBankInDataForABank } from "./bank_in.controllers";
const router = express.Router();

// Create, Get BankIn
router
    .route("/")
    .get(verifyToken, findAllBankInDataForABank)

export const BankInRoutes = router;
