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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily'

    let trendData = []

    if (period === 'daily') {
      // Get last 365 days of daily goals (most recent)
      const dailyGoals = await prisma.dailyGoal.findMany({
        where: { userId: session.user.email },
        orderBy: { date: 'desc' },
        take: 365
      })
      
      // Reverse to show chronological order (oldest to newest)
      dailyGoals.reverse()

      trendData = dailyGoals.map(goal => ({
        date: goal.date.toISOString().split('T')[0],
        totalQuestions: goal.totalQuestions,
        physicsQuestions: goal.physicsQuestions,
        chemistryQuestions: goal.chemistryQuestions,
        botanyQuestions: goal.botanyQuestions,
        zoologyQuestions: goal.zoologyQuestions
      }))
    }

    if (period === 'weekly') {
      // Get last 54 weeks of data for weekly aggregation
      const fiftyFourWeeksAgo = new Date()
      fiftyFourWeeksAgo.setDate(fiftyFourWeeksAgo.getDate() - (54 * 7))
      
      const dailyGoals = await prisma.dailyGoal.findMany({
        where: { 
          userId: session.user.email,
          date: { gte: fiftyFourWeeksAgo }
        },
        orderBy: { date: 'asc' }
      })

      const weeklyData = new Map()
      
      dailyGoals.forEach(goal => {
        const date = new Date(goal.date)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0]
        
        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, {
            weekStart: weekKey,
            weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalQuestions: 0,
            weekNumber: Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
          })
        }
        
        const week = weeklyData.get(weekKey)
        week.totalQuestions += goal.totalQuestions
      })

      trendData = Array.from(weeklyData.values()).slice(-54) // Last 54 weeks only
    }

    if (period === 'monthly') {
      // Get last 12 months of data for monthly aggregation
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      
      const dailyGoals = await prisma.dailyGoal.findMany({
        where: { 
          userId: session.user.email,
          date: { gte: twelveMonthsAgo }
        },
        orderBy: { date: 'asc' }
      })

      const monthlyData = new Map()
      
      dailyGoals.forEach(goal => {
        const date = new Date(goal.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthKey,
            year: date.getFullYear(),
            totalQuestions: 0,
            monthName: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          })
        }
        
        const month = monthlyData.get(monthKey)
        month.totalQuestions += goal.totalQuestions
      })

      trendData = Array.from(monthlyData.values()).slice(-12) // Last 12 months only
    }

    return NextResponse.json({
      success: true,
      data: trendData
    })

  } catch (error) {
    console.error('Error fetching daily goals trend:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}