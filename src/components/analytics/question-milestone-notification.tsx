'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuestionAnalytics } from '@/hooks/use-question-analytics'
import { X, Trophy, Target, Sparkles } from 'lucide-react'

type MilestoneType = 'daily-250' | 'daily-300' | 'daily-500' | 'weekly-2000' | 'monthly-27500'

interface Milestone {
  type: MilestoneType
  title: string
  message: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const milestones: Record<MilestoneType, Milestone> = {
  'daily-250': {
    type: 'daily-250',
    title: '🎯 Daily Target Achieved!',
    message: 'Great job! You\'ve completed 250+ questions today. You\'re on track for NEET success!',
    icon: <Target className="h-6 w-6" />,
    color: 'text-green-400',
    bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500'
  },
  'daily-300': {
    type: 'daily-300',
    title: '⭐ Excellent Progress!',
    message: 'Amazing! 300+ questions today shows real dedication. Keep up this fantastic pace!',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500'
  },
  'daily-500': {
    type: 'daily-500',
    title: '🔥 UNSTOPPABLE!',
    message: 'WOW! 500+ questions today! You\'re absolutely crushing it! This dedication will pay off!',
    icon: <Trophy className="h-6 w-6" />,
    color: 'text-yellow-400',
    bgColor: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500'
  },
  'weekly-2000': {
    type: 'weekly-2000',
    title: '🏆 Weekly Champion!',
    message: '2000+ questions this week! You\'re setting the bar high. This consistency leads to success!',
    icon: <Trophy className="h-6 w-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500'
  },
  'monthly-27500': {
    type: 'monthly-27500',
    title: '🌟 Monthly Superstar!',
    message: '27500+ questions this month! You\'re demonstrating the dedication of a future doctor!',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'text-pink-400',
    bgColor: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500'
  }
}

export function QuestionMilestoneNotification() {
  const { data: analytics } = useQuestionAnalytics()
  const [achievedMilestones, setAchievedMilestones] = useState<Set<string>>(new Set())
  const [currentNotification, setCurrentNotification] = useState<Milestone | null>(null)

  useEffect(() => {
    if (!analytics) return

    const { today } = analytics
    const todayKey = new Date().toDateString()

    // Check for daily milestones
    if (today.daily >= 500 && !achievedMilestones.has(`daily-500-${todayKey}`)) {
      setCurrentNotification(milestones['daily-500'])
      setAchievedMilestones(prev => new Set(prev).add(`daily-500-${todayKey}`))
    } else if (today.daily >= 300 && !achievedMilestones.has(`daily-300-${todayKey}`)) {
      setCurrentNotification(milestones['daily-300'])
      setAchievedMilestones(prev => new Set(prev).add(`daily-300-${todayKey}`))
    } else if (today.daily >= 250 && !achievedMilestones.has(`daily-250-${todayKey}`)) {
      setCurrentNotification(milestones['daily-250'])
      setAchievedMilestones(prev => new Set(prev).add(`daily-250-${todayKey}`))
    }

    // Check for weekly milestones
    const weekKey = `week-${Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))}`
    if (today.weekly >= 2000 && !achievedMilestones.has(`weekly-2000-${weekKey}`)) {
      setCurrentNotification(milestones['weekly-2000'])
      setAchievedMilestones(prev => new Set(prev).add(`weekly-2000-${weekKey}`))
    }

    // Check for monthly milestones
    const monthKey = `${new Date().getFullYear()}-${new Date().getMonth()}`
    if (today.monthly >= 27500 && !achievedMilestones.has(`monthly-27500-${monthKey}`)) {
      setCurrentNotification(milestones['monthly-27500'])
      setAchievedMilestones(prev => new Set(prev).add(`monthly-27500-${monthKey}`))
    }
  }, [analytics, achievedMilestones])

  // Auto-dismiss notification after 10 seconds
  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        setCurrentNotification(null)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [currentNotification])

  if (!currentNotification) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.6 
        }}
        className="fixed bottom-4 right-4 z-[9999] max-w-sm"
      >
        <div className={`${currentNotification.bgColor} border-2 rounded-xl p-4 shadow-2xl backdrop-blur-sm`}>
          <div className="flex items-start gap-3">
            <motion.div
              className={currentNotification.color}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {currentNotification.icon}
            </motion.div>
            
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm mb-1">
                {currentNotification.title}
              </h3>
              <p className="text-gray-200 text-xs leading-relaxed">
                {currentNotification.message}
              </p>
            </div>
            
            <button
              onClick={() => setCurrentNotification(null)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-3">
            <motion.div
              className="h-1 bg-gray-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className={`h-full ${currentNotification.color.replace('text-', 'bg-')}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Hook to trigger milestone notifications
 */
export function useMilestoneNotifications() {
  const { data: analytics } = useQuestionAnalytics()
  const [lastChecked, setLastChecked] = useState<number>(0)

  useEffect(() => {
    if (!analytics) return

    const now = Date.now()
    if (now - lastChecked < 5000) return // Throttle checks to every 5 seconds

    setLastChecked(now)
  }, [analytics, lastChecked])

  return {
    shouldCheck: analytics !== undefined
  }
}