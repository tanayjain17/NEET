'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ChartBarIcon, BookOpenIcon, CalendarIcon, BeakerIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { Brain, Activity, Dna, Microscope, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'
import { useEffect } from 'react'

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
  moodInsights: {
    happyDays: number
    totalEntries: number
    currentStreak: number
  }
}

export default function RealTimeAnalytics() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleChapterUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      queryClient.refetchQueries({ queryKey: ['dashboard-analytics'] })
    }

    window.addEventListener('chapterProgressUpdated', handleChapterUpdate)
    
    return () => {
      window.removeEventListener('chapterProgressUpdated', handleChapterUpdate)
    }
  }, [queryClient])

  const { data: analytics, isLoading } = useQuery<DashboardAnalytics>({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const timestamp = Date.now()
      const response = await fetch(`/api/dashboard/analytics?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 3000,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    retry: 2,
    retryDelay: attemptIndex => Math.min(2000 * 2 ** attemptIndex, 10000)
  })

  // Professional utility functions for clinical assessment
  const getPerformanceStatus = (progress: number) => {
    if (progress >= 95) return { icon: Target, label: 'Excellence', color: 'emerald' }
    if (progress >= 85) return { icon: TrendingUp, label: 'Advanced Proficiency', color: 'cyan' }
    if (progress >= 75) return { icon: Activity, label: 'Competent', color: 'blue' }
    return { icon: Brain, label: 'Development Phase', color: 'indigo' }
  }

  const getAcademicAssessment = (progress: number) => {
    if (progress >= 90) return "Exceptional Academic Performance"
    if (progress >= 70) return "Strong Progress Trajectory"
    if (progress >= 50) return "Steady Development Phase"
    return "Foundation Building Stage"
  }

  const getVolumeMetrics = (count: number) => {
    if (count >= 1000) return "High-Volume Practice Protocol"
    if (count >= 500) return "Intensive Training Regimen"
    if (count >= 100) return "Active Learning Phase"
    return "Initial Engagement Stage"
  }

  const getBioRhythmStatus = (positiveRatio: number) => {
    if (positiveRatio >= 0.7) return "Optimal Wellness State"
    if (positiveRatio >= 0.5) return "Balanced Bio-Rhythm Pattern"
    return "Monitoring Required"
  }

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-8 bg-slate-700 rounded-lg"></div>
                  <div className="h-4 w-20 bg-slate-700 rounded"></div>
                </div>
                <div className="h-10 bg-slate-700 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700 rounded w-full"></div>
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const performanceStatus = getPerformanceStatus(analytics.subjectProgress.overall)
  const bioRhythmRatio = analytics.moodInsights.totalEntries > 0 
    ? analytics.moodInsights.happyDays / analytics.moodInsights.totalEntries 
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* **Subject Mastery Analytics** */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 backdrop-blur-xl border border-slate-700/80 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 group-hover:from-cyan-500/20 group-hover:via-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-300" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <BookOpenIcon className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Subject Mastery Index
                </span>
              </div>
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
              >
                <performanceStatus.icon className="h-4 w-4 text-cyan-400" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent font-mono">
                {analytics.subjectProgress.overall.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {getAcademicAssessment(analytics.subjectProgress.overall)}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 flex items-center gap-2">
                  <Brain className="h-3 w-3 text-indigo-400" />
                  Physics
                </span>
                <span className="font-bold text-cyan-400 font-mono">
                  {analytics.subjectProgress.physics.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 flex items-center gap-2">
                  <Dna className="h-3 w-3 text-cyan-400" />
                  Chemistry
                </span>
                <span className="font-bold text-cyan-400 font-mono">
                  {analytics.subjectProgress.chemistry.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 flex items-center gap-2">
                  <Microscope className="h-3 w-3 text-emerald-400" />
                  Biology
                </span>
                <span className="font-bold text-cyan-400 font-mono">
                  {((analytics.subjectProgress.botany + analytics.subjectProgress.zoology) / 2).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* **Question Volume Analytics** */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 backdrop-blur-xl border border-blue-700/80 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:via-indigo-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Practice Volume Metrics
                </span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                <Activity className="h-4 w-4 text-blue-400" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                {analytics.questionStats.lifetime.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {getVolumeMetrics(analytics.questionStats.lifetime)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 mb-1 font-medium">Daily Target</div>
                <div className="font-mono text-blue-400 font-bold">{analytics.questionStats.daily}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 mb-1 font-medium">Chapter Focus</div>
                <div className="font-mono text-blue-400 font-bold">{analytics.questionStats.chapterwise}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 mb-1 font-medium">Weekly Total</div>
                <div className="font-mono text-blue-400 font-bold">{analytics.questionStats.weekly}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 mb-1 font-medium">Monthly Total</div>
                <div className="font-mono text-blue-400 font-bold">{analytics.questionStats.monthly}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* **Performance Analytics** */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 backdrop-blur-xl border border-indigo-700/80 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Assessment Performance
                </span>
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-full border border-slate-700"
              >
                {analytics.testPerformance.improvement > 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : analytics.testPerformance.improvement < 0 ? (
                  <TrendingDown className="h-3 w-3 text-rose-400" />
                ) : (
                  <Activity className="h-3 w-3 text-indigo-400" />
                )}
                <span className={`text-xs font-mono font-bold ${
                  analytics.testPerformance.improvement > 0 ? 'text-emerald-400' : 
                  analytics.testPerformance.improvement < 0 ? 'text-rose-400' : 'text-indigo-400'
                }`}>
                  {analytics.testPerformance.improvement > 0 ? '+' : ''}{analytics.testPerformance.improvement}
                </span>
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-mono">
                {analytics.testPerformance.averageScore}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {analytics.testPerformance.improvement > 0 ? "Positive Performance Trajectory" : "Consistent Assessment Results"}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 font-medium">Total Assessments</span>
                <span className="font-bold text-indigo-400 font-mono">{analytics.testPerformance.totalTests}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 font-medium">Latest Score</span>
                <span className="font-bold text-indigo-400 font-mono">{analytics.testPerformance.lastScore}/720</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* **Bio-Rhythm Sync Analytics** */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 backdrop-blur-xl border border-emerald-700/80 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 group-hover:from-emerald-500/20 group-hover:via-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <CalendarIcon className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Bio-Rhythm Sync
                </span>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
              >
                <Target className="h-4 w-4 text-emerald-400" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                {Math.round(bioRhythmRatio * 100)}%
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {getBioRhythmStatus(bioRhythmRatio)}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 font-medium">Positive Days</span>
                <span className="font-bold text-emerald-400 font-mono">{analytics.moodInsights.happyDays}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 font-medium">Total Entries</span>
                <span className="font-bold text-emerald-400 font-mono">{analytics.moodInsights.totalEntries}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-slate-300 font-medium">Consistency Streak</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-emerald-400 font-mono">{analytics.moodInsights.currentStreak}</span>
                  <span className="text-slate-500 text-[10px] font-medium">DAYS</span>
                </div>
              </div>
            </div>

            {/* **Progress Indicator** */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(bioRhythmRatio * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
