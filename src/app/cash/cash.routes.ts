import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findACash, updateCash } from "./cash.controllers";
const router = express.Router();

// Create, Get Cash
router.route("/").get(findACash).patch(verifyToken("cash_patch"), updateCash);

export const CashRoutes = router;
