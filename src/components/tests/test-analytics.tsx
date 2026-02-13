'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { StatsCard } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/enhanced-components'
import { ProgressRing } from '@/components/ui/premium-charts'
import { 
  TrophyIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline'

type AnalyticsData = {
  averageScore: number
  highestScore: number
  lowestScore: number
  totalTests: number
  improvementTrend: number
  recentPerformance: number
  scorePercentage: number
  emoji: string
}

export default function TestAnalytics() {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['test-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/tests/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </motion.div>
    )
  }

  if (error || !analytics) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Tests"
          value="0"
          description="No tests recorded yet"
          icon={<AcademicCapIcon className="h-6 w-6 text-blue-400" />}
          color="primary"
        />

        <StatsCard
          title="Average Score"
          value="-"
          description="Add tests to see analytics"
          icon={<ChartBarIcon className="h-6 w-6 text-purple-400" />}
          color="primary"
        />

        <StatsCard
          title="Highest Score"
          value="-"
          description="Add tests to see analytics"
          icon={<TrophyIcon className="h-6 w-6 text-yellow-400" />}
          color="warning"
        />

        <StatsCard
          title="Performance"
          value="📊"
          description="Add tests to see performance"
          icon={<StarIcon className="h-6 w-6 text-green-400" />}
          color="success"
        />
      </motion.div>
    )
  }

  const getPerformanceColor = (trend: number) => {
    if (trend > 0) return 'success'
    if (trend < 0) return 'error'
    return 'warning'
  }

  const getPerformanceIcon = (trend: number) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="h-5 w-5 text-success-500" />
    if (trend < 0) return <ArrowTrendingDownIcon className="h-5 w-5 text-error-500" />
    return <div className="w-5 h-5 rounded-full bg-warning-500" />
  }

  const getPerformanceLabel = (percentage: number) => {
    if (percentage < 75) return 'Needs Focus'
    if (percentage < 85) return 'Good Progress'
    if (percentage < 95) return 'Excellent'
    return 'Outstanding'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {/* Total Tests */}
      <StatsCard
        title="Total Tests"
        value={analytics.totalTests.toString()}
        description="Tests completed"
        icon={<AcademicCapIcon className="h-6 w-6 text-blue-400" />}
        color="primary"
      />

      {/* Average Score with Progress Ring */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="premium-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-foreground-secondary">Average Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{analytics.averageScore}</span>
              <span className="text-sm text-foreground-muted">/720</span>
            </div>
          </div>
          <ProgressRing 
            progress={analytics.scorePercentage} 
            size={60}
            strokeWidth={6}
            color="#8b5cf6"
            showValue={false}
          />
        </div>
        <p className="text-xs text-foreground-secondary">
          {analytics.scorePercentage.toFixed(1)}% average performance
        </p>
      </motion.div>

      {/* Highest Score */}
      <StatsCard
        title="Highest Score"
        value={analytics.highestScore.toString()}
        description={`${Math.round((analytics.highestScore / 720) * 100)}% best performance`}
        icon={<TrophyIcon className="h-6 w-6 text-yellow-400" />}
        color="warning"
      />

      {/* Performance Trend with Enhanced Visual */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="premium-card p-6 relative overflow-hidden"
      >
        {/* Background gradient based on performance */}
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${
          analytics.improvementTrend > 0 ? 'from-success-500 to-success-600' :
          analytics.improvementTrend < 0 ? 'from-error-500 to-error-600' :
          'from-warning-500 to-warning-600'
        }`} />
        
        <div className="relative z-10">
          <p className="text-sm font-medium text-foreground-secondary mb-3">Performance Trend</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 rounded-2xl bg-white/[0.08]"
              >
                {getPerformanceIcon(analytics.recentPerformance)}
              </motion.div>
              
              <div>
                <div className="flex items-center gap-2">
                  {getPerformanceIcon(analytics.improvementTrend)}
                  <span className={`text-lg font-bold ${
                    analytics.improvementTrend > 0 ? 'text-success-500' : 
                    analytics.improvementTrend < 0 ? 'text-error-500' : 'text-warning-500'
                  }`}>
                    {analytics.improvementTrend > 0 ? '+' : ''}{analytics.improvementTrend}%
                  </span>
                </div>
                <p className="text-xs text-foreground-secondary">
                  {getPerformanceLabel(analytics.recentPerformance)} • {analytics.improvementTrend > 0 ? 'Improving' : 
                   analytics.improvementTrend < 0 ? 'Needs attention' : 'Stable'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}