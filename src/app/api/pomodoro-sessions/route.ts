import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.pomodoroSession.findMany({
      where: { userId: session.user.email },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Calculate analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaySessions = sessions.filter(s => new Date(s.createdAt) >= today)
    const totalFocusTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const avgFocusScore = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / sessions.length 
      : 0

    return NextResponse.json({
      success: true,
      data: sessions,
      analytics: {
        totalSessions: sessions.length,
        todaySessions: todaySessions.length,
        totalFocusTime: Math.round(totalFocusTime),
        avgFocusScore: Math.round(avgFocusScore * 10) / 10
      }
    })
  } catch (error) {
    console.error('Error fetching pomodoro sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      subject, 
      chapter, 
      duration, 
      sessionType,
      completed, 
      focusScore, 
      productivity, 
      notes,
      startTime,
      endTime
    } = body

    const pomodoroSession = await prisma.pomodoroSession.create({
      data: {
        userId: session.user.email,
        subject: subject || 'General Study',
        chapter: chapter || '',
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : (completed ? new Date() : null),
        duration: duration || 25,
        completed: completed || false,
        focusScore: focusScore || 8,
        productivity: productivity || 8,
        notes: notes || `${sessionType || 'Standard'} session completed`
      }
    })

    return NextResponse.json({ success: true, data: pomodoroSession })
  } catch (error) {
    console.error('Error creating pomodoro session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}