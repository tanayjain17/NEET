import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { QuestionAnalyticsRepository } from '@/lib/repositories/question-analytics-repository'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Sync question analytics from daily goals
    await QuestionAnalyticsRepository.syncFromDailyGoals()

    return NextResponse.json({
      success: true,
      message: 'Analytics synced successfully'
    })

  } catch (error) {
    console.error('Error syncing analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}