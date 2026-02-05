'use client';

import React, { useState, useEffect } from 'react';
import { TamboProvider } from '@tambo-ai/react';
import { z } from 'zod';
import { Navbar } from './Navbar';

// Import Tambo components
import { EventList } from './tambo/EventList';
import { TeamMatcher } from './tambo/TeamMatcher';
import { EventSchedule } from './tambo/EventSchedule';
import { PrizeDisplay } from './tambo/PrizeDisplay';
import { ParticipantList } from './tambo/ParticipantList';
import { EventCalendar } from './tambo/EventCalendar';
import { EventAnalytics } from './tambo/EventAnalytics';

// Define Tambo components with Zod schemas
const tamboComponents = [
  {
    name: 'EventList',
    description: 'Display a list of events with filtering options. Use this to show hackathons, conferences, workshops, and meetups to the user.',
    component: EventList,
    propsSchema: z.object({
      eventType: z.enum(['HACKATHON', 'CONFERENCE', 'WORKSHOP', 'MEETUP']).optional().describe('Filter by event type'),
      limit: z.number().optional().describe('Maximum number of events to show'),
      showFilters: z.boolean().optional().describe('Show filter controls'),
    }),
  },
  {
    name: 'TeamMatcher',
    description: 'AI-powered component to find and suggest teammates for hackathons based on skills. Use this when a user wants to find team members.',
    component: TeamMatcher,
    propsSchema: z.object({
      eventId: z.string().describe('The event ID for team matching'),
      userSkills: z.array(z.string()).optional().describe('Current user skills to match'),
    }),
  },
  {
    name: 'EventSchedule',
    description: 'Display event schedule with timeline view showing sessions, talks, and activities. Use when user asks about event agenda or schedule.',
    component: EventSchedule,
    propsSchema: z.object({
      eventId: z.string().describe('The event ID'),
      scheduleItems: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        startTime: z.string(),
        endTime: z.string(),
        location: z.string().optional(),
        speaker: z.string().optional(),
      })).describe('Schedule items to display'),
    }),
  },
  {
    name: 'PrizeDisplay',
    description: 'Show prizes and awards for hackathon events with values and descriptions. Use when user asks about prizes or awards.',
    component: PrizeDisplay,
    propsSchema: z.object({
      prizes: z.array(z.object({
        rank: z.number(),
        title: z.string(),
        description: z.string(),
        value: z.number(),
        currency: z.string(),
      })).describe('List of prizes'),
    }),
  },
  {
    name: 'ParticipantList',
    description: 'Display list of event participants with team status. Use when user asks to see who registered or participants.',
    component: ParticipantList,
    propsSchema: z.object({
      eventId: z.string().describe('The event ID'),
      showTeams: z.boolean().optional().describe('Show team information'),
    }),
  },
  {
    name: 'EventCalendar',
    description: 'Calendar view showing events across months with type indicators. Use when user wants to see events in calendar format.',
    component: EventCalendar,
    propsSchema: z.object({
      month: z.number().optional().describe('Month (0-11)'),
      year: z.number().optional().describe('Year'),
      eventType: z.enum(['HACKATHON', 'CONFERENCE', 'WORKSHOP', 'MEETUP']).optional().describe('Filter by event type'),
    }),
  },
  {
    name: 'EventAnalytics',
    description: 'Analytics dashboard showing registrations, revenue, and trends. Use when organizer asks for event statistics or analytics.',
    component: EventAnalytics,
    propsSchema: z.object({
      eventId: z.string().optional().describe('Specific event ID or leave empty for all events'),
      organizerId: z.string().optional().describe('Organizer ID'),
    }),
  },
];

// Tool functions
const getEvents = async (type?: string, status?: string, limit?: number) => {
  const queryParams = new URLSearchParams();
  if (type) queryParams.append('type', type);
  if (status) queryParams.append('status', status);
  if (limit) queryParams.append('limit', limit.toString());
  
  const response = await fetch(`/api/events?${queryParams.toString()}`);
  const data = await response.json();
  return data.events || [];
};

const getEventDetails = async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}`);
  const data = await response.json();
  return data.event;
};

const registerForEvent = async (eventId: string, skills?: string[], motivation?: string) => {
  const response = await fetch(`/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skills: skills || [],
      motivation: motivation || '',
      teamPreference: 'looking',
    }),
  });
  return response.json();
};

const getCurrentUser = async () => {
  const response = await fetch('/api/auth/me');
  if (!response.ok) return { error: 'Not logged in', loggedIn: false };
  const data = await response.json();
  return { ...data.user, loggedIn: true };
};

const getMyRegistrations = async () => {
  const response = await fetch('/api/user/registrations');
  if (!response.ok) return { error: 'Not logged in', registrations: [] };
  const data = await response.json();
  return data.registrations || [];
};

const getMyEvents = async () => {
  const response = await fetch('/api/events?organizer=me');
  const data = await response.json();
  return data.events || [];
};

const createEvent = async (
  title: string,
  description: string,
  type: string,
  startDate: string,
  endDate: string,
  location: string,
  capacity: number,
  price?: number
) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      capacity,
      price: price || 0,
      status: 'DRAFT',
    }),
  });
  return response.json();
};

const updateProfile = async (name?: string, bio?: string, skills?: string[], interests?: string[]) => {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      bio,
      skills,
      interests,
    }),
  });
  return response.json();
};

// Define Tambo tools with proper TamboTool format
const tamboTools = [
  {
    name: 'getEvents',
    description: 'Fetch list of events from the database with optional filters for type and status. Use this to show users available events.',
    tool: getEvents,
    toolSchema: z.function()
      .args(
        z.string().optional().describe('Event type: HACKATHON, CONFERENCE, WORKSHOP, or MEETUP'),
        z.string().optional().describe('Event status: DRAFT, PUBLISHED, ONGOING, or COMPLETED'),
        z.number().optional().describe('Maximum number of events to return')
      )
      .returns(z.array(z.any())),
  },
  {
    name: 'getEventDetails',
    description: 'Get detailed information about a specific event including prizes, schedule, and participants',
    tool: getEventDetails,
    toolSchema: z.function()
      .args(z.string().describe('The event ID to get details for'))
      .returns(z.any()),
  },
  {
    name: 'registerForEvent',
    description: 'Register the current logged-in user for an event. User must be logged in.',
    tool: registerForEvent,
    toolSchema: z.function()
      .args(
        z.string().describe('The event ID to register for'),
        z.array(z.string()).optional().describe('User skills'),
        z.string().optional().describe('Motivation for attending')
      )
      .returns(z.any()),
  },
  {
    name: 'getCurrentUser',
    description: 'Get information about the currently logged in user including their role (ORGANIZER or ATTENDEE), name, email, skills, and interests',
    tool: getCurrentUser,
    toolSchema: z.function()
      .args()
      .returns(z.any()),
  },
  {
    name: 'getMyRegistrations',
    description: 'Get the list of events the current user is registered for. Only works for logged-in users.',
    tool: getMyRegistrations,
    toolSchema: z.function()
      .args()
      .returns(z.array(z.any())),
  },
  {
    name: 'getMyEvents',
    description: 'Get events created by the current organizer. Only works for logged-in organizers.',
    tool: getMyEvents,
    toolSchema: z.function()
      .args()
      .returns(z.array(z.any())),
  },
  {
    name: 'createEvent',
    description: 'Create a new event. Only organizers can use this. Returns the created event.',
    tool: createEvent,
    toolSchema: z.function()
      .args(
        z.string().describe('Event title'),
        z.string().describe('Event description'),
        z.string().describe('Event type: HACKATHON, CONFERENCE, WORKSHOP, or MEETUP'),
        z.string().describe('Start date in ISO format'),
        z.string().describe('End date in ISO format'),
        z.string().describe('Event location'),
        z.number().describe('Maximum capacity'),
        z.number().optional().describe('Ticket price (0 for free)')
      )
      .returns(z.any()),
  },
  {
    name: 'updateProfile',
    description: 'Update the current user profile including name, bio, skills, and interests',
    tool: updateProfile,
    toolSchema: z.function()
      .args(
        z.string().optional().describe('New name'),
        z.string().optional().describe('New bio'),
        z.array(z.string()).optional().describe('Skills list'),
        z.array(z.string()).optional().describe('Interests list')
      )
      .returns(z.any()),
  },
];

interface TamboWrapperProps {
  children: React.ReactNode;
}

export function TamboWrapper({ children }: TamboWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  // No API key - render without Tambo
  if (!apiKey) {
    console.warn('Tambo API key not found');
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">© 2024 AI Event Management Platform. Powered by Tambo AI.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Always wrap with TamboProvider for consistent context
  // Use suppressHydrationWarning to avoid SSR/CSR mismatch warnings
  return (
    <TamboProvider
      apiKey={apiKey}
      components={tamboComponents}
      tools={tamboTools}
    >
      <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {mounted ? children : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">© 2024 AI Event Management Platform. Powered by Tambo AI.</p>
          </div>
        </footer>
      </div>
    </TamboProvider>
  );
}
