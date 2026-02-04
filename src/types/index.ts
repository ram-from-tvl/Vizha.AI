export interface User {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'attendee';
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'conference' | 'workshop' | 'meetup';
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  registeredCount: number;
  tags: string[];
  organizer: User;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  currency: 'USD' | 'EUR' | 'GBP';
  requirements?: string[];
  prizes?: Prize[];
  schedule?: ScheduleItem[];
}

export interface Prize {
  rank: number;
  title: string;
  description: string;
  value: number;
  currency: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  speaker?: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: string;
  teamName?: string;
  teamMembers?: string[];
  specialRequests?: string;
}

export interface Team {
  id: string;
  name: string;
  eventId: string;
  members: User[];
  project?: Project;
  status: 'forming' | 'active' | 'submitted';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  eventId: string;
  timestamp: string;
  type: 'text' | 'system' | 'announcement';
}

// Tambo AI specific types
export interface TamboComponentProps {
  [key: string]: any;
}

export interface TamboComponent {
  name: string;
  description: string;
  component: React.ComponentType<any>;
  propsSchema: any; // Zod schema
}

export interface TamboTool {
  name: string;
  description: string;
  parameters: any; // JSON schema
  execute: (params: any) => Promise<any>;
}

export interface EventFilters {
  type?: Event['type'];
  status?: Event['status'];
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}