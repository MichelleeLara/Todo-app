import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/login", loginLimiter, login);

router.post("/register", register); // Register user
router.post("/login", login); // Login user
router.post("/logout", logout); //  Logout user

export default router;
