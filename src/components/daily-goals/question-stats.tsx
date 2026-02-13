'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrophyIcon, FireIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'

type QuestionStats = {
  daily: number
  weekly: number
  monthly: number
  lifetime: number
  weeklyGoal: number
  monthlyGoal: number
  dailyGoalAchieved: boolean
  weeklyProgress: number
  monthlyProgress: number
}



export default function QuestionStats() {
  const { data: stats, isLoading } = useQuery<QuestionStats>({
    queryKey: ['question-stats'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })



  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-400'
    if (progress >= 75) return 'text-yellow-400'
    if (progress >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const getProgressBg = (progress: number) => {
    if (progress >= 100) return 'bg-green-400'
    if (progress >= 75) return 'bg-yellow-400'
    if (progress >= 50) return 'bg-orange-400'
    return 'bg-red-400'
  }

  const getMilestoneEmoji = (count: number) => {
    if (count >= 500) return '🔥'
    if (count >= 300) return '😘'
    if (count >= 250) return '😊'
    if (count >= 150) return '😐'
    if (count > 0) return '😟'
    return '😴'
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-effect border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Daily Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="text-3xl font-bold text-white">{stats.daily}</div>
                <div className="text-3xl">{getMilestoneEmoji(stats.daily)}</div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`text-sm font-medium ${stats.dailyGoalAchieved ? 'text-green-400' : 'text-gray-400'}`}>
                  Goal: 250+ {stats.dailyGoalAchieved ? '✓' : ''}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center space-x-2">
                <ChartBarIcon className="h-4 w-4" />
                <span>This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.weekly}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className={getProgressColor(stats.weeklyProgress)}>
                    {Math.round(stats.weeklyProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getProgressBg(stats.weeklyProgress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.weeklyProgress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-400">Goal: {stats.weeklyGoal}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center space-x-2">
                <TrophyIcon className="h-4 w-4" />
                <span>This Month</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.monthly}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className={getProgressColor(stats.monthlyProgress)}>
                    {Math.round(stats.monthlyProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getProgressBg(stats.monthlyProgress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.monthlyProgress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
                <div className="text-xs text-gray-400">Goal: {stats.monthlyGoal}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lifetime Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center space-x-2">
                <FireIcon className="h-4 w-4" />
                <span>Lifetime</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {stats.lifetime.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Total questions solved
              </div>
              {stats.lifetime >= 10000 && (
                <div className="text-xs text-yellow-400 mt-1 flex items-center space-x-1">
                  <TrophyIcon className="h-3 w-3" />
                  <span>10K+ Champion!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>



      {/* Motivational Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Daily Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { count: 500, emoji: '🔥', label: 'FIRE!', color: 'text-red-400' },
                { count: 300, emoji: '😘', label: 'Amazing', color: 'text-pink-400' },
                { count: 250, emoji: '😊', label: 'Great', color: 'text-green-400' },
                { count: 150, emoji: '😐', label: 'Good', color: 'text-yellow-400' },
                { count: 1, emoji: '😟', label: 'Keep going', color: 'text-orange-400' }
              ].map((milestone) => (
                <div
                  key={milestone.count}
                  className={`text-center p-3 rounded-lg border transition-all ${
                    stats.daily >= milestone.count
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-background-secondary/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{milestone.emoji}</div>
                  <div className="text-sm font-medium text-white">{milestone.count}+</div>
                  <div className={`text-xs ${milestone.color}`}>{milestone.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}