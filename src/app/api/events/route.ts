import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const organizer = searchParams.get('organizer');
    const limit = searchParams.get('limit');

    const where: any = {};
    
    if (type) where.type = type;
    
    // Handle organizer filter
    if (organizer === 'me') {
      const session = await getSession();
      if (session) {
        where.organizerId = session.id;
        // Don't filter by status for own events
      } else {
        return NextResponse.json({ events: [] });
      }
    } else {
      // Default to published events for public listing
      if (status) where.status = status;
      else where.status = 'PUBLISHED';
    }

    const events = await prisma.event.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        prizes: true,
        scheduleItems: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            registrations: true,
            teams: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST create new event (organizers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Only organizers can create events' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status || 'DRAFT',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location,
        capacity: data.capacity,
        price: data.price || 0,
        currency: data.currency || 'USD',
        imageUrl: data.imageUrl,
        tags: data.tags || [],
        requirements: data.requirements || [],
        organizerId: session.id,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}