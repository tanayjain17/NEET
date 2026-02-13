'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CalendarIcon } from '@heroicons/react/24/outline'

type DailyGoal = {
  id: string
  date: string
  totalQuestions: number
  physicsDpp: number
  chemistryDpp: number
  botanyDpp: number
  zoologyDpp: number
  physicsRevision: number
  chemistryRevision: number
  botanyRevision: number
  zoologyRevision: number
}

export default function YesterdayPerformance() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const { data: yesterdayGoal } = useQuery<DailyGoal>({
    queryKey: ['yesterday-goal', yesterdayStr],
    queryFn: async () => {
      const response = await fetch(`/api/daily-goals/date?date=${yesterdayStr}`)
      if (!response.ok) return null
      const result = await response.json()
      return result.data
    }
  })

  if (!yesterdayGoal || yesterdayGoal.totalQuestions === 0) {
    return null
  }

  const totalDpp = yesterdayGoal.physicsDpp + yesterdayGoal.chemistryDpp + 
                  yesterdayGoal.botanyDpp + yesterdayGoal.zoologyDpp
  const totalRevision = yesterdayGoal.physicsRevision + yesterdayGoal.chemistryRevision + 
                       yesterdayGoal.botanyRevision + yesterdayGoal.zoologyRevision

  const getPerformanceEmoji = (questions: number) => {
    if (questions >= 500) return '🔥'
    if (questions >= 300) return '😘'
    if (questions >= 250) return '😊'
    if (questions >= 150) return '😐'
    if (questions > 0) return '😟'
    return '😴'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span>Yesterday's Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-lg border border-gray-600/30">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getPerformanceEmoji(yesterdayGoal.totalQuestions)}</span>
              <div>
                <div className="text-lg font-bold text-white">
                  {yesterdayGoal.totalQuestions} Questions
                </div>
                <div className="text-sm text-gray-300">
                  {totalDpp} DPPs • {totalRevision}h Revision
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                {yesterday.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}