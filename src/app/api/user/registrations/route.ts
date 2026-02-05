import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET user's registrations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: session.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
            startDate: true,
            endDate: true,
            location: true,
            imageUrl: true,
            organizer: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get team information for each registration
    const registrationsWithTeams = await Promise.all(
      registrations.map(async (reg) => {
        const teamMember = await prisma.teamMember.findFirst({
          where: { userId: session.id },
          include: {
            team: {
              select: {
                id: true,
                name: true,
                status: true,
                eventId: true,
              },
            },
          },
        });
        
        // Only include team if it's for this event
        const team = teamMember?.team.eventId === reg.eventId ? teamMember.team : null;
        
        return {
          ...reg,
          team,
        };
      })
    );

    return NextResponse.json({ registrations: registrationsWithTeams });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
