import type { Request, Response } from "express";
import { authservice } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authservice.signupUserintoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;

    res.status(400).json({
      success: false,
      message: err.message,
      errors: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authservice.loginUserintoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;

    res.status(401).json({
      success: false,
      message: err.message,
      errors: error,
    });
  }
};

export const authconTroller = {
  signupUser,
  loginUser,
};