import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findABankBalanceUpdateHistory } from "./bankBalanceUpdateHistory.controllers";
const router = express.Router();

// Create, Get BankBalanceUpdateHistory
router.route("/").get(verifyToken, findABankBalanceUpdateHistory)

export const BankBalanceUpdateHistoryRoutes = router;
