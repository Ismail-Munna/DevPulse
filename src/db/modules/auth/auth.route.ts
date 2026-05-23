import { Router } from "express";
import { authconTroller } from "./auth.controller";

const router = Router();

router.post("/signup", authconTroller.signupUser);
router.post("/login", authconTroller.loginUser);

export const authRoute = router;