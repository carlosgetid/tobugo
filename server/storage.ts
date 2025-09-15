import { users, trips, chatSessions, reviews, savedTrips, reviewHelpfuls, type User, type InsertUser, type UpsertUser, type Trip, type InsertTrip, type ChatSession, type InsertChatSession, type Review, type InsertReview, type SavedTrip, type InsertSavedTrip } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, avg, sql, gte, lte, ilike } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Required for Replit Auth
  upsertUser(user: UpsertUser): Promise<User>;

  // Trips
  getTrip(id: string): Promise<Trip | undefined>;
  getTripsByUserId(userId: string): Promise<Trip[]>;
  getPublicTrips(filters?: {
    destination?: string;
    minBudget?: number;
    maxBudget?: number;
    minDuration?: number;
    maxDuration?: number;
    travelStyle?: string;
  }): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip>;
  deleteTrip(id: string): Promise<void>;

  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getChatSessionsByUserId(userId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, session: Partial<InsertChatSession>): Promise<ChatSession>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByTripId(tripId: string): Promise<Review[]>;
  getReviewsByUserId(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review>;

  // Saved Trips
  getSavedTripsByUserId(userId: string): Promise<SavedTrip[]>;
  createSavedTrip(savedTrip: InsertSavedTrip): Promise<SavedTrip>;
  deleteSavedTrip(userId: string, tripId: string): Promise<void>;

  // Community functionality
  getCommunityStats(): Promise<CommunityStats>;
  getRecentReviews(limit: number): Promise<ReviewWithUser[]>;
  incrementReviewHelpful(reviewId: string, userId: string): Promise<Review | null>;
}

// Community stats type
export interface CommunityStats {
  totalTrips: number;
  totalUsers: number;
  totalReviews: number;
  averageRating: number;
}

// Review with user information
export interface ReviewWithUser extends Review {
  user: {
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  targetName?: string;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Required for Replit Auth - upserts user based on id
  async upsertUser(userData: UpsertUser): Promise<User> {
    const { id: _id, ...rest } = userData;
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...rest,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Trips
  async getTrip(id: string): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip || undefined;
  }

  async getTripsByUserId(userId: string): Promise<Trip[]> {
    return await db.select().from(trips).where(eq(trips.userId, userId)).orderBy(desc(trips.createdAt));
  }

  async getPublicTrips(filters?: {
    destination?: string;
    minBudget?: number;
    maxBudget?: number;
    minDuration?: number;
    maxDuration?: number;
    travelStyle?: string;
  }): Promise<Trip[]> {
    let conditions = [eq(trips.isPublic, true)];
    
    if (filters) {
      if (filters.destination) {
        conditions.push(sql`LOWER(${trips.destination}) LIKE LOWER(${'%' + filters.destination + '%'})`);
      }
      
      if (filters.minBudget !== undefined) {
        conditions.push(sql`CAST(${trips.budget} AS DECIMAL) >= ${filters.minBudget}`);
      }
      
      if (filters.maxBudget !== undefined) {
        conditions.push(sql`CAST(${trips.budget} AS DECIMAL) <= ${filters.maxBudget}`);
      }
      
      if (filters.travelStyle) {
        conditions.push(sql`${trips.preferences}->>'travelStyle' ILIKE ${'%' + filters.travelStyle + '%'}`);
      }
      
      // Duration filtering based on date difference
      if (filters.minDuration !== undefined) {
        conditions.push(sql`EXTRACT(DAY FROM ${trips.endDate} - ${trips.startDate}) >= ${filters.minDuration}`);
      }
      
      if (filters.maxDuration !== undefined) {
        conditions.push(sql`EXTRACT(DAY FROM ${trips.endDate} - ${trips.startDate}) <= ${filters.maxDuration}`);
      }
    }
    
    return await db.select().from(trips)
      .where(and(...conditions))
      .orderBy(desc(trips.createdAt));
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const [trip] = await db.insert(trips).values(insertTrip as typeof trips.$inferInsert).returning();
    return trip;
  }

  async updateTrip(id: string, updateTrip: Partial<InsertTrip>): Promise<Trip> {
    const [trip] = await db.update(trips)
      .set({ ...(updateTrip as Partial<typeof trips.$inferInsert>), updatedAt: new Date() })
      .where(eq(trips.id, id))
      .returning();
    return trip;
  }

  async deleteTrip(id: string): Promise<void> {
    await db.delete(trips).where(eq(trips.id, id));
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return await db.select().from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db.insert(chatSessions).values(insertSession as typeof chatSessions.$inferInsert).returning();
    return session;
  }

  async updateChatSession(id: string, updateSession: Partial<InsertChatSession>): Promise<ChatSession> {
    const [session] = await db.update(chatSessions)
      .set({ ...(updateSession as Partial<typeof chatSessions.$inferInsert>), updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async getReviewsByTripId(tripId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.tripId, tripId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUserId(userId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: string, updateReview: Partial<InsertReview>): Promise<Review> {
    const [review] = await db.update(reviews)
      .set(updateReview)
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  // Saved Trips
  async getSavedTripsByUserId(userId: string): Promise<Trip[]> {
    const savedTripsWithDetails = await db.select({
      id: trips.id,
      title: trips.title,
      description: trips.description,
      destination: trips.destination,
      startDate: trips.startDate,
      endDate: trips.endDate,
      budget: trips.budget,
      currency: trips.currency,
      isPublic: trips.isPublic,
      itinerary: trips.itinerary,
      preferences: trips.preferences,
      createdAt: trips.createdAt,
      updatedAt: trips.updatedAt,
      userId: trips.userId
    }).from(savedTrips)
      .innerJoin(trips, eq(savedTrips.tripId, trips.id))
      .where(eq(savedTrips.userId, userId))
      .orderBy(desc(savedTrips.createdAt));
    
    return savedTripsWithDetails;
  }

  async createSavedTrip(insertSavedTrip: InsertSavedTrip): Promise<SavedTrip> {
    const [savedTrip] = await db.insert(savedTrips).values(insertSavedTrip).returning();
    return savedTrip;
  }

  async deleteSavedTrip(userId: string, tripId: string): Promise<void> {
    await db.delete(savedTrips)
      .where(and(eq(savedTrips.userId, userId), eq(savedTrips.tripId, tripId)));
  }

  // Community functionality
  async getCommunityStats(): Promise<CommunityStats> {
    const [tripsCount] = await db.select({ count: count() }).from(trips);
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [reviewsCount] = await db.select({ count: count() }).from(reviews);
    const [avgRating] = await db.select({ avg: avg(reviews.rating) }).from(reviews);

    return {
      totalTrips: tripsCount.count,
      totalUsers: usersCount.count,
      totalReviews: reviewsCount.count,
      averageRating: parseFloat(avgRating.avg || "0"),
    };
  }

  async getRecentReviews(limit: number): Promise<ReviewWithUser[]> {
    const recentReviews = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        tripId: reviews.tripId,
        targetType: reviews.targetType,
        targetId: reviews.targetId,
        rating: reviews.rating,
        comment: reviews.comment,
        helpful: reviews.helpful,
        createdAt: reviews.createdAt,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userProfileImageUrl: users.profileImageUrl,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    return recentReviews.map(review => ({
      id: review.id,
      userId: review.userId,
      tripId: review.tripId,
      targetType: review.targetType,
      targetId: review.targetId,
      rating: review.rating,
      comment: review.comment,
      helpful: review.helpful,
      createdAt: review.createdAt,
      user: {
        firstName: review.userFirstName,
        lastName: review.userLastName,
        profileImageUrl: review.userProfileImageUrl,
      },
      targetName: review.targetId, // For now, use targetId as name
    }));
  }

  async incrementReviewHelpful(reviewId: string, userId: string): Promise<Review | null> {
    try {
      // Attempt to insert the helpful vote (will fail if duplicate due to unique constraint)
      await db.insert(reviewHelpfuls).values({
        reviewId,
        userId,
      });

      // If insert was successful, increment the helpful count atomically
      const [review] = await db
        .update(reviews)
        .set({ helpful: sql`coalesce(${reviews.helpful}, 0) + 1` })
        .where(eq(reviews.id, reviewId))
        .returning();
      
      return review;
    } catch (error: any) {
      // If the error is a unique constraint violation, user has already voted
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return null;
      }
      // Re-throw other errors
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
