import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

// POST register for an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - please login first' },
        { status: 401 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: session.id,
          eventId: params.id,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      );
    }

    // Check capacity
    if (event._count.registrations >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // If event is paid, create Stripe checkout session
    if (event.price > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const checkoutSession = await createCheckoutSession(
        event.id,
        event.title,
        event.price,
        session.id,
        `${baseUrl}/events/${event.id}?payment=success`,
        `${baseUrl}/events/${event.id}?payment=cancelled`
      );

      // Create pending registration
      await prisma.registration.create({
        data: {
          userId: session.id,
          eventId: params.id,
          status: 'PENDING',
          teamPreference: data.teamPreference,
          skills: data.skills || [],
          motivation: data.motivation,
          specialRequests: data.specialRequests,
          paymentId: checkoutSession.id,
        },
      });

      return NextResponse.json({
        checkoutUrl: checkoutSession.url,
        message: 'Please complete payment to confirm registration',
      });
    }

    // Free event - create confirmed registration
    const registration = await prisma.registration.create({
      data: {
        userId: session.id,
        eventId: params.id,
        status: 'CONFIRMED',
        teamPreference: data.teamPreference,
        skills: data.skills || [],
        motivation: data.motivation,
        specialRequests: data.specialRequests,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      registration,
      message: 'Successfully registered for the event!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}

// GET registrations for an event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    const registrations = await prisma.registration.findMany({
      where: { eventId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            skills: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if user is registered
    const userRegistration = session
      ? registrations.find((r) => r.userId === session.id)
      : null;

    return NextResponse.json({
      registrations,
      userRegistration,
      count: registrations.length,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}