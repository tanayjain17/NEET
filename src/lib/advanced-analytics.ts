import { prisma } from './prisma'

export type LearningVelocity = {
  subject: string
  chapter: string
  conceptsPerHour: number
  retentionRate: number
  difficultyTrend: 'improving' | 'stable' | 'declining'
}

export type PerformanceHeatmap = {
  hour: number
  day: string
  performance: number
  focusLevel: number
  questionsAttempted: number
}

export type RetentionAnalysis = {
  timeframe: string
  initialScore: number
  currentScore: number
  retentionRate: number
  forgettingCurve: { days: number; retention: number }[]
}

export class AdvancedAnalytics {
  static async getLearningVelocity(userId: string, days: number = 30): Promise<LearningVelocity[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const [studySessions, memoryItems] = await Promise.all([
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: { gte: cutoffDate }
        },
        orderBy: { startTime: 'asc' }
      }),
      prisma.memoryItem.findMany({
        where: {
          userId,
          createdAt: { gte: cutoffDate }
        }
      })
    ])

    // Group by subject and chapter
    const velocityMap = new Map<string, {
      totalHours: number
      conceptsLearned: number
      retentionSum: number
      retentionCount: number
      performanceHistory: number[]
    }>()

    studySessions.forEach(session => {
      const key = `${session.subject}-${session.chapter || 'General'}`
      const existing = velocityMap.get(key) || {
        totalHours: 0,
        conceptsLearned: 0,
        retentionSum: 0,
        retentionCount: 0,
        performanceHistory: []
      }

      existing.totalHours += session.duration / 60
      existing.conceptsLearned += session.questionsCorrect
      existing.performanceHistory.push(session.productivity)
      
      velocityMap.set(key, existing)
    })

    // Add memory retention data
    memoryItems.forEach(item => {
      const key = `${item.subject}-${item.chapter}`
      const existing = velocityMap.get(key)
      if (existing) {
        existing.retentionSum += item.retentionScore
        existing.retentionCount += 1
      }
    })

    return Array.from(velocityMap.entries()).map(([key, data]) => {
      const [subject, chapter] = key.split('-')
      const avgRetention = data.retentionCount > 0 ? data.retentionSum / data.retentionCount : 0
      
      // Calculate trend
      const recentPerf = data.performanceHistory.slice(-5).reduce((sum, p) => sum + p, 0) / Math.max(1, data.performanceHistory.slice(-5).length)
      const earlierPerf = data.performanceHistory.slice(0, 5).reduce((sum, p) => sum + p, 0) / Math.max(1, data.performanceHistory.slice(0, 5).length)
      
      let difficultyTrend: 'improving' | 'stable' | 'declining' = 'stable'
      if (recentPerf > earlierPerf + 1) difficultyTrend = 'improving'
      else if (recentPerf < earlierPerf - 1) difficultyTrend = 'declining'

      return {
        subject,
        chapter,
        conceptsPerHour: data.totalHours > 0 ? data.conceptsLearned / data.totalHours : 0,
        retentionRate: avgRetention,
        difficultyTrend
      }
    })
  }

  static async getPerformanceHeatmap(userId: string, days: number = 30): Promise<PerformanceHeatmap[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const studySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: cutoffDate }
      }
    })

    const heatmapData: PerformanceHeatmap[] = []
    
    studySessions.forEach(session => {
      const startTime = new Date(session.startTime)
      const hour = startTime.getHours()
      const day = startTime.toLocaleDateString('en-US', { weekday: 'long' })
      
      const performance = session.questionsAttempted > 0 
        ? (session.questionsCorrect / session.questionsAttempted) * 100
        : 0

      heatmapData.push({
        hour,
        day,
        performance,
        focusLevel: session.focusScore,
        questionsAttempted: session.questionsAttempted
      })
    })

    return heatmapData
  }

  static async getRetentionAnalysis(userId: string, subject?: string): Promise<RetentionAnalysis[]> {
    const whereClause: any = { userId }
    if (subject) whereClause.subject = subject

    const memoryItems = await prisma.memoryItem.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' }
    })

    // Group by time periods
    const timeframes = ['1 week', '1 month', '3 months', '6 months']
    const analyses: RetentionAnalysis[] = []

    timeframes.forEach(timeframe => {
      const days = this.getTimeframeDays(timeframe)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const relevantItems = memoryItems.filter(item => 
        new Date(item.createdAt) >= cutoffDate
      )

      if (relevantItems.length === 0) return

      const initialScore = relevantItems.reduce((sum, item) => sum + (item.reviewCount === 0 ? 0.5 : 1), 0) / relevantItems.length
      const currentScore = relevantItems.reduce((sum, item) => sum + item.retentionScore, 0) / relevantItems.length
      const retentionRate = currentScore / Math.max(initialScore, 0.1)

      // Generate forgetting curve
      const forgettingCurve = this.generateForgettingCurve(relevantItems)

      analyses.push({
        timeframe,
        initialScore,
        currentScore,
        retentionRate,
        forgettingCurve
      })
    })

    return analyses
  }

  private static getTimeframeDays(timeframe: string): number {
    switch (timeframe) {
      case '1 week': return 7
      case '1 month': return 30
      case '3 months': return 90
      case '6 months': return 180
      default: return 30
    }
  }

  private static generateForgettingCurve(items: any[]): { days: number; retention: number }[] {
    const curve: { days: number; retention: number }[] = []
    const dayIntervals = [1, 3, 7, 14, 30, 60, 90, 180]

    dayIntervals.forEach(days => {
      const relevantItems = items.filter(item => {
        const daysSinceCreation = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceCreation >= days
      })

      if (relevantItems.length > 0) {
        const avgRetention = relevantItems.reduce((sum, item) => sum + item.retentionScore, 0) / relevantItems.length
        curve.push({ days, retention: avgRetention })
      }
    })

    return curve
  }

  static async getStudyEfficiencyMetrics(userId: string): Promise<{
    averageSessionDuration: number
    questionsPerMinute: number
    accuracyRate: number
    focusConsistency: number
    optimalStudyHours: number[]
    breakEffectiveness: number
  }> {
    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: 100
    })

    if (sessions.length === 0) {
      return {
        averageSessionDuration: 0,
        questionsPerMinute: 0,
        accuracyRate: 0,
        focusConsistency: 0,
        optimalStudyHours: [],
        breakEffectiveness: 0
      }
    }

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0)
    const totalCorrect = sessions.reduce((sum, s) => sum + s.questionsCorrect, 0)
    const avgFocus = sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length

    // Find optimal study hours
    const hourlyPerformance = new Map<number, { performance: number; count: number }>()
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours()
      const performance = session.questionsAttempted > 0 
        ? (session.questionsCorrect / session.questionsAttempted) * session.focusScore
        : 0

      const existing = hourlyPerformance.get(hour) || { performance: 0, count: 0 }
      hourlyPerformance.set(hour, {
        performance: existing.performance + performance,
        count: existing.count + 1
      })
    })

    const optimalStudyHours = Array.from(hourlyPerformance.entries())
      .map(([hour, data]) => ({ hour, avgPerformance: data.performance / data.count }))
      .sort((a, b) => b.avgPerformance - a.avgPerformance)
      .slice(0, 4)
      .map(item => item.hour)

    return {
      averageSessionDuration: totalDuration / sessions.length,
      questionsPerMinute: totalDuration > 0 ? totalQuestions / totalDuration : 0,
      accuracyRate: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      focusConsistency: avgFocus,
      optimalStudyHours,
      breakEffectiveness: sessions.reduce((sum, s) => sum + s.breaksTaken, 0) / sessions.length
    }
  }
}