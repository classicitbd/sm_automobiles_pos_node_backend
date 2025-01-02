import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { postSalaryPayment } from "./salaryPayment.controller";
const router = express.Router();

// Create, Get a user all SalaryPayment
// router.route("/").post(verifyToken("SalaryPayment_post"), postSalaryPayment);
router.route("/").post(postSalaryPayment)

export const SalaryPaymentRoutes = router;
