import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  preferences: jsonb("preferences").$type<{
    accommodation?: string;
    activities?: string[];
    travelStyle?: string;
    dietaryRestrictions?: string[];
  }>(),
  itinerary: jsonb("itinerary").$type<{
    days: Array<{
      date: string;
      activities: Array<{
        time: string;
        title: string;
        description: string;
        type: 'flight' | 'accommodation' | 'activity' | 'transport' | 'meal';
        cost?: number;
        location?: string;
      }>;
      totalCost: number;
    }>;
    totalCost: number;
    costBreakdown: {
      flights: number;
      accommodation: number;
      activities: number;
      meals: number;
      transport: number;
    };
  }>(),
  isPublic: boolean("is_public").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  tripId: varchar("trip_id").references(() => trips.id),
  messages: jsonb("messages").$type<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>().default([]),
  status: text("status").default('active'), // active, completed, cancelled
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tripId: varchar("trip_id").references(() => trips.id),
  targetType: text("target_type").notNull(), // 'trip', 'accommodation', 'activity'
  targetId: text("target_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  helpful: integer("helpful").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const savedTrips = pgTable("saved_trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tripId: varchar("trip_id").notNull().references(() => trips.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
  chatSessions: many(chatSessions),
  reviews: many(reviews),
  savedTrips: many(savedTrips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
  chatSessions: many(chatSessions),
  reviews: many(reviews),
  savedTrips: many(savedTrips),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  user: one(users, { fields: [chatSessions.userId], references: [users.id] }),
  trip: one(trips, { fields: [chatSessions.tripId], references: [trips.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  trip: one(trips, { fields: [reviews.tripId], references: [trips.id] }),
}));

export const savedTripsRelations = relations(savedTrips, ({ one }) => ({
  user: one(users, { fields: [savedTrips.userId], references: [users.id] }),
  trip: one(trips, { fields: [savedTrips.tripId], references: [trips.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertSavedTripSchema = createInsertSchema(savedTrips).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertSavedTrip = z.infer<typeof insertSavedTripSchema>;
export type SavedTrip = typeof savedTrips.$inferSelect;
