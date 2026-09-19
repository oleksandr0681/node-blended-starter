import { celebrate } from "celebrate";
import { Router } from "express";
import { registerUserSchema, loginUserSchema } from "../validations/authValidation.js";
import { loginUser, registerUser, logoutUser, refreshUserSession } from "../controllers/authController.js";

const router = new Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh", refreshUserSession);

export default router;
