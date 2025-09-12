import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || "" 
});

export interface TravelPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  travelers?: number;
  accommodationType?: string;
  activities?: string[];
  travelStyle?: string;
  dietaryRestrictions?: string[];
}

export interface ItineraryDay {
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
}

export interface TravelItinerary {
  days: ItineraryDay[];
  totalCost: number;
  costBreakdown: {
    flights: number;
    accommodation: number;
    activities: number;
    meals: number;
    transport: number;
  };
}

export async function generateItinerary(preferences: TravelPreferences): Promise<TravelItinerary> {
  const systemPrompt = `You are a professional travel planner AI. Create detailed, realistic travel itineraries with accurate cost estimates.

Key requirements:
- Provide realistic cost estimates in USD
- Include specific times and locations
- Balance activities throughout each day
- Consider travel time between locations
- Include accommodation, meals, transport, and activities
- Provide a comprehensive cost breakdown

Response format must be valid JSON matching the TravelItinerary interface.`;

  const userPrompt = `Create a travel itinerary for:
- Destination: ${preferences.destination}
- Dates: ${preferences.startDate} to ${preferences.endDate}
- Budget: ${preferences.budget ? `$${preferences.budget}` : 'Flexible'}
- Travelers: ${preferences.travelers || 1}
- Accommodation: ${preferences.accommodationType || 'Mid-range hotels'}
- Preferred activities: ${preferences.activities?.join(', ') || 'General sightseeing'}
- Travel style: ${preferences.travelStyle || 'Balanced'}
- Dietary restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}

Include flights, accommodation, daily activities, meals, and local transport with realistic pricing.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const itinerary: TravelItinerary = JSON.parse(rawJson);
    
    // Validate the response structure
    if (!itinerary.days || !itinerary.costBreakdown) {
      throw new Error("Invalid itinerary structure from AI");
    }

    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error(`Failed to generate itinerary: ${error}`);
  }
}

export async function processConversation(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  context?: { preferences?: Partial<TravelPreferences> }
): Promise<{ response: string; extractedPreferences?: Partial<TravelPreferences>; shouldGenerateItinerary?: boolean }> {
  
  const systemPrompt = `You are a friendly travel planning assistant. Your goal is to gather travel preferences and create amazing itineraries.

Current conversation context: ${JSON.stringify(context || {})}

Guidelines:
- Ask one question at a time to avoid overwhelming the user
- Be conversational and helpful
- Extract travel information from user responses
- When you have enough information (destination, dates, rough budget), suggest generating an itinerary
- Keep responses concise but friendly
- Always respond in the same language the user is using

Key information to gather:
1. Destination
2. Travel dates
3. Budget range
4. Number of travelers
5. Accommodation preferences
6. Activity interests
7. Travel style
8. Any restrictions

Respond with JSON containing:
{
  "response": "your conversational response",
  "extractedPreferences": { /* any new preferences extracted */ },
  "shouldGenerateItinerary": boolean
}`;

  try {
    const conversationHistory = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: `Conversation so far:\n${conversationHistory}\n\nRespond to the latest user message.`,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error processing conversation:", error);
    // Fallback response
    return {
      response: "Lo siento, tuve un problema técnico. ¿Podrías repetir tu mensaje?",
      shouldGenerateItinerary: false
    };
  }
}

export async function optimizeItinerary(
  currentItinerary: TravelItinerary,
  userFeedback: string
): Promise<TravelItinerary> {
  const systemPrompt = `You are a travel planner optimizing an existing itinerary based on user feedback.

Modify the itinerary according to the user's requests while maintaining:
- Realistic costs and timing
- Logical flow between activities
- Comprehensive cost tracking

Return the updated itinerary in the same JSON format.`;

  const userPrompt = `Current itinerary: ${JSON.stringify(currentItinerary)}

User feedback: ${userFeedback}

Please modify the itinerary according to this feedback.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error optimizing itinerary:", error);
    throw new Error(`Failed to optimize itinerary: ${error}`);
  }
}
