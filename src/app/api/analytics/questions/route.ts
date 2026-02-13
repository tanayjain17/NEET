import { NextRequest, NextResponse } from 'next/server'
import { QuestionAnalyticsRepository } from '@/lib/repositories/question-analytics-repository'

/**
 * GET /api/analytics/questions
 * Get question count analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'
    const days = parseInt(searchParams.get('days') || '30')
    const weeks = parseInt(searchParams.get('weeks') || '12')
    const months = parseInt(searchParams.get('months') || '12')

    switch (type) {
      case 'summary':
        try {
          const stats = await QuestionAnalyticsRepository.getCurrentStats()
          return NextResponse.json({
            today: { daily: stats.daily, weekly: stats.weekly, monthly: stats.monthly, lifetime: stats.lifetime },
            yesterday: { daily: 0, weekly: 0, monthly: 0, lifetime: 0 },
            thisWeek: stats.weekly,
            thisMonth: stats.monthly,
            breakdown: {
              assignment: stats.breakdown.assignment,
              kattar: stats.breakdown.kattar,
              dpp: stats.breakdown.dpp,
              dailyGoals: stats.breakdown.dailyGoals,
              total: stats.daily
            }
          })
        } catch (error) {
          return NextResponse.json({
            today: { daily: 0, weekly: 0, monthly: 0, lifetime: 0 },
            yesterday: { daily: 0, weekly: 0, monthly: 0, lifetime: 0 },
            thisWeek: 0,
            thisMonth: 0,
            breakdown: { assignment: 0, kattar: 0, dpp: 0, dailyGoals: 0, total: 0 }
          })
        }

      case 'daily':
      case 'weekly':
      case 'monthly':
        return NextResponse.json({ trend: [] })

      case 'counts':
        try {
          const counts = await QuestionAnalyticsRepository.getCurrentStats()
          return NextResponse.json(counts)
        } catch (error) {
          return NextResponse.json({ daily: 0, weekly: 0, monthly: 0, lifetime: 0 })
        }

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching question analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question analytics' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/analytics/questions
 * Update question counts (triggers recalculation)
 */
export async function PUT(request: NextRequest) {
  try {
    const stats = await QuestionAnalyticsRepository.getCurrentStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error updating question analytics:', error)
    return NextResponse.json(
      { error: 'Failed to update question analytics' },
      { status: 500 }
    )
  }
}