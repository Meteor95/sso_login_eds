import { Context, Next } from "hono";
import { db } from "@database/connection";

export const checkDatabase = async (c: Context, next: Next) => {
    if (!db) {
        return c.json(
            {
                success: false,
                error_messages: "Failed To Connect Database: maybe database down or upgrade, Please Contact Administrator or try again later",
            },
            503
        );
    }
    await next();
};
