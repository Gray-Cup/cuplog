import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const sample = pgTable("sample", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  origin: text("origin").notNull().default("—"),
  variety: text("variety").notNull().default("—"),
  process: text("process").notNull().default("—"),
  roast: text("roast").notNull().default("—"),
  dateReceived: text("date_received").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "complete"
  photos: jsonb("photos").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  // SCA scores (null until cupping is complete)
  fragrance: text("fragrance"),
  flavor: text("flavor"),
  aftertaste: text("aftertaste"),
  acidity: text("acidity"),
  body: text("body"),
  balance: text("balance"),
  overall: text("overall"),
  uniformity: text("uniformity"),
  cleanCup: text("clean_cup"),
  sweetness: text("sweetness"),
  taints: text("taints"),
  faults: text("faults"),
  notes: text("notes"),
  descriptors: jsonb("descriptors")
    .$type<{ label: string; family: string; attrKey?: string }[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  finalScore: text("final_score"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
