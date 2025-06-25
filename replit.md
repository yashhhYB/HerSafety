# Sefty1st - Women's Safety Mobile Application

## Overview

Sefty1st is a comprehensive women's safety mobile application built as a Progressive Web App (PWA). The application provides emergency assistance, incident reporting, safe zone mapping, and educational resources to enhance women's safety and security. It features a mobile-first design optimized for smartphones with touch-friendly interfaces and responsive layouts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: TanStack Query (React Query) for server state management
- **Animations**: Framer Motion for smooth transitions and interactions
- **Mobile Design**: Mobile-first responsive design with PWA capabilities

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage with PostgreSQL-ready schema using Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with JSON responses

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Type-safe database schema with Zod validation
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless PostgreSQL (configured but not yet connected)

## Key Components

### Core Features
1. **SOS Emergency System**: One-touch emergency alert with location sharing
2. **Incident Reporting**: Anonymous and registered user incident reporting with geolocation
3. **Safe Zone Mapping**: Interactive map showing nearby police stations, hospitals, and NGOs
4. **Educational Hub**: Safety tips, legal rights information, and self-defense resources
5. **Emergency Contacts**: Personal emergency contact management system

### User Interface Components
- **StatusBar**: Mobile-style status bar with time and connectivity indicators
- **BottomNavigation**: Tab-based navigation for easy mobile access
- **ActionCard**: Interactive cards for quick access to main features
- **ReportModal**: Comprehensive incident reporting form with validation

### Data Models
- **Users**: User authentication and profile management
- **Emergency Contacts**: Personal emergency contact storage
- **Incidents**: Incident reports with location and categorization
- **SOS Alerts**: Emergency alert tracking and status management
- **Safe Zones**: Categorized safe locations (police, hospitals, NGOs)
- **User Settings**: Personalized application preferences

## Data Flow

### Emergency Flow
1. User triggers SOS button
2. Application captures current location using browser geolocation
3. Emergency alert created in database with location data
4. Emergency contacts notified (simulated)
5. Alert status tracked for follow-up

### Incident Reporting Flow
1. User fills incident report form
2. Location automatically captured if permitted
3. Report validated using Zod schemas
4. Data stored with optional anonymization
5. Confirmation provided to user

### Safe Zone Discovery Flow
1. User requests nearby safe zones
2. Current location obtained
3. Safe zones filtered by type and proximity
4. Results displayed with contact information

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessibility
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Date Handling**: date-fns for date manipulation
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend Dependencies
- **Database**: Drizzle ORM with Neon Database serverless driver
- **Validation**: Zod for runtime type checking and validation
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **Development**: tsx for TypeScript execution, Replit integration plugins

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module configured
- **Build Process**: Vite development server with hot module replacement
- **Port Configuration**: Application serves on port 5000

### Production Deployment
- **Build Command**: `npm run build` - Vite frontend build + esbuild server bundle
- **Start Command**: `npm run start` - Runs production server
- **Deployment Target**: Replit Autoscale for automatic scaling
- **Static Assets**: Frontend built to `dist/public` directory

### Environment Configuration
- **Database URL**: Environment variable for PostgreSQL connection
- **Session Management**: Configured for production with secure cookies
- **Static File Serving**: Express serves built frontend assets in production

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```