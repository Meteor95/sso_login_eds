import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const sso_services = pgTable('sso_services', {
    id: serial('id').primaryKey().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    callback_url: varchar('callback_url', { length: 255 }).notNull(),
    api_key: varchar('api_key', { length: 255 }).notNull(),
    status: boolean('status').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at')
});