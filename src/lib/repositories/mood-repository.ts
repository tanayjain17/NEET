import { prisma } from '@/lib/prisma'
import { MoodEntry } from '@prisma/client'

export interface MoodAnalytics {
  totalEntries: number
  moodCounts: {
    sad: number
    neutral: number
    happy: number
  }
  moodPercentages: {
    sad: number
    neutral: number
    happy: number
  }
  averageHappinessScore: number
  streakData: {
    currentStreak: number
    currentStreakType: 'sad' | 'neutral' | 'happy'
    longestStreak: number
    longestStreakType: 'sad' | 'neutral' | 'happy'
  }
}

export class MoodRepository {
  /**
   * Get mood entries for a specific month
   */
  static async getMoodEntriesForMonth(userId: string, year: number, month: number): Promise<MoodEntry[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0) // Last day of month

    return await prisma.moodEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  /**
   * Get mood entries for a date range
   */
  static async getMoodEntriesForRange(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<MoodEntry[]> {
    return await prisma.moodEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  /**
   * Create or update a mood entry
   */
  static async upsertMoodEntry(
    userId: string, 
    date: Date, 
    mood: 'sad' | 'neutral' | 'happy'
  ): Promise<MoodEntry> {
    return await prisma.moodEntry.upsert({
      where: {
        date: date
      },
      update: {
        mood
      },
      create: {
        date,
        mood
      }
    })
  }

  /**
   * Get mood entry for a specific date
   */
  static async getMoodEntryForDate(userId: string, date: Date): Promise<MoodEntry | null> {
    return await prisma.moodEntry.findUnique({
      where: {
        date: date
      }
    })
  }

  /**
   * Delete a mood entry
   */
  static async deleteMoodEntry(userId: string, date: Date): Promise<void> {
    await prisma.moodEntry.delete({
      where: {
        date: date
      }
    })
  }

  /**
   * Get mood analytics for a date range
   */
  static async getMoodAnalytics(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<MoodAnalytics> {
    const entries = await this.getMoodEntriesForRange(userId, startDate, endDate)
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        moodCounts: { sad: 0, neutral: 0, happy: 0 },
        moodPercentages: { sad: 0, neutral: 0, happy: 0 },
        averageHappinessScore: 0,
        streakData: {
          currentStreak: 0,
          currentStreakType: 'neutral',
          longestStreak: 0,
          longestStreakType: 'neutral'
        }
      }
    }

    // Calculate mood counts
    const moodCounts = entries.reduce((acc, entry) => {
      if (entry.mood === 'sad') acc.sad++
      else if (entry.mood === 'neutral') acc.neutral++
      else if (entry.mood === 'happy') acc.happy++
      return acc
    }, { sad: 0, neutral: 0, happy: 0 })

    const totalEntries = entries.length

    // Calculate percentages
    const moodPercentages = {
      sad: Math.round((moodCounts.sad / totalEntries) * 100),
      neutral: Math.round((moodCounts.neutral / totalEntries) * 100),
      happy: Math.round((moodCounts.happy / totalEntries) * 100)
    }

    // Calculate average happiness score (sad=1, neutral=2, happy=3)
    const totalScore = entries.reduce((score, entry) => {
      switch (entry.mood) {
        case 'sad': return score + 1
        case 'neutral': return score + 2
        case 'happy': return score + 3
        default: return score
      }
    }, 0)
    const averageHappinessScore = totalScore / totalEntries

    // Calculate streaks
    const streakData = this.calculateStreaks(entries)

    return {
      totalEntries,
      moodCounts,
      moodPercentages,
      averageHappinessScore,
      streakData
    }
  }

  /**
   * Calculate streak information from mood entries
   */
  private static calculateStreaks(entries: MoodEntry[]) {
    if (entries.length === 0) {
      return {
        currentStreak: 0,
        currentStreakType: 'neutral' as const,
        longestStreak: 0,
        longestStreakType: 'neutral' as const
      }
    }

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime())
    
    let currentStreak = 1
    let currentStreakType: 'sad' | 'neutral' | 'happy' = sortedEntries[sortedEntries.length - 1].mood as 'sad' | 'neutral' | 'happy'
    let longestStreak = 1
    let longestStreakType: 'sad' | 'neutral' | 'happy' = sortedEntries[0].mood as 'sad' | 'neutral' | 'happy'
    let tempStreak = 1
    let tempType: 'sad' | 'neutral' | 'happy' = sortedEntries[0].mood as 'sad' | 'neutral' | 'happy'

    // Calculate streaks
    for (let i = 1; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i]
      
      if (entry.mood === tempType) {
        tempStreak++
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
          longestStreakType = tempType
        }
        tempStreak = 1
        tempType = entry.mood as 'sad' | 'neutral' | 'happy'
      }
    }

    // Check if the last streak is the longest
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
      longestStreakType = tempType
    }

    // Calculate current streak (from the end)
    currentStreak = tempStreak
    currentStreakType = tempType

    return {
      currentStreak,
      currentStreakType,
      longestStreak,
      longestStreakType
    }
  }

  /**
   * Get mood trends over time
   */
  static async getMoodTrends(
    userId: string, 
    startDate: Date, 
    endDate: Date,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    const entries = await this.getMoodEntriesForRange(userId, startDate, endDate)
    
    // Group entries by the specified time period
    const groupedData = new Map<string, { sad: number, neutral: number, happy: number }>()
    
    entries.forEach(entry => {
      let key: string
      
      switch (groupBy) {
        case 'week':
          // Get the start of the week (Sunday)
          const weekStart = new Date(entry.date)
          weekStart.setDate(weekStart.getDate() - weekStart.getDay())
          key = weekStart.toISOString().split('T')[0]
          break
        case 'month':
          key = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`
          break
        default:
          key = entry.date.toISOString().split('T')[0]
      }
      
      if (!groupedData.has(key)) {
        groupedData.set(key, { sad: 0, neutral: 0, happy: 0 })
      }
      
      const group = groupedData.get(key)!
      if (entry.mood === 'sad') group.sad++
      else if (entry.mood === 'neutral') group.neutral++
      else if (entry.mood === 'happy') group.happy++
    })
    
    return Array.from(groupedData.entries()).map(([date, counts]) => ({
      date,
      ...counts,
      total: counts.sad + counts.neutral + counts.happy,
      happinessScore: (counts.sad * 1 + counts.neutral * 2 + counts.happy * 3) / (counts.sad + counts.neutral + counts.happy)
    })).sort((a, b) => a.date.localeCompare(b.date))
  }
}