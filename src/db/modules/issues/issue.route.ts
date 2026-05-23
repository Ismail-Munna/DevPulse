import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../../middleware/auth";
import { user_role } from "../../../types";

const router = Router();

router.post(
  "/",
  auth(user_role.contributor, user_role.maintainer),
  issueController.createIssue
);

router.get("/", issueController.getAllIssues);

router.get("/:id", issueController.getSingleIssue);

router.patch(
  "/:id",
  auth(user_role.contributor, user_role.maintainer),
  issueController.updateIssue
);

router.delete(
  "/:id",
  auth(user_role.maintainer),
  issueController.deleteIssue
);

export const issueRouter = router;