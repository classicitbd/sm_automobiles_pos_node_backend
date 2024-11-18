import express from "express";
import { ImageUploadRoutes } from "../helpers/frontend/imageUpload/imageUpload.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/image_upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
