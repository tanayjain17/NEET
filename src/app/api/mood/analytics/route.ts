import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db-utils'
import { MoodRepository } from '@/lib/repositories/mood-repository'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'month'
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Use email as user identifier
    const userId = session.user.email

    // Calculate date range based on timeRange parameter
    let startDate: Date
    let endDate: Date = new Date()

    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam)
      endDate = new Date(endDateParam)
    } else {
      switch (timeRange) {
        case 'week':
          startDate = new Date()
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'quarter':
          startDate = new Date()
          startDate.setMonth(startDate.getMonth() - 3)
          break
        case 'year':
          startDate = new Date()
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
        default: // month
          startDate = new Date()
          startDate.setMonth(startDate.getMonth() - 1)
      }
    }

    // Get mood analytics
    const analytics = await MoodRepository.getMoodAnalytics(userId, startDate, endDate)
    
    // Get mood trends
    const trends = await MoodRepository.getMoodTrends(
      userId, 
      startDate, 
      endDate, 
      timeRange === 'year' ? 'month' : timeRange === 'quarter' ? 'week' : 'day'
    )

    return NextResponse.json({
      analytics,
      trends,
      timeRange,
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    })

  } catch (error) {
    console.error('Error fetching mood analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}