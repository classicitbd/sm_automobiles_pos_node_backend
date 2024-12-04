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
  .post(verifyToken, postCategory)
  .patch(verifyToken, updateCategory);

export const CategoryRoutes = router;
