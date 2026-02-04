# 🚀 EventAI - AI-Powered Event Management Platform

An intelligent event management platform built with **Next.js 14**, **Tambo AI**, and **PostgreSQL** that enables users to discover, organize, and participate in hackathons, conferences, workshops, and meetups.

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?style=flat-square&logo=prisma)

## ✨ Features

### 🤖 AI-Powered Chat Assistant
- Natural language event discovery ("Show me upcoming hackathons")
- Smart teammate matching based on skills
- Event registration through conversation
- Personalized recommendations

### 📅 Event Management
- **Event Types**: Hackathons, Conferences, Workshops, Meetups
- **Rich Event Pages**: Schedule, prizes, participants, team chat
- **Registration System**: Free and paid events with Stripe integration
- **Organizer Dashboard**: Analytics, participant management

### 👥 Team Features
- AI-powered teammate matching
- Team formation and management
- Real-time event chat rooms
- Skill-based participant discovery

### 🔐 Authentication
- JWT-based session management
- Role-based access (Organizer/Attendee)
- Secure password hashing with bcrypt

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| AI Integration | Tambo AI |
| Payments | Stripe |
| Authentication | JWT (jose) |

## 📁 Project Structure

```
ai-event-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Login, register, logout, me
│   │   │   ├── events/        # CRUD events, registration
│   │   │   └── user/          # Profile, registrations
│   │   ├── chat/              # AI Chat interface
│   │   ├── dashboard/         # User dashboard
│   │   ├── events/            # Event listing & details
│   │   ├── login/             # Authentication
│   │   └── profile/           # User profile
│   ├── components/
│   │   ├── tambo/             # Tambo AI components
│   │   │   ├── ChatRoom.tsx
│   │   │   ├── EventAnalytics.tsx
│   │   │   ├── EventCalendar.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventList.tsx
│   │   │   ├── EventSchedule.tsx
│   │   │   ├── ParticipantList.tsx
│   │   │   ├── PrizeDisplay.tsx
│   │   │   ├── RegistrationForm.tsx
│   │   │   └── TeamMatcher.tsx
│   │   ├── Navbar.tsx
│   │   └── TamboWrapper.tsx   # Tambo provider setup
│   ├── lib/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── data.ts            # Mock data & schemas
│   │   ├── prisma.ts          # Database client
│   │   ├── seed.ts            # Database seeding
│   │   └── stripe.ts          # Payment integration
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── types/
│       └── index.ts           # TypeScript definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example               # Environment template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or [Neon](https://neon.tech) for serverless)
- [Tambo AI](https://tambo.co) API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-event-website.git
   cd ai-event-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Tambo AI
   NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
   
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   
   # Auth
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Database Schema

### Models

- **User**: Organizers and attendees with profiles
- **Event**: Hackathons, conferences, workshops, meetups
- **Registration**: User-event registrations
- **Team**: Hackathon teams with members
- **Prize**: Event prizes and awards
- **ScheduleItem**: Event agenda items
- **ChatMessage**: Real-time event chat

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Organizer | organizer@techcorp.com | password123 |
| Organizer | organizer@climatelab.org | password123 |
| Attendee | alex@email.com | password123 |
| Attendee | sarah@email.com | password123 |
| Attendee | mike@email.com | password123 |
| Attendee | priya@email.com | password123 |

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and get session |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Get current user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| POST | `/api/events` | Create event (organizer) |
| GET | `/api/events/[id]` | Get event details |
| PUT | `/api/events/[id]` | Update event |
| GET | `/api/events/[id]/schedule` | Get event schedule |
| GET | `/api/events/[id]/prizes` | Get event prizes |
| POST | `/api/events/[id]/register` | Register for event |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/registrations` | Get user's registrations |

## 🤖 Tambo AI Integration

The platform uses Tambo AI for intelligent UI generation. Registered components:

| Component | Description |
|-----------|-------------|
| `EventList` | Display filterable event cards |
| `TeamMatcher` | AI teammate suggestions |
| `EventSchedule` | Timeline view of event agenda |
| `PrizeDisplay` | Prize showcase with values |
| `ParticipantList` | Event participants grid |
| `EventCalendar` | Monthly calendar view |
| `EventAnalytics` | Registration analytics |
| `ChatRoom` | Real-time event chat |

### Available AI Tools

- `getEvents` - Fetch events with filters
- `getEventDetails` - Get full event info
- `registerForEvent` - Register user for event
- `getCurrentUser` - Get logged-in user
- `getMyRegistrations` - User's registered events
- `getMyEvents` - Organizer's created events
- `createEvent` - Create new event
- `updateProfile` - Update user profile

## 🎨 UI Components

All components are built with Tailwind CSS and support:
- Responsive design (mobile-first)
- Dark mode ready
- Loading skeletons
- Error states
- Streaming data support

## 📜 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed database
npm run db:setup     # Push + seed database
```

## 🔒 Security

- JWT tokens with 7-day expiration
- HTTP-only cookies for session storage
- Password hashing with bcrypt (10 rounds)
- Input validation with Zod schemas
- CORS protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_TAMBO_API_KEY=
DATABASE_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://your-domain.com
```

## 📝 License

MIT License - feel free to use this project for learning or building your own event platform.

## 🙏 Acknowledgments

- [Tambo AI](https://tambo.co) - Generative UI framework
- [Vercel](https://vercel.com) - Hosting platform
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Prisma](https://prisma.io) - Database ORM

---

Built with ❤️ using Next.js and Tambo AI
