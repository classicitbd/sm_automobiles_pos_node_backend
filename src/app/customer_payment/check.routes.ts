import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllACustomerCheck,
  findAllAOrderCheck,
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
  .get(findAllACustomerCheck)
  .post(verifyToken("check_post"), postCheck)
  .patch(verifyToken("check_patch"), updateCheck);

// Find all  Check publish a user
router.route("/find_a_order_all_check").get(findAllAOrderCheck);

// Find all  Check publish a user
router
  .route("/find_user_publish_check")
  .get(findAllCheckPublishAUser);

// get all Check dashboard
router.route("/dashboard").get(verifyToken("check_dashboard_show"), findAllDashboardCheck);

// get all Check in payment filter by today date or date wise
router
  .route("/check_or_cash_in_payment")
  .get(verifyToken("check_or_cash_in_payment_show"), findAllCheckInPayment);

// get all Check in today_dashboard
router.route("/today_dashboard").get(verifyToken("check_today_dashboard_show"), findAllTodayDashboardCheck);

// get all Check in due_dashboard
router.route("/due_dashboard").get(verifyToken("check_due_dashboard_show"), findAllDueDashboardCheck);

export const CheckRoutes = router;
