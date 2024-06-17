import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../utils/types";
import { NextFunction, Response } from "express";

exports.allowedTo = (...roles: string[]) =>
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    //  access roles
    //  access registered user (req.user.role)
    if (!roles.includes(req.user!.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
});
