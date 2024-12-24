import express from "express";
import { getSiteSetting, postSiteSetting } from "./site_setting.controllers";
import { verifyToken } from "../../middlewares/verify.token";
const router = express.Router();

// Create, update and get site setting
router.route("/").get(getSiteSetting).patch(verifyToken("site_setting_patch"), postSiteSetting);

export const SiteSettingRoutes = router;
