import type { Request, Response } from "express";
import { pool } from "../..";
import { userService } from "./user.service";

const createUser=async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  try {
    
const result=await userService.createUserintodb(req.body)
    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const GeyAlluser=async (req: Request, res: Response) => {
  try {
      const result=await userService.getAllusersfromDb()

    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const getSingleUser=async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result=await userService.getsingleuserfromDB(id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}


const updatUser=async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  try {
    
    const result=await userService.UpdateuserfromDB(req.body,id as string)
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}

const deleteUser=async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
   const result=await userService.userDeleteformDB(id as string)
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
}
export const userController={
    createUser,
    GeyAlluser,
    getSingleUser,
    updatUser,
    deleteUser
}