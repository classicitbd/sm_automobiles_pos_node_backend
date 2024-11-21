import express from "express";
import { verifyToken } from "../../middlewares/verify.token";
import { findAllDashboardShowroom, findAllShowroom, postShowroom, updateShowroom } from "./showroom.controllers";
const router = express.Router();

// Create, Get Showroom
router
  .route("/")
  .get(findAllShowroom)
  .post(verifyToken, postShowroom)
  .patch(verifyToken, updateShowroom);

// get all Showroom in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardShowroom);

export const ShowroomRoutes = router;
