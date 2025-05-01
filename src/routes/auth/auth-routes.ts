import { Hono } from "hono";
import { loginSSO, registerSSO } from "@controllers/auth/auth-controller";

export const authRoutes = new Hono();
authRoutes.post("/login",loginSSO)
authRoutes.post("/register", registerSSO);