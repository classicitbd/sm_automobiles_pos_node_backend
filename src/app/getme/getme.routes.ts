import express from "express";
import { getMeUser } from "./getme.controllers";
const router = express.Router();

//  Get and update User
router.route('/').get(getMeUser)

export const UserGetMeRoutes = router;