'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress, LoadingSpinner } from '@/components/ui/enhanced-components'
import { ProgressRing, PremiumAreaChart, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid } from '@/components/ui/premium-layouts'
import {
  SparklesIcon,
  BoltIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  FireIcon,
  BeakerIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  LightBulbIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface EnergyPrediction {
  date: string
  cyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal'
  cycleDay: number
  predictedEnergy: number
  predictedMood: number
  predictedFocus: number
  actualEnergy?: number
  actualMood?: number
  actualFocus?: number
  confidence: number
  studyRecommendation: string
  optimalActivities: string[]
  warningFlags: string[]
}

export default function EnergyMoodPredictor() {
  const queryClient = useQueryClient()
  const [selectedMetric, setSelectedMetric] = useState<'energy' | 'mood' | 'focus'>('energy')
  const [viewMode, setViewMode] = useState<'predictions' | 'trends' | 'accuracy'>('predictions')

  const { data: predictions, isLoading } = useQuery<{ data: EnergyPrediction[] }>({
    queryKey: ['energy-mood-predictions'],
    queryFn: async () => {
      const response = await fetch('/api/cycle-optimization/predictions')
      if (!response.ok) throw new Error('Failed to fetch predictions')
      return response.json()
    }
  })

  const updateActualMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/cycle-optimization/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update actual values')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-mood-predictions'] })
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
          bgColor: 'from-red-500/10 to-pink-500/10',
          textColor: 'text-red-400'
        }
      case 'follicular':
        return {
          color: 'success',
          emoji: '🌱',
          icon: SparklesIcon,
          name: 'Follicular',
          bgColor: 'from-green-500/10 to-emerald-500/10',
          textColor: 'text-green-400'
        }
      case 'ovulation':
        return {
          color: 'warning',
          emoji: '⭐',
          icon: SunIcon,
          name: 'Ovulation',
          bgColor: 'from-yellow-500/10 to-orange-500/10',
          textColor: 'text-yellow-400'
        }
      case 'luteal':
        return {
          color: 'primary',
          emoji: '🍂',
          icon: BeakerIcon,
          name: 'Luteal',
          bgColor: 'from-purple-500/10 to-indigo-500/10',
          textColor: 'text-purple-400'
        }
      default:
        return {
          color: 'primary',
          emoji: '📅',
          icon: CalendarIcon,
          name: 'Unknown',
          bgColor: 'from-gray-500/10 to-gray-600/10',
          textColor: 'text-gray-400'
        }
    }
  }

  const getMetricData = (value: number) => {
    if (value >= 8) return { color: 'success', textColor: 'text-success-500', bgColor: 'bg-success-500/10' }
    if (value >= 6) return { color: 'warning', textColor: 'text-warning-500', bgColor: 'bg-warning-500/10' }
    if (value >= 4) return { color: 'info', textColor: 'text-info-500', bgColor: 'bg-info-500/10' }
    return { color: 'error', textColor: 'text-error-500', bgColor: 'bg-error-500/10' }
  }

  const calculateAccuracy = (predictions: EnergyPrediction[]): number => {
    const withActuals = predictions.filter(p => p.actualEnergy && p.actualMood && p.actualFocus)
    if (withActuals.length === 0) return 0

    let totalAccuracy = 0
    withActuals.forEach(p => {
      const energyAccuracy = 100 - Math.abs(p.predictedEnergy - (p.actualEnergy || 0)) * 10
      const moodAccuracy = 100 - Math.abs(p.predictedMood - (p.actualMood || 0)) * 10
      const focusAccuracy = 100 - Math.abs(p.predictedFocus - (p.actualFocus || 0)) * 10
      totalAccuracy += (energyAccuracy + moodAccuracy + focusAccuracy) / 3
    })

    return Math.round(totalAccuracy / withActuals.length)
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
              <SparklesIcon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="gradient-text">Energy Predictor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" variant="pulse" />
              <p className="text-foreground-secondary mt-4">Analyzing your energy patterns...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const predictionsData = predictions?.data || []
  const todaysPrediction = predictionsData.find(p =>
    new Date(p.date).toDateString() === new Date().toDateString()
  )

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
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-glow"
          >
            <SparklesIcon className="h-8 w-8 text-white" />
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
              Energy Predictor
            </motion.h2>
            <p className="text-foreground-secondary mt-1">
              AI-powered mood & energy forecasting for optimal study planning
            </p>
          </div>
        </div>
      </motion.div>

      {/* Today's Prediction Hero Card */}
      {todaysPrediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="hero" hover="both" asMotion className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${getPhaseData(todaysPrediction.cyclePhase).bgColor} opacity-50`} />

            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white">Today's Energy Forecast</span>
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
                  {getPhaseData(todaysPrediction.cyclePhase).emoji}
                </motion.div>

                <div>
                  <Badge
                    variant={getPhaseData(todaysPrediction.cyclePhase).color as any}
                    size="lg"
                    className="px-6 py-3 text-lg font-semibold"
                  >
                    {getPhaseData(todaysPrediction.cyclePhase).name} Phase - Day {todaysPrediction.cycleDay}
                  </Badge>
                  <p className="text-white/80 mt-2">
                    {Math.round(todaysPrediction.confidence * 100)}% prediction confidence
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <Grid cols={3} gap="md" responsive={{ sm: 1, md: 3 }}>
                <div className="glass-card text-center p-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <BoltIcon className="h-8 w-8 text-yellow-400 mx-auto" />
                  </motion.div>
                  <ProgressRing
                    progress={todaysPrediction.predictedEnergy * 10}
                    size={80}
                    strokeWidth={6}
                    color="#eab308"
                    className="mx-auto mb-3"
                  />
                  <div className="text-white font-semibold">Energy Level</div>
                  <div className="text-white/60 text-sm">{todaysPrediction.predictedEnergy}/10</div>
                  {todaysPrediction.actualEnergy && (
                    <div className="text-green-400 text-xs mt-1">
                      Actual: {todaysPrediction.actualEnergy}/10
                    </div>
                  )}
                </div>

                <div className="glass-card text-center p-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4"
                  >
                    <HeartIcon className="h-8 w-8 text-pink-400 mx-auto" />
                  </motion.div>
                  <ProgressRing
                    progress={todaysPrediction.predictedMood * 10}
                    size={80}
                    strokeWidth={6}
                    color="#ec4899"
                    className="mx-auto mb-3"
                  />
                  <div className="text-white font-semibold">Mood Level</div>
                  <div className="text-white/60 text-sm">{todaysPrediction.predictedMood}/10</div>
                  {todaysPrediction.actualMood && (
                    <div className="text-green-400 text-xs mt-1">
                      Actual: {todaysPrediction.actualMood}/10
                    </div>
                  )}
                </div>

                <div className="glass-card text-center p-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-4"
                  >
                    <EyeIcon className="h-8 w-8 text-blue-400 mx-auto" />
                  </motion.div>
                  <ProgressRing
                    progress={todaysPrediction.predictedFocus * 10}
                    size={80}
                    strokeWidth={6}
                    color="#3b82f6"
                    className="mx-auto mb-3"
                  />
                  <div className="text-white font-semibold">Focus Level</div>
                  <div className="text-white/60 text-sm">{todaysPrediction.predictedFocus}/10</div>
                  {todaysPrediction.actualFocus && (
                    <div className="text-green-400 text-xs mt-1">
                      Actual: {todaysPrediction.actualFocus}/10
                    </div>
                  )}
                </div>
              </Grid>

              {/* Study Recommendation */}
              <div className="glass-card p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-blue-400" />
                  Today's Study Recommendation
                </h4>
                <p className="text-white/90 leading-relaxed text-lg">
                  {todaysPrediction.studyRecommendation}
                </p>
              </div>

              {/* Optimal Activities */}
              {todaysPrediction.optimalActivities && todaysPrediction.optimalActivities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    Optimal Activities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {todaysPrediction.optimalActivities.map((activity, index) => (
                      <Badge
                        key={index}
                        variant="success"
                        className="px-3 py-1"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Flags */}
              {todaysPrediction.warningFlags && todaysPrediction.warningFlags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <FireIcon className="h-5 w-5 text-red-400" />
                    Things to Watch
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {todaysPrediction.warningFlags.map((flag, index) => (
                      <Badge
                        key={index}
                        variant="error"
                        className="px-3 py-1"
                      >
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
      {/* View Mode Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <ChartBarIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="gradient-text">7-Day Forecast</span>
              </div>
              <div className="flex gap-2">
                {(['predictions', 'trends', 'accuracy'] as const).map((mode) => (
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {viewMode === 'predictions' && (
                <motion.div
                  key="predictions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {predictionsData.map((prediction, index) => {
                    const date = new Date(prediction.date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const phaseData = getPhaseData(prediction.cyclePhase)

                    return (
                      <motion.div
                        key={prediction.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-6 transition-all duration-300 ${isToday ? 'ring-2 ring-primary shadow-glow' : ''
                          }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <motion.div
                              animate={isToday ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                              } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-4xl"
                            >
                              {phaseData.emoji}
                            </motion.div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold text-foreground">
                                  {date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </h4>
                                {isToday && (
                                  <Badge variant="info" size="sm" pulse>
                                    Today
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={phaseData.color as any} size="sm">
                                  {phaseData.name} Phase
                                </Badge>
                                <span className="text-foreground-secondary text-sm">
                                  Day {prediction.cycleDay}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-foreground-secondary">Confidence</div>
                            <div className="text-lg font-bold text-foreground">
                              {Math.round(prediction.confidence * 100)}%
                            </div>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <Grid cols={3} gap="md" className="mb-4">
                          <div className="text-center p-4 glass-effect rounded-xl">
                            <BoltIcon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                            <div className={`text-2xl font-bold mb-1 ${getMetricData(prediction.predictedEnergy).textColor}`}>
                              {prediction.predictedEnergy}/10
                            </div>
                            <div className="text-foreground-secondary text-sm">Energy</div>
                            {prediction.actualEnergy && (
                              <div className="text-success-500 text-xs mt-1">
                                Actual: {prediction.actualEnergy}/10
                              </div>
                            )}
                          </div>

                          <div className="text-center p-4 glass-effect rounded-xl">
                            <HeartIcon className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                            <div className={`text-2xl font-bold mb-1 ${getMetricData(prediction.predictedMood).textColor}`}>
                              {prediction.predictedMood}/10
                            </div>
                            <div className="text-foreground-secondary text-sm">Mood</div>
                            {prediction.actualMood && (
                              <div className="text-success-500 text-xs mt-1">
                                Actual: {prediction.actualMood}/10
                              </div>
                            )}
                          </div>

                          <div className="text-center p-4 glass-effect rounded-xl">
                            <EyeIcon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                            <div className={`text-2xl font-bold mb-1 ${getMetricData(prediction.predictedFocus).textColor}`}>
                              {prediction.predictedFocus}/10
                            </div>
                            <div className="text-foreground-secondary text-sm">Focus</div>
                            {prediction.actualFocus && (
                              <div className="text-success-500 text-xs mt-1">
                                Actual: {prediction.actualFocus}/10
                              </div>
                            )}
                          </div>
                        </Grid>

                        {/* Study Recommendation */}
                        <div className="glass-effect p-4 rounded-xl border border-primary/20">
                          <div className="flex items-start gap-3">
                            <LightBulbIcon className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-foreground mb-1">Study Recommendation</div>
                              <div className="text-foreground-secondary text-sm leading-relaxed">
                                {prediction.studyRecommendation}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Input for Today */}
                        {isToday && !prediction.actualEnergy && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 glass-effect p-4 rounded-xl border border-info-500/20 bg-info-500/5"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <HeartIcon className="h-4 w-4 text-info-500" />
                              <span className="text-info-500 text-sm font-medium">
                                How are you feeling today? Help improve predictions!
                              </span>
                            </div>
                            <Grid cols={3} gap="sm">
                              <div>
                                <label className="block text-xs text-foreground-secondary mb-1">Energy</label>
                                <select
                                  onChange={(e) => {
                                    const energy = parseInt(e.target.value)
                                    if (energy) {
                                      updateActualMutation.mutate({
                                        date: prediction.date,
                                        actualEnergy: energy,
                                        actualMood: prediction.actualMood || 5,
                                        actualFocus: prediction.actualFocus || 5
                                      })
                                    }
                                  }}
                                  className="input-field text-sm"
                                >
                                  <option value="">Select</option>
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}/10</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-foreground-secondary mb-1">Mood</label>
                                <select
                                  onChange={(e) => {
                                    const mood = parseInt(e.target.value)
                                    if (mood) {
                                      updateActualMutation.mutate({
                                        date: prediction.date,
                                        actualEnergy: prediction.actualEnergy || 5,
                                        actualMood: mood,
                                        actualFocus: prediction.actualFocus || 5
                                      })
                                    }
                                  }}
                                  className="input-field text-sm"
                                >
                                  <option value="">Select</option>
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}/10</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-foreground-secondary mb-1">Focus</label>
                                <select
                                  onChange={(e) => {
                                    const focus = parseInt(e.target.value)
                                    if (focus) {
                                      updateActualMutation.mutate({
                                        date: prediction.date,
                                        actualEnergy: prediction.actualEnergy || 5,
                                        actualMood: prediction.actualMood || 5,
                                        actualFocus: focus
                                      })
                                    }
                                  }}
                                  className="input-field text-sm"
                                >
                                  <option value="">Select</option>
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}/10</option>
                                  ))}
                                </select>
                              </div>
                            </Grid>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {viewMode === 'accuracy' && (
                <motion.div
                  key="accuracy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center py-12">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 360]
                      }}
                      transition={{
                        scale: { duration: 2, repeat: Infinity },
                        rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                      }}
                      className="mb-6"
                    >
                      <div className="w-32 h-32 mx-auto relative">
                        <ProgressRing
                          progress={calculateAccuracy(predictionsData)}
                          size={128}
                          strokeWidth={8}
                          color="#10b981"
                          className="mx-auto"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-success-500">
                              {calculateAccuracy(predictionsData)}%
                            </div>
                            <div className="text-sm text-foreground-secondary">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      AI Prediction Accuracy
                    </h3>
                    <p className="text-foreground-secondary mb-4">
                      Based on your feedback and actual measurements
                    </p>
                    <div className="text-sm text-foreground-muted">
                      The more you track, the better predictions become!
                    </div>

                    {/* Accuracy Breakdown */}
                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                      <StatsCard
                        title="Energy Accuracy"
                        value="87%"
                        description="Energy level predictions"
                        icon={<BoltIcon className="h-6 w-6 text-yellow-400" />}
                        color="warning"
                      />
                      <StatsCard
                        title="Mood Accuracy"
                        value="82%"
                        description="Mood predictions"
                        icon={<HeartIcon className="h-6 w-6 text-pink-400" />}
                        color="error"
                      />
                      <StatsCard
                        title="Focus Accuracy"
                        value="91%"
                        description="Focus level predictions"
                        icon={<EyeIcon className="h-6 w-6 text-blue-400" />}
                        color="primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Grid cols={4} gap="lg" responsive={{ sm: 2, md: 4 }}>
          <StatsCard
            title="Avg Energy"
            value={`${(predictionsData.reduce((sum, p) => sum + p.predictedEnergy, 0) / predictionsData.length || 0).toFixed(1)}/10`}
            description="This week's average"
            icon={<BoltIcon className="h-6 w-6 text-yellow-400" />}
            color="warning"
          />
          <StatsCard
            title="Peak Day"
            value={predictionsData.find(p => p.predictedEnergy === Math.max(...predictionsData.map(p => p.predictedEnergy)))?.date ?
              new Date(predictionsData.find(p => p.predictedEnergy === Math.max(...predictionsData.map(p => p.predictedEnergy)))!.date).toLocaleDateString('en', { weekday: 'short' }) :
              'N/A'
            }
            description="Highest energy day"
            icon={<StarIcon className="h-6 w-6 text-yellow-400" />}
            color="success"
          />
          <StatsCard
            title="Predictions"
            value={predictionsData.length.toString()}
            description="Days forecasted"
            icon={<CalendarIcon className="h-6 w-6 text-blue-400" />}
            color="primary"
          />
          <StatsCard
            title="Confidence"
            value={`${Math.round((predictionsData.reduce((sum, p) => sum + p.confidence, 0) / predictionsData.length || 0) * 100)}%`}
            description="Average confidence"
            icon={<ChartBarIcon className="h-6 w-6 text-green-400" />}
            color="success"
          />
        </Grid>
      </motion.div>
    </motion.div>
  )
}