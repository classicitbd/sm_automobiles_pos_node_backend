import express from "express";
import {
  findAllCategory,
  postCategory,
  updateCategory,
} from "./category.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get category
router
  .route("/")
  .get(findAllCategory)
  .post(verifyToken("category_post"), postCategory)
  .patch(verifyToken("category_patch"), updateCategory);

export const CategoryRoutes = router;
