import express from "express";
import { findAllDashboardRole, postRole, updateRole } from "./role.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get Role
router
  .route("/")
  .get(findAllDashboardRole)
  .post(verifyToken("role_post"), postRole)
  .patch(verifyToken("role_patch"), updateRole)


export const RoleRoutes = router;
