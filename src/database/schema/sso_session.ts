import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { sso_users } from "./sso_users";

export const sso_sessions = pgTable('sso_sessions', {
    id: serial('id').primaryKey().notNull(),
    user_id: integer('user_id').notNull().references(() => sso_users.id),
    token: varchar('token', { length: 255 }).notNull(),
    ip_address: varchar('ip_address', { length: 50 }),
    user_agent: varchar('user_agent', { length: 255 }),
    expires_at: timestamp('expires_at').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at')
});