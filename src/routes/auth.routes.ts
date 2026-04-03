import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();
const loginRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many login attempts. Try again later.",
		code: "RATE_LIMITED"
	}
});

router.post("/login", loginRateLimiter, validateBody(loginSchema), login);

export default router;
