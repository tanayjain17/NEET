'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { FlagIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type DailyGoalSummary = {
  totalQuestions: number
  totalDpp: number
  totalRevision: number
  emoji: string
  motivationalMessage: string
}

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

export default function DailyGoalsCard() {
  const { data: summary } = useQuery<DailyGoalSummary>({
    queryKey: ['daily-goal-summary'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/summary')
      if (!response.ok) throw new Error('Failed to fetch summary')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })

  const { data: stats } = useQuery<QuestionStats>({
    queryKey: ['question-stats'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FlagIcon className="h-5 w-5 text-pink-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent font-bold">Aaj ke Sapne</span>
            </div>
            <Link 
              href="/daily-goals"
              className="text-gray-400 hover:text-pink-400 transition-colors group-hover:translate-x-1 transform duration-200"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Today's Performance */}
          {summary && (
            <div className="relative overflow-hidden p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-400/30">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    {summary.emoji}
                  </motion.span>
                  <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                      {summary.totalQuestions} Sawal Solve Kiye!
                    </div>
                    <div className="text-sm text-pink-200">
                      {summary.totalDpp} DPPs • {summary.totalRevision}h Revision
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bars */}
          {stats && (
            <div className="space-y-3">
              {/* Weekly Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-pink-300">Is Hafte ka Progress</span>
                  <span className={getProgressColor(stats.weeklyProgress)}>
                    {stats.weekly}/{stats.weeklyGoal}
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
              </div>

              {/* Monthly Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-300">Is Mahine ka Progress</span>
                  <span className={getProgressColor(stats.monthlyProgress)}>
                    {stats.monthly}/{stats.monthlyGoal}
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
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-pink-400/30">
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">{stats.daily}</div>
                <div className="text-xs text-pink-300">Aaj</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">{stats.weekly}</div>
                <div className="text-xs text-purple-300">Is Hafte</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {stats.lifetime > 999 ? `${(stats.lifetime / 1000).toFixed(1)}k` : stats.lifetime}
                </div>
                <div className="text-xs text-cyan-300">Total</div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          {summary && summary.motivationalMessage && (
            <div className="text-center p-2 bg-background-secondary/30 rounded-lg">
              <p className="text-sm text-gray-300 italic">
                "{summary.motivationalMessage}"
              </p>
            </div>
          )}

          {/* Call to Action */}
          <Link 
            href="/daily-goals"
            className="block w-full text-center py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-300 border border-pink-400/30 rounded-xl transition-all text-sm font-medium"
          >
            Aaj ka Progress Track Karo 💕
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}