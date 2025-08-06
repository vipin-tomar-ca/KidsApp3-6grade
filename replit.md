# Learning Platform for Kids

## Overview

This is a modern educational platform designed specifically for kids, featuring interactive learning modules across multiple subjects (Math, Reading, Science, and Art). The platform includes gamification elements like points, achievements, and progress tracking to keep young learners engaged. Built with a full-stack architecture using React for the frontend and Express for the backend, with PostgreSQL as the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

**Music Keyboard Audio System Fixed and Enhanced (Latest)**
- Successfully resolved Tone.js audio initialization issues that prevented piano keyboard sounds from playing
- Implemented proper audio context management with manual user activation to comply with browser audio policies
- Enhanced synthesizer configuration with triangle wave oscillator and piano-like envelope for improved sound quality
- Added comprehensive audio debugging and error handling for reliable music functionality
- Piano keyboard now responds correctly to both mouse clicks and keyboard shortcuts (C, D, E, F keys)
- Music section fully functional with interactive piano, rhythm games, and educational content

**Direct Integration of Multimedia Content into Subject Pages**
- Successfully integrated Grade 4 multimedia educational content directly into Math, Reading, and Science subject pages for immediate access
- Created MultimediaSection component that automatically fetches and displays relevant content from the Grade 4 JSON datasource
- Students can now access Khan Academy videos, PBS LearningMedia resources, and interactive CK-12 content without navigating away from their lessons
- Each subject page displays topic-organized content with direct external links to educational videos, images, and interactive activities
- Enhanced user experience with seamless integration - multimedia resources appear right below welcome messages on each subject page
- Maintained full COPPA compliance with external link handling and age-appropriate content filtering
- Content includes proper attribution and licensing information from trusted educational sources (Khan Academy, PBS LearningMedia, Wikimedia Commons, CK-12)

**Complete Comprehensive Curriculum Expansion Across All Subjects**
- Successfully implemented authentic curriculum from ICSE, CBSE, and IB educational standards across ALL subjects
- **Mathematics**: Expanded to 5 skill areas with 10 comprehensive lessons covering Number Systems, Operations, Geometry & Measurement, Patterns & Algebra, and Data Handling based on ICSE 6 themes, CBSE NCERT framework with NEP 2020 alignment, and IB PYP 5-strand approach
- **Reading & Language Arts**: Developed 4 skill areas with 10 lessons covering Reading Comprehension, Vocabulary Building, Literary Analysis, and Reading Fluency with progressive difficulty from grades 3-6
- **Science**: Created 4 skill areas with 10 lessons covering Living & Non-Living World, Matter & Materials, Forces & Energy, and Earth & Environment using CBSE EVS 6-theme approach, ICSE structured topics, and IB PYP inquiry-based learning
- **Visual Arts**: Established 4 skill areas with 10 lessons covering Drawing & Sketching, Color & Painting, Craft & 3D Art, and Cultural Arts following CBSE/ICSE standards and IB PYP creative expression principles
- **Music Theory**: Previously completed comprehensive expansion with 14+ modules based on Kodaly and Orff pedagogical methods
- All subject pages now feature unified UI design with comprehensive curriculum structure, skill progression tracking, grade-appropriate difficulty levels, and authentic educational content
- Resolved all LSP diagnostic errors and established consistent component architecture across all subjects
- Platform now provides complete K-6 educational foundation with international curriculum standards alignment

**Previous Documentation Completion**
- Created comprehensive README.md with full project architecture and setup instructions
- Developed detailed Parental Guide covering all safety, educational, and monitoring features
- Implemented complete Component Reference Guide with code examples and usage patterns
- Established Collaboration Guide for team development with Replit multiplayer setup
- Updated project documentation to support team of 3 developers + 1 content curator
- All documentation follows child safety and educational effectiveness principles

## Child Safety & Compliance Features

### COPPA & GDPR-K Compliance (Ages 8-11)
- **Anonymous User System**: UUID-based identification with no PII collection
- **Parental Authentication**: bcryptjs-secured password protection with localforage storage
- **Time Management**: react-timer-hook integration for daily limits and session tracking
- **Content Moderation**: Educational whitelist filtering for Khan Academy, CK-12, and other sources
- **Data Rights**: Export, delete, and audit capabilities for all stored learning data
- **Restricted Hours**: Configurable time windows for learning access control
- **Safety Monitoring**: Real-time content filtering and inappropriate material blocking

### Privacy Protection Implementation
- **No Personal Data**: Zero collection of names, emails, addresses, or contact information
- **Local Storage Only**: All data stored via localforage on user's device
- **Anonymized Analytics**: Learning progress tracked without identity correlation
- **Parental Controls**: Password-protected dashboard for monitoring and configuration
- **Compliance Reporting**: Automated generation of privacy-compliant activity reports

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