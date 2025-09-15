import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTripSchema, insertChatSessionSchema, insertReviewSchema, insertSavedTripSchema } from "@shared/schema";
import { generateItinerary, processConversation, optimizeItinerary, type TravelPreferences } from "./services/gemini";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { pixabayService } from "./pixabayService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Sanitize response by omitting sensitive fields
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes (protected)
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // Trip routes
  app.get("/api/trips/public", async (req, res) => {
    try {
      const trips = await storage.getPublicTrips();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get public trips", error });
    }
  });

  app.get("/api/trips/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const trips = await storage.getTripsByUserId(req.params.userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user trips", error });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const trip = await storage.getTrip(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trip", error });
    }
  });

  app.post("/api/trips", isAuthenticated, async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: "Invalid trip data", error });
    }
  });

  app.put("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      const tripData = insertTripSchema.partial().parse(req.body);
      const trip = await storage.updateTrip(req.params.id, tripData);
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: "Failed to update trip", error });
    }
  });

  app.delete("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTrip(req.params.id);
      res.json({ message: "Trip deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip", error });
    }
  });

  // Chat session routes (protected)
  app.get("/api/chat/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const sessions = await storage.getChatSessionsByUserId(req.params.userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat sessions", error });
    }
  });

  app.get("/api/chat/:id", isAuthenticated, async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat session", error });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid chat session data", error });
    }
  });

  app.post("/api/chat/:id/message", isAuthenticated, async (req, res) => {
    try {
      const { message } = req.body;
      const sessionId = req.params.id;
      
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const messages = session.messages || [];
      const newMessage = {
        id: Math.random().toString(36),
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString(),
      };

      messages.push(newMessage);

      // Process with Gemini AI
      const aiResponse = await processConversation(
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

      const aiMessage = {
        id: Math.random().toString(36),
        role: 'assistant' as const,
        content: aiResponse.response,
        timestamp: new Date().toISOString(),
      };

      messages.push(aiMessage);

      const updatedSession = await storage.updateChatSession(sessionId, {
        messages,
        status: aiResponse.shouldGenerateItinerary ? 'completed' : 'active'
      });

      console.log("Extracted preferences:", JSON.stringify(aiResponse.extractedPreferences, null, 2));

      res.json({
        session: updatedSession,
        shouldGenerateItinerary: aiResponse.shouldGenerateItinerary,
        extractedPreferences: aiResponse.extractedPreferences
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process message", error });
    }
  });

  // AI itinerary generation
  app.post("/api/ai/generate-itinerary", async (req, res) => {
    try {
      const preferencesSchema = z.object({
        destination: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        duration: z.union([z.number(), z.string()]).optional().transform((val) => {
          if (typeof val === 'string') {
            const match = String(val).match(/\d+/);
            return match ? parseInt(match[0], 10) : undefined;
          }
          return val;
        }),
        days: z.union([z.number(), z.string()]).optional().transform((val) => {
          if (typeof val === 'string') {
            const match = String(val).match(/\d+/);
            return match ? parseInt(match[0], 10) : undefined;
          }
          return val;
        }),
        budget: z.union([z.number(), z.string()]).optional().transform((val) => {
          if (typeof val === 'string') {
            // Extract numbers from strings like "$1,000 - $1,500 USD" or "$1500"
            const numbers = val.match(/\d+(?:,\d+)*/g);
            if (numbers) {
              const numericValue = parseInt(numbers[0].replace(/,/g, ''), 10);
              return isNaN(numericValue) ? undefined : numericValue;
            }
            return undefined;
          }
          return val;
        }),
        travelers: z.union([z.number(), z.string()]).optional().transform((val) => {
          if (typeof val === 'string') {
            const num = parseInt(val, 10);
            return isNaN(num) ? 1 : num;
          }
          return val || 1;
        }),
        accommodationType: z.string().optional(),
        activities: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
          if (typeof val === 'string') {
            return [val];
          }
          return val;
        }),
        travelStyle: z.string().optional(),
        dietaryRestrictions: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
          if (typeof val === 'string') {
            return [val];
          }
          return val;
        }),
      });

      const parsedPreferences = preferencesSchema.parse(req.body);
      
      // Smart date calculation preserving provided dates
      let startDate = parsedPreferences.startDate;
      let endDate = parsedPreferences.endDate;
      const duration = parsedPreferences.duration || parsedPreferences.days || 7;
      
      if (!startDate && !endDate) {
        // No dates provided - generate defaults
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() + 7); // Start 7 days from now
        
        const end = new Date(start);
        end.setDate(start.getDate() + duration - 1);
        
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
      } else if (startDate && !endDate) {
        // Start date provided, calculate end date
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          throw new Error("Invalid start date format");
        }
        const end = new Date(start);
        end.setDate(start.getDate() + duration - 1);
        endDate = end.toISOString().split('T')[0];
      } else if (!startDate && endDate) {
        // End date provided, calculate start date
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          throw new Error("Invalid end date format");
        }
        const start = new Date(end);
        start.setDate(end.getDate() - duration + 1);
        startDate = start.toISOString().split('T')[0];
      }
      // If both dates provided, use them as-is
      
      // Validate that we have valid dates
      if (!startDate || !endDate) {
        throw new Error("Unable to determine trip dates");
      }
      
      // Ensure dates are strings (TypeScript safety)
      const finalPreferences = {
        ...parsedPreferences,
        startDate,
        endDate
      };
      
      const itinerary = await generateItinerary(finalPreferences);
      
      res.json(itinerary);
    } catch (error: any) {
      console.error("Itinerary generation error:", error);
      res.status(400).json({ message: "Failed to generate itinerary", error: error?.message || error });
    }
  });

  app.post("/api/ai/optimize-itinerary", async (req, res) => {
    try {
      const { itinerary, feedback } = req.body;
      const optimizedItinerary = await optimizeItinerary(itinerary, feedback);
      
      res.json(optimizedItinerary);
    } catch (error) {
      res.status(400).json({ message: "Failed to optimize itinerary", error });
    }
  });

  // Review routes
  app.get("/api/reviews/trip/:tripId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByTripId(req.params.tripId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reviews", error });
    }
  });

  app.get("/api/reviews/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const reviews = await storage.getReviewsByUserId(req.params.userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user reviews", error });
    }
  });

  app.post("/api/reviews", isAuthenticated, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error });
    }
  });

  // Saved trips routes (protected)
  app.get("/api/saved-trips/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const savedTrips = await storage.getSavedTripsByUserId(req.params.userId);
      res.json(savedTrips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get saved trips", error });
    }
  });

  app.post("/api/saved-trips", isAuthenticated, async (req, res) => {
    try {
      const savedTripData = insertSavedTripSchema.parse(req.body);
      const savedTrip = await storage.createSavedTrip(savedTripData);
      res.json(savedTrip);
    } catch (error) {
      res.status(400).json({ message: "Invalid saved trip data", error });
    }
  });

  app.delete("/api/saved-trips/:userId/:tripId", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteSavedTrip(req.params.userId, req.params.tripId);
      res.json({ message: "Trip removed from saved trips" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove saved trip", error });
    }
  });

  // Pixabay content routes (public)
  app.get("/api/pixabay/travel-content", async (req, res) => {
    try {
      const content = await pixabayService.getTravelContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching Pixabay content:", error);
      res.status(500).json({ message: "Failed to fetch travel content", error });
    }
  });

  app.get("/api/pixabay/videos", async (req, res) => {
    try {
      const query = req.query.q as string || 'travel landscape tourism beautiful destinations';
      const perPage = parseInt(req.query.per_page as string) || 10;
      
      const videos = await pixabayService.searchVideos(query, perPage);
      res.json({ videos });
    } catch (error) {
      console.error("Error fetching Pixabay videos:", error);
      res.status(500).json({ message: "Failed to fetch videos", error });
    }
  });

  app.get("/api/pixabay/images", async (req, res) => {
    try {
      const query = req.query.q as string || 'travel landscape tourism beautiful destinations';
      const perPage = parseInt(req.query.per_page as string) || 10;
      
      const images = await pixabayService.searchImages(query, perPage);
      res.json({ images });
    } catch (error) {
      console.error("Error fetching Pixabay images:", error);
      res.status(500).json({ message: "Failed to fetch images", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
