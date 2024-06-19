import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import path from "path";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import hpp from "hpp";
import { connect } from "./utils/connect.db";
import { ApiError } from "./utils/apiError";
import { globalError } from "./middleware/errorMiddleware";
import mountRoutes from "./router";
import logger from "./utils/logger";
import { globalLimiter } from "./middleware/rate-limit";


dotenv.config();

// Connect to the database
connect();

export const app = express();


app.use(cors());
app.options("*", cors());


app.use(compression());


app.use(helmet());



app.use(express.json({ limit: "5mb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      // LATER 
    ],
  })
);


app.use(express.static(path.join(__dirname, "uploads")));


app.use(globalLimiter);


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  logger.info(`Mode: ${process.env.NODE_ENV}`);
}

// Mount routes
mountRoutes(app);

// Handle unknown routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalError);

