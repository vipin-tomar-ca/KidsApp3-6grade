import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  points: integer("points").default(0),
  level: integer("level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(), // math, reading, science, art
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  difficulty: integer("difficulty").default(1), // 1-5
  pointsReward: integer("points_reward").default(10),
  isActive: boolean("is_active").default(true),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(), // math, reading, science, art
  progressPercentage: integer("progress_percentage").default(0),
  completedActivities: integer("completed_activities").default(0),
  totalActivities: integer("total_activities").default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  pointsRequired: integer("points_required").default(0),
  type: text("type").notNull(), // badge, medal, trophy
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull().references(() => learningModules.id),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  type: text("type").notNull(), // quiz, game, reading, creative
  difficulty: integer("difficulty").default(1),
  estimatedTime: integer("estimated_time").default(5), // minutes
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  name: true,
  password: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  subject: true,
  progressPercentage: true,
  completedActivities: true,
  totalActivities: true,
});

export const insertAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LearningModule = typeof learningModules.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
