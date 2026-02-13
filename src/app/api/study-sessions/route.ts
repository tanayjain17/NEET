import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StudySessionTracker } from '@/lib/study-session-tracker'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'progress-stats') {
      const stats = await StudySessionTracker.getProgressStats(session.user.email)
      return NextResponse.json({ success: true, data: stats })
    }

    if (action === 'praise-message') {
      const hoursCompleted = parseFloat(searchParams.get('hours') || '0')
      const targetHours = parseFloat(searchParams.get('target') || '8')
      const message = await StudySessionTracker.getPraiseMessage(session.user.email, hoursCompleted, targetHours)
      return NextResponse.json({ success: true, data: message })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Study sessions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { action, ...data } = await request.json()

    if (action === 'start-session') {
      const studySession = await StudySessionTracker.startSession(
        session.user.email,
        data.subject,
        data.chapter
      )
      return NextResponse.json({ success: true, data: studySession })
    }

    if (action === 'end-session') {
      const studySession = await StudySessionTracker.endSession(
        session.user.email,
        data.sessionId,
        {
          focusScore: data.focusScore,
          productivity: data.productivity,
          questionsAttempted: data.questionsAttempted,
          questionsCorrect: data.questionsCorrect,
          breaksTaken: data.breaksTaken,
          notes: data.notes
        }
      )
      return NextResponse.json({ success: true, data: studySession })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Study sessions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}