import express from "express";
const router = express.Router();

import {
  signUpController,
  loginController,
  activateAccountController,
  forgotPasswordController,
  forgotPasswordConfirmationController,
  changePasswordController,
} from "../controllers/auth.controller";

import validate from "../middleware/validator";

import {
  signUpSchema,
  loginSchema,
  activateSchema,
  forgotPasswordSchema,
  changePasswordSchema,
} from "../resources-schema/user.schema";






router
  .post("/signup", validate(signUpSchema), signUpController)
  .post("/login", validate(loginSchema), loginController)
  .get("/verify", validate(activateSchema), activateAccountController) //with query token
  .post("/forgotPassword", validate(forgotPasswordSchema), forgotPasswordController)
  .post("/verifyResetCode", validate(activateSchema), forgotPasswordConfirmationController) //with query token
  .put("/change-password", validate(changePasswordSchema), changePasswordController);

  //TODO : REFRESH TOKEN ROUTE 

export default router;
