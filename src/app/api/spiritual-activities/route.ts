import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userId = '1';
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get today's activities
    const todayActivities = await prisma.spiritualActivity.findMany({
      where: {
        userId,
        date: new Date().toISOString().split('T')[0]
      }
    });

    // Calculate progress
    const weeklyActivities = await prisma.spiritualActivity.findMany({
      where: {
        userId,
        date: { gte: startOfWeek },
        completed: true
      }
    });

    const monthlyActivities = await prisma.spiritualActivity.findMany({
      where: {
        userId,
        date: { gte: startOfMonth },
        completed: true
      }
    });

    // Calculate streak
    const recentActivities = await prisma.spiritualActivity.findMany({
      where: { userId, completed: true },
      orderBy: { date: 'desc' },
      take: 30
    });

    let streak = 0;
    const today_str = new Date().toISOString().split('T')[0];
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasActivity = recentActivities.some(a => 
        a.date.toISOString().split('T')[0] === dateStr
      );
      
      if (hasActivity) {
        streak++;
      } else if (dateStr !== today_str) {
        break;
      }
    }

    const progress = {
      daily: Math.round((todayActivities.filter(a => a.completed).length / 3) * 100),
      weekly: Math.round((weeklyActivities.length / 21) * 100), // 3 activities * 7 days
      monthly: Math.round((monthlyActivities.length / 93) * 100), // 3 activities * 31 days
      streak
    };

    return NextResponse.json({
      success: true,
      activities: todayActivities,
      progress
    });
  } catch (error) {
    console.error('Spiritual activities GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { activityType, duration, completed, notes } = await request.json();
    const userId = '1';
    const today = new Date().toISOString().split('T')[0];

    const activity = await prisma.spiritualActivity.upsert({
      where: {
        userId_date_activityType: {
          userId,
          date: new Date(today),
          activityType
        }
      },
      update: {
        duration,
        completed,
        notes,
        updatedAt: new Date()
      },
      create: {
        userId,
        date: new Date(today),
        activityType,
        duration,
        completed,
        notes
      }
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Spiritual activities POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save activity' }, { status: 500 });
  }
}