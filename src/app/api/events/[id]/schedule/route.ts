import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// POST add schedule item to event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is the organizer
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.organizerId !== session.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this event' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const scheduleItem = await prisma.scheduleItem.create({
      data: {
        title: data.title,
        description: data.description || '',
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        location: data.location || '',
        speaker: data.speaker || '',
        order: data.order || 0,
        eventId: params.id,
      },
    });

    return NextResponse.json({ scheduleItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule item' },
      { status: 500 }
    );
  }
}

// GET schedule items for event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleItems = await prisma.scheduleItem.findMany({
      where: { eventId: params.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ scheduleItems });
  } catch (error) {
    console.error('Error fetching schedule items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule items' },
      { status: 500 }
    );
  }
}
