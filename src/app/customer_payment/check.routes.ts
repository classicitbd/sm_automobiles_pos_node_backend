import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllACustomerCheck,
  findAllDashboardCheck,
  findAllDueDashboardCheck,
  findAllTodayDashboardCheck,
  postCheck,
  updateCheck,
} from "./check.controllers";
const router = express.Router();

// Create, Get Check
router.route("/").get(verifyToken, findAllACustomerCheck).post(postCheck).patch(updateCheck);

// get all Check in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCheck);

// get all Check in today_dashboard
router.route("/today_dashboard").get(verifyToken, findAllTodayDashboardCheck);

// get all Check in due_dashboard
router.route("/due_dashboard").get(verifyToken, findAllDueDashboardCheck);

export const CheckRoutes = router;
