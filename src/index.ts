import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import connectDB from "./server";
import httpStatus from "http-status";
import routes from "./routes/routes";
import globalErrorHandler from "./middlewares/global.error.handler";
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app: Application = express();

app.use(express.json());
// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // Allow only this origin
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Classic Ecommerce App is working! YaY!");
});

// Import All Api
app.use("/api/v1", routes);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

//connect to db
connectDB();

const port: number | any = process.env.PORT || 8080;
const time = new Date().toLocaleTimeString();
const date = new Date().toLocaleString("en-us", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

app.listen(port, () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    "[FC]",
    time,
    ":",
    date,
    `: SM Automobile app listening on port ${port}`
  );
});
