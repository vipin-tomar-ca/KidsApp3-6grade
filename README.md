# Learning Platform for Kids (Grades 3-6)

[![Replit](https://img.shields.io/badge/Built%20on-Replit-orange)](https://replit.com)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org)
[![COPPA Compliant](https://img.shields.io/badge/COPPA-Compliant-green)](https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy)

A modern, interactive educational platform designed specifically for elementary school children (grades 3-6). Features comprehensive learning modules for Math, Reading, Science, and Creative Arts with built-in child safety, accessibility, and gamification elements.

## 🎯 Platform Overview

### Target Audience
- **Primary Users**: Children ages 8-11 (grades 3-6)
- **Secondary Users**: Parents and educators monitoring progress
- **Content Standards**: Aligned with Common Core and national educational standards

### Key Features
- ✅ **COPPA & GDPR-K Compliant** - Full privacy protection for children
- 🎨 **Creative Modules** - Music composition, digital art, and creative writing
- 🏆 **Olympiad Preparation** - AMC 8 math and NSO science competition training  
- 🧠 **AI Learning Assistant** - Educational hints and guidance using TensorFlow.js
- ♿ **Full Accessibility** - WCAG 2.1 AA compliant with text-to-speech support
- 📱 **Responsive Design** - Works on tablets, desktops, and interactive whiteboards
- 🔒 **Parental Controls** - Comprehensive dashboard and safety monitoring

## 🚀 Getting Started in Replit

### Prerequisites
This project is designed to run seamlessly in Replit with zero additional setup required.

### Quick Start
1. **Fork this Replit** to your account
2. **Click "Run"** to start the development server
3. The app will automatically open in the webview
4. Navigate to different learning modules to explore features

### Development Commands
```bash
# Start development server (automatically configured)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Database operations
npm run db:push
npm run db:generate
```

## 📁 Project Structure

```
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui base components
│   │   │   ├── HintAssistant.tsx    # AI learning assistant
│   │   │   ├── FirebaseSync.tsx     # Cloud sync component
│   │   │   └── SpeakableText.tsx    # Text-to-speech component
│   │   ├── pages/             # Application pages/routes
│   │   │   ├── home.tsx       # Main dashboard
│   │   │   ├── math.tsx       # Math learning module
│   │   │   ├── reading.tsx    # Reading comprehension
│   │   │   ├── science.tsx    # Science experiments
│   │   │   ├── art.tsx        # Digital art creation
│   │   │   ├── music.tsx      # Music composition
│   │   │   ├── olympiad.tsx   # Competition preparation
│   │   │   └── workspace.tsx  # Student workspace
│   │   ├── services/          # External service integrations
│   │   │   ├── llmHintService.ts    # AI hint generation
│   │   │   ├── contentService.ts    # Educational content
│   │   │   └── firebaseConfig.ts    # Cloud storage setup
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useChildSafety.ts    # Safety and parental controls
│   │   │   ├── use-mobile.tsx       # Mobile responsiveness
│   │   │   └── use-toast.ts         # Notification system
│   │   └── __tests__/         # Test suites
│   └── index.html             # Main HTML template
├── server/                    # Express.js backend
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API route definitions
│   └── storage.ts            # Data storage abstraction
├── shared/                   # Shared TypeScript types
│   └── schema.ts            # Database schema and validation
├── docs/                    # Documentation
│   ├── PARENTAL_GUIDE.md   # Parent and educator guide
│   ├── COMPONENT_GUIDE.md  # Developer component reference
│   └── COLLABORATION.md   # Team development guide
├── .replit                 # Replit configuration
├── replit.md              # Project architecture documentation
└── package.json           # Dependencies and scripts
```

## 🏗️ Architecture Overview

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing  
- **State Management**: TanStack Query for server state + localforage for offline storage
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom kid-friendly design system
- **Build Tool**: Vite for fast development and optimized builds

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations
- **Storage**: Abstracted storage interface supporting both in-memory and database
- **API Design**: RESTful endpoints for users, progress, achievements, and content

### Key Dependencies

#### Core Framework
```json
{
  "react": "^18.x",
  "react-dom": "^18.x", 
  "typescript": "^5.x",
  "vite": "^5.x"
}
```

#### UI & Styling
```json
{
  "@radix-ui/react-*": "Latest",
  "tailwindcss": "^3.x",
  "tailwindcss-animate": "Latest",
  "lucide-react": "Latest",
  "framer-motion": "Latest"
}
```

#### State Management & Data
```json
{
  "@tanstack/react-query": "^5.x",
  "localforage": "Latest",
  "wouter": "Latest",
  "zod": "Latest",
  "react-hook-form": "Latest"
}
```

#### Educational Features
```json
{
  "tone": "Latest",                    // Music composition
  "react-piano": "Latest",             // Piano interface
  "react-sketch-canvas": "Latest",     // Digital art
  "vexflow": "Latest",                 // Music notation
  "@tensorflow/tfjs": "Latest",        // AI hints
  "react-timer-hook": "Latest"         // Timed challenges
}
```

#### Child Safety & Accessibility
```json
{
  "react-audio-player": "Latest",      // Audio content
  "bcryptjs": "Latest",                // Parental authentication
  "firebase": "Latest",                // COPPA-compliant sync
  "drizzle-orm": "Latest"              // Type-safe database
}
```

## 🔧 Configuration

### Environment Variables
The platform supports optional Firebase integration for cloud sync:

```bash
# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note**: The platform works fully offline without Firebase. Cloud sync is only enabled when all Firebase environment variables are properly configured.

## 🎮 Usage Examples

### Basic Navigation
```typescript
// Main dashboard with learning modules
import { Link } from "wouter";

<Link href="/math">
  <Card>Math Adventures</Card>
</Link>
```

### AI Learning Assistant
```typescript
// Educational hints for student problems
import HintAssistant from '@/components/HintAssistant';

<HintAssistant 
  problemContext="What is 15 + 27?"
  subject="math"
  grade={4}
  onHintGenerated={(hint) => console.log(hint)}
/>
```

### Text-to-Speech Integration
```typescript
// Make any content readable aloud
import SpeakableText from '@/components/SpeakableText';

<SpeakableText text="Learn about fractions with fun examples!">
  <div>Interactive fraction lesson content</div>
</SpeakableText>
```

### Progress Tracking
```typescript
// Monitor student learning progress
import { useChildSafety } from '@/hooks/useChildSafety';

const { currentUser, parentalSettings, updateProgress } = useChildSafety();
```

## 🧪 Testing

### Test Framework
- **Jest**: Primary testing framework
- **React Testing Library**: Component testing with child behavior simulation
- **Coverage**: Comprehensive test coverage including accessibility and safety

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:accessibility
npm run test:safety
npm run test:usability

# Generate coverage report
npm run test:coverage
```

### Test Categories
1. **Child Safety**: COPPA compliance, content filtering, parental controls
2. **Accessibility**: WCAG 2.1 AA standards, keyboard navigation, screen reader support
3. **Educational Effectiveness**: Age-appropriate content, learning progression
4. **Performance**: Child attention span optimization (< 2 second load times)

## 🚀 Deployment

### Replit Deployment
1. Click the "Deploy" button in your Replit interface
2. Choose "Autoscale" for production workloads
3. Configure custom domain if needed
4. Enable SSL (automatically handled)

### Manual Deployment
```bash
# Build production version
npm run build

# Files will be in dist/ directory
# Deploy to any static hosting service
```

## 🤝 Contributing

See [COLLABORATION.md](docs/COLLABORATION.md) for detailed team development guidelines including:
- Replit multiplayer setup
- Code style standards  
- Review processes
- Content curation workflow

## 📚 Documentation

- **[Parental Guide](docs/PARENTAL_GUIDE.md)** - Complete guide for parents and educators
- **[Component Reference](docs/COMPONENT_GUIDE.md)** - Detailed component documentation
- **[Collaboration Guide](docs/COLLABORATION.md)** - Team development processes

## 🛡️ Safety & Compliance

### Child Privacy (COPPA/GDPR-K)
- ✅ No personal information collection
- ✅ Anonymous user identification via UUID
- ✅ Parental consent for cloud sync
- ✅ Local-first data storage
- ✅ Right to data export and deletion

### Content Safety
- ✅ Educational source whitelisting (Khan Academy, CK-12, PBS Kids)
- ✅ Real-time content moderation
- ✅ Age-appropriate language filtering
- ✅ Academic integrity monitoring

### Accessibility
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility  
- ✅ High contrast color schemes
- ✅ Adjustable font sizes (14px minimum)

## 📊 Performance

### Optimizations
- **Bundle Size**: < 500KB gzipped for main bundle
- **Load Time**: < 2 seconds for child attention spans
- **Offline Support**: Full functionality without internet
- **Memory Usage**: Optimized for low-end devices

### Browser Support
- ✅ Chrome 88+ (recommended for schools)
- ✅ Safari 14+ (iPad compatibility)
- ✅ Firefox 85+
- ✅ Edge 88+

## 🎯 Educational Standards

### Curriculum Alignment
- **Math**: Common Core grades 3-6, AMC 8 preparation
- **Reading**: Lexile framework, age-appropriate complexity
- **Science**: NGSS standards, hands-on experiments
- **Arts**: National Core Arts Standards integration

### Learning Objectives
Each module includes clearly defined learning objectives mapped to grade-level standards with progress tracking and assessment tools.

## 📞 Support

### For Developers
- Review component documentation in `docs/COMPONENT_GUIDE.md`
- Check existing issues and testing framework
- Follow collaboration guidelines for team development

### For Educators
- Complete setup guide available in `docs/PARENTAL_GUIDE.md`
- Contact support for curriculum integration questions
- Access progress reporting and parent dashboard features

### For Parents  
- Safety features and controls explained in parental guide
- Child progress monitoring and time limit configuration
- Data privacy and export options

---

**Built with ❤️ for young learners using Replit's collaborative development platform**