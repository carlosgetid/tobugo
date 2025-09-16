import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, decimal, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Updated for Replit Auth compatibility  
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Legacy fields for backward compatibility (optional)
  username: text("username").unique(),
  password: text("password"),
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

// Reviews table for user reviews of places
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  placeName: text("place_name").notNull(),
  location: text("location").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]), // Photo/video URLs
  tripId: varchar("trip_id").references(() => trips.id), // Optional link to trip
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Saved itineraries for users who download PDFs
export const savedItineraries = pgTable("saved_itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tripId: varchar("trip_id").notNull().references(() => trips.id),
  savedPreferences: jsonb("saved_preferences").$type<{
    destinations?: string[];
    budgetRange?: { min: number; max: number };
    preferredActivities?: string[];
    travelStyle?: string;
    accommodationType?: string;
  }>(),
  downloadedAt: timestamp("downloaded_at").default(sql`now()`),
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

export const reviewHelpfuls = pgTable("review_helpfuls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  reviewId: varchar("review_id").notNull().references(() => reviews.id),
  createdAt: timestamp("created_at").default(sql`now()`),
}, (table) => [
  // UNIQUE constraint: one helpful per user per review
  uniqueIndex("unique_user_review_helpful").on(table.userId, table.reviewId)
]);

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

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  trip: one(trips, { fields: [reviews.tripId], references: [trips.id] }),
  helpfuls: many(reviewHelpfuls),
}));

export const savedTripsRelations = relations(savedTrips, ({ one }) => ({
  user: one(users, { fields: [savedTrips.userId], references: [users.id] }),
  trip: one(trips, { fields: [savedTrips.tripId], references: [trips.id] }),
}));

export const reviewHelpfulsRelations = relations(reviewHelpfuls, ({ one }) => ({
  user: one(users, { fields: [reviewHelpfuls.userId], references: [users.id] }),
  review: one(reviews, { fields: [reviewHelpfuls.reviewId], references: [reviews.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Replit Auth specific user upsert type
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  itinerary: z.object({
    days: z.array(z.object({
      date: z.string(),
      activities: z.array(z.object({
        time: z.string(),
        title: z.string(),
        description: z.string(),
        type: z.enum(['flight', 'accommodation', 'activity', 'transport', 'meal']),
        cost: z.number().optional(),
        location: z.string().optional(),
      })),
      totalCost: z.number(),
    })),
    totalCost: z.number(),
    costBreakdown: z.object({
      flights: z.number(),
      accommodation: z.number(),
      activities: z.number(),
      meals: z.number(),
      transport: z.number(),
    }),
  }).optional(),
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
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertSavedTrip = z.infer<typeof insertSavedTripSchema>;
export type SavedTrip = typeof savedTrips.$inferSelect;
