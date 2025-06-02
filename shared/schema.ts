import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Daily log entries table
export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: date("date").notNull(),
  emotion: text("emotion").notNull(), // calm, happy, anxious, sad, angry
  anxietyLevel: integer("anxiety_level").notNull(), // 1-10
  trigger: text("trigger").notNull(), // home, school, work, social
  description: text("description").notNull(),
  mind: jsonb("mind").notNull().$type<string[]>(), // array of selected mind symptoms
  body: jsonb("body").notNull().$type<string[]>(), // array of selected body symptoms
  emotions: jsonb("emotions").notNull().$type<string[]>(), // array of selected emotions
  behaviors: jsonb("behaviors").notNull().$type<string[]>(), // array of selected behaviors
  strategiesUsed: text("strategies_used"), // text description of strategies used
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Create schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEntrySchema = createInsertSchema(entries)
  .omit({ id: true, createdAt: true })
  .extend({
    date: z.coerce.date(),
    anxietyLevel: z.number().min(1).max(10),
    mind: z.array(z.string()),
    body: z.array(z.string()),
    emotions: z.array(z.string()),
    behaviors: z.array(z.string()),
  });

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;
export type Entry = typeof entries.$inferSelect;

// Enums for consistent data
export const emotionOptions = ["calm", "happy", "anxious", "sad", "angry"] as const;
export const triggerOptions = ["home", "school", "work", "social"] as const;

// Options for the four quadrants
export const mindOptions = [
  "Racing thoughts",
  "Overthinking",
  "Difficulty concentrating",
  "Memory issues",
  "Negative thought patterns"
] as const;

export const bodyOptions = [
  "Rapid heartbeat",
  "Trouble sleeping", 
  "Muscle tension",
  "Headaches",
  "Stomach issues"
] as const;

export const emotionSymptomOptions = [
  "Overwhelmed",
  "Irritable",
  "Fearful",
  "Sad",
  "Worried"
] as const;

export const behaviorOptions = [
  "Avoiding situations",
  "Procrastination",
  "Restlessness",
  "Increased irritability",
  "Social withdrawal"
] as const;

// Coping strategies
export const copingStrategies = [
  {
    id: 1,
    title: "Deep Breathing",
    description: "Practice 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8.",
    category: "relaxation"
  },
  {
    id: 2,
    title: "Mindfulness",
    description: "Focus on the present moment without judgment.",
    category: "mindfulness"
  },
  {
    id: 3,
    title: "Progressive Relaxation",
    description: "Tense and then release each muscle group.",
    category: "relaxation"
  },
  {
    id: 4,
    title: "Positive Self-Talk",
    description: "Replace negative thoughts with positive affirmations.",
    category: "cognitive"
  },
  {
    id: 5,
    title: "Physical Exercise",
    description: "Even a short walk can reduce anxiety.",
    category: "physical"
  },
  {
    id: 6,
    title: "Journaling",
    description: "Write down your thoughts and feelings.",
    category: "cognitive"
  }
] as const;
