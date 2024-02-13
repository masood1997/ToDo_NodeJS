import express from "express";
import { login, register, getMyProfile, getAllUsers, logOut } from "../controllers/user.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.get("/myDetails",isAuthenticated, getMyProfile);
router.get("/logout", logOut);

export default router;
