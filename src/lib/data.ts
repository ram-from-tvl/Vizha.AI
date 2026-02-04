import { z } from 'zod';
import { Event, Registration, Team, User, EventFilters } from '@/types';

// Mock data for demonstration
export const mockHackathons: Event[] = [
  {
    id: '1',
    title: 'AI Innovation Challenge 2024',
    description: 'Build the next generation of AI applications using cutting-edge technologies. Compete for $50,000 in prizes and mentorship opportunities.',
    type: 'hackathon',
    startDate: '2024-03-15T09:00:00Z',
    endDate: '2024-03-17T18:00:00Z',
    location: 'San Francisco Tech Hub',
    capacity: 500,
    registeredCount: 347,
    tags: ['AI', 'Machine Learning', 'Innovation', 'Startup'],
    organizer: {
      id: 'org1',
      name: 'TechCorp Events',
      email: 'events@techcorp.com',
      role: 'organizer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    status: 'published',
    price: 0,
    currency: 'USD',
    requirements: ['Laptop', 'Basic programming knowledge', 'Team of 2-4 members'],
    prizes: [
      { rank: 1, title: 'Grand Prize', description: 'Cash + Mentorship', value: 25000, currency: 'USD' },
      { rank: 2, title: 'Runner-up', description: 'Cash Prize', value: 15000, currency: 'USD' },
      { rank: 3, title: 'Third Place', description: 'Cash Prize', value: 10000, currency: 'USD' }
    ],
    schedule: [
      {
        id: 's1',
        title: 'Opening Ceremony',
        description: 'Welcome and rules explanation',
        startTime: '2024-03-15T09:00:00Z',
        endTime: '2024-03-15T10:00:00Z',
        location: 'Main Hall',
        speaker: 'John Smith, CEO TechCorp'
      },
      {
        id: 's2',
        title: 'Team Formation',
        description: 'Find your teammates',
        startTime: '2024-03-15T10:00:00Z',
        endTime: '2024-03-15T11:00:00Z',
        location: 'Networking Area'
      }
    ]
  },
  {
    id: '2',
    title: 'Climate Tech Solutions Hackathon',
    description: 'Create innovative solutions to combat climate change. Focus on renewable energy, carbon capture, and sustainable technologies.',
    type: 'hackathon',
    startDate: '2024-04-20T08:00:00Z',
    endDate: '2024-04-22T20:00:00Z',
    location: 'Green Innovation Center, Austin',
    capacity: 300,
    registeredCount: 156,
    tags: ['Climate Tech', 'Sustainability', 'Green Energy', 'Environment'],
    organizer: {
      id: 'org2',
      name: 'Climate Innovation Lab',
      email: 'hello@climatelab.org',
      role: 'organizer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    status: 'published',
    price: 25,
    currency: 'USD',
    requirements: ['Interest in climate solutions', 'Any technical background welcome'],
    prizes: [
      { rank: 1, title: 'Climate Champion', description: 'Funding + Incubation', value: 100000, currency: 'USD' },
      { rank: 2, title: 'Innovation Award', description: 'Development Grant', value: 50000, currency: 'USD' }
    ]
  }
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    role: 'attendee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'attendee',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b0189b87?w=100&h=100&fit=crop&crop=face'
  }
];

// Validation Schemas for Tambo Components
export const eventValidationSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  type: z.enum(['hackathon', 'conference', 'workshop', 'meetup']),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().min(5),
  capacity: z.number().min(1).max(10000),
  price: z.number().min(0),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  tags: z.array(z.string()).min(1).max(10)
});

export const registrationSchema = z.object({
  eventId: z.string(),
  teamName: z.string().optional(),
  specialRequests: z.string().optional()
});

export const teamFormationSchema = z.object({
  name: z.string().min(3).max(50),
  eventId: z.string(),
  lookingForSkills: z.array(z.string()).optional(),
  projectIdea: z.string().optional()
});

export const filterSchema = z.object({
  type: z.enum(['hackathon', 'conference', 'workshop', 'meetup']).optional(),
  status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']).optional(),
  dateRange: z.object({
    start: z.string(),
    end: z.string()
  }).optional(),
  location: z.string().optional(),
  priceRange: z.object({
    min: z.number(),
    max: z.number()
  }).optional(),
  tags: z.array(z.string()).optional()
});