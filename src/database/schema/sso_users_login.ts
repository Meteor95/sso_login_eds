import { pgTable, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";

export const sso_users_login = pgTable('sso_users_login', {
    id: serial('id').primaryKey().notNull(),
    user_id: integer('user_id').notNull(),
    deviced_id: varchar('deviced_id', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
})