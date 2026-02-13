'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PremiumLineChart, PremiumAreaChart, ProgressRing } from '@/components/ui/premium-charts'
import { Badge, LoadingSpinner } from '@/components/ui/enhanced-components'
import { Button } from '@/components/ui/button'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

type PerformanceTrend = {
  date: string
  score: number
  percentage: number
  testType: string
  testNumber: string
}

export default function TestPerformanceChart() {
  const [selectedTestType, setSelectedTestType] = useState<string>('all')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')

  const { data: trendData, isLoading, error } = useQuery<PerformanceTrend[]>({
    queryKey: ['test-performance-trend', selectedTestType],
    queryFn: async () => {
      const url = selectedTestType === 'all'
        ? '/api/tests/trend'
        : `/api/tests/trend?testType=${encodeURIComponent(selectedTestType)}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch performance trend')
      }
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const testTypes = [
    { value: 'all', label: 'All Tests', color: 'primary' },
    { value: 'Weekly Test', label: 'Weekly Test', color: 'success' },
    { value: 'Rank Booster', label: 'Rank Booster', color: 'warning' },
    { value: 'Test Series', label: 'Test Series', color: 'error' },
    { value: 'AITS', label: 'AITS', color: 'info' },
    { value: 'Full Length Test', label: 'Full Length', color: 'primary' }
  ]

  // Get icon for current performance
  const getPerformanceIndicator = (percentage: number) => {
    if (percentage < 75) return <div className="w-3 h-3 rounded-full bg-error-500 animate-pulse" />
    if (percentage < 85) return <div className="w-3 h-3 rounded-full bg-warning-500 animate-pulse" />
    if (percentage < 95) return <div className="w-3 h-3 rounded-full bg-success-500 animate-pulse" />
    return <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
  }

  // Prepare chart data
  const chartData = trendData?.map((item, index) => ({
    name: `Test ${index + 1}`,
    score: item.score,
    percentage: item.percentage,
    date: new Date(item.date).toLocaleDateString(),
    testType: item.testType,
    testNumber: item.testNumber
  })) || []

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
              <ChartBarIcon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="gradient-text">Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" variant="orbit" />
              <p className="text-foreground-secondary mt-4">Loading performance data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !trendData || trendData.length === 0) {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <ChartBarIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">Performance Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="h-80 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-4 p-6 rounded-3xl bg-primary/10"
              >
                <ChartBarIcon className="h-16 w-16 text-primary mx-auto" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Performance Data Yet
              </h3>
              <p className="text-foreground-secondary mb-4">
                Add some test scores to see your amazing progress journey!
              </p>
              <Button variant="gradient" size="sm">
                Add Your First Test
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  const latestScore = trendData[trendData.length - 1]
  const firstScore = trendData[0]
  const improvement = latestScore.score - firstScore.score
  const improvementPercentage = ((improvement / firstScore.score) * 100).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="premium" hover="both" asMotion className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-xl bg-primary/20"
              >
                <ChartBarIcon className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="gradient-text">Performance Analytics</span>
            </CardTitle>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Chart Type Toggle */}
              <div className="flex bg-background-secondary rounded-lg p-1">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 rounded text-sm transition-all ${chartType === 'area'
                    ? 'bg-primary text-white'
                    : 'text-foreground-secondary hover:text-foreground'
                    }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded text-sm transition-all ${chartType === 'line'
                    ? 'bg-primary text-white'
                    : 'text-foreground-secondary hover:text-foreground'
                    }`}
                >
                  Line
                </button>
              </div>
            </div>
          </div>

          {/* Test Type Filter */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
            {testTypes.map(type => (
              <Badge
                key={type.value}
                variant={selectedTestType === type.value ? type.color as any : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedTestType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Chart */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={chartType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {chartType === 'area' ? (
                    <PremiumAreaChart
                      data={chartData}
                      areas={[
                        {
                          dataKey: 'score',
                          name: 'Score',
                          color: '#3b82f6',
                          type: 'monotone'
                        }
                      ]}
                      height={300}
                      showGrid={true}
                      showTooltip={true}
                      animate={true}
                    />
                  ) : (
                    <PremiumLineChart
                      data={chartData}
                      lines={[
                        {
                          dataKey: 'score',
                          name: 'Score',
                          color: '#3b82f6',
                          strokeWidth: 3,
                          type: 'monotone'
                        }
                      ]}
                      height={300}
                      showGrid={true}
                      showTooltip={true}
                      animate={true}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced Performance Comparison */}
            {trendData.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 border-t border-white/10"
              >
                {/* First Test */}
                <div className="glass-effect p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-foreground-secondary" />
                    <span className="text-sm text-foreground-secondary">First Test</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-foreground">
                      {firstScore.score}
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-2 rounded-xl bg-white/[0.08]"
                    >
                      {getPerformanceIndicator(firstScore.percentage)}
                    </motion.div>
                  </div>
                  <div className="text-sm text-foreground-secondary">
                    {firstScore.percentage.toFixed(1)}% • {new Date(firstScore.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Latest Test */}
                <div className="glass-effect p-4 rounded-xl text-center border border-primary/30">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <StarIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">Latest Test</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-foreground">
                      {latestScore.score}
                    </span>
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-2 rounded-xl bg-primary/20"
                    >
                      {getPerformanceIndicator(latestScore.percentage)}
                    </motion.div>
                  </div>
                  <div className="text-sm text-foreground-secondary">
                    {latestScore.percentage.toFixed(1)}% • {new Date(latestScore.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Improvement */}
                <div className="glass-effect p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {improvement >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-success-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-error-500" />
                    )}
                    <span className="text-sm text-foreground-secondary">Growth</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`text-2xl font-bold ${improvement >= 0 ? 'text-success-500' : 'text-error-500'
                      }`}>
                      {improvement >= 0 ? '+' : ''}{improvement}
                    </span>
                    <ProgressRing
                      progress={Math.abs(parseFloat(improvementPercentage))}
                      size={40}
                      strokeWidth={4}
                      color={improvement >= 0 ? '#10b981' : '#ef4444'}
                      showValue={false}
                    />
                  </div>
                  <div className="text-sm text-foreground-secondary">
                    {improvementPercentage}% change
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}