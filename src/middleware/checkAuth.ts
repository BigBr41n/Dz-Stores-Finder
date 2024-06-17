import { ApiError } from "../utils/apiError";
import asyncHandler from "express-async-handler";
import { verifyJwt } from "../utils/jwt.utils";
import User from "../models/user.model";
import { AuthRequest } from "../utils/types";
import { NextFunction, Response } from "express";

exports.protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    //check if token exist, if exist get
    if (
      !req.headers.authorization &&
      !req.headers.authorization?.startsWith("Bearer")
    ) {
      return next(
        new ApiError(
          "You are not login, Please login to get access this route",
          401
        )
      );
    }
    let token: string = req.headers.authorization.split(" ")[1];

    // verify token (no change happens, expired token)
    const decoded = verifyJwt(token);

    if (decoded.valid && !decoded.expired) {
      // check if user exists
      const currentUser = await User.findById(decoded.decoded.id);
      if (!currentUser) {
        return next(
          new ApiError(
            "The user that belong to this token does no longer exist",
            401
          )
        );
      }
      req.user = {id : currentUser._id.toString()};
      next();
    }
    else if (!decoded.valid && decoded.expired) {
        return next(
            new ApiError(
              "you should refresh your token",
              401
            )
          );
    }
    else {
       return next(new ApiError("Internal Server Error , please try again later" , 500)); 
    }
  }
);
