import { Router } from "express";
import { AuthControllers } from "./user.controller.js";

const router = Router();

router.post("/google", AuthControllers.googleLogin);
router.post("/login", AuthControllers.credentialLogin);

export const AuthRouter = router;
