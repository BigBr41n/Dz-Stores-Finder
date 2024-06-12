import mongoose from "mongoose";
import logger from "./logger";

export const connect = () => {
  if (!process.env.DB_URI)
    throw new Error("please add your db URI to connect DB");
  mongoose.connect(process.env.DB_URI);
  const connection = mongoose.connection;
  connection.once("open", () => {
    logger.info("DATABASE connection established");
  });
  connection.on("error", (error) => {
    logger.error(error);
  });
};
