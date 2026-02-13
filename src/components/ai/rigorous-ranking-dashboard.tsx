'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LoadingSpinner, Badge } from '@/components/ui/enhanced-components'
import { ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts'
import { 
  TrophyIcon, 
  UsersIcon, 
  ChartBarIcon,
  BeakerIcon,
  CpuChipIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  BoltIcon,
  AcademicCapIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'
import { Activity, Dna, CalendarIcon } from 'lucide-react'

type RankingData = {
  currentRank: number
  totalStudents: number
  percentile: number
  categoryRank: number
  stateRank: number
  progressRank: number
  consistencyRank: number
  biologicalOptimizationRank: number
  rigorousMetrics: {
    syllabusCompletion: number
    testAverage: number
    dailyConsistency: number
    weeklyTarget: number
    monthlyGrowth: number
  }
}

export default function RigorousRankingDashboard() {
  const { data: ranking, isLoading, error } = useQuery<RankingData>({
    queryKey: ['ranking-analytics'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/ranking-analytics')
        if (!response.ok) {
          console.error('Ranking API response not ok:', response.status, response.statusText)
          throw new Error(`Failed to fetch ranking: ${response.status}`)
        }
        const result = await response.json()
        console.log('Ranking API result:', result)
        
        if (!result.success || !result.data) {
          throw new Error('Invalid ranking data received')
        }
        
        return result.data
      } catch (error) {
        console.error('Ranking fetch error:', error)
        // Return default data on error
        return {
          currentRank: 500000,
          totalStudents: 1000000,
          percentile: 50,
          categoryRank: 350000,
          stateRank: 25000,
          progressRank: 400000,
          consistencyRank: 300000,
          biologicalOptimizationRank: 450000,
          rigorousMetrics: {
            syllabusCompletion: 0,
            testAverage: 0,
            dailyConsistency: 0,
            weeklyTarget: 0,
            monthlyGrowth: 0
          }
        }
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3,
    retryDelay: 1000
  })

  const getRankColor = (rank: number, total: number) => {
    const percentile = ((total - rank) / total) * 100
    if (percentile >= 99) return 'text-cyan-400'
    if (percentile >= 95) return 'text-blue-400'
    if (percentile >= 90) return 'text-indigo-400'
    if (percentile >= 75) return 'text-emerald-400'
    return 'text-slate-400'
  }

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-emerald-400'
    if (value >= threshold * 0.8) return 'text-cyan-400'
    if (value >= threshold * 0.6) return 'text-blue-400'
    return 'text-rose-400'
  }

  if (isLoading) {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <LoadingSpinner size="lg" variant="orbit" />
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Processing Cohort Analytics
              </div>
              <div className="text-sm text-foreground-tertiary">
                Benchmarking performance against national dataset...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!ranking) {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardContent className="p-12 text-center">
          <div className="text-foreground-tertiary">
            {error ? 'System Error: Analytics data unavailable.' : 'No ranking data available.'}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRankConfig = (rank: number, total: number) => {
    const percentile = ((total - rank) / total) * 100
    if (percentile >= 99.99) return { 
      gradient: 'from-cyan-500 to-blue-600', 
      icon: <TrophyIcon className="h-8 w-8" />, 
      label: 'DISTINCTION',
      bg: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      textColor: 'text-cyan-500'
    }
    if (percentile >= 99) return { 
      gradient: 'from-blue-500 to-indigo-600', 
      icon: <CheckBadgeIcon className="h-8 w-8" />, 
      label: 'SUPERIOR',
      bg: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30',
      textColor: 'text-blue-500'
    }
    if (percentile >= 95) return { 
      gradient: 'from-indigo-500 to-cyan-600', 
      icon: <BeakerIcon className="h-8 w-8" />, 
      label: 'HIGH MERIT',
      bg: 'from-indigo-500/20 to-cyan-500/20',
      border: 'border-indigo-500/30',
      textColor: 'text-indigo-500'
    }
    if (percentile >= 90) return { 
      gradient: 'from-emerald-500 to-teal-600', 
      icon: <AcademicCapIcon className="h-8 w-8" />, 
      label: 'ABOVE AVERAGE',
      bg: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-500'
    }
    return { 
      gradient: 'from-slate-500 to-slate-600', 
      icon: <BoltIcon className="h-8 w-8" />, 
      label: 'STANDARD',
      bg: 'from-slate-500/20 to-slate-600/20',
      border: 'border-slate-500/30',
      textColor: 'text-slate-500'
    }
  }

  const rankConfig = getRankConfig(ranking.currentRank, ranking.totalStudents)

  return (
    <div className="space-y-6">
      {/* Hero Ranking Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className={`absolute inset-0 bg-gradient-to-br ${rankConfig.bg}`} />
        <div className={`relative glass-effect border ${rankConfig.border} p-8 md:p-12`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-4 rounded-3xl bg-white/[0.08]"
              >
                <PresentationChartLineIcon className="h-10 w-10 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">National Performance Index</h2>
                <p className="text-foreground-tertiary text-sm mt-1">Cohort Size: {(ranking.totalStudents / 100000).toFixed(1)} Lakh Candidates</p>
              </div>
            </div>
            <Badge variant="warning" size="lg" className="hidden md:flex">
              {rankConfig.label} STATUS
            </Badge>
          </div>

          {/* Main Rank Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Rank */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                {rankConfig.icon}
              </div>
              <div className={`text-6xl font-bold mb-3 ${rankConfig.textColor} drop-shadow-glow`}>
                #<AnimatedCounter value={ranking.currentRank || 0} />
              </div>
              <div className="text-sm font-semibold text-foreground-secondary mb-2">AIR (All India Rank)</div>
              <div className="text-xs text-foreground-tertiary">
                Top {ranking.percentile}% of Cohort
              </div>
            </motion.div>

            {/* Category Rank */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                <UsersIcon className="h-8 w-8 text-blue-500 mx-auto" />
              </div>
              <div className="text-6xl font-bold text-blue-500 mb-3 drop-shadow-glow">
                #<AnimatedCounter value={ranking.categoryRank || 0} />
              </div>
              <div className="text-sm font-semibold text-foreground-secondary mb-2">Category Rank</div>
              <div className="text-xs text-foreground-tertiary">Vertical Reservation</div>
            </motion.div>

            {/* State Rank */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                <AcademicCapIcon className="h-8 w-8 text-emerald-500 mx-auto" />
              </div>
              <div className="text-6xl font-bold text-emerald-500 mb-3 drop-shadow-glow">
                #<AnimatedCounter value={ranking.stateRank || 0} />
              </div>
              <div className="text-sm font-semibold text-foreground-secondary mb-2">State Rank</div>
              <div className="text-xs text-foreground-tertiary">Domicile Quota</div>
            </motion.div>

            {/* Percentile */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4 flex justify-center">
                <ProgressRing
                  progress={ranking.percentile || 0}
                  size={80}
                  strokeWidth={8}
                  color="#3b82f6"
                  showValue={false}
                />
              </div>
              <div className="text-6xl font-bold text-blue-500 mb-3 drop-shadow-glow">
                {ranking.percentile || 0}%
              </div>
              <div className="text-sm font-semibold text-foreground-secondary mb-2">Percentile Score</div>
              <div className="text-xs text-foreground-tertiary">
                {ranking.currentRank <= 50 ? 'Target performance achieved' : 
                 ranking.currentRank <= 1000 ? 'Superior performance tier' : 
                 ranking.currentRank <= 10000 ? 'Above-average performance' : 'Consistent progress maintained'}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Rigorous Performance Metrics */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/20">
              <ChartBarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="gradient-text text-xl">Quantitative Performance Metrics</div>
              <div className="text-xs text-foreground-tertiary font-normal mt-1">
                Key Performance Indicators (KPIs) for AIR &lt; 50
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Syllabus Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                (ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 
                  ? 'from-emerald-500/20 to-teal-500/20' 
                  : 'from-blue-500/20 to-cyan-500/20'
              }`} />
              <div className={`relative glass-effect border ${
                (ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 
                  ? 'border-emerald-500/30' 
                  : 'border-blue-500/30'
              } p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-emerald-500" />
                  </div>
                  <ProgressRing
                    progress={ranking.rigorousMetrics?.syllabusCompletion || 0}
                    size={60}
                    strokeWidth={6}
                    color={(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 ? '#10b981' : '#3b82f6'}
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.syllabusCompletion || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Syllabus Coverage</div>
                <div className="text-xs text-foreground-tertiary">Target: 97%+ for AIR &lt; 50</div>
                {(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 && (
                  <Badge variant="success" size="sm" className="mt-2">Target Achieved</Badge>
                )}
              </div>
            </motion.div>

            {/* Test Average */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                (ranking.rigorousMetrics?.testAverage || 0) >= 650 
                  ? 'from-indigo-500/20 to-blue-500/20' 
                  : 'from-rose-500/20 to-blue-500/20'
              }`} />
              <div className={`relative glass-effect border ${
                (ranking.rigorousMetrics?.testAverage || 0) >= 650 
                  ? 'border-indigo-500/30' 
                  : 'border-rose-500/30'
              } p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <BeakerIcon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <ProgressRing
                    progress={((ranking.rigorousMetrics?.testAverage || 0) / 720) * 100}
                    size={60}
                    strokeWidth={6}
                    color={(ranking.rigorousMetrics?.testAverage || 0) >= 650 ? '#6366f1' : '#f43f5e'}
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.testAverage || 0}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Mock Test Mean</div>
                <div className="text-xs text-foreground-tertiary">Target: 650+ / 720 Marks</div>
              </div>
            </motion.div>

            {/* Daily Consistency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                (ranking.rigorousMetrics?.dailyConsistency || 0) >= 90 
                  ? 'from-cyan-500/20 to-teal-500/20' 
                  : 'from-slate-500/20 to-slate-600/20'
              }`} />
              <div className={`relative glass-effect border ${
                (ranking.rigorousMetrics?.dailyConsistency || 0) >= 90 
                  ? 'border-cyan-500/30' 
                  : 'border-slate-500/30'
              } p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <Activity className="h-6 w-6 text-cyan-500" />
                  </div>
                  <ProgressRing
                    progress={ranking.rigorousMetrics?.dailyConsistency || 0}
                    size={60}
                    strokeWidth={6}
                    color={(ranking.rigorousMetrics?.dailyConsistency || 0) >= 90 ? '#06b6d4' : '#6b7280'}
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.dailyConsistency || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Study Adherence</div>
                <div className="text-xs text-foreground-tertiary">Target: 90%+ daily consistency</div>
              </div>
            </motion.div>

            {/* Weekly Target */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
              <div className="relative glass-effect border border-emerald-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <CalendarIcon className="h-6 w-6 text-emerald-500" />
                  </div>
                  <ProgressRing
                    progress={ranking.rigorousMetrics?.weeklyTarget || 0}
                    size={60}
                    strokeWidth={6}
                    color="#10b981"
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.weeklyTarget || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Problem Volume</div>
                <div className="text-xs text-foreground-tertiary">2000 questions/week target</div>
              </div>
            </motion.div>

            {/* Monthly Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                (ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 
                  ? 'from-blue-500/20 to-indigo-500/20' 
                  : 'from-rose-500/20 to-blue-500/20'
              }`} />
              <div className={`relative glass-effect border ${
                (ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 
                  ? 'border-blue-500/30' 
                  : 'border-rose-500/30'
              } p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className={`text-3xl ${
                    (ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'text-blue-500' : 'text-rose-500'
                  }`}>
                    {(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? '↗' : '↘'}
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 ${
                  (ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'text-blue-500' : 'text-rose-500'
                }`}>
                  {(ranking.rigorousMetrics?.monthlyGrowth || 0) > 0 ? '+' : ''}{ranking.rigorousMetrics?.monthlyGrowth || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Growth Delta</div>
                <div className="text-xs text-foreground-tertiary">Month-over-month variance</div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Specialized Rankings */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20">
              <CpuChipIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <div className="gradient-text text-xl">Specialized Performance Indices</div>
              <div className="text-xs text-foreground-tertiary font-normal mt-1">
                Category-specific performance vectors
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Rank */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
              <div className="relative glass-effect border border-blue-500/30 p-6 text-center">
                <div className="mb-4">
                  <ArrowTrendingUpIcon className="h-10 w-10 text-blue-500 mx-auto" />
                </div>
                <div className="text-4xl font-bold text-blue-500 mb-3">
                  #<AnimatedCounter value={ranking.progressRank || 0} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">Academic Velocity</div>
                <div className="text-xs text-foreground-tertiary">
                  Rate of syllabus acquisition
                </div>
              </div>
            </motion.div>

            {/* Consistency Rank */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20" />
              <div className="relative glass-effect border border-emerald-500/30 p-6 text-center">
                <div className="mb-4">
                  <CheckBadgeIcon className="h-10 w-10 text-emerald-500 mx-auto" />
                </div>
                <div className="text-4xl font-bold text-emerald-500 mb-3">
                  #<AnimatedCounter value={ranking.consistencyRank || 0} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">Study Adherence Index</div>
                <div className="text-xs text-foreground-tertiary">
                  Daily routine stability metric
                </div>
              </div>
            </motion.div>

            {/* Bio-Rhythm Sync Rank */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20" />
              <div className="relative glass-effect border border-indigo-500/30 p-6 text-center">
                <div className="mb-4">
                  <Dna className="h-10 w-10 text-indigo-500 mx-auto" />
                </div>
                <div className="text-4xl font-bold text-indigo-500 mb-3">
                  #<AnimatedCounter value={ranking.biologicalOptimizationRank || 0} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">Bio-Rhythm Synchronization</div>
                <div className="text-xs text-foreground-tertiary">
                  Circadian optimization efficiency
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Analysis Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20" />
        <div className="relative glass-effect border border-blue-500/30 p-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            {rankConfig.icon}
          </motion.div>
          <div className="text-2xl font-bold gradient-text mb-3">
            {ranking.currentRank <= 50
              ? 'Statistical Projection: High probability of selection in premier institutions'
              : ranking.currentRank <= 1000
              ? 'Performance Analysis: Superior tier achievement with strong selection probability'
              : ranking.currentRank <= 10000
              ? 'Cohort Analysis: Above-average performance with steady trajectory'
              : 'Performance Tracking: Consistent progress maintained across metrics'}
          </div>
          <div className="text-foreground-secondary text-lg mb-4">
            Current performance metrics position you in the top{' '}
            <span className="font-bold text-primary">
              {ranking.currentRank && ranking.totalStudents
                ? ((ranking.totalStudents - ranking.currentRank) / ranking.totalStudents * 100).toFixed(2)
                : '0'}%
            </span>{' '}
            of the national candidate cohort.
          </div>
          <Badge variant="warning" size="lg">
            {rankConfig.label} PERFORMANCE TIER
          </Badge>
        </div>
      </motion.div>
    </div>
  )
}
