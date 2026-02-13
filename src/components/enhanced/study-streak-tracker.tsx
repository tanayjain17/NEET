'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'

export default function StudyStreakTracker() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: streakData } = useQuery({
    queryKey: ['study-streaks', user?.email],
    queryFn: async () => {
      const response = await fetch('/api/study-streaks')
      if (!response.ok) throw new Error('Failed to fetch streak data')
      return response.json()
    },
    enabled: !!user?.email
  })

  const updateStreak = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/study-streaks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!response.ok) throw new Error('Failed to update streak')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-streaks'] })
    }
  })

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '🔥'
    if (streak >= 30) return '⭐'
    if (streak >= 14) return '💪'
    if (streak >= 7) return '🎯'
    if (streak >= 3) return '📚'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return 'LEGENDARY! You\'re unstoppable! 🏆'
    if (streak >= 50) return 'ON FIRE! Keep the momentum! 🔥'
    if (streak >= 30) return 'SUPERSTAR! Amazing consistency! ⭐'
    if (streak >= 14) return 'STRONG! Two weeks straight! 💪'
    if (streak >= 7) return 'FOCUSED! One week done! 🎯'
    if (streak >= 3) return 'BUILDING! Great start! 📚'
    if (streak >= 1) return 'GROWING! Keep it up! 🌱'
    return 'START TODAY! Begin your journey! 💕'
  }

  const currentStreak = streakData?.currentStreak || 0
  const longestStreak = streakData?.longestStreak || 0
  const totalDays = streakData?.totalDays || 0

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="text-center mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="text-6xl mb-3"
        >
          {getStreakEmoji(currentStreak)}
        </motion.div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          Study Streak
        </h3>
        
        <motion.p 
          key={currentStreak}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-pink-300 font-medium"
        >
          {getStreakMessage(currentStreak)}
        </motion.p>
      </div>

      {/* Current Streak Display */}
      <div className="text-center mb-6">
        <motion.div
          key={currentStreak}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl font-bold text-white mb-2"
        >
          {currentStreak}
        </motion.div>
        <p className="text-gray-400">
          {currentStreak === 1 ? 'day' : 'days'} in a row
        </p>
      </div>

      {/* Progress Bar to Next Milestone */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Next milestone</span>
          <span>
            {currentStreak >= 100 ? 'MAX LEVEL!' : 
             currentStreak >= 50 ? '100 days' :
             currentStreak >= 30 ? '50 days' :
             currentStreak >= 14 ? '30 days' :
             currentStreak >= 7 ? '14 days' :
             currentStreak >= 3 ? '7 days' : '3 days'}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
            initial={{ width: 0 }}
            animate={{ 
              width: currentStreak >= 100 ? '100%' :
                     currentStreak >= 50 ? `${((currentStreak - 50) / 50) * 100}%` :
                     currentStreak >= 30 ? `${((currentStreak - 30) / 20) * 100}%` :
                     currentStreak >= 14 ? `${((currentStreak - 14) / 16) * 100}%` :
                     currentStreak >= 7 ? `${((currentStreak - 7) / 7) * 100}%` :
                     currentStreak >= 3 ? `${((currentStreak - 3) / 4) * 100}%` :
                     `${(currentStreak / 3) * 100}%`
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
          <div className="text-xl font-bold text-yellow-400">{longestStreak}</div>
          <div className="text-xs text-gray-400">Longest Streak</div>
        </div>
        <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
          <div className="text-xl font-bold text-green-400">{totalDays}</div>
          <div className="text-xs text-gray-400">Total Study Days</div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => updateStreak.mutate()}
        disabled={updateStreak.isPending}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
      >
        {updateStreak.isPending ? '⏳ Updating...' : '✅ Mark Today Complete'}
      </motion.button>

      {/* Motivational Quote */}
      <div className="mt-4 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
        <p className="text-pink-200 text-sm text-center italic">
          "Success is the sum of small efforts repeated day in and day out." 💕
        </p>
      </div>
    </div>
  )
}