import { Response, Request, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { ApiError } from "../utils/apiError";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(new ApiError(error.message, 400));
    }
  };

export default validate;
