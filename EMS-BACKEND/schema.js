import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

// Departments schema
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

// Employees schema
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  department_id: integer("department_id")
    .references(() => departments.id)
    .notNull(),
});
