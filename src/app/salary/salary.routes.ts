import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardSalary,
  findAUserAllSalary,
  findAUserASalaryDetails,
  postAllUserSalary,
  postMultipleUserSalary,
  postSalary,
} from "./salary.controller";
const router = express.Router();

// Create, Get a user all Salary
// router.route("/").post(verifyToken("salary_post"), postSalary);
router.route("/").get(findAUserAllSalary).post(postSalary);

// create multiple user salary
router.route("/multiple_user").post(postMultipleUserSalary);

// create all user salary
router.route("/all_user").post(postAllUserSalary);

// find a user a salary
router.route("/a_user_a_salary_details").get(findAUserASalaryDetails);

// find all dashboard salary
router.route("/dashboard").post(findAllDashboardSalary);

export const SalaryRoutes = router;
