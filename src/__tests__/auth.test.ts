import {
  signUpService,
  loginService,
  activateAccountService,
  forgotPasswordService,
  forgotPasswordConfirmation,
  changePasswordService,
} from "../services/auth.service";
import User from "../models/user.model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  sendActivationEmail,
  sendForgotPassToken,
  passwordChangedNotify,
} from "../utils/mailer";
import { ApiError } from "../utils/apiError";
import { signJwt, signRefreshToken } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { LOGIN, PASS } from "../utils/types";

// Mocking dependencies
jest.mock("../models/user.model");
jest.mock("crypto");
jest.mock("bcryptjs");
jest.mock("../utils/mailer");
//jest.mock("../utils/apiError");
jest.mock("../utils/jwt.utils");
jest.mock("../utils/logger");
jest.mock("nodemailer");

describe("Auth Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUpService", () => {
    it('should register a new user successfully', async () => {

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockActivationToken = 'mockActivationToken';
      const mockActivationTokenHex = Buffer.from(mockActivationToken).toString('hex');
      const mockActiveExpires = expect.any(Number);

      (crypto.randomBytes as jest.Mock).mockReturnValue(Buffer.from(mockActivationToken));
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const mockUser = {
        ...userData,
        activationToken: mockActivationTokenHex,
        activeExpires: mockActiveExpires,
      };

      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (sendActivationEmail as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await signUpService(userData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        activationToken: mockActivationTokenHex,
        activeExpires: mockActiveExpires,
      }));
      expect(sendActivationEmail).toHaveBeenCalledWith(
        userData.email,
        userData.name,
        mockActivationTokenHex
      );
      expect(result).toEqual(mockUser);
    });


    it("should throw an error if the email already exists", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(userData);


       try {
        await signUpService(userData);
      } catch (err) {
        console.log('Caught error:', err);
      } 

      await expect(signUpService(userData)).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith({email: userData.email});
      expect(User.create).not.toHaveBeenCalled();
      expect(sendActivationEmail).not.toHaveBeenCalled();
    });

    it("should delete user on error after creation and throw an ApiError", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      (crypto.randomBytes as jest.Mock).mockReturnValue(
        Buffer.from("activationtoken")
      );
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });
      (sendActivationEmail as jest.Mock).mockRejectedValue(
        new Error("Email Error")
      );

      await expect(signUpService(userData)).rejects.toThrow(ApiError);

      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        email: userData.email,
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("loginService", () => {
    it("should log in a user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        verified: true,
        _id: "userId",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (signJwt as jest.Mock).mockReturnValue("accessToken");
      (signRefreshToken as jest.Mock).mockReturnValue("refreshToken");

      const result = await loginService(userData as LOGIN);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        mockUser.password
      );
      expect(result).toEqual({
        ...userData,
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      });
    });

    it("should throw an error if user is not found", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(loginService(userData as LOGIN)).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    });

    it("should throw an error if the password does not match", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        verified: true,
        _id: "userId",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginService(userData as LOGIN)).rejects.toThrow(ApiError);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        mockUser.password
      );
    });

    it("should throw an error if the user is not verified", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        verified: false,
        _id: "userId",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(loginService(userData as LOGIN)).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        mockUser.password
      );
    });
  });

  describe("activateAccountService", () => {
    it("should activate the user account successfully", async () => {
      const token = "activationtoken";
      const mockUser = {
        activationToken: token,
        activeExpires: Date.now() + 1000 * 60 * 60,
        verified: false,
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await activateAccountService(token);

      expect(User.findOne).toHaveBeenCalledWith({
        activationToken: token,
        activeExpires: { $gt: Date.now() },
      });
      expect(mockUser.verified).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should throw an error if the activation token is invalid or expired", async () => {
      const token = "invalidtoken";
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(activateAccountService(token)).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith({
        activationToken: token,
        activeExpires: { $gt: Date.now() },
      });
    });

    it("should throw an error if the account is already activated", async () => {
      const token = "activationtoken";
      const mockUser = {
        activationToken: token,
        activeExpires: Date.now() + 1000 * 60 * 60,
        verified: true,
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(activateAccountService(token)).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith({
        activationToken: token,
        activeExpires: { $gt: Date.now() },
      });
    });
  });

  describe("forgotPasswordService", () => {
    // Tests for forgotPasswordService
    it("should send forgot password token successfully", async () => {
      const email = "test@example.com";
      const mockUser = {
        email: "test@example.com",
        name: "Test User",
        changePassToken: "",
        changePassTokenExpires: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (crypto.randomBytes as jest.Mock).mockReturnValue(
        Buffer.from("changepasstoken")
      );
      (sendForgotPassToken as jest.Mock).mockResolvedValue(true);

      const result = await forgotPasswordService(email);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.changePassToken).toBe(Buffer.from("changepasstoken").toString('hex'));
      expect(mockUser.changePassTokenExpires).toBeGreaterThan(Date.now());
      expect(mockUser.save).toHaveBeenCalled();
      expect(sendForgotPassToken).toHaveBeenCalledWith(
        email,
        "Test User",
        Buffer.from("changepasstoken").toString('hex')
      );
      expect(result).toBe(true);
    });

    it("should throw an error if the user is not found", async () => {
      const email = "test@example.com";
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(forgotPasswordService(email)).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe("forgotPasswordConfirmation", () => {
    // Tests for forgotPasswordConfirmation
    it("should confirm forgot password and update the password successfully", async () => {
      const token = "changepasstoken";
      const newPassword = "newpassword123";


      const mockDateNow = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => mockDateNow);

      const mockUser = {
        changePassToken: token,
        password: "oldPass",
        changePassTokenExpires:mockDateNow + 3600000,
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (passwordChangedNotify as jest.Mock).mockResolvedValue(true);

      const result = await forgotPasswordConfirmation(token, newPassword);

      expect(User.findOne).toHaveBeenCalledWith(     
        { changePassToken: token },
        {
          changePassTokenExpires: { $gt: mockDateNow },
        })
      expect(mockUser.password).toBe("newpassword123");
      expect(mockUser.changePassToken).toBe("");
      expect(mockUser.changePassTokenExpires).toBe(0);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw an error if the token is invalid or expired", async () => {
      const token = "invalidtoken";
      const newPassword = "newpassword123";
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const mockDateNow = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => mockDateNow);

      await expect(
        forgotPasswordConfirmation(token, newPassword)
      ).rejects.toThrow(ApiError);
      expect(User.findOne).toHaveBeenCalledWith(      
         { changePassToken: token },
        {
          changePassTokenExpires: { $gt: mockDateNow },
        });
    });
  });

  describe("changePasswordService", () => {
    it('should change the password successfully', async () => {
      const data: PASS = {
        userId: 'userId',
        old: 'oldpassword123',
        new: 'newpassword123',
      };

      const mockUser = {
        _id: data.userId,
        password: 'hashedpassword',
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await changePasswordService(data);

      expect(User.findById).toHaveBeenCalledWith(data.userId);
      expect(mockUser.password).toBe(data.new);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });


    it("should throw an error if the user is not found", async () => {
      const data: PASS = {
        userId: "userId",
        old: "oldpassword123",
        new: "newpassword123",
      };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(changePasswordService(data)).rejects.toThrow(ApiError);
      expect(User.findById).toHaveBeenCalledWith(data.userId);
    });

    it("should throw an error if the old password does not match", async () => {
      const data: PASS = {
        userId: "userId",
        old: "oldpassword123",
        new: "newpassword123",
      };
      const mockUser = {
        _id: data.userId,
        password: "hashedpass",
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(changePasswordService(data)).rejects.toThrow(ApiError);
      expect(bcrypt.compare).toHaveBeenCalledWith(data.old, mockUser.password);
    });
  });
});
