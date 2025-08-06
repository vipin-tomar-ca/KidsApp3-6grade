# Learning Platform for Kids

## Overview

This is a modern educational platform designed specifically for kids, featuring interactive learning modules across multiple subjects (Math, Reading, Science, and Art). The platform includes gamification elements like points, achievements, and progress tracking to keep young learners engaged. Built with a full-stack architecture using React for the frontend and Express for the backend, with PostgreSQL as the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom kid-friendly color palette and themes
- **Design System**: Component-based architecture with reusable UI elements optimized for children

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints for users, progress tracking, achievements, and learning modules
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Development Setup**: Hot module replacement with Vite middleware for seamless development experience

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Structured tables for users, learning modules, user progress, achievements, and activities
- **Migration System**: Drizzle Kit for database schema migrations and management
- **Connection**: Neon serverless PostgreSQL for cloud deployment

### Authentication & User Management
- **User System**: Simple username-based authentication with password storage
- **Progress Tracking**: Individual user progress per subject with completion percentages
- **Achievement System**: Badge, medal, and trophy-based rewards for user engagement
- **Points & Levels**: Gamification through point accumulation and level progression

## External Dependencies

- **Database**: Neon serverless PostgreSQL (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **State Management**: TanStack Query for server state and caching
- **Build Tools**: Vite for fast development and optimized production builds
- **Development**: Replit-specific plugins for development environment integration