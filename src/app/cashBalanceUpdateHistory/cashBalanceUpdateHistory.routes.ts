import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findACashBalanceUpdateHistory } from "./cashBalanceUpdateHistory.controllers";
const router = express.Router();

// Create, Get CashBalanceUpdateHistory
router.route("/").get(verifyToken, findACashBalanceUpdateHistory)

export const CashBalanceUpdateHistoryRoutes = router;
