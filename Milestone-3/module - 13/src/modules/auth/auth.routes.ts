import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// http://localhost:5000/auth/login
router.post("/login", authController.loginUser);

// http://localhost:5000/auth/signup
router.post("/signup", authController.signupUser);

export const authRoutes = router;
