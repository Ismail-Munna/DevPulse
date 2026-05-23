import type { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Method -> ${req.method} Url -> ${req.url} Time -> ${Date.now()}`);
  next();
};

export default logger;