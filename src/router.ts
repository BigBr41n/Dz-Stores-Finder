import { Express } from "express";
import authRoutes from "./routes/auth.routes"




function routes(app: Express) {
  app.get("/api/v1/healthCheck", (req, res) =>
    res.status(200).json("Server is On")
  );



  //auth routes 
  app.use('/api/v1/auth' , authRoutes)
}
export default routes;
