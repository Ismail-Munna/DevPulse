import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssueQuery } from "./issue.interface";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueintoDB(req.body, req.user!);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesfromDB(
      req.query as IIssueQuery
    );

    res.status(200).json({
      success: true,
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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueService.getSingleIssuefromDB(id);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Issue not found",
        errors: "No issue found with this id",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
      errors: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueService.updateIssuefromDB(id, req.body, req.user!);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;

    const statusCode =
      err.message.includes("not found")
        ? 404
        : err.message.includes("Contributor") ||
          err.message.includes("only your own")
        ? 403
        : 400;

    res.status(statusCode).json({
      success: false,
      message: err.message,
      errors: error,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await issueService.deleteIssuefromDB(id);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: unknown) {
    const err = error as Error;

    res.status(404).json({
      success: false,
      message: err.message,
      errors: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};