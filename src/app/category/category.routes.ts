import express from "express";
import {
  findAllCategory,
  findAllDashboardCategory,
  postCategory,
  updateCategory,
} from "./category.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get category
router
  .route("/")
  .get(findAllCategory)
  .post(verifyToken, postCategory)
  .patch(verifyToken, updateCategory);

// get all category in dashboard
router.route("/dashboard").get(verifyToken, findAllDashboardCategory);

export const CategoryRoutes = router;
