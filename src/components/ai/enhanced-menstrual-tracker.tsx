'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress, LoadingSpinner } from '@/components/ui/enhanced-components'
import { ProgressRing, PremiumAreaChart } from '@/components/ui/premium-charts'
import { Grid } from '@/components/ui/premium-layouts'
import {
  HeartIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  FireIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

interface MenstrualData {
  id: string
  cycleStartDate: string
  cycleLength: number
  periodLength: number
  energyLevel: number
  studyCapacity: number
  symptoms: string[]
  mood: string
  notes?: string
}

interface CycleInsights {
  currentPhase: string
  dayInCycle: number
  energyPrediction: number
  studyRecommendations: string[]
  symptomPredictions: string[]
  optimalStudyTimes: string[]
}

export default function EnhancedMenstrualTracker() {
  const [formData, setFormData] = useState({
    cycleStartDate: '',
    cycleLength: 28,
    periodLength: 5,
    energyLevel: 5,
    studyCapacity: 5,
    symptoms: [] as string[],
    mood: '',
    notes: ''
  })

  const queryClient = useQueryClient()

  // Fetch existing menstrual data
  const { data: menstrualData, isLoading } = useQuery<MenstrualData[]>({
    queryKey: ['menstrual-cycle'],
    queryFn: async () => {
      const response = await fetch('/api/menstrual-cycle')
      if (!response.ok) throw new Error('Failed to fetch data')
      const result = await response.json()
      return result.data || []
    }
  })

  // Fetch cycle insights
  const { data: insights } = useQuery<CycleInsights>({
    queryKey: ['menstrual-insights'],
    queryFn: async () => {
      const response = await fetch('/api/menstrual-insights')
      if (!response.ok) throw new Error('Failed to fetch insights')
      const result = await response.json()
      return result.data
    },
    enabled: !!menstrualData && menstrualData.length > 0
  })

  // Add new menstrual data
  const addDataMutation = useMutation({
    mutationFn: async (data: Omit<MenstrualData, 'id'>) => {
      const response = await fetch('/api/menstrual-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to add data')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menstrual-cycle'] })
      queryClient.invalidateQueries({ queryKey: ['menstrual-insights'] })
      // Reset form
      setFormData({
        cycleStartDate: '',
        cycleLength: 28,
        periodLength: 5,
        energyLevel: 5,
        studyCapacity: 5,
        symptoms: [],
        mood: '',
        notes: ''
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.cycleStartDate) return

    addDataMutation.mutate({
      cycleStartDate: formData.cycleStartDate,
      cycleLength: formData.cycleLength,
      periodLength: formData.periodLength,
      energyLevel: formData.energyLevel,
      studyCapacity: formData.studyCapacity,
      symptoms: formData.symptoms,
      mood: formData.mood,
      notes: formData.notes
    })
  }

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const commonSymptoms = [
    { name: 'Cramps', emoji: '😣', color: 'error' },
    { name: 'Headache', emoji: '🤕', color: 'warning' },
    { name: 'Fatigue', emoji: '😴', color: 'info' },
    { name: 'Bloating', emoji: '🤰', color: 'warning' },
    { name: 'Mood Swings', emoji: '�', rcolor: 'error' },
    { name: 'Breast Tenderness', emoji: '💔', color: 'error' },
    { name: 'Acne', emoji: '😖', color: 'warning' },
    { name: 'Food Cravings', emoji: '🍫', color: 'success' },
    { name: 'Back Pain', emoji: '🔥', color: 'error' },
    { name: 'Nausea', emoji: '🤢', color: 'warning' }
  ]

  const moodOptions = [
    { name: 'Energetic', emoji: '⚡', color: 'success' },
    { name: 'Happy', emoji: '😊', color: 'success' },
    { name: 'Calm', emoji: '😌', color: 'info' },
    { name: 'Anxious', emoji: '😰', color: 'warning' },
    { name: 'Irritable', emoji: '😠', color: 'error' },
    { name: 'Sad', emoji: '😢', color: 'error' },
    { name: 'Focused', emoji: '🎯', color: 'primary' },
    { name: 'Distracted', emoji: '🌀', color: 'warning' }
  ]

  const getPhaseData = (phase: string) => {
    switch (phase?.toLowerCase()) {
      case 'menstrual':
        return {
          color: 'error',
          emoji: '�',
          icon: MoonIcon,
          description: 'Rest and recovery phase',
          bgColor: 'from-red-500/10 to-pink-500/10'
        }
      case 'follicular':
        return {
          color: 'success',
          emoji: '🌱',
          icon: SparklesIcon,
          description: 'Energy building phase',
          bgColor: 'from-green-500/10 to-emerald-500/10'
        }
      case 'ovulation':
        return {
          color: 'warning',
          emoji: '🌸',
          icon: SunIcon,
          description: 'Peak energy phase',
          bgColor: 'from-yellow-500/10 to-orange-500/10'
        }
      case 'luteal':
        return {
          color: 'primary',
          emoji: '🍂',
          icon: BeakerIcon,
          description: 'Focus and concentration phase',
          bgColor: 'from-purple-500/10 to-indigo-500/10'
        }
      default:
        return {
          color: 'primary',
          emoji: '❓',
          icon: HeartIcon,
          description: 'Tracking phase',
          bgColor: 'from-gray-500/10 to-gray-600/10'
        }
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
              className="p-2 rounded-xl bg-pink/20"
            >
              <HeartIcon className="h-5 w-5 text-pink-400" />
            </motion.div>
            <span className="gradient-text">Cycle Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" variant="pulse" />
              <p className="text-foreground-secondary mt-4">Loading your cycle data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const phaseData = insights ? getPhaseData(insights.currentPhase) : null

  const renderCycleCalendar = () => {
    if (!menstrualData || menstrualData.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-foreground-secondary">Add cycle data to see your calendar</p>
        </div>
      )
    }

    const recentCycle = menstrualData[0]
    const cycleStartDate = new Date(recentCycle.cycleStartDate)
    const today = new Date()

    // Calculate cycle phases
    const menstrualEnd = new Date(cycleStartDate)
    menstrualEnd.setDate(cycleStartDate.getDate() + recentCycle.periodLength - 1)

    const follicularEnd = new Date(cycleStartDate)
    follicularEnd.setDate(cycleStartDate.getDate() + 11)

    const ovulationStart = new Date(cycleStartDate)
    ovulationStart.setDate(cycleStartDate.getDate() + 12)

    const ovulationEnd = new Date(cycleStartDate)
    ovulationEnd.setDate(cycleStartDate.getDate() + 16)

    const lutealStart = new Date(cycleStartDate)
    lutealStart.setDate(cycleStartDate.getDate() + 17)

    const cycleEnd = new Date(cycleStartDate)
    cycleEnd.setDate(cycleStartDate.getDate() + recentCycle.cycleLength - 1)

    const nextPeriod = new Date(cycleStartDate)
    nextPeriod.setDate(cycleStartDate.getDate() + recentCycle.cycleLength)

    // Generate calendar days (show 6 weeks)
    const calendarStart = new Date(cycleStartDate)
    calendarStart.setDate(1) // Start of month
    const calendarDays = []

    for (let i = 0; i < 42; i++) {
      const date = new Date(calendarStart)
      date.setDate(calendarStart.getDate() + i)
      calendarDays.push(date)
    }

    const getPhaseForDate = (date: Date) => {
      const daysSinceStart = Math.floor((date.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))
      const dayInCycle = ((daysSinceStart % recentCycle.cycleLength) + recentCycle.cycleLength) % recentCycle.cycleLength + 1

      if (dayInCycle <= recentCycle.periodLength) return 'menstrual'
      if (dayInCycle <= 11) return 'follicular'
      if (dayInCycle >= 12 && dayInCycle <= 16) return 'ovulation'
      if (dayInCycle >= 17) return 'luteal'
      return 'none'
    }

    const getPhaseColor = (phase: string) => {
      switch (phase) {
        case 'menstrual': return 'bg-red-500/20 border-red-500/40 text-red-300'
        case 'follicular': return 'bg-green-500/20 border-green-500/40 text-green-300'
        case 'ovulation': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
        case 'luteal': return 'bg-purple-500/20 border-purple-500/40 text-purple-300'
        default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400'
      }
    }

    const isToday = (date: Date) => {
      return date.toDateString() === today.toDateString()
    }

    return (
      <div className="space-y-6">
        {/* Phase Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 glass-card p-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium text-foreground">Menstrual</div>
              <div className="text-xs text-foreground-muted">Days 1-{recentCycle.periodLength}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 glass-card p-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium text-foreground">Follicular</div>
              <div className="text-xs text-foreground-muted">Days {recentCycle.periodLength + 1}-11</div>
            </div>
          </div>
          <div className="flex items-center gap-3 glass-card p-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium text-foreground">Ovulation</div>
              <div className="text-xs text-foreground-muted">Days 12-16</div>
            </div>
          </div>
          <div className="flex items-center gap-3 glass-card p-3">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div className="text-sm font-medium text-foreground">Luteal</div>
              <div className="text-xs text-foreground-muted">Days 17-{recentCycle.cycleLength}</div>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 text-center border border-yellow-500/30 bg-yellow-500/10"
          >
            <div className="text-2xl mb-2">🥚</div>
            <div className="font-semibold text-foreground">Next Ovulation</div>
            <div className="text-sm text-foreground-secondary">
              {ovulationStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {ovulationEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 text-center border border-red-500/30 bg-red-500/10"
          >
            <div className="text-2xl mb-2">🩸</div>
            <div className="font-semibold text-foreground">Next Period</div>
            <div className="text-sm text-foreground-secondary">
              {nextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs text-foreground-muted">
              {Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days away
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 text-center border border-purple-500/30 bg-purple-500/10"
          >
            <div className="text-2xl mb-2">🌙</div>
            <div className="font-semibold text-foreground">Luteal Phase</div>
            <div className="text-sm text-foreground-secondary">
              {lutealStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {cycleEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </motion.div>
        </div>

        {/* Calendar Grid */}
        <div className="glass-card p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {cycleStartDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-foreground-secondary p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const phase = getPhaseForDate(date)
              const phaseColor = getPhaseColor(phase)
              const todayClass = isToday(date) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    relative p-3 rounded-lg text-center cursor-pointer transition-all duration-200
                    ${phaseColor} ${todayClass}
                    ${date.getMonth() !== cycleStartDate.getMonth() ? 'opacity-30' : ''}
                  `}
                  title={`${date.toLocaleDateString()} - ${phase} phase`}
                >
                  <div className="text-sm font-medium">
                    {date.getDate()}
                  </div>

                  {/* Phase indicator dot */}
                  {phase !== 'none' && (
                    <div className={`
                      absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full
                      ${phase === 'menstrual' ? 'bg-red-500' :
                        phase === 'follicular' ? 'bg-green-500' :
                          phase === 'ovulation' ? 'bg-yellow-500' :
                            'bg-purple-500'}
                    `} />
                  )}

                  {/* Today indicator */}
                  {isToday(date) && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

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
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 flex items-center justify-center shadow-glow"
          >
            <HeartIcon className="h-8 w-8 text-white" />
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
              Cycle Tracker
            </motion.h2>
            <p className="text-foreground-secondary mt-1">
              AI-powered menstrual cycle insights for optimal study planning
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cycle Calendar & Current Status */}
      <AnimatePresence>
        {insights && phaseData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Cycle Calendar */}
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-pink/20">
                    <CalendarIcon className="h-5 w-5 text-pink-400" />
                  </div>
                  <span className="gradient-text">Cycle Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCycleCalendar()}
              </CardContent>
            </Card>

            {/* Current Cycle Status */}
            <Card variant="hero" hover="both" asMotion className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${phaseData.bgColor} opacity-50`} />

              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10">
                    <phaseData.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white">Current Cycle Status</span>
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
                      {insights.currentPhase} Phase
                    </Badge>
                    <p className="text-white/80 mt-2">{phaseData.description}</p>
                    <p className="text-white/60 text-sm mt-1">
                      Day {insights.dayInCycle} of your cycle
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <Grid cols={3} gap="md" responsive={{ sm: 1, md: 3 }}>
                  <div className="glass-card text-center p-4">
                    <ProgressRing
                      progress={insights.energyPrediction * 10}
                      size={80}
                      strokeWidth={6}
                      color="#f59e0b"
                      className="mx-auto mb-3"
                    />
                    <div className="text-white font-semibold">Energy Level</div>
                    <div className="text-white/60 text-sm">{insights.energyPrediction}/10</div>
                  </div>

                  <div className="glass-card text-center p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      {insights.optimalStudyTimes.length}
                    </div>
                    <div className="text-white font-semibold">Study Windows</div>
                    <div className="text-white/60 text-sm">Optimal times today</div>
                  </div>

                  <div className="glass-card text-center p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      {insights.symptomPredictions.length}
                    </div>
                    <div className="text-white font-semibold">Symptoms</div>
                    <div className="text-white/60 text-sm">To watch for</div>
                  </div>
                </Grid>

                {/* Study Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-yellow-400" />
                    Today's Study Recommendations
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {insights.studyRecommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-3 border border-blue-400/20"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-white text-sm">{rec}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Optimal Study Times */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-green-400" />
                    Optimal Study Times
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.optimalStudyTimes.map((time, index) => (
                      <Badge
                        key={index}
                        variant="success"
                        className="px-3 py-1"
                      >
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Symptom Predictions */}
                {insights.symptomPredictions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                      Potential Symptoms to Watch
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {insights.symptomPredictions.map((symptom, index) => (
                        <Badge
                          key={index}
                          variant="warning"
                          className="px-3 py-1"
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink/20">
                <CalendarIcon className="h-5 w-5 text-pink-400" />
              </div>
              <span className="gradient-text">Track Your Cycle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Cycle Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                <Grid cols={3} gap="md" responsive={{ sm: 1, md: 2, lg: 3 }}>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground-secondary">
                      Cycle Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.cycleStartDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, cycleStartDate: e.target.value }))}
                      className="form-input text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground-secondary">
                      Cycle Length (days)
                    </label>
                    <input
                      type="number"
                      min="21"
                      max="35"
                      value={formData.cycleLength}
                      onChange={(e) => setFormData(prev => ({ ...prev, cycleLength: parseInt(e.target.value) }))}
                      className="form-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground-secondary">
                      Period Length (days)
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={formData.periodLength}
                      onChange={(e) => setFormData(prev => ({ ...prev, periodLength: parseInt(e.target.value) }))}
                      className="form-input text-foreground"
                    />
                  </div>
                </Grid>
              </div>

              {/* Energy and Study Capacity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Energy & Focus Levels</h3>
                <Grid cols={2} gap="lg" responsive={{ sm: 1, md: 2 }}>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground-secondary">
                      Energy Level: {formData.energyLevel}/10
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.energyLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                        className="slider"
                      />
                      <Progress
                        value={formData.energyLevel * 10}
                        variant="gradient"
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground-secondary">
                      Study Capacity: {formData.studyCapacity}/10
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.studyCapacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, studyCapacity: parseInt(e.target.value) }))}
                        className="slider"
                      />
                      <Progress
                        value={formData.studyCapacity * 10}
                        variant="gradient"
                        className="h-2"
                      />
                    </div>
                  </div>
                </Grid>
              </div>

              {/* Symptoms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Current Symptoms</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <motion.button
                      key={symptom.name}
                      type="button"
                      onClick={() => toggleSymptom(symptom.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`glass-card p-3 text-center transition-all duration-200 ${formData.symptoms.includes(symptom.name)
                          ? 'border-pink-400 bg-pink-500/20'
                          : 'hover:border-pink-400/50'
                        }`}
                    >
                      <div className="text-2xl mb-1">{symptom.emoji}</div>
                      <div className="text-xs font-medium text-foreground">{symptom.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Current Mood</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {moodOptions.map((mood) => (
                    <motion.button
                      key={mood.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mood: mood.name }))}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`glass-card p-4 text-center transition-all duration-200 ${formData.mood === mood.name
                          ? 'border-purple-400 bg-purple-500/20'
                          : 'hover:border-purple-400/50'
                        }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-medium text-foreground">{mood.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Additional Notes</h3>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional observations, symptoms, or notes about your cycle..."
                  className="form-input text-foreground resize-none"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={addDataMutation.isPending || !formData.cycleStartDate}
                variant="gradient"
                size="lg"
                className="w-full shadow-glow"
                leftIcon={addDataMutation.isPending ?
                  <LoadingSpinner size="sm" /> :
                  <HeartIcon className="h-5 w-5" />
                }
              >
                {addDataMutation.isPending ? 'Saving Cycle Data...' : 'Save Cycle Data'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Entries */}
      <AnimatePresence>
        {menstrualData && menstrualData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-info/20">
                    <InformationCircleIcon className="h-5 w-5 text-info-500" />
                  </div>
                  <span className="gradient-text">Recent Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menstrualData.slice(0, 3).map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 hover:shadow-elevation-2 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-foreground font-semibold text-lg">
                            {new Date(entry.cycleStartDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-foreground-secondary text-sm">
                            {entry.cycleLength} day cycle • {entry.periodLength} day period
                          </div>
                        </div>
                        <Badge variant="outline" size="sm">
                          {Math.ceil((Date.now() - new Date(entry.cycleStartDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </Badge>
                      </div>

                      <Grid cols={2} gap="md" className="mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                            <FireIcon className="h-5 w-5 text-success-500" />
                          </div>
                          <div>
                            <div className="text-foreground font-medium">{entry.energyLevel}/10</div>
                            <div className="text-foreground-secondary text-sm">Energy Level</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <ChartBarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-foreground font-medium">{entry.studyCapacity}/10</div>
                            <div className="text-foreground-secondary text-sm">Study Capacity</div>
                          </div>
                        </div>
                      </Grid>

                      {entry.mood && (
                        <div className="mb-3">
                          <Badge variant="outline" className="mr-2">
                            Mood: {entry.mood}
                          </Badge>
                        </div>
                      )}

                      {entry.symptoms.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-foreground-secondary text-sm font-medium">Symptoms:</div>
                          <div className="flex flex-wrap gap-1">
                            {entry.symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="outline" size="sm">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.notes && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-foreground-secondary text-sm italic">
                            "{entry.notes}"
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}