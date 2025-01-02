import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAUserAllSalaryPayment,
  findAUserAllSalaryPaymentInAInvoice,
  findDashboardSalaryPayment,
  postSalaryPayment,
} from "./salaryPayment.controller";
const router = express.Router();

// Create, Get a user all SalaryPayment
// router.route("/").post(verifyToken("SalaryPayment_post"), postSalaryPayment);
router.route("/").post(postSalaryPayment).get(findAUserAllSalaryPayment);

// Find a user all SalaryPayment history in a salary create
router.route("/a_salary_all_payment").get(findAUserAllSalaryPaymentInAInvoice);

// find dashboard salary payment history
router.route("/dashboard").get(findDashboardSalaryPayment);

export const SalaryPaymentRoutes = router;
