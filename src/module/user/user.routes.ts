import { Router } from "express";
import { AUthControllers } from "./user.controller.js";

const router = Router();

router.post("/google", AUthControllers.googleLogin);

export const AuthRouter = router;
