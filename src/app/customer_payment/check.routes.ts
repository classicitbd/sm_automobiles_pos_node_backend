import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllACustomerCheck,
  findAllCheckInPayment,
  findAllCheckPublishAUser,
  findAllDashboardCheck,
  findAllDueDashboardCheck,
  findAllTodayDashboardCheck,
  postCheck,
  updateCheck,
} from "./check.controllers";
const router = express.Router();

// Create, Get Check
router
  .route("/")
  .get(verifyToken, findAllACustomerCheck)
  .post(postCheck)
  .patch(updateCheck);

// Find all  Check publish a user
router
  .route("/find_user_publish_check")
  .get(verifyToken, findAllCheckPublishAUser);

// get all Check dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCheck);

// get all Check in payment filter by today date or date wise
router.route("/check_or_cash_in_payment").get(verifyToken, findAllCheckInPayment);

// get all Check in today_dashboard
router.route("/today_dashboard").get(verifyToken, findAllTodayDashboardCheck);

// get all Check in due_dashboard
router.route("/due_dashboard").get(verifyToken, findAllDueDashboardCheck);

export const CheckRoutes = router;
