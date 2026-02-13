'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, LoadingSpinner } from '@/components/ui/enhanced-components'
import { PremiumLineChart, PremiumAreaChart, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid, TabsLayout } from '@/components/ui/premium-layouts'
import { useState } from 'react'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

type DailyTrend = {
  date: string
  totalQuestions: number
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
}

type WeeklyTrend = {
  weekStart: string
  weekEnd: string
  totalQuestions: number
  weekNumber: number
}

type MonthlyTrend = {
  month: string
  year: number
  totalQuestions: number
  monthName: string
}

type ChartPeriod = 'daily' | 'weekly' | 'monthly'

export default function DailyGoalsCharts() {
  const [activeChart, setActiveChart] = useState<ChartPeriod>('daily')

  const { data: dailyTrend, isLoading: dailyLoading } = useQuery<DailyTrend[]>({
    queryKey: ['daily-goals-trend'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/trend?period=daily')
      if (!response.ok) throw new Error('Failed to fetch daily trend')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const { data: weeklyTrend, isLoading: weeklyLoading } = useQuery<WeeklyTrend[]>({
    queryKey: ['weekly-goals-trend'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/trend?period=weekly')
      if (!response.ok) throw new Error('Failed to fetch weekly trend')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const { data: monthlyTrend, isLoading: monthlyLoading } = useQuery<MonthlyTrend[]>({
    queryKey: ['monthly-goals-trend'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/trend?period=monthly')
      if (!response.ok) throw new Error('Failed to fetch monthly trend')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const calculateStats = (data: any[], type: ChartPeriod) => {
    if (!data || data.length === 0) return null

    const total = data.reduce((sum, item) => sum + item.totalQuestions, 0)
    const average = Math.round(total / data.length)
    const max = Math.max(...data.map(item => item.totalQuestions))
    const min = Math.min(...data.map(item => item.totalQuestions))

    // Calculate trend (last 7 vs previous 7 for daily, last 4 vs previous 4 for others)
    const recentCount = type === 'daily' ? 7 : 4
    const recent = data.slice(-recentCount)
    const previous = data.slice(-recentCount * 2, -recentCount)

    const recentAvg = recent.length > 0 ? recent.reduce((sum, item) => sum + item.totalQuestions, 0) / recent.length : 0
    const previousAvg = previous.length > 0 ? previous.reduce((sum, item) => sum + item.totalQuestions, 0) / previous.length : 0

    const trendPercentage = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0
    const isPositiveTrend = trendPercentage > 0

    return {
      total,
      average,
      max,
      min,
      trendPercentage: Math.abs(trendPercentage),
      isPositiveTrend,
      recentAvg: Math.round(recentAvg),
      dataPoints: data.length
    }
  }

  const renderPremiumChart = (data: any[], type: ChartPeriod) => {
    if (!data || data.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-80 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📊
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
            <p className="text-foreground-secondary">Add some daily goals to see your progress!</p>
          </div>
        </motion.div>
      )
    }

    // Transform data for the premium chart
    const chartData = data.map((item, index) => ({
      name: type === 'daily'
        ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : type === 'weekly'
          ? `W${item.weekNumber}`
          : item.monthName,
      value: item.totalQuestions,
      physics: item.physicsQuestions || 0,
      chemistry: item.chemistryQuestions || 0,
      botany: item.botanyQuestions || 0,
      zoology: item.zoologyQuestions || 0,
      index
    }))

    return (
      <div className="space-y-6">
        {/* Main Chart */}
        <div className="h-80">
          <PremiumAreaChart
            data={chartData}
            areas={[
              {
                dataKey: "value",
                name: "Total Questions",
                color: "#3b82f6",
                fillOpacity: 0.6,
                type: "monotone"
              }
            ]}
            showGrid={true}
            showTooltip={true}
            animate={true}
          />
        </div>

        {/* Subject Breakdown Chart */}
        {type === 'daily' && data.some(item =>
          (item.physicsQuestions || 0) + (item.chemistryQuestions || 0) +
          (item.botanyQuestions || 0) + (item.zoologyQuestions || 0) > 0
        ) && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                Subject-wise Breakdown
              </h4>
              <div className="h-64">
                <PremiumLineChart
                  data={chartData}
                  lines={[
                    { dataKey: 'physics', color: '#ef4444', name: 'Physics' },
                    { dataKey: 'chemistry', color: '#10b981', name: 'Chemistry' },
                    { dataKey: 'botany', color: '#f59e0b', name: 'Botany' },
                    { dataKey: 'zoology', color: '#8b5cf6', name: 'Zoology' }
                  ]}
                  showGrid={true}
                  showTooltip={true}
                  animate={true}
                />
              </div>
            </div>
          )}
      </div>
    )
  }

  const isLoading = dailyLoading || weeklyLoading || monthlyLoading

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
            <span className="gradient-text">Progress Charts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" variant="orbit" />
              <p className="text-foreground-secondary mt-4">Loading your progress charts...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getCurrentData = () => {
    switch (activeChart) {
      case 'daily': return dailyTrend || []
      case 'weekly': return weeklyTrend || []
      case 'monthly': return monthlyTrend || []
      default: return []
    }
  }

  const currentData = getCurrentData()
  const stats = calculateStats(currentData, activeChart)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats Overview */}
      {stats && (
        <Grid cols={4} gap="lg" responsive={{ sm: 2, md: 4 }}>
          <StatsCard
            title="Total Questions"
            value={stats.total}
            description={`Across ${stats.dataPoints} ${activeChart === 'daily' ? 'days' : activeChart === 'weekly' ? 'weeks' : 'months'}`}
            icon={<ChartBarIcon className="h-6 w-6 text-blue-400" />}
            color="primary"
          />
          <StatsCard
            title="Average"
            value={stats.average}
            description={`Per ${activeChart.slice(0, -2)}`}
            icon={<CalendarIcon className="h-6 w-6 text-green-400" />}
            color="success"
          />
          <StatsCard
            title="Best Performance"
            value={stats.max}
            description="Highest single day"
            icon={<StarIcon className="h-6 w-6 text-yellow-400" />}
            color="warning"
          />
          <StatsCard
            title="Recent Trend"
            value={`${stats.trendPercentage.toFixed(1)}%`}
            description={stats.isPositiveTrend ? 'Improving' : 'Declining'}
            icon={stats.isPositiveTrend ?
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" /> :
              <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
            }
            trend={{ value: stats.trendPercentage, isPositive: stats.isPositiveTrend }}
            color={stats.isPositiveTrend ? 'success' : 'error'}
          />
        </Grid>
      )}

      {/* Main Chart Card */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
              >
                <ChartBarIcon className="h-5 w-5 text-blue-400" />
              </motion.div>
              <div>
                <span className="gradient-text text-xl font-bold">Progress Analytics</span>
                <p className="text-foreground-secondary text-sm mt-1">
                  Track your question-solving journey over time
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <Button
                  key={period}
                  onClick={() => setActiveChart(period)}
                  variant={activeChart === period ? 'primary' : 'outline'}
                  size="sm"
                  leftIcon={
                    period === 'daily' ? <ClockIcon className="h-4 w-4" /> :
                      period === 'weekly' ? <CalendarIcon className="h-4 w-4" /> :
                        <ChartBarIcon className="h-4 w-4" />
                  }
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPremiumChart(currentData, activeChart)}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      {stats && currentData.length >= 2 && (
        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/20">
                <ArrowTrendingUpIcon className="h-5 w-5 text-success-500" />
              </div>
              <span className="gradient-text">Performance Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={3} gap="lg" responsive={{ sm: 1, md: 3 }}>
              <motion.div
                className="glass-card p-6 text-center hover:shadow-glow transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground-secondary">First Entry</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <AnimatedCounter value={currentData[0].totalQuestions} />
                </div>
                <div className="text-sm text-foreground-muted">
                  {activeChart === 'daily'
                    ? new Date((currentData[0] as DailyTrend).date).toLocaleDateString()
                    : activeChart === 'weekly'
                      ? `Week ${(currentData[0] as WeeklyTrend).weekNumber}`
                      : `${(currentData[0] as MonthlyTrend).monthName} ${(currentData[0] as MonthlyTrend).year}`
                  }
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-6 text-center hover:shadow-glow transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground-secondary">Latest Entry</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <AnimatedCounter value={currentData[currentData.length - 1].totalQuestions} />
                </div>
                <div className="text-sm text-foreground-muted">
                  {activeChart === 'daily'
                    ? new Date((currentData[currentData.length - 1] as DailyTrend).date).toLocaleDateString()
                    : activeChart === 'weekly'
                      ? `Week ${(currentData[currentData.length - 1] as WeeklyTrend).weekNumber}`
                      : `${(currentData[currentData.length - 1] as MonthlyTrend).monthName} ${(currentData[currentData.length - 1] as MonthlyTrend).year}`
                  }
                </div>
              </motion.div>

              <motion.div
                className={`glass-card p-6 text-center hover:shadow-glow transition-all duration-300 ${stats.isPositiveTrend
                  ? 'border-success-500/30 bg-success-500/5'
                  : 'border-error-500/30 bg-error-500/5'
                  }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  {stats.isPositiveTrend ? (
                    <ArrowUpIcon className="h-4 w-4 text-success-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-error-500" />
                  )}
                  <span className="text-sm font-medium text-foreground-secondary">Net Change</span>
                </div>
                <div className={`text-3xl font-bold mb-2 ${stats.isPositiveTrend ? 'text-success-500' : 'text-error-500'
                  }`}>
                  {stats.isPositiveTrend ? '+' : ''}
                  <AnimatedCounter
                    value={currentData[currentData.length - 1].totalQuestions - currentData[0].totalQuestions}
                  />
                </div>
                <div className="text-sm text-foreground-muted">
                  {stats.trendPercentage.toFixed(1)}% {stats.isPositiveTrend ? 'improvement' : 'decline'}
                </div>
              </motion.div>
            </Grid>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}