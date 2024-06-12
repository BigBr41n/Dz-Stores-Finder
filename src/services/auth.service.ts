import User from "../models/user.model";
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





export const signUp = async (userData: SIGNUP): Promise<SIGNUP> => {
  const activationToken = crypto.randomBytes(32).toString("hex");

  const activeExpires = Date.now() + 1000 * 60 * 60; // 1h
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    activationToken: activationToken,
    activeExpires: activeExpires,
  });

  //send activation email
  sendActivationEmail(userData.email, userData.password, activationToken);
  return newUser;
};







export const login = async (userData: LOGIN): Promise<LOGIN> => {
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
};






export const activateAccount = async (token: string): Promise<boolean> => {
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
};







export const forgotPassword = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid Email!", 200);

  const changePassToken = crypto.randomBytes(32).toString("hex");
  const changePassTokenExpires = Date.now() + 1000 * 60 * 60;

  user.changePassToken = changePassToken;
  user.changePassTokenExpires = changePassTokenExpires;

  user.save();

  await sendForgotPassToken(email, user.name, changePassToken);

  return true;
};








export const forgotPasswordConfirmation = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
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
  await user.save();

  return true;
};







export const changePasswordService = async (
  password: PASS,
  userId: string
): Promise<void> => {
  if (!password.old || !password.new) {
    throw new ApiError("You must provide both the old and new password", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password.old, user.password);
  if (!isMatch) {
    throw new ApiError("Invalid old password", 401);
  }

  user.password = password.new;
  await user.save();

  await passwordChangedNotify(user.email, user.name);
};
