import { prisma } from './prisma'

export type ComprehensiveData = {
  subjects: any[]
  dailyGoals: any[]
  testPerformances: any[]
  menstrualCycles: any[]
  questionAnalytics: any[]
  moodEntries: any[]
  totalQuestionsLifetime: number
  averageTestScore: number
  consistencyScore: number
  weakAreas: string[]
  strongAreas: string[]
}

export class ComprehensiveDataFetcher {
  static async fetchAllUserData(userId: string): Promise<ComprehensiveData> {
    try {
      const [
        subjects,
        dailyGoals,
        testPerformances,
        menstrualCycles,
        questionAnalytics,
        moodEntries
      ] = await Promise.all([
        prisma.subject.findMany({
          include: {
            chapters: true
          }
        }),
        prisma.dailyGoal.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 90 // Last 3 months
        }),
        prisma.testPerformance.findMany({
          where: { userId },
          orderBy: { testDate: 'desc' },
          take: 50 // Last 50 tests
        }),
        prisma.menstrualCycle.findMany({
          where: { userId },
          orderBy: { cycleStartDate: 'desc' },
          take: 12 // Last 12 cycles
        }),
        prisma.questionAnalytics.findMany({
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.moodEntry.findMany({
          orderBy: { date: 'desc' },
          take: 30
        })
      ])

      // Calculate comprehensive metrics
      const totalQuestionsLifetime = dailyGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)
      const averageTestScore = testPerformances.length > 0 
        ? testPerformances.reduce((sum, test) => sum + test.score, 0) / testPerformances.length
        : 0

      const activeDays = dailyGoals.filter(goal => goal.totalQuestions > 0).length
      const consistencyScore = dailyGoals.length > 0 ? (activeDays / dailyGoals.length) * 100 : 0

      // Analyze weak and strong areas
      const subjectPerformance = subjects.map(subject => {
        const subjectTests = testPerformances.filter(test => 
          test.testType?.toLowerCase().includes(subject.name.toLowerCase())
        )
        const avgScore = subjectTests.length > 0 
          ? subjectTests.reduce((sum, test) => sum + test.score, 0) / subjectTests.length
          : 0
        
        return {
          subject: subject.name,
          avgScore,
          completion: subject.completionPercentage
        }
      })

      const weakAreas = subjectPerformance
        .filter(s => s.avgScore < 120 || s.completion < 70) // Below 120/180 per subject or <70% completion
        .map(s => s.subject)

      const strongAreas = subjectPerformance
        .filter(s => s.avgScore >= 150 && s.completion >= 85) // Above 150/180 and >85% completion
        .map(s => s.subject)

      return {
        subjects,
        dailyGoals,
        testPerformances,
        menstrualCycles,
        questionAnalytics,
        moodEntries,
        totalQuestionsLifetime,
        averageTestScore,
        consistencyScore,
        weakAreas,
        strongAreas
      }
    } catch (error) {
      console.error('Error fetching comprehensive data:', error)
      throw error
    }
  }
}