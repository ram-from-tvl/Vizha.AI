import { PrismaClient, UserRole, EventType, EventStatus, RegistrationStatus, TeamStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Organizers
  const organizer1 = await prisma.user.create({
    data: {
      email: 'organizer@techcorp.com',
      password: hashedPassword,
      name: 'John Smith',
      role: UserRole.ORGANIZER,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'CEO of TechCorp Events, passionate about bringing innovators together.',
      skills: ['Event Management', 'Technology', 'Leadership'],
      interests: ['AI', 'Startups', 'Innovation'],
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      email: 'organizer@climatelab.org',
      password: hashedPassword,
      name: 'Emma Green',
      role: UserRole.ORGANIZER,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      bio: 'Founder of Climate Innovation Lab, dedicated to sustainable tech solutions.',
      skills: ['Sustainability', 'Climate Tech', 'Fundraising'],
      interests: ['Environment', 'Green Energy', 'Social Impact'],
    },
  });

  console.log('✅ Created organizers');

  // Attendees
  const attendee1 = await prisma.user.create({
    data: {
      email: 'alex@email.com',
      password: hashedPassword,
      name: 'Alex Chen',
      role: UserRole.ATTENDEE,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Full-stack developer with a passion for AI and machine learning.',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
      interests: ['AI', 'Web Development', 'Open Source'],
    },
  });

  const attendee2 = await prisma.user.create({
    data: {
      email: 'sarah@email.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: UserRole.ATTENDEE,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'UX designer and frontend developer, love creating beautiful interfaces.',
      skills: ['UI/UX Design', 'React', 'Figma', 'CSS'],
      interests: ['Design', 'User Experience', 'Accessibility'],
    },
  });

  const attendee3 = await prisma.user.create({
    data: {
      email: 'mike@email.com',
      password: hashedPassword,
      name: 'Mike Chen',
      role: UserRole.ATTENDEE,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      bio: 'Data scientist specializing in NLP and computer vision.',
      skills: ['Python', 'TensorFlow', 'Data Science', 'NLP'],
      interests: ['Machine Learning', 'Data Analysis', 'Research'],
    },
  });

  const attendee4 = await prisma.user.create({
    data: {
      email: 'priya@email.com',
      password: hashedPassword,
      name: 'Priya Patel',
      role: UserRole.ATTENDEE,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face',
      bio: 'Backend engineer with expertise in distributed systems.',
      skills: ['Go', 'Kubernetes', 'AWS', 'PostgreSQL'],
      interests: ['Cloud Computing', 'DevOps', 'Microservices'],
    },
  });

  console.log('✅ Created attendees');

  // Create Events (Hackathons)
  const event1 = await prisma.event.create({
    data: {
      title: 'AI Innovation Challenge 2026',
      description: 'Build the next generation of AI applications using cutting-edge technologies. Compete for $50,000 in prizes and mentorship opportunities from top industry leaders. Join 500+ developers, designers, and entrepreneurs for an exciting 48-hour hackathon experience!',
      type: EventType.HACKATHON,
      status: EventStatus.PUBLISHED,
      startDate: new Date('2026-03-15T09:00:00Z'),
      endDate: new Date('2026-03-17T18:00:00Z'),
      location: 'San Francisco Tech Hub, 123 Innovation Blvd',
      capacity: 500,
      price: 0,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      tags: ['AI', 'Machine Learning', 'Innovation', 'Startup', 'Tech'],
      requirements: ['Laptop required', 'Basic programming knowledge', 'Team of 2-4 members'],
      organizerId: organizer1.id,
    },
  });

  // Add schedule items for event1
  await prisma.scheduleItem.createMany({
    data: [
      {
        eventId: event1.id,
        title: 'Opening Ceremony',
        description: 'Welcome speech and rules explanation',
        startTime: new Date('2026-03-15T09:00:00Z'),
        endTime: new Date('2026-03-15T10:00:00Z'),
        location: 'Main Hall',
        speaker: 'John Smith, CEO TechCorp',
        order: 1,
      },
      {
        eventId: event1.id,
        title: 'Team Formation & Ideation',
        description: 'Find your teammates and brainstorm ideas',
        startTime: new Date('2026-03-15T10:00:00Z'),
        endTime: new Date('2026-03-15T12:00:00Z'),
        location: 'Networking Area',
        order: 2,
      },
      {
        eventId: event1.id,
        title: 'Hacking Begins',
        description: 'Start building your projects',
        startTime: new Date('2026-03-15T12:00:00Z'),
        endTime: new Date('2026-03-17T12:00:00Z'),
        location: 'Coding Zones',
        order: 3,
      },
      {
        eventId: event1.id,
        title: 'Final Presentations',
        description: 'Demo your projects to judges',
        startTime: new Date('2026-03-17T14:00:00Z'),
        endTime: new Date('2026-03-17T17:00:00Z'),
        location: 'Main Stage',
        order: 4,
      },
      {
        eventId: event1.id,
        title: 'Awards Ceremony',
        description: 'Winners announcement and closing',
        startTime: new Date('2026-03-17T17:00:00Z'),
        endTime: new Date('2026-03-17T18:00:00Z'),
        location: 'Main Stage',
        speaker: 'John Smith',
        order: 5,
      },
    ],
  });

  // Add prizes for event1
  await prisma.prize.createMany({
    data: [
      {
        eventId: event1.id,
        rank: 1,
        title: 'Grand Prize',
        description: 'Cash prize + 3 months mentorship from industry experts',
        value: 25000,
        currency: 'USD',
      },
      {
        eventId: event1.id,
        rank: 2,
        title: 'Runner-up',
        description: 'Cash prize + startup accelerator access',
        value: 15000,
        currency: 'USD',
      },
      {
        eventId: event1.id,
        rank: 3,
        title: 'Third Place',
        description: 'Cash prize + cloud credits',
        value: 10000,
        currency: 'USD',
      },
    ],
  });

  console.log('✅ Created AI Innovation Challenge');

  const event2 = await prisma.event.create({
    data: {
      title: 'Climate Tech Solutions Hackathon',
      description: 'Create innovative solutions to combat climate change! Focus on renewable energy, carbon capture, sustainable agriculture, and green technologies. Win up to $100,000 in funding and get your solution incubated by leading climate VCs.',
      type: EventType.HACKATHON,
      status: EventStatus.PUBLISHED,
      startDate: new Date('2026-04-20T08:00:00Z'),
      endDate: new Date('2026-04-22T20:00:00Z'),
      location: 'Green Innovation Center, 456 Eco Drive, Austin TX',
      capacity: 300,
      price: 25,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800',
      tags: ['Climate Tech', 'Sustainability', 'Green Energy', 'Environment', 'Social Impact'],
      requirements: ['Interest in climate solutions', 'Any technical background welcome', 'Individual or team participation'],
      organizerId: organizer2.id,
    },
  });

  // Add schedule items for event2
  await prisma.scheduleItem.createMany({
    data: [
      {
        eventId: event2.id,
        title: 'Climate Keynote',
        description: 'State of climate tech and opportunities',
        startTime: new Date('2026-04-20T08:00:00Z'),
        endTime: new Date('2026-04-20T09:30:00Z'),
        location: 'Auditorium',
        speaker: 'Emma Green, Climate Lab Founder',
        order: 1,
      },
      {
        eventId: event2.id,
        title: 'Problem Statements Workshop',
        description: 'Choose your climate challenge',
        startTime: new Date('2026-04-20T09:30:00Z'),
        endTime: new Date('2026-04-20T11:00:00Z'),
        location: 'Workshop Rooms',
        order: 2,
      },
      {
        eventId: event2.id,
        title: 'Building Phase',
        description: 'Create your climate solution',
        startTime: new Date('2026-04-20T11:00:00Z'),
        endTime: new Date('2026-04-22T15:00:00Z'),
        location: 'Innovation Labs',
        order: 3,
      },
      {
        eventId: event2.id,
        title: 'Pitch Competition',
        description: 'Present to VC judges',
        startTime: new Date('2026-04-22T16:00:00Z'),
        endTime: new Date('2026-04-22T19:00:00Z'),
        location: 'Main Stage',
        order: 4,
      },
    ],
  });

  // Add prizes for event2
  await prisma.prize.createMany({
    data: [
      {
        eventId: event2.id,
        rank: 1,
        title: 'Climate Champion',
        description: 'Seed funding + 6-month incubation program',
        value: 100000,
        currency: 'USD',
      },
      {
        eventId: event2.id,
        rank: 2,
        title: 'Innovation Award',
        description: 'Development grant + mentorship',
        value: 50000,
        currency: 'USD',
      },
      {
        eventId: event2.id,
        rank: 3,
        title: 'Community Impact',
        description: 'Grant for community implementation',
        value: 25000,
        currency: 'USD',
      },
    ],
  });

  console.log('✅ Created Climate Tech Hackathon');

  // Create registrations
  await prisma.registration.createMany({
    data: [
      {
        userId: attendee1.id,
        eventId: event1.id,
        status: RegistrationStatus.CONFIRMED,
        teamPreference: 'looking',
        skills: ['React', 'Node.js', 'Python'],
        motivation: 'I want to build an AI-powered education platform',
      },
      {
        userId: attendee2.id,
        eventId: event1.id,
        status: RegistrationStatus.CONFIRMED,
        teamPreference: 'looking',
        skills: ['UI/UX Design', 'React', 'Figma'],
        motivation: 'Excited to design innovative AI interfaces',
      },
      {
        userId: attendee3.id,
        eventId: event1.id,
        status: RegistrationStatus.CONFIRMED,
        teamPreference: 'looking',
        skills: ['Python', 'TensorFlow', 'NLP'],
        motivation: 'Want to work on cutting-edge ML projects',
      },
      {
        userId: attendee4.id,
        eventId: event2.id,
        status: RegistrationStatus.CONFIRMED,
        teamPreference: 'forming',
        skills: ['Go', 'AWS', 'Kubernetes'],
        motivation: 'Passionate about building sustainable tech solutions',
      },
    ],
  });

  console.log('✅ Created registrations');

  // Create a team for event1
  const team1 = await prisma.team.create({
    data: {
      name: 'AI Innovators',
      status: TeamStatus.ACTIVE,
      eventId: event1.id,
      projectName: 'EduAI - Smart Learning Assistant',
      projectDesc: 'An AI-powered learning assistant that adapts to each student\'s learning style',
      technologies: ['React', 'Python', 'OpenAI', 'PostgreSQL'],
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, userId: attendee1.id, role: 'leader' },
      { teamId: team1.id, userId: attendee2.id, role: 'member' },
    ],
  });

  console.log('✅ Created teams');

  // Add some chat messages
  await prisma.chatMessage.createMany({
    data: [
      {
        userId: attendee1.id,
        eventId: event1.id,
        content: 'Hey everyone! Looking for a team. I have experience with React and Python.',
        channel: 'general',
      },
      {
        userId: attendee2.id,
        eventId: event1.id,
        content: 'Hi Alex! I\'m a designer looking for developers. Want to team up?',
        channel: 'general',
      },
      {
        userId: attendee3.id,
        eventId: event1.id,
        content: 'I can help with ML models if any team needs a data scientist!',
        channel: 'general',
      },
    ],
  });

  console.log('✅ Created chat messages');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('');
  console.log('🔑 Organizers:');
  console.log('   Email: organizer@techcorp.com | Password: password123');
  console.log('   Email: organizer@climatelab.org | Password: password123');
  console.log('');
  console.log('👤 Attendees:');
  console.log('   Email: alex@email.com | Password: password123');
  console.log('   Email: sarah@email.com | Password: password123');
  console.log('   Email: mike@email.com | Password: password123');
  console.log('   Email: priya@email.com | Password: password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });