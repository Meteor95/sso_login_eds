import { pgTable, varchar, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";

export const sso_users = pgTable('sso_users', {
    id: serial('id').primaryKey().notNull(),
    uuid: varchar('uuid', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    password: varchar('password', { length: 100 }).notNull(),
    role: integer('role').notNull(),
    registration_number: varchar('registration_number', { length: 255 }).notNull(),
    status: boolean('status').notNull(),
    max_allowed_login: integer('max_allowed_login').notNull(),
    token: varchar('token', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at'),
    deleted_at: timestamp('deleted_at')
})