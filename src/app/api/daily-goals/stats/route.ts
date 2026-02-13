import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DailyGoalsRepository } from '@/lib/repositories/daily-goals-repository'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const stats = await DailyGoalsRepository.getQuestionStats(session.user.email)
    
    // Also get from question analytics for consistency
    const { QuestionAnalyticsRepository } = await import('@/lib/repositories/question-analytics-repository')
    const analyticsStats = await QuestionAnalyticsRepository.getCurrentStats()
    
    // Merge stats with analytics data
    const mergedStats = {
      ...stats,
      daily: analyticsStats.daily || stats.daily,
      weekly: analyticsStats.weekly || stats.weekly,
      monthly: analyticsStats.monthly || stats.monthly,
      lifetime: analyticsStats.lifetime || stats.lifetime
    }

    return NextResponse.json({
      success: true,
      data: mergedStats
    })

  } catch (error) {
    console.error('Error fetching question stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}