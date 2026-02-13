import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fixed date range: May 4, 2025 to December 31, 2026 (IST)
    const startDate = new Date('2025-05-04')
    const endDate = new Date('2026-12-31')

    // Fetch all daily goals in the date range
    const dailyGoals = await prisma.dailyGoal.findMany({
      where: {
        userId: session.user.email,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        date: true,
        totalQuestions: true
      },
      orderBy: {
        date: 'asc'
      }
    })



    // Create a map for quick lookup
    const goalMap = new Map()
    dailyGoals.forEach(goal => {
      // Use the date as stored in database (already in correct format)
      const dateKey = goal.date.toISOString().split('T')[0]
      goalMap.set(dateKey, goal.totalQuestions)
    })

    // Generate all dates in range
    const heatmapData = []
    const currentDate = new Date(startDate)
    
    // Calculate week index based on start date
    const getWeekIndex = (date: Date) => {
      const diffTime = date.getTime() - startDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return Math.floor(diffDays / 7)
    }
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0]
      const count = goalMap.get(dateKey) || 0
      
      // Color coding based on question count
      let color = 'blank'
      if (count >= 400) {
        color = 'darkest'
      } else if (count >= 300) {
        color = 'darker'
      } else if (count >= 250) {
        color = 'mid'
      } else if (count >= 100) {
        color = 'light'
      } else if (count >= 1) {
        color = 'deep-red'
      }

      heatmapData.push({
        date: dateKey,
        count,
        color,
        dayOfWeek: currentDate.getDay(),
        week: getWeekIndex(currentDate)
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    const totalWeeks = Math.max(...heatmapData.map(d => d.week)) + 1

    return NextResponse.json({
      success: true,
      data: {
        startDate: '2025-05-04',
        endDate: '2026-12-31',
        heatmapData,
        totalDays: heatmapData.length,
        totalWeeks
      }
    })

  } catch (error) {
    console.error('Error fetching heatmap data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}