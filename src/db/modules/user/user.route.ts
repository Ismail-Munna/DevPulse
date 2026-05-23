import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../../middleware/auth";
import { user_role } from "../../../types";

const router = Router();

router.post("/", userController.createUser);

router.get("/", auth(user_role.admin,user_role.agent), userController.GeyAlluser);

router.get("/:id", userController.getSingleUser);

router.delete("/:id", userController.deleteUser);

router.put("/:id", userController.updatUser);

export const userRouter = router;