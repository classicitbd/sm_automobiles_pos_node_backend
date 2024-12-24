import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import {
  findAllDashboardUser,
  findAllUser,
  findAUser,
  postLogUser,
  postUser,
  updateUser,
} from "./admin.controllers";
const router = express.Router();

// Create, Get update and delete User side user
router
  .route("/")
  .get(findAllUser)
  .post(verifyToken("user_post"), postUser)
  .patch(verifyToken("user_patch"), updateUser);

// login a User
router.route("/login").post(postLogUser);

// get all User in dashboard
router.route("/dashboard").get(verifyToken("user_dashboard_show"), findAllDashboardUser);

// get a User
router.route("/:_id").get(findAUser);

export const UserRegRoutes = router;
