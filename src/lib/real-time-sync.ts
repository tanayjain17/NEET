/**
 * Real-time Data Synchronization Service
 * Ensures all data changes are immediately saved to database and reflected in UI
 */

import { prisma } from './prisma'

export class RealTimeSyncService {
  /**
   * Sync chapter progress changes immediately
   */
  static async syncChapterProgress(chapterId: string, updates: {
    lecturesCompleted?: boolean[]
    dppCompleted?: boolean[]
    assignmentCompleted?: boolean[]
    kattarCompleted?: boolean[]
    revisionScore?: number
  }) {
    try {
      const updatedChapter = await prisma.chapter.update({
        where: { id: chapterId },
        data: updates,
        include: { subject: true }
      })

      // Update subject completion percentage
      await this.updateSubjectProgress(updatedChapter.subjectId)

      return updatedChapter
    } catch (error) {
      console.error('Error syncing chapter progress:', error)
      throw error
    }
  }

  /**
   * Update subject progress based on all chapters
   */
  static async updateSubjectProgress(subjectId: string) {
    try {
      const chapters = await prisma.chapter.findMany({
        where: { subjectId }
      })

      if (chapters.length === 0) return

      let totalItems = 0
      let completedItems = 0
      let totalQuestions = 0

      chapters.forEach(chapter => {
        // Lectures
        totalItems += chapter.lectureCount
        completedItems += Array.isArray(chapter.lecturesCompleted) 
          ? (chapter.lecturesCompleted as boolean[]).filter(Boolean).length 
          : 0

        // DPP
        totalItems += chapter.lectureCount
        completedItems += Array.isArray(chapter.dppCompleted) 
          ? (chapter.dppCompleted as boolean[]).filter(Boolean).length 
          : 0

        // Assignments
        totalItems += chapter.assignmentQuestions
        completedItems += Array.isArray(chapter.assignmentCompleted) 
          ? (chapter.assignmentCompleted as boolean[]).filter(Boolean).length 
          : 0
        totalQuestions += chapter.assignmentQuestions

        // Kattar questions
        totalItems += chapter.kattarQuestions
        completedItems += Array.isArray(chapter.kattarCompleted) 
          ? (chapter.kattarCompleted as boolean[]).filter(Boolean).length 
          : 0
        totalQuestions += chapter.kattarQuestions
      })

      const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

      await prisma.subject.update({
        where: { id: subjectId },
        data: {
          completionPercentage,
          totalQuestions
        }
      })

      return completionPercentage
    } catch (error) {
      console.error('Error updating subject progress:', error)
      throw error
    }
  }

  /**
   * Sync daily goals with real-time updates
   */
  static async syncDailyGoals(userId: string, date: Date, updates: {
    physicsQuestions?: number
    chemistryQuestions?: number
    botanyQuestions?: number
    zoologyQuestions?: number
    physicsDpp?: number
    chemistryDpp?: number
    botanyDpp?: number
    zoologyDpp?: number
    physicsRevision?: number
    chemistryRevision?: number
    botanyRevision?: number
    zoologyRevision?: number
  }) {
    try {
      const normalizedDate = new Date(date)
      normalizedDate.setHours(0, 0, 0, 0)
      
      const totalQuestions = (updates.physicsQuestions || 0) + 
                           (updates.chemistryQuestions || 0) + 
                           (updates.botanyQuestions || 0) + 
                           (updates.zoologyQuestions || 0)

      // Use raw SQL to handle race conditions
      const result = await prisma.$executeRaw`
        INSERT INTO daily_goals (
          id, user_id, date, physics_questions, chemistry_questions, 
          botany_questions, zoology_questions, physics_dpp, chemistry_dpp,
          botany_dpp, zoology_dpp, physics_revision, chemistry_revision,
          botany_revision, zoology_revision, total_questions, created_at, updated_at
        ) VALUES (
          ${Math.random().toString(36)}, ${userId}, ${normalizedDate}, 
          ${updates.physicsQuestions || 0}, ${updates.chemistryQuestions || 0},
          ${updates.botanyQuestions || 0}, ${updates.zoologyQuestions || 0},
          ${updates.physicsDpp || 0}, ${updates.chemistryDpp || 0},
          ${updates.botanyDpp || 0}, ${updates.zoologyDpp || 0},
          ${updates.physicsRevision || 0}, ${updates.chemistryRevision || 0},
          ${updates.botanyRevision || 0}, ${updates.zoologyRevision || 0},
          ${totalQuestions}, NOW(), NOW()
        )
        ON DUPLICATE KEY UPDATE
          physics_questions = physics_questions + VALUES(physics_questions),
          chemistry_questions = chemistry_questions + VALUES(chemistry_questions),
          botany_questions = botany_questions + VALUES(botany_questions),
          zoology_questions = zoology_questions + VALUES(zoology_questions),
          physics_dpp = physics_dpp + VALUES(physics_dpp),
          chemistry_dpp = chemistry_dpp + VALUES(chemistry_dpp),
          botany_dpp = botany_dpp + VALUES(botany_dpp),
          zoology_dpp = zoology_dpp + VALUES(zoology_dpp),
          physics_revision = physics_revision + VALUES(physics_revision),
          chemistry_revision = chemistry_revision + VALUES(chemistry_revision),
          botany_revision = botany_revision + VALUES(botany_revision),
          zoology_revision = zoology_revision + VALUES(zoology_revision),
          total_questions = total_questions + VALUES(total_questions),
          updated_at = NOW()
      `

      // Return the updated record
      return await prisma.dailyGoal.findUnique({
        where: {
          userId_date: {
            userId,
            date: normalizedDate
          }
        }
      })
    } catch (error) {
      console.error('Error syncing daily goals:', error)
      throw error
    }
  }

  /**
   * Update question analytics for real-time tracking
   * Now just returns current stats since we pull from daily goals directly
   */
  static async updateQuestionAnalytics(date: Date, dailyCount: number) {
    try {
      // Question analytics now pulls directly from daily goals
      // No need to maintain separate analytics table
      const { QuestionAnalyticsRepository } = await import('@/lib/repositories/question-analytics-repository')
      return await QuestionAnalyticsRepository.getCurrentStats()
    } catch (error) {
      console.error('Error updating question analytics:', error)
      throw error
    }
  }

  /**
   * Sync test performance data
   */
  static async syncTestPerformance(userId: string, testData: {
    testType: string
    testNumber: string
    score: number
    testDate: Date
  }) {
    try {
      const testPerformance = await prisma.testPerformance.create({
        data: {
          userId,
          testType: testData.testType,
          testNumber: testData.testNumber,
          score: testData.score,
          testDate: testData.testDate
        }
      })

      return testPerformance
    } catch (error) {
      console.error('Error syncing test performance:', error)
      throw error
    }
  }

  /**
   * Sync mood entry
   */
  static async syncMoodEntry(date: Date, mood: string) {
    try {
      const moodEntry = await prisma.moodEntry.upsert({
        where: { date },
        update: { mood },
        create: { date, mood }
      })

      return moodEntry
    } catch (error) {
      console.error('Error syncing mood entry:', error)
      throw error
    }
  }

  /**
   * Get comprehensive dashboard data with real-time updates
   */
  static async getDashboardData(userId: string) {
    try {
      const [subjects, dailyGoals, testPerformances, moodEntries, questionAnalytics] = await Promise.all([
        prisma.subject.findMany({
          include: { chapters: true },
          orderBy: { name: 'asc' }
        }),
        prisma.dailyGoal.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.testPerformance.findMany({
          where: { userId },
          orderBy: { testDate: 'desc' },
          take: 10
        }),
        prisma.moodEntry.findMany({
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.questionAnalytics.findMany({
          orderBy: { date: 'desc' },
          take: 1
        })
      ])

      return {
        subjects,
        dailyGoals,
        testPerformances,
        moodEntries,
        questionAnalytics: questionAnalytics[0] || null
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }
}