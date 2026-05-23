import express, { type Request, type Response } from "express";
import { authRoute } from "../src/db/modules/auth/auth.route";
import { issueRouter } from "../src/db/modules/issues/issue.route";
import logger from "../src/middleware/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "express server",
    author: "next level",
  });
});

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API test route working",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRouter);

export default app;