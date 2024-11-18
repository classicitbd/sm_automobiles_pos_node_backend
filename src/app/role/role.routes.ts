import express from "express";
import { deleteARole, findAllDashboardRole, postRole, updateRole } from "./role.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, Get Role
router
  .route("/")
  .get(verifyToken, findAllDashboardRole)
  .post(verifyToken, postRole)
  .patch(verifyToken, updateRole)
  .delete(verifyToken, deleteARole);


export const RoleRoutes = router;
