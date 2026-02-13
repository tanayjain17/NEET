import { prisma } from '../prisma'
import { withRetry, handleDatabaseError } from '../error-handler'
import { QuestionAnalytics } from '@prisma/client'

export class QuestionAnalyticsRepository {
  /**
   * Update daily question count and recalculate aggregates
   */
  static async updateDailyCount(date: Date, count: number): Promise<QuestionAnalytics> {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    // Use upsert to handle create or update atomically
    const today = await prisma.questionAnalytics.upsert({
      where: { date: dateOnly },
      update: { dailyCount: count },
      create: {
        date: dateOnly,
        dailyCount: count,
        weeklyCount: 0,
        monthlyCount: 0,
        lifetimeCount: 0
      }
    })

    // Recalculate aggregates
    await this.recalculateAggregates(dateOnly)
    
    return today
  }

  /**
   * Get current question statistics from daily goals + chapter questions
   */
  static async getCurrentStats(): Promise<{
    daily: number
    weekly: number
    monthly: number
    lifetime: number
    breakdown: {
      dailyGoals: number
      dpp: number
      assignment: number
      kattar: number
    }
  }> {
    return withRetry(async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get daily goals count
    const todayGoal = await prisma.dailyGoal.findFirst({
      where: { date: today }
    })
    const dailyGoalsCount = todayGoal?.totalQuestions || 0

    // Get chapter-level questions
    const chapters = await prisma.chapter.findMany()
    
    let dppCount = 0
    let assignmentCount = 0
    let kattarCount = 0

    chapters.forEach(chapter => {
      // DPP questions (sum of question counts for completed DPPs)
      const dppCompleted = Array.isArray(chapter.dppCompleted) 
        ? chapter.dppCompleted as boolean[]
        : []
      const dppQuestionCounts = Array.isArray(chapter.dppQuestionCounts) 
        ? chapter.dppQuestionCounts as number[]
        : []
      
      dppCompleted.forEach((completed, index) => {
        if (completed && dppQuestionCounts[index]) {
          dppCount += dppQuestionCounts[index]
        }
      })
      
      // Assignment questions (completed count)
      const assignmentCompleted = Array.isArray(chapter.assignmentCompleted) 
        ? (chapter.assignmentCompleted as boolean[]).filter(Boolean).length 
        : 0
      assignmentCount += assignmentCompleted
      
      // Kattar questions (completed count)
      const kattarCompleted = Array.isArray(chapter.kattarCompleted) 
        ? (chapter.kattarCompleted as boolean[]).filter(Boolean).length 
        : 0
      kattarCount += kattarCompleted
    })

    const daily = dailyGoalsCount + dppCount + assignmentCount + kattarCount

    // Calculate weekly/monthly/lifetime with same logic
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - 6)
    const weeklyGoals = await prisma.dailyGoal.findMany({
      where: { date: { gte: weekStart, lte: today } }
    })
    const weeklyGoalsTotal = weeklyGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)
    const weekly = weeklyGoalsTotal + dppCount + assignmentCount + kattarCount

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthlyGoals = await prisma.dailyGoal.findMany({
      where: { date: { gte: monthStart, lte: today } }
    })
    const monthlyGoalsTotal = monthlyGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)
    const monthly = monthlyGoalsTotal + dppCount + assignmentCount + kattarCount

    const allGoals = await prisma.dailyGoal.findMany()
    const lifetimeGoalsTotal = allGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)
    const lifetime = lifetimeGoalsTotal + dppCount + assignmentCount + kattarCount

      return {
        daily,
        weekly,
        monthly,
        lifetime,
        breakdown: {
          dailyGoals: dailyGoalsCount,
          dpp: dppCount,
          assignment: assignmentCount,
          kattar: kattarCount
        }
      }
    }).catch(handleDatabaseError)
  }

  /**
   * Recalculate weekly, monthly, and lifetime totals
   */
  private static async recalculateAggregates(targetDate: Date): Promise<void> {
    // Calculate weekly total (last 7 days including today)
    const weekStart = new Date(targetDate)
    weekStart.setDate(weekStart.getDate() - 6)
    
    const weeklyEntries = await prisma.questionAnalytics.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: targetDate
        }
      }
    })
    const weeklyTotal = weeklyEntries.reduce((sum, entry) => sum + entry.dailyCount, 0)

    // Calculate monthly total
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
    const monthlyEntries = await prisma.questionAnalytics.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: targetDate
        }
      }
    })
    const monthlyTotal = monthlyEntries.reduce((sum, entry) => sum + entry.dailyCount, 0)

    // Calculate lifetime total
    const allEntries = await prisma.questionAnalytics.findMany()
    const lifetimeTotal = allEntries.reduce((sum, entry) => sum + entry.dailyCount, 0)

    // Update the target date entry
    await prisma.questionAnalytics.update({
      where: { date: targetDate },
      data: {
        weeklyCount: weeklyTotal,
        monthlyCount: monthlyTotal,
        lifetimeCount: lifetimeTotal
      }
    })
  }

  /**
   * Sync question count from daily goals
   */
  static async syncFromDailyGoals(): Promise<void> {
    const dailyGoals = await prisma.dailyGoal.findMany({
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    })

    for (const goal of dailyGoals) {
      await this.updateDailyCount(goal.date, goal.totalQuestions)
    }
  }
}