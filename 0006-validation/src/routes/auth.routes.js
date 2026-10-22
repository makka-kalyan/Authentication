import express from "express";
import { register } from "../controller/auth.controller";
import { registerValidation } from "../validators/auth.validator";
const router = express.Router();

/*
 * POST /api/auth/register
 *req.body = {email,phone, password}
 */

router.post("/register", registerValidation, register);

export default router;
