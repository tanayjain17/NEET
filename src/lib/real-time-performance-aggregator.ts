/**
 * Real-time Performance Data Aggregator
 * Collects data from entire project for accurate rank prediction
 */

import { prisma } from './prisma'

interface RealTimePerformanceData {
  dailyQuestions: number
  testAverage: number
  syllabusCompletion: number
  consistency: number
  accuracy: number
  studyStreak: number
  studyHours: number
  weeklyTarget: number
  monthlyGrowth: number
  lastUpdateDays: number
}

export class RealTimePerformanceAggregator {
  /**
   * Aggregate all performance data from the entire project
   */
  static async aggregatePerformanceData(userId?: string): Promise<RealTimePerformanceData> {
    try {
      const results = await Promise.allSettled([
        this.getDailyGoalsData(),
        this.getTestPerformanceData(),
        this.getChaptersData(),
        this.getQuestionAnalyticsData()
      ])

      const dailyGoalsData = results[0].status === 'fulfilled' ? results[0].value : this.getDefaultDailyGoalsData()
      const testData = results[1].status === 'fulfilled' ? results[1].value : this.getDefaultTestData()
      const chaptersData = results[2].status === 'fulfilled' ? results[2].value : this.getDefaultChaptersData()
      const questionsData = results[3].status === 'fulfilled' ? results[3].value : this.getDefaultQuestionsData()

      return {
        dailyQuestions: dailyGoalsData.averageQuestions,
        testAverage: testData.averageScore,
        syllabusCompletion: chaptersData.completionPercentage,
        consistency: dailyGoalsData.consistency,
        accuracy: testData.accuracy,
        studyStreak: dailyGoalsData.currentStreak,
        studyHours: dailyGoalsData.averageHours,
        weeklyTarget: questionsData.weeklyTarget,
        monthlyGrowth: questionsData.monthlyGrowth,
        lastUpdateDays: dailyGoalsData.daysSinceLastUpdate
      }
    } catch (error) {
      console.error('Error aggregating performance data:', error)
      return this.getDefaultData()
    }
  }

  /**
   * Get daily goals performance data
   */
  private static async getDailyGoalsData() {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const goals = await prisma.dailyGoal.findMany({
        where: { date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'desc' }
      })

      return this.processDailyGoalsData(goals)
    } catch (error) {
      console.error('Database connection error in getDailyGoalsData:', error)
      return this.getDefaultDailyGoalsData()
    }
  }

  private static processDailyGoalsData(goals: any[]) {

    if (goals.length === 0) {
      return {
        averageQuestions: 0,
        consistency: 0,
        currentStreak: 0,
        averageHours: 0,
        daysSinceLastUpdate: 30
      }
    }

    const totalQuestions = goals.reduce((sum, goal) => 
      sum + (goal.physicsQuestions || 0) + (goal.chemistryQuestions || 0) + 
      (goal.botanyQuestions || 0) + (goal.zoologyQuestions || 0), 0
    )

    const averageQuestions = Math.round(totalQuestions / Math.max(1, goals.length))
    const averageHours = Math.round(averageQuestions / 35) // ~35 questions per hour

    // Calculate consistency (days with goals / total days)
    const consistency = Math.round((goals.length / 30) * 100)

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      const hasGoal = goals.some(goal => {
        const goalDate = new Date(goal.date)
        goalDate.setHours(0, 0, 0, 0)
        return goalDate.getTime() === checkDate.getTime()
      })

      if (hasGoal) {
        currentStreak++
      } else {
        break
      }
    }

    // Days since last update
    const lastGoal = goals[0]
    const daysSinceLastUpdate = lastGoal ? 
      Math.floor((Date.now() - new Date(lastGoal.date).getTime()) / (1000 * 60 * 60 * 24)) : 30

    return {
      averageQuestions,
      consistency,
      currentStreak,
      averageHours,
      daysSinceLastUpdate
    }
  }

  /**
   * Get test performance data
   */
  private static async getTestPerformanceData() {
    try {
      const tests = await prisma.testPerformance.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return this.processTestData(tests)
    } catch (error) {
      console.error('Database connection error in getTestPerformanceData:', error)
      return this.getDefaultTestData()
    }
  }

  private static processTestData(tests: any[]) {

    if (tests.length === 0) {
      return { averageScore: 0, accuracy: 0 }
    }

    const totalScore = tests.reduce((sum, test) => sum + test.score, 0)
    const averageScore = Math.round(totalScore / tests.length)
    
    // Calculate accuracy based on NEET 2026 scoring (720 max)
    const accuracy = Math.round((averageScore / 720) * 100)

    return { averageScore, accuracy }
  }

  /**
   * Get chapters completion data (out of 81 total chapters)
   */
  private static async getChaptersData() {
    try {
      const chapters = await prisma.chapter.findMany()

      return this.processChaptersData(chapters)
    } catch (error) {
      console.error('Database connection error in getChaptersData:', error)
      return this.getDefaultChaptersData()
    }
  }

  private static processChaptersData(chapters: any[]) {
    const TOTAL_CHAPTERS = 81

    if (chapters.length === 0) {
      return { completionPercentage: 0 }
    }

    let totalCompletedChapters = 0

    chapters.forEach(chapter => {
      let chapterCompletion = 0
      let totalWeight = 0

      // Check lectures (25% weight)
      if (Array.isArray(chapter.lecturesCompleted)) {
        const completed = (chapter.lecturesCompleted as boolean[]).filter(Boolean).length
        const total = (chapter.lecturesCompleted as boolean[]).length
        if (total > 0) {
          chapterCompletion += (completed / total) * 25
          totalWeight += 25
        }
      }

      // Check DPP (35% weight)
      if (Array.isArray(chapter.dppCompleted)) {
        const completed = (chapter.dppCompleted as boolean[]).filter(Boolean).length
        const total = (chapter.dppCompleted as boolean[]).length
        if (total > 0) {
          chapterCompletion += (completed / total) * 35
          totalWeight += 35
        }
      }

      // Check assignments (25% weight)
      if (Array.isArray(chapter.assignmentCompleted)) {
        const completed = (chapter.assignmentCompleted as boolean[]).filter(Boolean).length
        const total = (chapter.assignmentCompleted as boolean[]).length
        if (total > 0) {
          chapterCompletion += (completed / total) * 25
          totalWeight += 25
        }
      }

      // Check revision (15% weight)
      if (chapter.revisionScore !== null && chapter.revisionScore > 0) {
        chapterCompletion += (chapter.revisionScore / 10) * 15
        totalWeight += 15
      }

      // Calculate chapter completion percentage
      if (totalWeight > 0) {
        const chapterPercent = chapterCompletion / totalWeight
        totalCompletedChapters += chapterPercent
      }
    })

    // Calculate overall syllabus completion percentage based on 81 total chapters
    const completionPercentage = Math.round((totalCompletedChapters / TOTAL_CHAPTERS) * 100)

    return { completionPercentage: Math.min(100, completionPercentage) }
  }

  /**
   * Get question analytics data
   */
  private static async getQuestionAnalyticsData() {
    try {
      const analytics = await prisma.questionAnalytics.findMany({
        orderBy: { date: 'desc' },
        take: 30
      })

      return this.processAnalyticsData(analytics)
    } catch (error) {
      console.error('Database connection error in getQuestionAnalyticsData:', error)
      return this.getDefaultQuestionsData()
    }
  }

  private static processAnalyticsData(analytics: any[]) {

    if (analytics.length === 0) {
      return { weeklyTarget: 0, monthlyGrowth: 0 }
    }

    const recent = analytics.slice(0, 7)
    const older = analytics.slice(7, 14)

    const recentAvg = recent.reduce((sum, a) => sum + a.dailyCount, 0) / Math.max(1, recent.length)
    const olderAvg = older.reduce((sum, a) => sum + a.dailyCount, 0) / Math.max(1, older.length)

    const weeklyTarget = Math.round(recentAvg * 7)
    const monthlyGrowth = olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0

    return { weeklyTarget, monthlyGrowth }
  }



  /**
   * Get default data when no real data is available
   */
  private static getDefaultData(): RealTimePerformanceData {
    return {
      dailyQuestions: 0,
      testAverage: 0,
      syllabusCompletion: 0,
      consistency: 0,
      accuracy: 0,
      studyStreak: 0,
      studyHours: 0,
      weeklyTarget: 0,
      monthlyGrowth: 0,
      lastUpdateDays: 30
    }
  }

  private static getDefaultDailyGoalsData() {
    return {
      averageQuestions: 0,
      consistency: 0,
      currentStreak: 0,
      averageHours: 0,
      daysSinceLastUpdate: 30
    }
  }

  private static getDefaultTestData() {
    return { averageScore: 0, accuracy: 0 }
  }

  private static getDefaultChaptersData() {
    return { completionPercentage: 0 }
  }

  private static getDefaultQuestionsData() {
    return { weeklyTarget: 0, monthlyGrowth: 0 }
  }
}