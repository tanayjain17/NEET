'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress, LoadingSpinner } from '@/components/ui/enhanced-components'
import { ProgressRing, PremiumAreaChart, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid } from '@/components/ui/premium-layouts'
import {
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  BookOpenIcon,
  BeakerIcon,
  FireIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  BoltIcon,
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

interface StudyBlock {
  id: string
  subject: string
  type: string
  topic: string
  startTime: string
  endTime: string
  duration: number
  difficulty: 'light' | 'moderate' | 'intense'
  reasoning: string
  energyRequired: number
}

interface ScheduleData {
  cyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal'
  energyLevel: number
  difficultyFocus: 'light' | 'moderate' | 'intense'
  totalStudyHours: number
  studyBlocks: StudyBlock[]
  mockTestSlot?: string
  phaseRecommendations: string[]
  biologicalOptimizations: string[]
  performancePrediction: {
    accuracy: number
    speed: number
    retention: number
  }
}

export default function CycleOptimizedScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')

  const { data: schedule, isLoading, refetch } = useQuery<{ data: ScheduleData }>({
    queryKey: ['cycle-schedule', selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/cycle-optimization/schedule?date=${selectedDate}`)
      if (!response.ok) throw new Error('Failed to fetch schedule')
      return response.json()
    }
  })

  const getPhaseData = (phase: string) => {
    switch (phase) {
      case 'menstrual':
        return {
          color: 'error',
          emoji: '🌙',
          icon: MoonIcon,
          name: 'Menstrual',
          description: 'Rest & Recovery Phase',
          bgColor: 'from-red-500/10 to-pink-500/10',
          borderColor: 'border-red-400/30'
        }
      case 'follicular':
        return {
          color: 'success',
          emoji: '🌱',
          icon: SparklesIcon,
          name: 'Follicular',
          description: 'Energy Building Phase',
          bgColor: 'from-green-500/10 to-emerald-500/10',
          borderColor: 'border-green-400/30'
        }
      case 'ovulation':
        return {
          color: 'warning',
          emoji: '⭐',
          icon: SunIcon,
          name: 'Ovulation',
          description: 'Peak Performance Phase',
          bgColor: 'from-yellow-500/10 to-orange-500/10',
          borderColor: 'border-yellow-400/30'
        }
      case 'luteal':
        return {
          color: 'primary',
          emoji: '🍂',
          icon: BeakerIcon,
          name: 'Luteal',
          description: 'Focus & Consolidation Phase',
          bgColor: 'from-purple-500/10 to-indigo-500/10',
          borderColor: 'border-purple-400/30'
        }
      default:
        return {
          color: 'primary',
          emoji: '📅',
          icon: CalendarIcon,
          name: 'Unknown',
          description: 'Cycle tracking needed',
          bgColor: 'from-gray-500/10 to-gray-600/10',
          borderColor: 'border-gray-400/30'
        }
    }
  }

  const getDifficultyData = (difficulty: string) => {
    switch (difficulty) {
      case 'light':
        return {
          color: 'info',
          icon: '💙',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400'
        }
      case 'moderate':
        return {
          color: 'warning',
          icon: '🧡',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400'
        }
      case 'intense':
        return {
          color: 'error',
          icon: '❤️',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400'
        }
      default:
        return {
          color: 'primary',
          icon: '💜',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400'
        }
    }
  }

  const generateOptimizedSchedule = async () => {
    try {
      const response = await fetch('/api/cycle-optimization/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate })
      })
      if (response.ok) {
        refetch()
      }
    } catch (error) {
      console.error('Error generating schedule:', error)
    }
  }

  if (isLoading) {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 rounded-xl bg-primary/20"
            >
              <CalendarIcon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="gradient-text">AI Cycle Scheduler</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" variant="orbit" />
              <p className="text-foreground-secondary mt-4">Optimizing your study schedule...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const scheduleData = schedule?.data
  const phaseData = scheduleData ? getPhaseData(scheduleData.cyclePhase) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-glow"
          >
            <CalendarIcon className="h-8 w-8 text-white" />
          </motion.div>

          <div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold gradient-text"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              AI Cycle Scheduler
            </motion.h2>
            <p className="text-foreground-secondary mt-1">
              Biologically optimized study planning for maximum performance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <ClockIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="gradient-text">Schedule Controls</span>
              </div>
              <Button
                onClick={generateOptimizedSchedule}
                variant="gradient"
                leftIcon={<SparklesIcon className="h-4 w-4" />}
              >
                Generate AI Schedule
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg" responsive={{ sm: 1, md: 2 }}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground-secondary">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground-secondary">
                  View Mode
                </label>
                <div className="flex gap-2">
                  {(['day', 'week', 'month'] as const).map((mode) => (
                    <Button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      variant={viewMode === mode ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {scheduleData && phaseData && (
        <>
          {/* Cycle Status Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="hero" hover="both" asMotion className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${phaseData.bgColor} opacity-50`} />

              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10">
                    <phaseData.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white">Today's Cycle Status</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* Phase Display */}
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-8xl"
                  >
                    {phaseData.emoji}
                  </motion.div>

                  <div>
                    <Badge
                      variant={phaseData.color as any}
                      size="lg"
                      className="px-6 py-3 text-lg font-semibold"
                    >
                      {phaseData.name} Phase
                    </Badge>
                    <p className="text-white/80 mt-2">{phaseData.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <Grid cols={4} gap="md" responsive={{ sm: 2, md: 4 }}>
                  <div className="glass-card text-center p-4">
                    <ProgressRing
                      progress={scheduleData.energyLevel * 10}
                      size={60}
                      strokeWidth={6}
                      color="#f59e0b"
                      className="mx-auto mb-2"
                    />
                    <div className="text-white font-semibold text-sm">Energy</div>
                    <div className="text-white/60 text-xs">{scheduleData.energyLevel}/10</div>
                  </div>

                  <div className="glass-card text-center p-4">
                    <div className="text-2xl font-bold text-white mb-1">
                      {scheduleData.totalStudyHours}h
                    </div>
                    <div className="text-white font-semibold text-sm">Study Time</div>
                    <div className="text-white/60 text-xs">Optimized</div>
                  </div>

                  <div className="glass-card text-center p-4">
                    <div className="text-2xl font-bold text-white mb-1">
                      {scheduleData.studyBlocks.length}
                    </div>
                    <div className="text-white font-semibold text-sm">Study Blocks</div>
                    <div className="text-white/60 text-xs">Scheduled</div>
                  </div>

                  <div className="glass-card text-center p-4">
                    <div className={`text-2xl font-bold mb-1 ${getDifficultyData(scheduleData.difficultyFocus).textColor}`}>
                      {getDifficultyData(scheduleData.difficultyFocus).icon}
                    </div>
                    <div className="text-white font-semibold text-sm">Focus</div>
                    <div className="text-white/60 text-xs">{scheduleData.difficultyFocus}</div>
                  </div>
                </Grid>

                {/* Performance Prediction */}
                <div className="glass-card p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5 text-blue-400" />
                    Performance Prediction
                  </h4>
                  <Grid cols={3} gap="md">
                    <div className="text-center">
                      <ProgressRing
                        progress={scheduleData?.performancePrediction?.accuracy || 0}
                        size={50}
                        strokeWidth={4}
                        color="#10b981"
                        className="mx-auto mb-2"
                      />
                      <div className="text-white text-sm font-medium">Accuracy</div>
                      <div className="text-white/60 text-xs">{scheduleData?.performancePrediction?.accuracy || 0}%</div>
                    </div>
                    <div className="text-center">
                      <ProgressRing
                        progress={scheduleData?.performancePrediction?.speed || 0}
                        size={50}
                        strokeWidth={4}
                        color="#f59e0b"
                        className="mx-auto mb-2"
                      />
                      <div className="text-white text-sm font-medium">Speed</div>
                      <div className="text-white/60 text-xs">{scheduleData?.performancePrediction?.speed || 0}%</div>
                    </div>
                    <div className="text-center">
                      <ProgressRing
                        progress={scheduleData?.performancePrediction?.retention || 0}
                        size={50}
                        strokeWidth={4}
                        color="#8b5cf6"
                        className="mx-auto mb-2"
                      />
                      <div className="text-white text-sm font-medium">Retention</div>
                      <div className="text-white/60 text-xs">{scheduleData?.performancePrediction?.retention || 0}%</div>
                    </div>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Study Blocks Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-success/20">
                    <BookOpenIcon className="h-5 w-5 text-success-500" />
                  </div>
                  <span className="gradient-text">Optimized Study Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduleData.studyBlocks.map((block, index) => {
                    const difficultyData = getDifficultyData(block.difficulty)

                    return (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-6 border ${difficultyData.color === 'error' ? 'border-red-400/30' :
                          difficultyData.color === 'warning' ? 'border-yellow-400/30' :
                            difficultyData.color === 'info' ? 'border-blue-400/30' : 'border-gray-400/30'
                          } hover:shadow-elevation-2 transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {block.startTime} - {block.endTime}
                              </Badge>
                              <Badge
                                variant={difficultyData.color as any}
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <span>{difficultyData.icon}</span>
                                {block.difficulty}
                              </Badge>
                            </div>

                            <h4 className="text-lg font-semibold text-foreground mb-1">
                              {block.subject} - {block.type.replace('_', ' ').toUpperCase()}
                            </h4>
                            <p className="text-foreground-secondary mb-2">{block.topic}</p>
                            <p className="text-foreground-muted text-sm italic">{block.reasoning}</p>
                          </div>

                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-foreground mb-1">
                              {Math.round(block.duration)}
                            </div>
                            <div className="text-foreground-secondary text-sm">minutes</div>

                            <div className="mt-3">
                              <ProgressRing
                                progress={block.energyRequired * 10}
                                size={40}
                                strokeWidth={3}
                                color={difficultyData.color === 'error' ? '#ef4444' :
                                  difficultyData.color === 'warning' ? '#f59e0b' :
                                    difficultyData.color === 'info' ? '#3b82f6' : '#6b7280'}
                                className="mx-auto"
                              />
                              <div className="text-xs text-foreground-muted mt-1">Energy</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <AcademicCapIcon className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground-secondary">
                              Optimized for {phaseData.name.toLowerCase()} phase
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BoltIcon className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-foreground-secondary">
                              {block.energyRequired}/10 energy required
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mock Test Slot */}
          {scheduleData.mockTestSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="premium" hover="both" asMotion className="border-warning-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-warning/20">
                      <RocketLaunchIcon className="h-5 w-5 text-warning-500" />
                    </div>
                    <span className="gradient-text">Peak Performance Mock Test</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="glass-card p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl"
                      >
                        🎯
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-warning-400 mb-2">
                          Optimal Mock Test Time
                        </h3>
                        <p className="text-lg font-semibold text-foreground mb-2">
                          {new Date(scheduleData.mockTestSlot).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-foreground-secondary">
                          Your {phaseData.name.toLowerCase()} phase indicates peak cognitive performance.
                          Perfect time for a full NEET mock test with maximum accuracy and speed!
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold text-warning-400 mb-1">
                          {scheduleData.performancePrediction.accuracy}%
                        </div>
                        <div className="text-sm text-foreground-secondary">Expected Score</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recommendations Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Phase-Specific Tips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card variant="premium" hover="both" asMotion>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-info/20">
                      <LightBulbIcon className="h-5 w-5 text-info-500" />
                    </div>
                    <span className="gradient-text">Phase-Specific Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(scheduleData?.phaseRecommendations || []).map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-4 hover:shadow-glow transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-foreground leading-relaxed">{tip}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Biological Optimizations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card variant="premium" hover="both" asMotion>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-success/20">
                      <BeakerIcon className="h-5 w-5 text-success-500" />
                    </div>
                    <span className="gradient-text">Biological Optimizations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(scheduleData?.biologicalOptimizations || []).map((optimization, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-4 border border-success-500/20 hover:border-success-500/40 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <FireIcon className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground leading-relaxed">{optimization}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Weekly Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="gradient-text">Weekly Cycle Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-3">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i - 3)
                    const isToday = date.toDateString() === new Date().toDateString()

                    // Mock cycle phase for each day
                    const phases = ['menstrual', 'menstrual', 'follicular', 'follicular', 'ovulation', 'luteal', 'luteal']
                    const dayPhase = phases[i]
                    const dayPhaseData = getPhaseData(dayPhase)

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={`glass-card p-3 text-center cursor-pointer transition-all duration-300 ${isToday ? 'ring-2 ring-primary shadow-glow' : ''
                          }`}
                        onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      >
                        <div className="text-xs text-foreground-secondary mb-1">
                          {date.toLocaleDateString('en', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold text-foreground mb-2">
                          {date.getDate()}
                        </div>
                        <div className="text-2xl mb-1">{dayPhaseData.emoji}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${dayPhaseData.bgColor} ${dayPhaseData.color === 'error' ? 'text-red-400' :
                            dayPhaseData.color === 'success' ? 'text-green-400' :
                              dayPhaseData.color === 'warning' ? 'text-yellow-400' :
                                'text-purple-400'
                          }`}>
                          {dayPhaseData.name}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {!scheduleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Card variant="premium" hover="both" asMotion>
            <CardContent className="p-12">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <CalendarIcon className="h-16 w-16 text-primary/50 mx-auto" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to optimize your schedule?
              </h3>
              <p className="text-foreground-secondary mb-6">
                Generate an AI-powered study schedule optimized for your menstrual cycle
              </p>
              <Button
                onClick={generateOptimizedSchedule}
                variant="gradient"
                size="lg"
                leftIcon={<SparklesIcon className="h-5 w-5" />}
              >
                Generate AI Schedule
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}