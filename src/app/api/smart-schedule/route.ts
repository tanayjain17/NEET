import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { smartScheduler } from '@/lib/smart-scheduler';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await smartScheduler.generateSmartSchedule(session.user.email);
    
    return NextResponse.json({
      success: true,
      data: schedule,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Smart schedule generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate smart schedule' },
      { status: 500 }
    );
  }
}