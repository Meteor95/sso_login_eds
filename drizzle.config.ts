import { defineConfig } from "drizzle-kit";

if (!process.env.MAIN_DATABASE_URL) {
  throw new Error("MAIN_DATABASE_URL is not defined in the environment variables.");
}
export default defineConfig({
  out: "./src/database/migrations",
  schema: "./src/database/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MAIN_DATABASE_URL,
  },
  breakpoints: true,
  strict: true,
});
