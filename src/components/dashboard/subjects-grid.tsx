'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  LightBulbIcon, 
  ArrowPathIcon,
  BeakerIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  Brain, 
  Dna, 
  Microscope, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  Target,
  HeartPulse,
  Atom
} from 'lucide-react'
import { useEffect, useMemo } from 'react'

type DashboardAnalytics = {
  subjectProgress: {
    physics: number
    chemistry: number
    botany: number
    zoology: number
    overall: number
  }
  questionStats: {
    daily: number
    weekly: number
    monthly: number
    lifetime: number
    chapterwise: number
  }
  testPerformance: {
    totalTests: number
    averageScore: number
    lastScore: number
    improvement: number
  }
  bioRhythm: {
    optimalDays: number
    totalEntries: number
    currentStreak: number
  }
}

// Professional utility functions for clinical assessment
const getPerformanceStatus = (progress: number): { status: string; icon: React.ReactNode; color: string } => {
  if (progress >= 95) return { 
    status: 'Excellence', 
    icon: <Target className="h-4 w-4 text-emerald-400" />, 
    color: 'text-emerald-400' 
  }
  if (progress >= 85) return { 
    status: 'Advanced', 
    icon: <TrendingUp className="h-4 w-4 text-cyan-400" />, 
    color: 'text-cyan-400' 
  }
  if (progress >= 75) return { 
    status: 'Proficient', 
    icon: <Activity className="h-4 w-4 text-blue-400" />, 
    color: 'text-blue-400' 
  }
  return { 
    status: 'Developing', 
    icon: <Brain className="h-4 w-4 text-indigo-400" />, 
    color: 'text-indigo-400' 
  }
}

const getClinicalAssessment = (progress: number): string => {
  if (progress >= 90) return "Exceptional performance metrics"
  if (progress >= 70) return "Strong progression trajectory"
  if (progress >= 50) return "Steady academic development"
  return "Foundation building phase"
}

const getVolumeMetrics = (count: number): string => {
  if (count >= 1000) return "High-volume practice protocol"
  if (count >= 500) return "Intensive training regimen"
  if (count >= 100) return "Active learning phase"
  return "Initial engagement stage"
}

const getBioRhythmStatus = (ratio: number): string => {
  if (ratio >= 0.8) return "Optimal cognitive state"
  if (ratio >= 0.6) return "Balanced performance rhythm"
  if (ratio >= 0.4) return "Moderate consistency"
  return "Optimization recommended"
}

export default function ProfessionalAnalytics() {
  const queryClient = useQueryClient()

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  // Optimized event listener with debouncing
  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout

    const handleChapterUpdate = () => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
        queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      }, 300)
    }

    window.addEventListener('chapterProgressUpdated', handleChapterUpdate)
    
    return () => {
      clearTimeout(debounceTimeout)
      window.removeEventListener('chapterProgressUpdated', handleChapterUpdate)
    }
  }, [queryClient])

  // Optimized React Query configuration
  const { data: analytics, isLoading, isError, refetch } = useQuery<DashboardAnalytics>({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/analytics', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      })
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 8000,
    staleTime: 3000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    retry: 2,
    retryDelay: attemptIndex => Math.min(2000 * 2 ** attemptIndex, 8000)
  })

  // Memoized calculations for performance
  const calculatedValues = useMemo(() => {
    if (!analytics) return null

    const biologyAverage = ((analytics.subjectProgress.botany + analytics.subjectProgress.zoology) / 2) || 0
    const bioRhythmRatio = analytics.bioRhythm.totalEntries > 0 
      ? (analytics.bioRhythm.optimalDays / analytics.bioRhythm.totalEntries) 
      : 0
    const bioRhythmPercentage = Math.round(bioRhythmRatio * 100)
    const improvementValue = analytics.testPerformance.improvement || 0
    const improvementDisplay = improvementValue > 0 ? `+${improvementValue}` : `${improvementValue}`

    return {
      biologyAverage,
      bioRhythmRatio,
      bioRhythmPercentage,
      improvementValue,
      improvementDisplay,
      performanceStatus: getPerformanceStatus(analytics.subjectProgress.overall)
    }
  }, [analytics])

  // Loading state with professional skeleton
  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" 
        role="status" 
        aria-label="Loading analytics dashboard"
      >
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-6 w-6 bg-slate-800 rounded-full"></div>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-8 bg-slate-800 rounded w-16 mx-auto"></div>
                  <div className="h-3 bg-slate-800 rounded w-3/4 mx-auto"></div>
                </div>
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="h-3 bg-slate-800 rounded"></div>
                  <div className="h-3 bg-slate-800 rounded"></div>
                  <div className="h-3 bg-slate-800 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Professional error state
  if (isError || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="col-span-full text-center p-8 rounded-2xl bg-rose-500/10 border border-rose-400/30 backdrop-blur-md" 
          role="alert"
          aria-live="polite"
        >
          <div className="text-rose-400 mb-4">
            <span className="text-3xl mb-3 block">🔬</span>
            <h2 className="text-lg font-medium mb-1">Analytics Temporarily Unavailable</h2>
            <p className="text-sm text-rose-300">Unable to synchronize performance metrics</p>
          </div>
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg transition-colors duration-200 text-rose-200 font-medium"
            aria-label="Retry loading analytics data"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry Synchronization
          </button>
        </div>
      </div>
    )
  }

  if (!calculatedValues) return null

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" 
      role="region" 
      aria-label="Performance analytics dashboard"
    >
      {/* Subject Mastery Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
        role="article"
        aria-label={`Subject mastery: ${analytics.subjectProgress.overall.toFixed(1)}% overall`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl border border-blue-500/30 shadow-xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
          <div className="relative p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-200">Subject Mastery</span>
              </div>
              <motion.div
                animate={!prefersReducedMotion ? { rotate: [0, 8, -8, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                {calculatedValues.performanceStatus.icon}
              </motion.div>
            </div>
            
            <div className="text-center mb-4 flex-grow flex flex-col justify-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                {analytics.subjectProgress.overall.toFixed(1)}%
              </div>
              <div className="text-xs text-blue-300/80">
                {getClinicalAssessment(analytics.subjectProgress.overall)}
              </div>
            </div>
            
            <div className="space-y-2 text-xs border-t border-blue-500/20 pt-3 mt-auto">
              <div className="flex justify-between items-center text-blue-200">
                <span className="flex items-center gap-1.5">
                  <Brain className="h-3 w-3 text-indigo-400" /> Physics
                </span>
                <span className="font-semibold font-mono">{analytics.subjectProgress.physics.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-blue-200">
                <span className="flex items-center gap-1.5">
                  <Atom className="h-3 w-3 text-cyan-400" /> Chemistry
                </span>
                <span className="font-semibold font-mono">{analytics.subjectProgress.chemistry.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-blue-200">
                <span className="flex items-center gap-1.5">
                  <Microscope className="h-3 w-3 text-emerald-400" /> Biology
                </span>
                <span className="font-semibold font-mono">{calculatedValues.biologyAverage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Practice Volume Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
        role="article"
        aria-label={`Practice volume: ${analytics.questionStats.lifetime.toLocaleString()} total questions`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-xl border border-cyan-500/30 shadow-xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 group-hover:from-cyan-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
          <div className="relative p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-200">Practice Volume</span>
              </div>
              <motion.div
                animate={!prefersReducedMotion ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
              >
                <Activity className="h-4 w-4 text-cyan-400" />
              </motion.div>
            </div>
            
            <div className="text-center mb-4 flex-grow flex flex-col justify-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-1">
                {analytics.questionStats.lifetime.toLocaleString()}
              </div>
              <div className="text-xs text-cyan-300/80">
                {getVolumeMetrics(analytics.questionStats.lifetime)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-cyan-500/20 pt-3 mt-auto">
              <div className="bg-slate-800/50 p-2 rounded-lg">
                <div className="text-cyan-300/70 mb-1">Daily</div>
                <div className="font-mono text-cyan-300 font-bold">{analytics.questionStats.daily}</div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded-lg">
                <div className="text-cyan-300/70 mb-1">Chapter</div>
                <div className="font-mono text-cyan-300 font-bold">{analytics.questionStats.chapterwise}</div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded-lg">
                <div className="text-cyan-300/70 mb-1">Weekly</div>
                <div className="font-mono text-cyan-300 font-bold">{analytics.questionStats.weekly}</div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded-lg">
                <div className="text-cyan-300/70 mb-1">Monthly</div>
                <div className="font-mono text-cyan-300 font-bold">{analytics.questionStats.monthly}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Performance Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
        role="article"
        aria-label={`Test performance: ${analytics.testPerformance.averageScore} average score`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl border border-indigo-500/30 shadow-xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
          <div className="relative p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-200">Test Performance</span>
              </div>
              <motion.div
                animate={!prefersReducedMotion ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20"
              >
                {calculatedValues.improvementValue > 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : calculatedValues.improvementValue < 0 ? (
                  <TrendingUp className="h-3 w-3 text-rose-400 rotate-180" />
                ) : (
                  <Activity className="h-3 w-3 text-indigo-400" />
                )}
                <span className={`text-xs font-mono font-bold ${
                  calculatedValues.improvementValue > 0 ? 'text-emerald-400' : 
                  calculatedValues.improvementValue < 0 ? 'text-rose-400' : 'text-indigo-400'
                }`}>
                  {calculatedValues.improvementDisplay}
                </span>
              </motion.div>
            </div>
            
            <div className="text-center mb-4 flex-grow flex flex-col justify-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                {analytics.testPerformance.averageScore}
              </div>
              <div className="text-xs text-indigo-300/80">
                {calculatedValues.improvementValue > 0 
                  ? "Positive performance trajectory" 
                  : "Consistent assessment results"}
              </div>
            </div>
            
            <div className="space-y-2 text-xs border-t border-indigo-500/20 pt-3 mt-auto">
              <div className="flex justify-between items-center text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-3 w-3" /> Total Tests
                </span>
                <span className="font-semibold font-mono">{analytics.testPerformance.totalTests}</span>
              </div>
              <div className="flex justify-between items-center text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <BeakerIcon className="h-3 w-3" /> Latest Score
                </span>
                <span className="font-semibold font-mono">{analytics.testPerformance.lastScore}/720</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bio-Rhythm Sync Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
        role="article"
        aria-label={`Bio-rhythm sync: ${calculatedValues.bioRhythmPercentage}% optimal days`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl border border-emerald-500/30 shadow-xl h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
          <div className="relative p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-200">Bio-Rhythm Sync</span>
              </div>
              <motion.div
                animate={!prefersReducedMotion ? { rotate: [0, 8, -8, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
              >
                <HeartPulse className="h-4 w-4 text-emerald-400" />
              </motion.div>
            </div>
            
            <div className="text-center mb-4 flex-grow flex flex-col justify-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
                {calculatedValues.bioRhythmPercentage}%
              </div>
              <div className="text-xs text-emerald-300/80">
                {getBioRhythmStatus(calculatedValues.bioRhythmRatio)}
              </div>
            </div>
            
            <div className="space-y-2 text-xs border-t border-emerald-500/20 pt-3 mt-auto">
              <div className="flex justify-between items-center text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Target className="h-3 w-3" /> Optimal Days
                </span>
                <span className="font-semibold font-mono">{analytics.bioRhythm.optimalDays}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3" /> Total Sessions
                </span>
                <span className="font-semibold font-mono">{analytics.bioRhythm.totalEntries}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" /> Current Streak
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold font-mono">{analytics.bioRhythm.currentStreak}</span>
                  <span className="text-emerald-400/60 text-[10px] font-medium">DAYS</span>
                </div>
              </div>
            </div>

            {/* Bio-Rhythm Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${calculatedValues.bioRhythmPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}