import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findABank,
  findAllBank,
  findAllDashboardBank,
  postBank,
  updateBank,
} from "./bank.controllers";
const router = express.Router();

// Create, Get Bank
router.route("/").get(findAllBank).post(verifyToken("bank_post"), postBank).patch(verifyToken("bank_patch"),updateBank);

// get all Bank in dashboard
router.route("/dashboard").get(verifyToken("bank_dashboard_show"), findAllDashboardBank);

// get a Bank
router.route("/:_id").get(findABank);

export const BankRoutes = router;
