import { Request, Response, NextFunction } from "express";
import * as redis from "redis";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

export const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});



 const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info( process.env.REDIS_URL)
  const key = req.originalUrl;
  const data = await redisClient.get(key).catch((err : any) => {
    logger.info(err);
    next(new ApiError("Internal server Error", 500));
  });

  if (data !== null) {
    res.status(200).send(JSON.stringify(data));
  }
  next();
};


export default cacheMiddleware