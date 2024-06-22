import User, { IUserDocument } from "../models/user.model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SIGNUP, LOGIN, PASS } from "../utils/types";
import {
  passwordChangedNotify,
  sendActivationEmail,
  sendForgotPassToken,
} from "../utils/mailer";
import { ApiError } from "../utils/apiError";
import { signJwt, signRefreshToken } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { Schema } from "mongoose";










/**
 *service to register a new user  
 *@param {SIGNUP} userData - user data needed to register
 *@returns {Promise<SIGNUP | undefined>} - The created user document.// TODO : ADD THE USER DOCUMENT TYPE
 *@throws {ApiError} -if the user registration failed
**/

export const signUpService = async (
  userData: SIGNUP
): Promise<IUserDocument | undefined> => {
  try {
    const user = await User.findOne({ email: userData.email });
    if (user) throw new ApiError("Email already  Exists", 401);

    const activationToken = crypto.randomBytes(32).toString("hex");
    const activeExpires = Date.now() + 1000 * 60 * 60;


    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      activationToken: activationToken,
      activeExpires: activeExpires,
    });

    await sendActivationEmail(
      userData.email,
      userData.name,
      activationToken
    );

    return newUser;
  } catch (err: any) {
    logger.error("Error during sign up service:", err);

  
    //throw the error to the controller
    if (err instanceof ApiError) throw err;

    //delete the user from the DB to avoid any error in the next registration
    await User.findOneAndDelete({ email: userData.email });
    throw new ApiError(err, 500);
  }
};








/**
 *service to login a registered user 
 *@param {SIGNUP} userData - user data needed to register
 *@returns {Promise<LOGIN | undefined>} - the logged in user with the access token & refresh token 
 *@throws {ApiError} -if the user login operation failed
**/
export const loginService = async (
  userData: LOGIN
): Promise<LOGIN | undefined> => {
  try {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      throw new ApiError("User not found!", 404);
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      throw new ApiError("Invalid credentials!", 401);
    }

    if (!user.verified) {
      throw new ApiError(
        "please verify your account , we sent to you an email !",
        401
      );
    }

    const accessToken = signJwt({ id: user._id.toString() });
    const refreshToken = signRefreshToken({ id: user._id.toString() });

    return {
      ...userData,
      accessToken,
      refreshToken,
    };
  } catch (err: any) {
    logger.error("Error during login service:", err);

    //throw the error to the controller
    if (err instanceof ApiError) throw err;
    throw new ApiError("Internal Server Error", 500);
  }
};











/**
 *service to activate the new registered user account
 *@param {string} token - user token that got from the sent email
 *@returns {Promise<boolean>} - if the account activated send true 
 *@throws {ApiError} -if the user activation operation failed
**/
export const activateAccountService = async (
  token: string
): Promise<boolean> => {
  try {
    const user = await User.findOne({
      activationToken: token,
      activeExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError("Invalid or expired activation token", 400);
    }

    if (user.verified) {
      throw new ApiError("Account is already activated", 400);
    }

    user.verified = true;
    await user.save();

    return user.verified;
  } catch (err: any) {
    logger.error("Error during activate account service:", err);

    //throw the error to the controller
    if (err instanceof ApiError) throw err;
    throw new ApiError("Internal server Error", 500);
  }
};











/**
 *service to reset password if forgotten 
 *@param {string} email - user email that want to reset his password
 *@returns {Promise<boolean | undefined>} - if the user found and email sent ,  send true 
 *@throws {ApiError} -return API error if the operation fails
**/
export const forgotPasswordService = async (
  email: string
): Promise<boolean | undefined> => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("Invalid Email!", 200);

    const changePassToken = crypto.randomBytes(32).toString("hex");
    const changePassTokenExpires = Date.now() + 1000 * 60 * 60;

    user.changePassToken = changePassToken;
    user.changePassTokenExpires = changePassTokenExpires;

    user.save();

    await sendForgotPassToken(email, user.name, changePassToken);

    return true;
  } catch (err: any) {
    logger.error("Error during forgot password service:", err);

    //throw the error to the controller
    if (err instanceof ApiError) throw err;
    throw new ApiError("Internal Server Error", 500);
  }
};










/**
 *service to activate the new registered user account
 *@param {string} token - user token that got from the sent email
 *@param {string} newPassword - the new password of the user account
 *@returns {Promise<boolean | undefined>} - if the reset password succeeded sent true 
 *@throws {ApiError} -if any error occurred
**/
export const forgotPasswordConfirmation = async (
  token: string,
  newPassword: string
): Promise<boolean | undefined> => {
  try {
    const user = await User.findOne(
      { changePassToken: token },
      {
        changePassTokenExpires: { $gt: Date.now() },
      }
    );

    if (!user) {
      throw new ApiError("Invalid Token or expired ", 401);
    }

    user.password = newPassword;
    user.changePassToken = "" ;
    user.changePassTokenExpires = 0 ;
    await user.save();

    return true;
  } catch (err: any) {
    logger.error("Error during forgot password conf service:", err);

    //throw the error to the controller
    if (err instanceof ApiError) throw err;
    throw new ApiError("INternal Server Error", 500);
  }
};











/**
 *service to activate the new registered user account
 *@param {PASS} data - user token that got from the sent email
 *@returns {Promise<void>} - 
 *@throws {ApiError} -if any error occurs throw error to the controller
**/
export const changePasswordService = async (data: PASS): Promise<void> => {
  try {
    if (!data.old || !data.new) {
      throw new ApiError("You must provide both the old and new password", 400);
    }

    const user = await User.findById(data.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(data.old, user.password);
    if (!isMatch) {
      throw new ApiError("Invalid old password", 401);
    }

    user.password = data.new;
    await user.save();

    await passwordChangedNotify(user.email, user.name);
  } catch (err: any) {
    logger.error("Error during change password service:", err);

    //throw the error to the controller
    if (err instanceof ApiError) throw err;
    throw new ApiError("Internal Server Error", 500);
  }
};
