import { prisma } from './prisma'

export type RankingAnalytics = {
  currentRank: number
  totalStudents: number
  percentile: number
  categoryRank: number
  stateRank: number
  progressRank: number
  consistencyRank: number
  biologicalOptimizationRank: number
  rigorousMetrics: {
    syllabusCompletion: number
    testAverage: number
    dailyConsistency: number
    weeklyTarget: number
    monthlyGrowth: number
  }
}

export class RankingAnalyticsEngine {
  private static readonly TOTAL_STUDENTS = 1000000 // 10 lakh students
  
  static async calculateRanking(userId: string): Promise<RankingAnalytics> {
    try {
      const [subjects, dailyGoals, testPerformances, menstrualData] = await Promise.all([
        prisma.subject.findMany({ include: { chapters: true } }),
        prisma.dailyGoal.findMany({ 
          where: { userId },
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.testPerformance.findMany({
          where: { userId },
          orderBy: { testDate: 'desc' },
          take: 20
        }),
        prisma.menstrualCycle.findMany({
          where: { userId },
          orderBy: { cycleStartDate: 'desc' },
          take: 6
        })
      ])

      const metrics = this.calculateRigorousMetrics(subjects, dailyGoals, testPerformances, menstrualData)
      const ranking = this.calculateCompetitiveRanking(metrics)
      
      return {
        currentRank: ranking.currentRank,
        totalStudents: this.TOTAL_STUDENTS,
        percentile: ranking.percentile,
        categoryRank: ranking.categoryRank,
        stateRank: ranking.stateRank,
        progressRank: ranking.progressRank,
        consistencyRank: ranking.consistencyRank,
        biologicalOptimizationRank: ranking.biologicalOptimizationRank,
        rigorousMetrics: metrics
      }
    } catch (error) {
      console.error('Ranking calculation error:', error)
      return this.getDefaultRanking()
    }
  }

  private static calculateRigorousMetrics(subjects: any[], dailyGoals: any[], tests: any[], menstrualData: any[]) {
    // Syllabus completion with 97%+ target
    const syllabusCompletion = subjects.length > 0 ? subjects.reduce((sum, subject) => {
      if (!subject.chapters || subject.chapters.length === 0) return sum
      
      const chapterCompletion = subject.chapters.reduce((chapterSum: number, chapter: any) => {
        const lectureProgress = Array.isArray(chapter.lecturesCompleted) && chapter.lectureCount > 0
          ? (chapter.lecturesCompleted as boolean[]).filter(Boolean).length / chapter.lectureCount
          : 0
        const dppProgress = Array.isArray(chapter.dppCompleted) && chapter.lectureCount > 0
          ? (chapter.dppCompleted as boolean[]).filter(Boolean).length / chapter.lectureCount
          : 0
        const assignmentProgress = Array.isArray(chapter.assignmentCompleted) && chapter.assignmentQuestions > 0
          ? (chapter.assignmentCompleted as boolean[]).filter(Boolean).length / chapter.assignmentQuestions
          : 0
        const kattarProgress = Array.isArray(chapter.kattarCompleted) && chapter.kattarQuestions > 0
          ? (chapter.kattarCompleted as boolean[]).filter(Boolean).length / chapter.kattarQuestions
          : 0
        
        return chapterSum + ((lectureProgress + dppProgress + assignmentProgress + kattarProgress) / 4)
      }, 0)
      return sum + (chapterCompletion / subject.chapters.length)
    }, 0) / subjects.length * 100 : 0

    // Test average with rigorous scoring
    const testAverage = tests.length > 0 
      ? tests.reduce((sum, t) => sum + t.score, 0) / tests.length
      : 0

    // Daily consistency (harsh penalty for missed days)
    const activeDays = dailyGoals.filter(g => g && g.totalQuestions >= 250).length
    const totalDays = Math.max(1, Math.min(30, dailyGoals.length))
    const dailyConsistency = (activeDays / totalDays) * 100

    // Weekly target achievement
    const weeklyQuestions = dailyGoals.slice(0, 7).reduce((sum, g) => sum + (g?.totalQuestions || 0), 0)
    const weeklyTarget = Math.min(100, (weeklyQuestions / 2000) * 100) // 2000 questions/week target

    // Monthly growth rate
    const recentMonth = dailyGoals.slice(0, 15).reduce((sum, g) => sum + (g?.totalQuestions || 0), 0)
    const previousMonth = dailyGoals.slice(15, 30).reduce((sum, g) => sum + (g?.totalQuestions || 0), 0)
    const monthlyGrowth = previousMonth > 0 ? ((recentMonth - previousMonth) / previousMonth) * 100 : 0

    return {
      syllabusCompletion: Math.round(syllabusCompletion * 100) / 100,
      testAverage: Math.round(testAverage),
      dailyConsistency: Math.round(dailyConsistency),
      weeklyTarget: Math.round(weeklyTarget),
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100
    }
  }

  private static calculateCompetitiveRanking(metrics: any) {
    // Rigorous ranking algorithm based on NEET competition
    let totalScore = 0
    
    // Syllabus completion (40% weightage) - 97%+ required for top ranks
    if (metrics.syllabusCompletion >= 97) {
      totalScore += 40
    } else if (metrics.syllabusCompletion >= 95) {
      totalScore += 35
    } else if (metrics.syllabusCompletion >= 90) {
      totalScore += 25
    } else if (metrics.syllabusCompletion >= 85) {
      totalScore += 15
    } else {
      totalScore += Math.max(0, metrics.syllabusCompletion * 0.1)
    }

    // Test performance (30% weightage)
    if (metrics.testAverage >= 650) totalScore += 30
    else if (metrics.testAverage >= 600) totalScore += 25
    else if (metrics.testAverage >= 550) totalScore += 20
    else if (metrics.testAverage >= 500) totalScore += 15
    else totalScore += Math.max(0, (metrics.testAverage / 720) * 30)

    // Consistency (20% weightage)
    totalScore += (metrics.dailyConsistency / 100) * 20

    // Weekly targets (10% weightage)
    totalScore += (metrics.weeklyTarget / 100) * 10

    // Calculate ranks based on total score
    const scorePercentile = Math.min(99.9, Math.max(0.1, totalScore))
    const currentRank = Math.ceil(this.TOTAL_STUDENTS * (100 - scorePercentile) / 100)
    
    return {
      currentRank,
      percentile: Math.round(scorePercentile * 100) / 100,
      categoryRank: Math.ceil(currentRank * 0.7), // Assuming general category
      stateRank: Math.ceil(currentRank * 0.05), // State-wise ranking
      progressRank: Math.ceil(currentRank * 0.8),
      consistencyRank: Math.ceil(currentRank * 0.6),
      biologicalOptimizationRank: Math.ceil(currentRank * 0.9)
    }
  }

  private static getDefaultRanking(): RankingAnalytics {
    return {
      currentRank: 500000,
      totalStudents: this.TOTAL_STUDENTS,
      percentile: 50,
      categoryRank: 350000,
      stateRank: 25000,
      progressRank: 400000,
      consistencyRank: 300000,
      biologicalOptimizationRank: 450000,
      rigorousMetrics: {
        syllabusCompletion: 0,
        testAverage: 0,
        dailyConsistency: 0,
        weeklyTarget: 0,
        monthlyGrowth: 0
      }
    }
  }
}