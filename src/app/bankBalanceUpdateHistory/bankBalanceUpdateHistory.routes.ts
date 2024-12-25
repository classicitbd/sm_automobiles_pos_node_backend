import express from "express";
import { findABankBalanceUpdateHistory } from "./bankBalanceUpdateHistory.controllers";
const router = express.Router();

// Create, Get BankBalanceUpdateHistory
router.route("/").get(findABankBalanceUpdateHistory)

export const BankBalanceUpdateHistoryRoutes = router;
