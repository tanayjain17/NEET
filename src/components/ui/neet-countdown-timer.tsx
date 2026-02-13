'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Brain, 
  Clock, 
  Calendar, 
  Activity, 
  Target, 
  Award,
  Stethoscope,
  Zap
} from 'lucide-react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function NEETCountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showMilestone, setShowMilestone] = useState(false)
  const [timePercentage, setTimePercentage] = useState(0)

  const EXAM_DATE = new Date('2026-05-03T14:00:00+05:30') // May 3rd, 2026 2:00 PM IST
  const PREP_START_DATE = new Date('2024-01-01T00:00:00+05:30') // Assuming prep started Jan 2024

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
      const difference = EXAM_DATE.getTime() - istNow.getTime()

      // Calculate preparation time percentage
      const totalPrepTime = EXAM_DATE.getTime() - PREP_START_DATE.getTime()
      const elapsedPrepTime = istNow.getTime() - PREP_START_DATE.getTime()
      const percentage = (elapsedPrepTime / totalPrepTime) * 100
      setTimePercentage(Math.min(100, Math.max(0, percentage)))

      if (difference <= 0) {
        setShowMilestone(true)
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getPerformanceUrgency = (days: number): string => {
    if (days <= 30) return 'CRITICAL PHASE - Peak Performance Required'
    if (days <= 90) return 'INTENSIVE PREPARATION - High Yield Focus'
    if (days <= 180) return 'CONSOLIDATION PHASE - Systematic Review'
    return 'FOUNDATION BUILDING - Core Concept Mastery'
  }

  const getTimeColor = (value: number, type: string): string => {
    if (type === 'days') {
      if (value <= 30) return 'text-rose-400'
      if (value <= 90) return 'text-amber-400'
      if (value <= 180) return 'text-blue-400'
      return 'text-emerald-400'
    }
    return 'text-cyan-400'
  }

  if (showMilestone) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-cyan-900/40 backdrop-blur-xl border border-blue-500/30 p-8 rounded-2xl text-center max-w-md mx-4 shadow-2xl"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/30">
                <Award className="h-12 w-12 text-amber-400" />
              </div>
            </motion.div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              NEET UG 2026 Commenced
            </h2>
            
            <p className="text-slate-300 text-sm mb-4">
              The examination window has opened. All preparation protocols should now transition to execution phase.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Performance metrics indicate optimal readiness</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Brain className="h-4 w-4 text-indigo-400" />
                <span>Neural pathways fully consolidated</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>Target institution: AIIMS Delhi</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMilestone(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-blue-900/20"
            >
              <span className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" />
                Initiate Examination Protocol
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-slate-950/40 via-blue-950/20 to-indigo-950/20 border-blue-500/30 backdrop-blur-xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
      <CardContent className="p-6">
        <div className="text-center">
          
          {/* Header with Icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-[0.15em]">
              NEET UG 2026 Countdown
            </h3>
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
              <Calendar className="h-5 w-5 text-indigo-400" />
            </div>
          </div>

          {/* Time Units Grid */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <div className={`text-2xl font-mono font-bold ${getTimeColor(timeLeft.days, 'days')}`}>
                {timeLeft.days}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DAYS</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <div className="text-2xl font-mono font-bold text-cyan-400">{timeLeft.hours}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HOURS</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <div className="text-2xl font-mono font-bold text-cyan-400">{timeLeft.minutes}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">MINUTES</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <div className="text-2xl font-mono font-bold text-cyan-400">{timeLeft.seconds}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SECONDS</div>
            </div>
          </div>

          {/* Preparation Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Preparation Timeline</span>
              <span>{Math.round(timePercentage)}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${timePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Performance Phase Indicator */}
          <div className="flex items-center justify-center gap-2 p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
            <Activity className={`h-4 w-4 ${
              timeLeft.days <= 30 ? 'text-rose-400' : 
              timeLeft.days <= 90 ? 'text-amber-400' : 
              'text-emerald-400'
            }`} />
            <span className="text-xs font-medium text-slate-300">
              {getPerformanceUrgency(timeLeft.days)}
            </span>
          </div>

          {/* Professional Footer */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" /> Neural Optimization Active
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Stethoscope className="h-3 w-3" /> Clinical Readiness: {timeLeft.days <= 90 ? 'HIGH' : 'BUILDING'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}