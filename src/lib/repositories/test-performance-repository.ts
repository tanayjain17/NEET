import { prisma } from '../prisma'
import { TestPerformance } from '@prisma/client'

export type TestType = 'Weekly Test' | 'Rank Booster' | 'Test Series' | 'AITS' | 'Full Length Test'

export type TestPerformanceData = {
  userId: string
  testType: TestType
  testNumber: string // e.g., "Test-01", "Test-02"
  score: number // 0-720
  testDate: Date
}

export type PerformanceAnalytics = {
  averageScore: number
  highestScore: number
  lowestScore: number
  totalTests: number
  improvementTrend: number // percentage change from first to last test
  recentPerformance: number // average of last 5 tests
  scorePercentage: number // current score as percentage of 720
  emoji: string // based on performance
}

export type PerformanceTrend = {
  date: string
  score: number
  percentage: number
  testType: string
  testNumber: string
}

/**
 * Test Performance Repository - CRUD operations for test performances
 */
export class TestPerformanceRepository {
  /**
   * Create a new test performance record
   */
  static async create(data: TestPerformanceData): Promise<TestPerformance> {
    // Validate score range
    if (data.score < 0 || data.score > 720) {
      throw new Error('Score must be between 0 and 720')
    }

    return await prisma.testPerformance.create({
      data: {
        userId: data.userId,
        testType: data.testType,
        testNumber: data.testNumber,
        score: data.score,
        testDate: data.testDate
      }
    })
  }

  /**
   * Get all test performances for a user
   */
  static async getAllByUserId(userId: string): Promise<TestPerformance[]> {
    return await prisma.testPerformance.findMany({
      where: { userId },
      orderBy: { testDate: 'desc' }
    })
  }

  /**
   * Get test performances by user ID and test type
   */
  static async getByUserIdAndType(userId: string, testType: TestType): Promise<TestPerformance[]> {
    return await prisma.testPerformance.findMany({
      where: { 
        userId,
        testType 
      },
      orderBy: { testDate: 'desc' }
    })
  }

  /**
   * Get test performance by ID
   */
  static async getById(id: string): Promise<TestPerformance | null> {
    return await prisma.testPerformance.findUnique({
      where: { id }
    })
  }

  /**
   * Update a test performance record
   */
  static async update(id: string, data: Partial<TestPerformanceData>): Promise<TestPerformance> {
    // Validate score if provided
    if (data.score !== undefined && (data.score < 0 || data.score > 720)) {
      throw new Error('Score must be between 0 and 720')
    }

    return await prisma.testPerformance.update({
      where: { id },
      data
    })
  }

  /**
   * Delete a test performance record
   */
  static async delete(id: string): Promise<void> {
    await prisma.testPerformance.delete({
      where: { id }
    })
  }

  /**
   * Get performance analytics for a user
   */
  static async getAnalytics(userId: string): Promise<PerformanceAnalytics> {
    const tests = await this.getAllByUserId(userId)

    if (tests.length === 0) {
      return {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalTests: 0,
        improvementTrend: 0,
        recentPerformance: 0,
        scorePercentage: 0,
        emoji: '😢'
      }
    }

    const scores = tests.map(test => test.score)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const highestScore = Math.max(...scores)
    const lowestScore = Math.min(...scores)

    // Calculate improvement trend (first test vs last test)
    const sortedByDate = [...tests].sort((a, b) => a.testDate.getTime() - b.testDate.getTime())
    const firstScore = sortedByDate[0]?.score || 0
    const lastScore = sortedByDate[sortedByDate.length - 1]?.score || 0
    const improvementTrend = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0

    // Recent performance (last 5 tests)
    const recentTests = tests.slice(0, 5)
    const recentPerformance = recentTests.length > 0 
      ? recentTests.reduce((sum, test) => sum + test.score, 0) / recentTests.length 
      : 0

    // Current score percentage (based on most recent test)
    const currentScore = tests[0]?.score || 0
    const scorePercentage = (currentScore / 720) * 100

    // Emoji based on current performance percentage
    const emoji = scorePercentage < 75 ? '😢' : 
                  scorePercentage < 85 ? '😟' :
                  scorePercentage < 95 ? '😊' : '😘'

    return {
      averageScore: Math.round(averageScore),
      highestScore,
      lowestScore,
      totalTests: tests.length,
      improvementTrend: Math.round(improvementTrend * 100) / 100,
      recentPerformance: Math.round(recentPerformance),
      scorePercentage: Math.round(scorePercentage * 100) / 100,
      emoji
    }
  }

  /**
   * Get performance trend data for visualization
   */
  static async getPerformanceTrend(userId: string, limit?: number): Promise<PerformanceTrend[]> {
    const tests = await prisma.testPerformance.findMany({
      where: { userId },
      orderBy: { testDate: 'asc' },
      ...(limit && { take: limit })
    })

    return tests.map(test => ({
      date: test.testDate.toISOString().split('T')[0], // YYYY-MM-DD format
      score: test.score,
      percentage: Math.round((test.score / 720) * 100 * 100) / 100,
      testType: test.testType,
      testNumber: test.testNumber
    }))
  }

  /**
   * Get performance analytics by test type
   */
  static async getAnalyticsByTestType(userId: string): Promise<Record<TestType, PerformanceAnalytics>> {
    const testTypes: TestType[] = ['Weekly Test', 'Rank Booster', 'Test Series', 'AITS', 'Full Length Test']
    const analytics: Record<string, PerformanceAnalytics> = {}

    for (const testType of testTypes) {
      const tests = await this.getByUserIdAndType(userId, testType)
      
      if (tests.length === 0) {
        analytics[testType] = {
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          totalTests: 0,
          improvementTrend: 0,
          recentPerformance: 0,
          scorePercentage: 0,
          emoji: '😢'
        }
        continue
      }

      const scores = tests.map(test => test.score)
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const highestScore = Math.max(...scores)
      const lowestScore = Math.min(...scores)

      // Calculate improvement trend
      const sortedByDate = [...tests].sort((a, b) => a.testDate.getTime() - b.testDate.getTime())
      const firstScore = sortedByDate[0]?.score || 0
      const lastScore = sortedByDate[sortedByDate.length - 1]?.score || 0
      const improvementTrend = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0

      // Recent performance
      const recentTests = tests.slice(0, 3) // Last 3 tests for this type
      const recentPerformance = recentTests.length > 0 
        ? recentTests.reduce((sum, test) => sum + test.score, 0) / recentTests.length 
        : 0

      const scorePercentage = (averageScore / 720) * 100
      const emoji = scorePercentage < 75 ? '😢' : 
                    scorePercentage < 85 ? '😟' :
                    scorePercentage < 95 ? '😊' : '😘'

      analytics[testType] = {
        averageScore: Math.round(averageScore),
        highestScore,
        lowestScore,
        totalTests: tests.length,
        improvementTrend: Math.round(improvementTrend * 100) / 100,
        recentPerformance: Math.round(recentPerformance),
        scorePercentage: Math.round(scorePercentage * 100) / 100,
        emoji
      }
    }

    return analytics as Record<TestType, PerformanceAnalytics>
  }

  /**
   * Get recent test performances (last N tests)
   */
  static async getRecentTests(userId: string, limit: number = 10): Promise<TestPerformance[]> {
    return await prisma.testPerformance.findMany({
      where: { userId },
      orderBy: { testDate: 'desc' },
      take: limit
    })
  }

  /**
   * Get test performances within a date range
   */
  static async getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<TestPerformance[]> {
    return await prisma.testPerformance.findMany({
      where: {
        userId,
        testDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { testDate: 'desc' }
    })
  }

  /**
   * Get performance comparison between two time periods
   */
  static async getPerformanceComparison(
    userId: string, 
    period1Start: Date, 
    period1End: Date,
    period2Start: Date, 
    period2End: Date
  ): Promise<{
    period1: PerformanceAnalytics
    period2: PerformanceAnalytics
    improvement: number
  }> {
    const period1Tests = await this.getByDateRange(userId, period1Start, period1End)
    const period2Tests = await this.getByDateRange(userId, period2Start, period2End)

    const calculatePeriodAnalytics = (tests: TestPerformance[]): PerformanceAnalytics => {
      if (tests.length === 0) {
        return {
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          totalTests: 0,
          improvementTrend: 0,
          recentPerformance: 0,
          scorePercentage: 0,
          emoji: '😢'
        }
      }

      const scores = tests.map(test => test.score)
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const scorePercentage = (averageScore / 720) * 100

      return {
        averageScore: Math.round(averageScore),
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        totalTests: tests.length,
        improvementTrend: 0,
        recentPerformance: Math.round(averageScore),
        scorePercentage: Math.round(scorePercentage * 100) / 100,
        emoji: scorePercentage < 75 ? '😢' : 
               scorePercentage < 85 ? '😟' :
               scorePercentage < 95 ? '😊' : '😘'
      }
    }

    const period1Analytics = calculatePeriodAnalytics(period1Tests)
    const period2Analytics = calculatePeriodAnalytics(period2Tests)

    const improvement = period1Analytics.averageScore > 0 
      ? ((period2Analytics.averageScore - period1Analytics.averageScore) / period1Analytics.averageScore) * 100
      : 0

    return {
      period1: period1Analytics,
      period2: period2Analytics,
      improvement: Math.round(improvement * 100) / 100
    }
  }

  /**
   * Get test count by type for a user
   */
  static async getTestCountByType(userId: string): Promise<Record<TestType, number>> {
    const testTypes: TestType[] = ['Weekly Test', 'Rank Booster', 'Test Series', 'AITS', 'Full Length Test']
    const counts: Record<string, number> = {}

    for (const testType of testTypes) {
      const count = await prisma.testPerformance.count({
        where: { userId, testType }
      })
      counts[testType] = count
    }

    return counts as Record<TestType, number>
  }
}