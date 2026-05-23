import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "express server",
    author: "next level",
  });
});

export default app;