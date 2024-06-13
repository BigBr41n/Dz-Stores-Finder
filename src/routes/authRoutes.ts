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

router
  .post("/signup", signUpController)
  .post("/login", loginController)
  .get("/verify", activateAccountController) //with query token
  .post("/forgotPassword", forgotPasswordController)
  .post("/verifyResetCode", forgotPasswordConfirmationController) //with query token
  .put("/change-password", changePasswordController);

export default router;

//router.post('/signup', signupValidator, signupController);
//router.post('/login', loginValidator, loginController);
