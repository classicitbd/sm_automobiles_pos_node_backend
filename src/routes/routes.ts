import express from "express";
import { ImageUploadRoutes } from "../helpers/frontend/imageUpload/imageUpload.routes";
import { UserRegRoutes } from "../app/user/admin.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRegRoutes,
  },
  {
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
