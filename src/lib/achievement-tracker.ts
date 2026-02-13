/**
 * Achievement Tracker Service
 * Tracks real progress across the entire project and updates achievements
 */

import { prisma } from './prisma'

export class AchievementTracker {
  /**
   * Calculate comprehensive user statistics for 188K question target
   */
  static async calculateUserStats(userId: string) {
    try {
      // Get all subjects and chapters
      const subjects = await prisma.subject.findMany({
        include: { chapters: true }
      })

      // Get daily goals for statistics
      const dailyGoals = await prisma.dailyGoal.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      })

      // Get test performances (each test = 180 questions)
      const testPerformances = await prisma.testPerformance.findMany({
        where: { userId },
        orderBy: { testDate: 'desc' }
      })

      // Calculate chapter completion
      let totalChapters = 0
      let completedChapters = 0
      let totalDppQuestions = 0
      let completedDppQuestions = 0
      let totalAssignmentQuestions = 0
      let completedAssignmentQuestions = 0
      let totalKattarQuestions = 0
      let completedKattarQuestions = 0

      subjects.forEach(subject => {
        subject.chapters.forEach(chapter => {
          totalChapters++
          
          // Count lectures completed
          const lecturesCompleted = Array.isArray(chapter.lecturesCompleted) 
            ? (chapter.lecturesCompleted as boolean[]).filter(Boolean).length 
            : 0
          
          // Count DPP completed
          const dppCompleted = Array.isArray(chapter.dppCompleted) 
            ? (chapter.dppCompleted as boolean[]).filter(Boolean).length 
            : 0
          totalDppQuestions += chapter.lectureCount // DPP = lecture count
          completedDppQuestions += dppCompleted

          // Count assignments
          totalAssignmentQuestions += chapter.assignmentQuestions
          completedAssignmentQuestions += Array.isArray(chapter.assignmentCompleted) 
            ? (chapter.assignmentCompleted as boolean[]).filter(Boolean).length 
            : 0

          // Count kattar questions
          totalKattarQuestions += chapter.kattarQuestions
          completedKattarQuestions += Array.isArray(chapter.kattarCompleted) 
            ? (chapter.kattarCompleted as boolean[]).filter(Boolean).length 
            : 0

          // Chapter is complete if lectures are 100% done
          if (lecturesCompleted === chapter.lectureCount && chapter.lectureCount > 0) {
            completedChapters++
          }
        })
      })

      // Calculate daily/weekly/monthly stats
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const todayGoals = dailyGoals.filter(g => 
        new Date(g.date).toDateString() === today.toDateString()
      )
      const weekGoals = dailyGoals.filter(g => new Date(g.date) >= weekAgo)
      const monthGoals = dailyGoals.filter(g => new Date(g.date) >= monthAgo)

      const todayQuestions = todayGoals.reduce((sum, g) => sum + g.totalQuestions, 0)
      const weekQuestions = weekGoals.reduce((sum, g) => sum + g.totalQuestions, 0)
      const monthQuestions = monthGoals.reduce((sum, g) => sum + g.totalQuestions, 0)
      const lifetimeQuestions = dailyGoals.reduce((sum, g) => sum + g.totalQuestions, 0)

      // Calculate study streak (handle missing table gracefully)
      let studyStreak = null
      try {
        studyStreak = await prisma.studyStreak.findFirst({
          where: { userId, streakType: 'daily' }
        })
      } catch (error) {
        console.log('StudyStreak table not available yet')
      }

      // Calculate TOTAL 188K QUESTION PROGRESS
      // Include: DPP + Assignments + Kattar + Daily Goals + Test Questions
      const testQuestions = testPerformances.length * 180 // Each NEET test = 180 questions
      const totalQuestionsSolved = completedDppQuestions + completedAssignmentQuestions + completedKattarQuestions + lifetimeQuestions + testQuestions
      const questionProgress = (totalQuestionsSolved / 188000) * 100 // Progress towards 188K

      return {
        // Chapter stats
        totalChapters,
        completedChapters,
        chapterCompletionRate: totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0,

        // Question stats (Individual categories)
        totalDppQuestions,
        completedDppQuestions,
        totalAssignmentQuestions,
        completedAssignmentQuestions,
        totalKattarQuestions,
        completedKattarQuestions,
        
        // 188K QUESTION TARGET TRACKING
        testQuestions, // Questions from tests (180 per test)
        totalQuestionsSolved, // ALL questions combined
        questionProgress, // Progress towards 188K target
        questionsRemaining: Math.max(0, 188000 - totalQuestionsSolved),
        dailyTargetForRemaining: Math.max(0, Math.ceil((188000 - totalQuestionsSolved) / Math.max(1, (new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))),

        // Daily goal stats
        todayQuestions,
        weekQuestions,
        monthQuestions,
        lifetimeQuestions,
        activeDays: dailyGoals.filter(g => g.totalQuestions > 0).length,
        totalDays: dailyGoals.length,

        // Streak stats
        currentStreak: studyStreak?.currentStreak || 0,
        longestStreak: studyStreak?.longestStreak || 0,

        // Test stats
        totalTests: testPerformances.length,
        averageScore: testPerformances.length > 0 
          ? testPerformances.reduce((sum, t) => sum + t.score, 0) / testPerformances.length 
          : 0,
        highestScore: testPerformances.length > 0 
          ? Math.max(...testPerformances.map(t => t.score)) 
          : 0
      }
    } catch (error) {
      console.error('Error calculating user stats:', error)
      return null
    }
  }

  /**
   * Check and update achievements based on current stats
   */
  static async checkAndUpdateAchievements(userId: string) {
    try {
      const stats = await this.calculateUserStats(userId)
      if (!stats) return

      // Get all achievements
      const achievements = await prisma.achievement.findMany({
        where: { isActive: true }
      })

      for (const achievement of achievements) {
        const condition = achievement.condition as any
        let progress = 0
        let isCompleted = false

        // Check achievement conditions
        switch (condition.type) {
          case 'chapters_completed':
            progress = Math.min(1, stats.completedChapters / condition.count)
            isCompleted = stats.completedChapters >= condition.count
            break

          case 'questions_solved':
            progress = Math.min(1, stats.totalQuestionsSolved / condition.count)
            isCompleted = stats.totalQuestionsSolved >= condition.count
            break

          case 'total_questions_188k':
            progress = Math.min(1, stats.totalQuestionsSolved / 188000)
            isCompleted = stats.totalQuestionsSolved >= 188000
            break

          case 'daily_questions':
            progress = Math.min(1, stats.todayQuestions / condition.count)
            isCompleted = stats.todayQuestions >= condition.count
            break

          case 'weekly_questions':
            progress = Math.min(1, stats.weekQuestions / condition.count)
            isCompleted = stats.weekQuestions >= condition.count
            break

          case 'monthly_questions':
            progress = Math.min(1, stats.monthQuestions / condition.count)
            isCompleted = stats.monthQuestions >= condition.count
            break

          case 'streak':
            progress = Math.min(1, stats.currentStreak / condition.days)
            isCompleted = stats.currentStreak >= condition.days
            break

          case 'test_score':
            progress = Math.min(1, stats.highestScore / condition.score)
            isCompleted = stats.highestScore >= condition.score
            break

          case 'overall_completion':
            progress = Math.min(1, stats.chapterCompletionRate / condition.percentage)
            isCompleted = stats.chapterCompletionRate >= condition.percentage
            break

          case 'dpp_completed':
            progress = Math.min(1, stats.completedDppQuestions / condition.count)
            isCompleted = stats.completedDppQuestions >= condition.count
            break
        }

        // Update or create user achievement
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id
            }
          },
          update: {
            progress,
            isCompleted,
            ...(isCompleted && { unlockedAt: new Date() })
          },
          create: {
            userId,
            achievementId: achievement.id,
            progress,
            isCompleted,
            ...(isCompleted && { unlockedAt: new Date() })
          }
        })
      }

      return stats
    } catch (error) {
      console.error('Error checking achievements:', error)
      return null
    }
  }

  /**
   * Initialize default achievements
   */
  static async initializeDefaultAchievements() {
    try {
      const existingCount = await prisma.achievement.count()
      if (existingCount > 0) return

      const defaultAchievements = [
        // 188K QUESTION TARGET ACHIEVEMENTS (STRINGENT)
        {
          name: "Question Starter",
          description: "Solve your first 1,000 questions",
          category: "performance",
          icon: "🌱",
          condition: { type: "questions_solved", count: 1000 },
          points: 25,
          rarity: "common"
        },
        {
          name: "10K Milestone",
          description: "Solve 10,000 questions (5% of 188K target)",
          category: "performance",
          icon: "🎯",
          condition: { type: "questions_solved", count: 10000 },
          points: 100,
          rarity: "uncommon"
        },
        {
          name: "Quarter Champion",
          description: "Solve 50,000 questions (27% of 188K target)",
          category: "performance",
          icon: "⭐",
          condition: { type: "questions_solved", count: 50000 },
          points: 250,
          rarity: "rare"
        },
        {
          name: "Halfway Hero",
          description: "Solve 100,000 questions (53% of 188K target)",
          category: "milestones",
          icon: "🔥",
          condition: { type: "questions_solved", count: 100000 },
          points: 500,
          rarity: "epic"
        },
        {
          name: "188K LEGEND",
          description: "COMPLETE 188,000 QUESTIONS - NEET MASTERY!",
          category: "milestones",
          icon: "👑",
          condition: { type: "total_questions_188k", count: 188000 },
          points: 2000,
          rarity: "legendary"
        },

        // DAILY STRINGENT TARGETS
        {
          name: "Daily Warrior",
          description: "Solve 300+ questions in a single day",
          category: "consistency",
          icon: "💪",
          condition: { type: "daily_questions", count: 300 },
          points: 50,
          rarity: "uncommon"
        },
        {
          name: "Daily Beast",
          description: "Solve 500+ questions in a single day",
          category: "consistency",
          icon: "🚀",
          condition: { type: "daily_questions", count: 500 },
          points: 100,
          rarity: "rare"
        },

        // WEEKLY TARGETS
        {
          name: "Weekly Champion",
          description: "Solve 2,000+ questions in a week",
          category: "consistency",
          icon: "🏆",
          condition: { type: "weekly_questions", count: 2000 },
          points: 150,
          rarity: "rare"
        },

        // STREAK ACHIEVEMENTS
        {
          name: "Streak Warrior",
          description: "Study for 7 consecutive days",
          category: "consistency",
          icon: "🔥",
          condition: { type: "streak", days: 7 },
          points: 100,
          rarity: "uncommon"
        },
        {
          name: "Streak Beast",
          description: "Study for 30 consecutive days",
          category: "consistency",
          icon: "⚡",
          condition: { type: "streak", days: 30 },
          points: 300,
          rarity: "rare"
        },

        // TEST PERFORMANCE
        {
          name: "High Scorer",
          description: "Score 650+ in a test (AIR 50 level)",
          category: "performance",
          icon: "🌟",
          condition: { type: "test_score", score: 650 },
          points: 300,
          rarity: "epic"
        },
        {
          name: "Half Complete",
          description: "Complete 50% of all chapters",
          category: "progress",
          icon: "⭐",
          condition: { type: "overall_completion", percentage: 50 },
          points: 200,
          rarity: "rare"
        },
        {
          name: "NEET Warrior",
          description: "Complete 90% of all chapters",
          category: "milestones",
          icon: "👑",
          condition: { type: "overall_completion", percentage: 90 },
          points: 500,
          rarity: "legendary"
        },

        // Question Achievements
        {
          name: "Question Rookie",
          description: "Solve 100 questions",
          category: "performance",
          icon: "🎯",
          condition: { type: "questions_solved", count: 100 },
          points: 25,
          rarity: "common"
        },
        {
          name: "Question Beast",
          description: "Solve 1000 questions",
          category: "performance",
          icon: "🔥",
          condition: { type: "questions_solved", count: 1000 },
          points: 200,
          rarity: "epic"
        },
        {
          name: "Question Legend",
          description: "Solve 5000 questions",
          category: "performance",
          icon: "⚡",
          condition: { type: "questions_solved", count: 5000 },
          points: 1000,
          rarity: "legendary"
        },

        // Daily Achievements
        {
          name: "Daily Warrior",
          description: "Solve 100 questions in a day",
          category: "consistency",
          icon: "💪",
          condition: { type: "daily_questions", count: 100 },
          points: 50,
          rarity: "uncommon"
        },
        {
          name: "Daily Beast",
          description: "Solve 300 questions in a day",
          category: "consistency",
          icon: "🚀",
          condition: { type: "daily_questions", count: 300 },
          points: 150,
          rarity: "epic"
        },

        // Weekly Achievements
        {
          name: "Weekly Champion",
          description: "Solve 1000 questions in a week",
          category: "consistency",
          icon: "🏆",
          condition: { type: "weekly_questions", count: 1000 },
          points: 200,
          rarity: "rare"
        },

        // Streak Achievements
        {
          name: "Streak Starter",
          description: "Study for 3 consecutive days",
          category: "consistency",
          icon: "🔥",
          condition: { type: "streak", days: 3 },
          points: 30,
          rarity: "common"
        },
        {
          name: "Week Warrior",
          description: "Study for 7 consecutive days",
          category: "consistency",
          icon: "⚡",
          condition: { type: "streak", days: 7 },
          points: 100,
          rarity: "uncommon"
        },
        {
          name: "Month Master",
          description: "Study for 30 consecutive days",
          category: "consistency",
          icon: "👑",
          condition: { type: "streak", days: 30 },
          points: 500,
          rarity: "epic"
        },

        // DPP Achievements
        {
          name: "DPP Starter",
          description: "Complete 50 DPP questions",
          category: "performance",
          icon: "📝",
          condition: { type: "dpp_completed", count: 50 },
          points: 50,
          rarity: "common"
        },
        {
          name: "DPP Master",
          description: "Complete 500 DPP questions",
          category: "performance",
          icon: "🎓",
          condition: { type: "dpp_completed", count: 500 },
          points: 300,
          rarity: "rare"
        },

        // Test Performance
        {
          name: "Score Achiever",
          description: "Score 500+ in a test",
          category: "performance",
          icon: "🎯",
          condition: { type: "test_score", score: 500 },
          points: 100,
          rarity: "uncommon"
        },
        {
          name: "High Scorer",
          description: "Score 650+ in a test",
          category: "performance",
          icon: "🌟",
          condition: { type: "test_score", score: 650 },
          points: 300,
          rarity: "epic"
        }
      ]

      await prisma.achievement.createMany({
        data: defaultAchievements
      })

      console.log('Default achievements initialized')
    } catch (error) {
      console.error('Error initializing achievements:', error)
    }
  }
}