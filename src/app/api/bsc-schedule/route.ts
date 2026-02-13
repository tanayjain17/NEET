import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedules = await prisma.bSCSchedule.findMany({
      where: { userId: session.user.email },
      orderBy: { examDate: 'asc' }
    });

    return NextResponse.json({ data: schedules });
  } catch (error) {
    console.error('Error fetching BSc schedules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { semester, subject, examDate, syllabusLoad, priority } = body;

    const schedule = await prisma.bSCSchedule.create({
      data: {
        userId: session.user.email,
        semester: semester || 1,
        subject: subject || '',
        examDate: new Date(examDate),
        syllabusLoad: syllabusLoad || 5,
        priority: priority || 'medium',
        status: 'pending'
      }
    });

    return NextResponse.json({ data: schedule });
  } catch (error) {
    console.error('Error creating BSc schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, ...updateData } = body;

    const schedule = await prisma.bSCSchedule.update({
      where: { 
        id,
        userId: session.user.email // Ensure user can only update their own schedules
      },
      data: {
        ...updateData,
        status: status || 'pending'
      }
    });

    return NextResponse.json({ data: schedule });
  } catch (error) {
    console.error('Error updating BSc schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}