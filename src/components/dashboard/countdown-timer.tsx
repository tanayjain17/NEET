'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const targetDate = new Date('2026-05-03T14:00:00+05:30') // May 3rd, 2026, 2:00 PM IST

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="glass-effect rounded-xl p-6 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-3 h-20"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalDays = timeLeft.days
  const isUrgent = totalDays <= 30
  const isCritical = totalDays <= 7

  return (
    <motion.div 
      className="glass-effect rounded-xl p-6 text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        <motion.h2 
          className={`text-xl md:text-2xl font-bold mb-2 ${
            isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-white'
          }`}
          animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🎯 NEET UG 2026 Countdown
        </motion.h2>
        
        <p className="text-gray-400 text-sm mb-6">
          May 3rd, 2026 • 2:00 PM IST
        </p>
        
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {/* Days */}
          <motion.div 
            className={`rounded-lg p-3 md:p-4 border transition-all duration-300 ${
              isCritical 
                ? 'bg-red-500/20 border-red-500/50' 
                : isUrgent 
                  ? 'bg-yellow-500/20 border-yellow-500/50'
                  : 'bg-primary/20 border-primary/30'
            }`}
            whileHover={{ scale: 1.05 }}
            animate={isCritical ? { 
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0.4)',
                '0 0 0 10px rgba(239, 68, 68, 0)',
                '0 0 0 0 rgba(239, 68, 68, 0)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className={`text-2xl md:text-3xl font-bold ${
                isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-primary'
              }`}
              key={timeLeft.days}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {timeLeft.days}
            </motion.div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Days
            </div>
          </motion.div>
          
          {/* Hours */}
          <motion.div 
            className="bg-primary/20 rounded-lg p-3 md:p-4 border border-primary/30"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-2xl md:text-3xl font-bold text-primary"
              key={timeLeft.hours}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {timeLeft.hours.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Hours
            </div>
          </motion.div>
          
          {/* Minutes */}
          <motion.div 
            className="bg-primary/20 rounded-lg p-3 md:p-4 border border-primary/30"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-2xl md:text-3xl font-bold text-primary"
              key={timeLeft.minutes}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {timeLeft.minutes.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Minutes
            </div>
          </motion.div>
          
          {/* Seconds */}
          <motion.div 
            className="bg-primary/20 rounded-lg p-3 md:p-4 border border-primary/30"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              scale: [1, 1.02, 1],
              borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.3)']
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <motion.div 
              className="text-2xl md:text-3xl font-bold text-primary"
              key={timeLeft.seconds}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {timeLeft.seconds.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Seconds
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-6 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`text-sm font-medium ${
            isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-gray-300'
          }`}>
            {isCritical 
              ? '🚨 Final Sprint! Every moment counts!' 
              : isUrgent 
                ? '⚡ Crunch time! Stay focused!' 
                : '💪 Time remaining until NEET UG 2026'
            }
          </div>
          
          {totalDays > 0 && (
            <div className="text-xs text-gray-400">
              That's {Math.floor(totalDays / 7)} weeks and {totalDays % 7} days to achieve your dream! 🎯
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}