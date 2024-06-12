import User from "../models/user.model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SIGNUP, LOGIN } from "../utils/types";
import { sendActivationEmail } from "../utils/mailer";
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

  const accessToken = signJwt({ id: user._id.toString() });
  const refreshToken = signRefreshToken({ id: user._id.toString() });

  return {
    ...userData,
    accessToken,
    refreshToken,
  };
};
