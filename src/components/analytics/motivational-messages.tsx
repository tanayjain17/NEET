'use client'

import { useQuestionAnalytics } from '@/hooks/use-question-analytics'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Target, Trophy, Zap, Heart, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type MotivationalMessage = {
  type: 'praise' | 'boost' | 'encouragement' | 'milestone'
  title: string
  message: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

/**
 * Get motivational message based on daily question count
 */
function getMotivationalMessage(dailyCount: number, weeklyCount: number, monthlyCount: number): MotivationalMessage | null {
  // Motivational boost messages for 500+ daily questions
  if (dailyCount >= 500) {
    const boostMessages = [
      {
        type: 'boost' as const,
        title: '🔥 UNSTOPPABLE FORCE!',
        message: `${dailyCount} questions today! You're absolutely crushing it! This level of dedication will definitely pay off in NEET!`,
        icon: <Trophy className="h-6 w-6" />,
        color: 'text-yellow-400',
        bgColor: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      },
      {
        type: 'boost' as const,
        title: '⚡ LIGHTNING SPEED!',
        message: `WOW! ${dailyCount} questions solved today! You're moving at the speed of light! Keep this momentum going!`,
        icon: <Zap className="h-6 w-6" />,
        color: 'text-purple-400',
        bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
      },
      {
        type: 'boost' as const,
        title: '🚀 ROCKET FUEL!',
        message: `${dailyCount} questions today! You're not just studying, you're launching yourself towards success! Amazing work!`,
        icon: <Sparkles className="h-6 w-6" />,
        color: 'text-blue-400',
        bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      }
    ]
    return boostMessages[Math.floor(Math.random() * boostMessages.length)]
  }

  // Praise messages for 250-300 daily questions
  if (dailyCount >= 250 && dailyCount < 500) {
    const praiseMessages = [
      {
        type: 'praise' as const,
        title: '🎯 EXCELLENT PROGRESS!',
        message: `${dailyCount} questions completed today! You're right on track for NEET success. Keep up this fantastic pace!`,
        icon: <Target className="h-6 w-6" />,
        color: 'text-green-400',
        bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
      },
      {
        type: 'praise' as const,
        title: '⭐ STELLAR PERFORMANCE!',
        message: `Great job! ${dailyCount} questions today shows real dedication. You're building the foundation for NEET success!`,
        icon: <Star className="h-6 w-6" />,
        color: 'text-indigo-400',
        bgColor: 'bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border-indigo-500/30'
      },
      {
        type: 'praise' as const,
        title: '💪 STRONG EFFORT!',
        message: `${dailyCount} questions solved! Your consistency is impressive. This is exactly how NEET toppers prepare!`,
        icon: <Heart className="h-6 w-6" />,
        color: 'text-pink-400',
        bgColor: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/30'
      }
    ]
    return praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
  }

  // Milestone messages for weekly/monthly achievements
  if (weeklyCount >= 2000) {
    return {
      type: 'milestone' as const,
      title: '🏆 WEEKLY CHAMPION!',
      message: `${weeklyCount} questions this week! You're setting the bar high. This consistency will lead to NEET success!`,
      icon: <Trophy className="h-6 w-6" />,
      color: 'text-yellow-400',
      bgColor: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
    }
  }

  if (monthlyCount >= 27500) {
    return {
      type: 'milestone' as const,
      title: '🌟 MONTHLY SUPERSTAR!',
      message: `${monthlyCount} questions this month! You're demonstrating the dedication of a future doctor. Incredible work!`,
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-purple-400',
      bgColor: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/30'
    }
  }

  // Encouragement for lower counts
  if (dailyCount > 0 && dailyCount < 250) {
    const encouragementMessages = [
      {
        type: 'encouragement' as const,
        title: '🌱 GROWING STRONG!',
        message: `${dailyCount} questions today is a great start! Every question brings you closer to your NEET goal. Keep building momentum!`,
        icon: <Target className="h-6 w-6" />,
        color: 'text-blue-400',
        bgColor: 'bg-gradient-to-r from-blue-500/20 to-sky-500/20 border-blue-500/30'
      },
      {
        type: 'encouragement' as const,
        title: '💫 EVERY STEP COUNTS!',
        message: `${dailyCount} questions completed! Remember, consistency beats intensity. You're on the right path to NEET success!`,
        icon: <Heart className="h-6 w-6" />,
        color: 'text-green-400',
        bgColor: 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30'
      }
    ]
    return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
  }

  return null
}

export function MotivationalMessages() {
  const { data: analytics, isLoading } = useQuestionAnalytics()

  if (isLoading || !analytics) {
    return null
  }

  const { today } = analytics
  const message = getMotivationalMessage(today.daily, today.weekly, today.monthly)

  if (!message) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className={`${message.bgColor} border-2 overflow-hidden relative`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <motion.div
                className={`${message.color} flex-shrink-0`}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {message.icon}
              </motion.div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">
                    {message.title}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`${message.color} border-current`}
                  >
                    {message.type.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-gray-200 leading-relaxed">
                  {message.message}
                </p>
                
                {/* Progress indicator for daily goals */}
                {today.daily > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Daily Progress</span>
                      <span>{today.daily}/500 questions</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((today.daily / 500) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <motion.div
                className={`w-full h-full ${message.color.replace('text-', 'bg-')} rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Compact version for smaller spaces
 */
export function CompactMotivationalMessage() {
  const { data: analytics, isLoading } = useQuestionAnalytics()

  if (isLoading || !analytics) {
    return null
  }

  const { today } = analytics
  const message = getMotivationalMessage(today.daily, today.weekly, today.monthly)

  if (!message) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${message.bgColor} border rounded-lg p-3`}
    >
      <div className="flex items-center gap-3">
        <div className={message.color}>
          {message.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm">
            {message.title}
          </h4>
          <p className="text-gray-300 text-xs">
            {today.daily} questions today!
          </p>
        </div>
        <Badge variant="outline" className={`${message.color} border-current text-xs`}>
          {message.type}
        </Badge>
      </div>
    </motion.div>
  )
}