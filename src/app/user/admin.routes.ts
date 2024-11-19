import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardUser, postLogUser, postUser, updateUser } from "./admin.controllers";
const router = express.Router();

// Create, Get update and delete User side user
router
  .route("/")
  .get(verifyToken, findAllDashboardUser)
  .post(verifyToken, postUser)
  .patch(verifyToken, updateUser)

// login a User
router.route("/login").post(verifyToken, postLogUser);

export const UserRegRoutes = router;
