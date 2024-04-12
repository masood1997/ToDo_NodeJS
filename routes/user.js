import express from "express";
import { login, register, getMyProfile, getAllUsers, logOut } from "../controllers/user.js";
import isAuthenticated, { isAuthorized, issueAccessToken } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/allUsers",isAuthenticated, isAuthorized(['admin']), getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.get("/refresh", issueAccessToken);
router.get("/myDetails",isAuthenticated, getMyProfile);
router.get("/logout",logOut);

export default router;
