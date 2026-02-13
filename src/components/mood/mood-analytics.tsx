'use client'

import { useMemo } from 'react'
import { 
  FaceFrownIcon, 
  FaceSmileIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { FaceSmileIcon as FaceNeutralIcon } from '@heroicons/react/24/outline'

interface MoodEntry {
  id: string
  date: string
  mood: 'sad' | 'neutral' | 'happy'
}

interface MoodAnalyticsProps {
  moodEntries: MoodEntry[]
  timeRange: 'week' | 'month' | 'quarter'
}

export default function MoodAnalytics({ moodEntries, timeRange }: MoodAnalyticsProps) {
  const analytics = useMemo(() => {
    if (moodEntries.length === 0) {
      return {
        totalDays: 0,
        moodCounts: { sad: 0, neutral: 0, happy: 0 },
        moodPercentages: { sad: 0, neutral: 0, happy: 0 },
        trend: 'stable' as 'improving' | 'declining' | 'stable',
        insights: [],
        streaks: { current: 0, longest: 0, type: 'neutral' as 'sad' | 'neutral' | 'happy' }
      }
    }

    // Calculate mood counts
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood]++
      return acc
    }, { sad: 0, neutral: 0, happy: 0 })

    const totalDays = moodEntries.length

    // Calculate percentages
    const moodPercentages = {
      sad: Math.round((moodCounts.sad / totalDays) * 100),
      neutral: Math.round((moodCounts.neutral / totalDays) * 100),
      happy: Math.round((moodCounts.happy / totalDays) * 100)
    }

    // Calculate trend (compare first half vs second half)
    const midPoint = Math.floor(moodEntries.length / 2)
    const firstHalf = moodEntries.slice(0, midPoint)
    const secondHalf = moodEntries.slice(midPoint)

    const getHappinessScore = (entries: MoodEntry[]) => {
      return entries.reduce((score, entry) => {
        switch (entry.mood) {
          case 'sad': return score + 1
          case 'neutral': return score + 2
          case 'happy': return score + 3
          default: return score
        }
      }, 0) / entries.length
    }

    const firstHalfScore = firstHalf.length > 0 ? getHappinessScore(firstHalf) : 2
    const secondHalfScore = secondHalf.length > 0 ? getHappinessScore(secondHalf) : 2
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    if (secondHalfScore > firstHalfScore + 0.2) trend = 'improving'
    else if (secondHalfScore < firstHalfScore - 0.2) trend = 'declining'

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let currentStreakType: 'sad' | 'neutral' | 'happy' = 'neutral'
    let longestStreakType: 'sad' | 'neutral' | 'happy' = 'neutral'
    let tempStreak = 0
    let tempType: 'sad' | 'neutral' | 'happy' = 'neutral'

    // Sort entries by date to calculate streaks properly
    const sortedEntries = [...moodEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i]
      
      if (i === 0 || entry.mood === tempType) {
        tempStreak++
        tempType = entry.mood
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
          longestStreakType = tempType
        }
        tempStreak = 1
        tempType = entry.mood
      }
      
      // Update current streak (from the end)
      if (i === sortedEntries.length - 1) {
        currentStreak = tempStreak
        currentStreakType = tempType
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
          longestStreakType = tempType
        }
      }
    }

    // Generate insights
    const insights = []
    
    if (moodPercentages.happy >= 60) {
      insights.push("🎉 You're having a great time! Your positive mood is excellent for learning.")
    } else if (moodPercentages.happy >= 40) {
      insights.push("😊 You're maintaining a good balance. Keep up the positive energy!")
    }
    
    if (moodPercentages.sad >= 40) {
      insights.push("💪 You're facing some challenges. Remember, difficult days are part of the journey.")
    }
    
    if (trend === 'improving') {
      insights.push("📈 Your mood is trending upward! You're building positive momentum.")
    } else if (trend === 'declining') {
      insights.push("📉 Consider taking breaks and practicing self-care to boost your mood.")
    }
    
    if (longestStreak >= 5) {
      const streakEmoji = longestStreakType === 'happy' ? '🔥' : longestStreakType === 'neutral' ? '⚖️' : '🌧️'
      insights.push(`${streakEmoji} Your longest ${longestStreakType} streak was ${longestStreak} days.`)
    }

    if (insights.length === 0) {
      insights.push("📊 Keep tracking your mood to get personalized insights!")
    }

    return {
      totalDays,
      moodCounts,
      moodPercentages,
      trend,
      insights,
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        type: currentStreakType
      }
    }
  }, [moodEntries])

  const moodConfig = {
    sad: { 
      label: 'Challenging', 
      icon: FaceFrownIcon, 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    neutral: { 
      label: 'Neutral', 
      icon: FaceNeutralIcon, 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    happy: { 
      label: 'Great', 
      icon: FaceSmileIcon, 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    }
  }

  const getTrendIcon = () => {
    switch (analytics.trend) {
      case 'improving':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
      case 'declining':
        return <ArrowTrendingDownIcon className="h-5 w-5 text-red-400" />
      default:
        return <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (analytics.trend) {
      case 'improving': return 'text-green-400'
      case 'declining': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (analytics.totalDays === 0) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Mood Analytics</h2>
        <div className="text-center py-8">
          <CalendarDaysIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">
            Start tracking your mood to see analytics and insights here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mood Distribution */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Mood Distribution</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(moodConfig).map(([mood, config]) => {
            const count = analytics.moodCounts[mood as keyof typeof analytics.moodCounts]
            const percentage = analytics.moodPercentages[mood as keyof typeof analytics.moodPercentages]
            const Icon = config.icon
            
            return (
              <div key={mood} className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                <div className="flex items-center space-x-3">
                  <Icon className={`h-6 w-6 ${config.color}`} />
                  <div>
                    <div className={`text-lg font-semibold ${config.color}`}>
                      {count} days
                    </div>
                    <div className="text-sm text-gray-300">
                      {config.label} ({percentage}%)
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-background-secondary/30 border border-gray-700">
          {getTrendIcon()}
          <span className={`font-medium ${getTrendColor()}`}>
            Mood trend: {analytics.trend}
          </span>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Insights & Patterns</h2>
        
        <div className="space-y-3">
          {analytics.insights.map((insight, index) => (
            <div key={index} className="p-3 rounded-lg bg-background-secondary/30 border border-gray-700">
              <p className="text-gray-300">{insight}</p>
            </div>
          ))}
        </div>

        {/* Streak Information */}
        {analytics.streaks.longest > 1 && (
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
            <h3 className="text-lg font-medium text-white mb-2">Streak Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-lg font-semibold text-primary">
                  {analytics.streaks.current} {analytics.streaks.current === 1 ? 'day' : 'days'} 
                  <span className="text-sm text-gray-300 ml-2">
                    ({moodConfig[analytics.streaks.type].label.toLowerCase()})
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Longest Streak</div>
                <div className="text-lg font-semibold text-primary">
                  {analytics.streaks.longest} {analytics.streaks.longest === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}