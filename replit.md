# Asheville Live - Event Management Application

## Overview

Asheville Live is a full-stack web application designed to showcase and manage live music events and venues in Asheville. The application provides a comprehensive platform for users to discover events, browse venues, and explore the local music scene through various views including a calendar interface, event listings, and venue spotlights.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and production builds
- **Component Library**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Development Storage**: In-memory storage implementation for development/testing

## Key Components

### Database Schema
The application uses four main entities:
- **Venues**: Store venue information including name, address, capacity, and images
- **Events**: Event details with venue relationships, dates, pricing, and metadata
- **Artists**: Artist information and profiles
- **Event-Artist Relationships**: Many-to-many relationship between events and artists

### Frontend Components
- **Navigation**: Responsive navigation with mobile menu support
- **Event Cards**: Reusable event display components with genre-based styling
- **Calendar Widget**: Interactive calendar view for event browsing
- **Venue Spotlight**: Featured venue displays with event counts
- **Filter System**: Advanced filtering for events by genre, venue, and date ranges

### API Endpoints
- **Venues**: CRUD operations for venue management
- **Events**: Event queries with filtering, search, and venue relationships
- **Calendar**: Date-based event retrieval for calendar views
- **Search**: Text-based event and venue search functionality

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and validate data
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Handling**: JSON responses with proper error handling
5. **State Management**: React Query caches responses and manages loading states
6. **UI Updates**: Components re-render based on query state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration and introspection tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles Express server for production
3. **Database Setup**: Drizzle migrations ensure schema consistency
4. **Asset Optimization**: Static assets are optimized and cached

### Production Configuration
- **Environment Variables**: Database URL and configuration via environment
- **Server Setup**: Express serves both API and static frontend files
- **Database Connection**: Serverless PostgreSQL connection via Neon
- **Error Handling**: Comprehensive error boundaries and API error responses

### Development Workflow
- **Hot Reload**: Vite middleware provides instant updates during development
- **Type Safety**: Full TypeScript integration across frontend and backend
- **Database Development**: Easy schema changes with Drizzle push commands
- **API Testing**: Integrated logging for API request/response monitoring

## Changelog
- June 27, 2025. Initial setup
- June 27, 2025. Added automatic event updating system with web scraping and scheduled daily updates
- June 27, 2025. Implemented event sorting by most recent date for better user experience
- June 27, 2025. Successfully deployed to Vercel with automatic GitHub deployments and PostgreSQL database integration
- June 27, 2025. Fixed event filtering functionality and Vercel deployment configuration - events now load and filter properly
- June 28, 2025. Fixed search button alignment and filter functionality - all filtering now works correctly with proper API calls
- June 28, 2025. Updated Vercel deployment configuration to fix runtime error - ready for redeployment
- June 28, 2025. Simplified Vercel configuration for static frontend deployment - resolves text-only display issue
- June 28, 2025. Added complete serverless API setup for full-stack Vercel deployment with Neon database integration

## User Preferences

Preferred communication style: Simple, everyday language.