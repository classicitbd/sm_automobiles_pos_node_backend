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
  .post(verifyToken, postUser)
  .patch(verifyToken, updateUser);

// login a User
router.route("/login").post(verifyToken, postLogUser);

// get all User in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardUser);

// get a User
router.route("/:_id").get(findAUser);

export const UserRegRoutes = router;
