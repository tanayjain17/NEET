import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RealTimeSyncService } from '@/lib/real-time-sync'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { date, updates } = await request.json()

    if (!date || !updates) {
      return NextResponse.json(
        { error: 'Date and updates are required' },
        { status: 400 }
      )
    }

    const goalDate = new Date(date)
    const updatedGoal = await RealTimeSyncService.syncDailyGoals(session.user.email, goalDate, updates)

    return NextResponse.json({
      success: true,
      data: updatedGoal
    })

  } catch (error) {
    console.error('Error syncing daily goals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}