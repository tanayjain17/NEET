'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CalendarIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

type DailyGoal = {
  id: string
  date: string
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
  physicsDpp: number
  chemistryDpp: number
  botanyDpp: number
  zoologyDpp: number
  physicsRevision: number
  chemistryRevision: number
  botanyRevision: number
  zoologyRevision: number
  totalQuestions: number
  createdAt: string
  updatedAt: string
}

export default function RecentGoals() {
  const { data: recentGoals, isLoading } = useQuery<DailyGoal[]>({
    queryKey: ['recent-goals'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/recent')
      if (!response.ok) throw new Error('Failed to fetch recent goals')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const getPerformanceEmoji = (totalQuestions: number) => {
    if (totalQuestions >= 500) return '🔥'
    if (totalQuestions >= 300) return '😘'
    if (totalQuestions >= 250) return '😊'
    if (totalQuestions >= 150) return '😐'
    if (totalQuestions > 0) return '😟'
    return '😴'
  }

  const getPerformanceColor = (totalQuestions: number) => {
    if (totalQuestions >= 500) return 'text-red-400'
    if (totalQuestions >= 300) return 'text-pink-400'
    if (totalQuestions >= 250) return 'text-green-400'
    if (totalQuestions >= 150) return 'text-yellow-400'
    if (totalQuestions > 0) return 'text-orange-400'
    return 'text-gray-400'
  }

  const getPerformanceLabel = (totalQuestions: number) => {
    if (totalQuestions >= 500) return 'FIRE!'
    if (totalQuestions >= 300) return 'Amazing'
    if (totalQuestions >= 250) return 'Great'
    if (totalQuestions >= 150) return 'Good'
    if (totalQuestions > 0) return 'Keep going'
    return 'No progress'
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recentGoals || recentGoals.length === 0) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No daily goals recorded yet</p>
            <p className="text-sm mt-1">Start tracking your daily progress!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Goals (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-background-secondary/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getPerformanceEmoji(goal.totalQuestions)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium">
                        {new Date(goal.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-lg font-bold ${getPerformanceColor(goal.totalQuestions)}`}>
                        {goal.totalQuestions}
                      </span>
                      <span className="text-sm text-gray-400">questions</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPerformanceColor(goal.totalQuestions)} bg-current/10`}>
                        {getPerformanceLabel(goal.totalQuestions)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                    title="Edit goal"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete goal"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Physics', questions: goal.physicsQuestions, dpp: goal.physicsDpp, revision: goal.physicsRevision, color: 'text-blue-400' },
                  { name: 'Chemistry', questions: goal.chemistryQuestions, dpp: goal.chemistryDpp, revision: goal.chemistryRevision, color: 'text-green-400' },
                  { name: 'Botany', questions: goal.botanyQuestions, dpp: goal.botanyDpp, revision: goal.botanyRevision, color: 'text-emerald-400' },
                  { name: 'Zoology', questions: goal.zoologyQuestions, dpp: goal.zoologyDpp, revision: goal.zoologyRevision, color: 'text-purple-400' }
                ].map((subject) => (
                  <div key={subject.name} className="text-center p-2 bg-background-secondary/20 rounded">
                    <div className={`text-xs font-medium ${subject.color} mb-1`}>
                      {subject.name}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-white">
                        <span className="font-semibold">{subject.questions}</span>
                        <span className="text-xs text-gray-400 ml-1">Q</span>
                      </div>
                      <div className="flex justify-center space-x-2 text-xs text-gray-400">
                        <span>{subject.dpp} DPP</span>
                        <span>{subject.revision}h Rev</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                <div className="flex space-x-4 text-sm text-gray-400">
                  <span>
                    DPPs: <span className="text-white">{goal.physicsDpp + goal.chemistryDpp + goal.botanyDpp + goal.zoologyDpp}</span>
                  </span>
                  <span>
                    Revision: <span className="text-white">{goal.physicsRevision + goal.chemistryRevision + goal.botanyRevision + goal.zoologyRevision}h</span>
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Updated: {new Date(goal.updatedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}