import { Context } from "hono";

const isJSON = (message: string): boolean => {
    const trimmed = message.trim();
    return (trimmed.startsWith("{") && trimmed.endsWith("}")) || 
           (trimmed.startsWith("[") && trimmed.endsWith("]"));
};
export const handleError = (c: Context, error: any, message = "Something went wrong.") => {
    return c.json({
        success: false,
        message,
        error_messages: isJSON(error.message) ? JSON.parse(error.message) : error.message,
    }, 500);
};

