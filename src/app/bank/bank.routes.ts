import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllBank, findAllDashboardBank, postBank, updateBank } from "./bank.controllers";
const router = express.Router();

// Create, Get Bank
router.route("/").get(findAllBank).post(postBank).patch(updateBank);

// get all Bank in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardBank);

export const BankRoutes = router;
