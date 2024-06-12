import User from "../models/user.model";
import crypto from "crypto";
import { USER } from "../utils/types";
import { sendActivationEmail } from "../utils/mailer";

export const signUp = async (userData: USER): Promise<USER> => {
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
