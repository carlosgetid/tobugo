# TobuGo Travel Planner

## Overview

TobuGo is an AI-powered travel planning platform that helps users create personalized itineraries, discover travel destinations, and connect with a community of travelers. The application combines conversational AI capabilities with comprehensive trip planning features, allowing users to generate detailed travel itineraries through natural language interactions. The platform also includes a community aspect where users can share and discover public travel itineraries created by other travelers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React using TypeScript and follows a modern component-based architecture. The UI framework leverages shadcn/ui components with Radix UI primitives for accessibility and consistent design patterns. The application uses Wouter for lightweight client-side routing and TanStack Query for efficient server state management and caching. Styling is implemented with Tailwind CSS using a custom design system with CSS variables for theming support.

### Backend Architecture
The server follows a REST API architecture built with Express.js and TypeScript. The application uses a modular approach with separate layers for routing, storage, and business logic. The server implements middleware for request logging, error handling, and JSON parsing. The API follows RESTful conventions with dedicated endpoints for user management, trip planning, chat sessions, reviews, and community features.

### Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes tables for users, trips, chat sessions, reviews, and saved trips. Complex data structures like travel preferences and itineraries are stored as JSONB for flexibility. The database supports relationships between entities through foreign keys and includes proper indexing for performance.

### AI Integration
The core travel planning functionality is powered by Google's Gemini AI through the @google/genai SDK. The AI service handles natural language processing for travel conversations, generates detailed itineraries based on user preferences, and provides travel recommendations. The system includes conversation management to maintain context across chat sessions and supports itinerary optimization based on user feedback.

### State Management
Client-side state is managed through TanStack Query for server state with automatic caching, background updates, and optimistic updates. Local component state is handled with React hooks. The application implements real-time features through mutation-based updates that invalidate and refetch relevant queries.

### Authentication & Security
The current implementation includes basic user authentication with email/password combinations. User sessions are managed server-side with secure password handling. The system includes user registration, login, and profile management endpoints with proper validation using Zod schemas.

### File Organization
The project follows a monorepo structure with clear separation between client, server, and shared code. Shared schemas and types are centralized in the `shared` directory for consistency across frontend and backend. The client uses path aliases for clean imports and maintains a component library structure with reusable UI components.

## External Dependencies

### Database Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and schema management
- **Drizzle Kit**: Database migration and schema synchronization tools

### AI & Machine Learning
- **Google Gemini AI**: Natural language processing and itinerary generation
- **@google/genai**: Official Google AI SDK for API integration

### Frontend Libraries
- **React 18**: Core UI library with modern hooks and concurrent features
- **Wouter**: Lightweight client-side routing solution
- **TanStack Query**: Server state management with caching and synchronization
- **shadcn/ui**: Pre-built component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Form handling with validation support

### Backend Infrastructure
- **Express.js**: Web application framework for Node.js
- **Zod**: Runtime type validation and schema parsing
- **WebSocket Support**: Real-time communication capabilities through ws library

### Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment with runtime error overlays and cartographer plugins

### PDF Generation
- **jsPDF**: Client-side PDF generation for itinerary exports

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation of concerns between different application layers.