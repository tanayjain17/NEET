'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AIR50CycleSummary() {
  const { data: predictions } = useQuery({
    queryKey: ['energy-mood-predictions-summary'],
    queryFn: async () => {
      const response = await fetch('/api/cycle-optimization/predictions')
      if (!response.ok) return null
      return response.json()
    }
  })

  const { data: schedule } = useQuery({
    queryKey: ['cycle-schedule-today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/cycle-optimization/schedule?date=${today}`)
      if (!response.ok) return null
      return response.json()
    }
  })

  const todayPrediction = predictions?.data?.[0]
  const todaySchedule = schedule?.data

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'text-red-400'
      case 'follicular': return 'text-green-400'
      case 'ovulation': return 'text-yellow-400'
      case 'luteal': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case 'menstrual': return '🔴'
      case 'follicular': return '🌱'
      case 'ovulation': return '⭐'
      case 'luteal': return '🌙'
      default: return '📅'
    }
  }

  if (!todayPrediction && !todaySchedule) {
    return (
      <Card className="glass-effect border-pink-400/30">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🌸</div>
          <h3 className="text-white font-semibold mb-2">AIR 50 Cycle Optimization</h3>
          <p className="text-gray-300 text-sm mb-4">
            Track your menstrual cycle to unlock AI-powered study optimization for achieving AIR 50!
          </p>
          <Link 
            href="/insights" 
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Start Tracking →
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect border-pink-400/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <span className="mr-2">🚀</span>
          AIR 50 Cycle Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's Status */}
          {todayPrediction && (
            <div className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPhaseEmoji(todayPrediction.cyclePhase)}</span>
                <div>
                  <div className={`font-semibold ${getPhaseColor(todayPrediction.cyclePhase)}`}>
                    {todayPrediction.cyclePhase.charAt(0).toUpperCase() + todayPrediction.cyclePhase.slice(1)} Phase
                  </div>
                  <div className="text-xs text-gray-400">Day {todayPrediction.cycleDay}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {todayPrediction.predictedEnergy}/10
                </div>
                <div className="text-xs text-gray-400">Energy</div>
              </div>
            </div>
          )}

          {/* Study Optimization */}
          {todaySchedule && (
            <div className="p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-pink-300 font-medium">Today's Focus</span>
                <span className="text-white font-bold">{todaySchedule.totalStudyHours}h planned</span>
              </div>
              <div className="text-sm text-gray-300">
                {getDifficultyRecommendation(todaySchedule.difficultyFocus, todaySchedule.cyclePhase)}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href="/insights?tab=cycle-schedule"
              className="p-2 bg-blue-500/10 rounded-lg border border-blue-400/20 text-center hover:bg-blue-500/20 transition-colors"
            >
              <div className="text-blue-300 text-sm font-medium">📅 AI Schedule</div>
            </Link>
            <Link 
              href="/insights?tab=emergency"
              className="p-2 bg-red-500/10 rounded-lg border border-red-400/20 text-center hover:bg-red-500/20 transition-colors"
            >
              <div className="text-red-300 text-sm font-medium">🆘 Emergency</div>
            </Link>
          </div>

          {/* Performance Indicator */}
          <div className="text-center p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-400/20">
            <div className="text-green-300 font-medium text-sm mb-1">
              🎯 AIR 50 Optimization Active
            </div>
            <div className="text-xs text-gray-400">
              Cycle-aware study planning for peak performance
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getDifficultyRecommendation(focus: string, phase: string): string {
  const recommendations = {
    light: 'Perfect for revision and easy topics - maintain momentum',
    moderate: 'Good for practice questions and consolidation',
    intense: 'Peak performance time - tackle your toughest challenges!'
  }
  
  return recommendations[focus as keyof typeof recommendations] || 'Optimized study plan ready'
}