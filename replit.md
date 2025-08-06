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

## Creative Activity Modules

### Music Education Module
- **Framework**: React components with TypeScript integration
- **Audio Library**: Tone.js for Web Audio API synthesis and audio playback
- **Piano Interface**: react-piano for interactive keyboard learning
- **Audio Players**: react-audio-player for lesson audio content
- **Music Notation**: VexFlow for displaying musical notation (future integration)
- **Content Source**: Berklee College of Music inspired curriculum
- **Features**: Interactive rhythm games, note identification, scale practice, metronome
- **Storage**: localforage for user progress and musical creations

### Digital Art Module  
- **Canvas Library**: react-sketch-canvas for digital drawing and painting
- **Drawing Tools**: Comprehensive brush settings, color palettes, eraser functionality
- **Tutorial System**: Step-by-step guided lessons adapted from Art for Kids Hub
- **Content Types**: Character drawing, landscapes, portraits, still life
- **Features**: Real-time drawing feedback, project saving, tutorial progression tracking
- **Storage**: localforage for artwork projects and learning progress

### Olympiad Preparation Module
- **Framework**: React components with TypeScript and react-timer-hook integration
- **Competition Sources**: AMC 8 (American Mathematics Competitions) and NSO (National Science Olympiad)
- **Problem Types**: Multiple-choice, short-answer, and numerical response questions
- **Timer Component**: react-timer-hook for authentic competition simulation with time pressure
- **Form Management**: react-hook-form for answer input validation and submission
- **API Integration**: axios for sourcing authentic competition problems from MAA archives
- **Progress Tracking**: localforage for offline storage of attempts, scores, and user analytics
- **Immediate Feedback**: Real-time answer checking with detailed explanations
- **Features**: Timed challenges, problem navigation, performance analytics, achievement system

### Educational Standards Alignment
- **Music**: National Core Arts Standards (MU:Re7.1.Ka, MU:Pr4.2.Ka, etc.)
- **Art**: National Visual Arts Standards (VA:Cr1.1.Ka, VA:Cr2.1.2a, etc.)
- **Math Olympiad**: AMC 8 problem structures adapted for elementary grades (3-6)
- **Science Olympiad**: NSO content areas covering physics, chemistry, biology, earth science
- **Pedagogy**: NAEYC play-based learning principles integration
- **Age Appropriateness**: Content scaled for grades 3-6 development levels

## External Dependencies

- **Database**: Neon serverless PostgreSQL (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **State Management**: TanStack Query for server state and caching
- **Build Tools**: Vite for fast development and optimized production builds
- **Development**: Replit-specific plugins for development environment integration
- **Creative Tools**: Tone.js, react-piano, react-sketch-canvas, react-audio-player, VexFlow
- **Competition Tools**: react-timer-hook for timed challenges, axios for problem sourcing
- **Storage**: localforage for offline content, user creations, and olympiad progress