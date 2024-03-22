import express from "express";
import authControllers from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  registerSchema,
  emailSchema,
  loginSchema,
  updateSubSchema,
} from "../models/user.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationCode", authControllers.verifyEmail);

authRouter.post(
  "/verify",
  validateBody(emailSchema),
  authControllers.resendVerifyEmail
);

authRouter.post("/login", validateBody(loginSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/",
  validateBody(updateSubSchema),
  authenticate,
  authControllers.updateSub
);

export default authRouter;
