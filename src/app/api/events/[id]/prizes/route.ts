import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// POST add prize to event
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

    const prize = await prisma.prize.create({
      data: {
        rank: data.rank,
        title: data.title,
        description: data.description || '',
        value: data.value,
        currency: data.currency || 'USD',
        eventId: params.id,
      },
    });

    return NextResponse.json({ prize }, { status: 201 });
  } catch (error) {
    console.error('Error creating prize:', error);
    return NextResponse.json(
      { error: 'Failed to create prize' },
      { status: 500 }
    );
  }
}

// GET prizes for event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prizes = await prisma.prize.findMany({
      where: { eventId: params.id },
      orderBy: { rank: 'asc' },
    });

    return NextResponse.json({ prizes });
  } catch (error) {
    console.error('Error fetching prizes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prizes' },
      { status: 500 }
    );
  }
}
