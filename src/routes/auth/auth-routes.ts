import { Hono } from "hono";
import { registerSSO } from "@controllers/auth/auth-controller";

export const authRoutes = new Hono();
authRoutes.post("/register", registerSSO);