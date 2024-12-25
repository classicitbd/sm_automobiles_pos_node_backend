import express from "express";
import { findACashBalanceUpdateHistory } from "./cashBalanceUpdateHistory.controllers";
const router = express.Router();

// Create, Get CashBalanceUpdateHistory
router.route("/").get(findACashBalanceUpdateHistory)

export const CashBalanceUpdateHistoryRoutes = router;
