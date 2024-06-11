import http from "node:http";
import { app } from "./app";

const PORT = process.env.PORT || 3000;

//creating the server
const server = http.createServer(app);
server.keepAliveTimeout = 60000;
server.timeout = 5000;
server.maxHeadersCount = 20;

//start the server based on the port in .env file
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err: any) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
