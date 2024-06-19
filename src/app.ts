import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import path from "path";
import { connect } from "./utils/connect.db";
import { ApiError } from "./utils/apiError";
import { globalError } from "./middleware/errorMiddleware";
import MountROutes from "./router";
import logger from "./utils/logger";
import { globalLimiter } from "./middleware/rate-limit";

dotenv.config();



// Connect with db
connect();

export const app = express();

app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(globalLimiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  logger.info(`mode: ${process.env.NODE_ENV}`);
}

//MountRoutes
MountROutes(app);

//handle unknown routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);
