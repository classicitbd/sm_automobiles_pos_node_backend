import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { postBankIn } from "./bank_in.controllers";
const router = express.Router();

// Create, Get BankIn
router.route("/").post(postBankIn)

export const BankInRoutes = router;
