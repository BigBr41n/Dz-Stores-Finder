import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  activateAccountService,
  changePasswordService,
  forgotPasswordConfirmation,
  forgotPasswordService,
  loginService,
  signUpService,
} from "../services/auth.service";
import { ApiError } from "../utils/apiError";
import { LOGIN, PASS, AuthRequest } from "../utils/types";






/**
 * DESC   : register a new user  
 * ACCESS : unprotected
 * ROUTE  : /api/v1/auth/signup
 */
export const signUpController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await signUpService(req.body);
    if (!newUser) next(new ApiError("failed to sign up", 500));

    res
      .status(201)
      .json({ message: "user created successfully", user: newUser });
  }
);






/**
 * DESC   : login a registered user 
 * ACCESS : unprotected
 * ROUTE  : /api/v1/auth/login
 */
export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tokens = await loginService(req.body as LOGIN);
    res.status(200).json({
      message: "user logged in successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
);






/**
 * DESC   : verification of user's email
 * ACCESS : unprotected
 * ROUTE  : /api/v1/auth/verify?token=
 */
export const activateAccountController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await activateAccountService(req.params.token as string);
    if (!result) next(new ApiError("failed to activate", 500));
    if (result) {
      res.status(200).json({ message: "verified successfully" });
    }
  }
);






/**
 * DESC   : reset the password without having access to the account 
 * ACCESS : unprotected
 * ROUTE  : /api/v1/auth/forgot-password
 */
export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await forgotPasswordService(req.body as string);
    if (result) {
      res
        .status(200)
        .json({ message: "we sent you a link in your email address" });
    } else next(new ApiError("failed to send link in your email address", 500));
  }
);






/**
 * DESC   : confirm the ownership of the account by confirming the ownership of the email
 * ACCESS : unprotected
 * ROUTE  : /api/v1/auth/forgot-password?token= 
 */
export const forgotPasswordConfirmationController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await forgotPasswordConfirmation(
      req.body.token as string,
      req.body.password as string
    );
    if (result) {
      res
        .status(200)
        .json({ message: "password changed successfully , please login !" });
    } else next(new ApiError("failed to change password", 500));
  }
);






/**
 * DESC   : change the user's password from his account 
 * ACCESS : protected
 * ROUTE  : /api/v1/auth/change-password
 */
export const changePasswordController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const data: PASS = {
      userId: req.user?.id,
      old: req.body.oldPassword,
      new: req.body.newPassword,
    };

    await changePasswordService(data);

    res.status(200).json({ message: "password changed successfully" });
  }
);
