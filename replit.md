# FeedMaster Admin Panel

## Overview

FeedMaster is a comprehensive content automation and moderation system designed for Telegram channel management. The application serves as a SaaS platform that automates content collection, filtering, and publication from external sources to Telegram channels with manual moderation capabilities. The system supports multi-user environments with role-based access control and features a dedicated admin panel for platform owners to manage users, bots, billing, and system performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend built with Vite, implementing a component-driven architecture with TypeScript for type safety. The UI framework is built on shadcn/ui components with Radix UI primitives, providing a consistent design system with Tailwind CSS for styling. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and API communication.

### Backend Architecture
The backend follows a RESTful API design pattern built with Express.js and TypeScript. The server implements a modular route structure with middleware for request logging and error handling. The architecture separates concerns between route handlers, storage interfaces, and business logic. Currently, the system uses an in-memory storage implementation but is designed to support database persistence through the storage interface abstraction.

### Data Storage Solutions
The application is configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and migrations. The database schema is centralized in a shared module, allowing both frontend and backend to use consistent type definitions. The current implementation includes a basic user table with plans for expansion to support bots, sources, subscriptions, and audit logs.

### Authentication and Authorization
The system implements a role-based access control system with support for different user roles including administrators and moderators. The admin panel features isolated routing with role-based access restrictions, ensuring that only users with 'owner' privileges can access administrative functions. Session management and user authentication are handled through the storage layer interface.

### Component Architecture
The admin panel follows a strict separation of concerns with dedicated components isolated from the main application. This includes specialized admin-only components for statistics cards, data tables, modals, and navigation elements. The admin interface uses its own sidebar navigation system independent of the main application layout, preventing UI conflicts and ensuring clean architectural boundaries.

### API Design
The backend exposes RESTful endpoints for admin panel functionality, currently serving mock data for development purposes. API routes are organized by functional areas (users, bots, billing, system monitoring) with consistent response formats. The architecture supports both real-time data updates and batch operations for administrative tasks.

## External Dependencies

### UI and Styling
- **shadcn/ui with Radix UI**: Comprehensive component library providing accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for consistent styling and theming
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **class-variance-authority**: Utility for creating variant-based component APIs

### Database and ORM
- **PostgreSQL**: Primary relational database for data persistence
- **Neon Database Serverless**: Cloud-hosted PostgreSQL service for production deployment
- **Drizzle ORM**: Type-safe ORM with excellent TypeScript integration and migration support
- **Drizzle Kit**: CLI tools for database migrations and schema management

### Development and Build Tools
- **Vite**: Modern build tool providing fast development server and optimized production builds
- **TypeScript**: Static type checking for improved development experience and code reliability
- **ESBuild**: Fast JavaScript bundler used by Vite for production builds

### State Management and Data Fetching
- **TanStack React Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form with Zod**: Form management with schema validation

### Routing and Navigation
- **Wouter**: Lightweight client-side routing library optimized for modern React applications

### Session and Authentication
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Express Session**: Server-side session management middleware

### Development Environment
- **Replit Integration**: Development environment optimizations including error overlays, cartographer, and development banners for enhanced development experience