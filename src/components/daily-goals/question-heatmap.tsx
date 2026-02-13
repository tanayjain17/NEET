'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Badge, LoadingSpinner } from '@/components/ui/enhanced-components'
import { ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid } from '@/components/ui/premium-layouts'
import {
  FireIcon,
  CalendarIcon,
  TrophyIcon,
  ChartBarIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

interface HeatmapData {
  date: string
  count: number
  color: string
  dayOfWeek: number
  week: number
}

interface HeatmapResponse {
  startDate: string
  endDate: string
  heatmapData: HeatmapData[]
  totalDays: number
  totalWeeks: number
  streakData: {
    currentStreak: number
    longestStreak: number
    totalActiveDays: number
    averageDaily: number
  }
  monthlyStats: Array<{
    month: string
    total: number
    average: number
    bestDay: number
  }>
}

const colorMap = {
  'blank': {
    bg: 'bg-gray-800/20',
    border: 'border-gray-700/30',
    glow: '',
    intensity: 0
  },
  'light': {
    bg: 'bg-green-400/30',
    border: 'border-green-400/50',
    glow: 'shadow-green-400/20',
    intensity: 1
  },
  'mid': {
    bg: 'bg-green-500/50',
    border: 'border-green-500/70',
    glow: 'shadow-green-500/30',
    intensity: 2
  },
  'darker': {
    bg: 'bg-green-600/70',
    border: 'border-green-600/80',
    glow: 'shadow-green-600/40',
    intensity: 3
  },
  'darkest': {
    bg: 'bg-green-700/90',
    border: 'border-green-700/90',
    glow: 'shadow-green-700/50 shadow-glow',
    intensity: 4
  },
  'legendary': {
    bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    border: 'border-yellow-400',
    glow: 'shadow-yellow-400/60 shadow-glow',
    intensity: 5
  }
}

interface QuestionHeatmapProps {
  compact?: boolean
}

export default function QuestionHeatmap({ compact = false }: QuestionHeatmapProps) {
  const { data, isLoading } = useQuery<{ data: HeatmapResponse }>({
    queryKey: ['daily-goals-heatmap'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/heatmap')
      if (!response.ok) throw new Error('Failed to fetch heatmap data')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

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
              <FireIcon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="gradient-text">Question Streak Heatmap</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" variant="pulse" />
              <p className="text-foreground-secondary mt-4">Loading your progress heatmap...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.data) return null

  const heatmapData = data.data

  // Group data by weeks for GitHub-style layout
  const weeks = heatmapData.heatmapData.reduce((acc, day) => {
    if (!acc[day.week]) acc[day.week] = Array(7).fill(null)
    acc[day.week][day.dayOfWeek] = day
    return acc
  }, {} as Record<number, (HeatmapData | null)[]>)

  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b)
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const cellSize = compact ? 'w-2 h-2' : 'w-4 h-4'
  const spacing = compact ? 'gap-0.5' : 'gap-1'
  const maxWeeks = compact ? 26 : weekNumbers.length
  const displayWeeks = weekNumbers.slice(-maxWeeks)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      {!compact && heatmapData.streakData && (
        <Grid cols={4} gap="lg" responsive={{ sm: 2, md: 4 }}>
          <StatsCard
            title="Current Streak"
            value={heatmapData.streakData.currentStreak.toString()}
            description="Days in a row"
            icon={<FireIcon className="h-6 w-6 text-orange-400" />}
            trend={{ value: 12, isPositive: true }}
            color="warning"
          />
          <StatsCard
            title="Longest Streak"
            value={heatmapData.streakData.longestStreak.toString()}
            description="Personal best"
            icon={<TrophyIcon className="h-6 w-6 text-yellow-400" />}
            color="success"
          />
          <StatsCard
            title="Active Days"
            value={heatmapData.streakData.totalActiveDays.toString()}
            description="Total days studied"
            icon={<CalendarIcon className="h-6 w-6 text-blue-400" />}
            color="primary"
          />
          <StatsCard
            title="Daily Average"
            value={Math.round(heatmapData.streakData.averageDaily).toString()}
            description="Questions per day"
            icon={<ChartBarIcon className="h-6 w-6 text-green-400" />}
            color="success"
          />
        </Grid>
      )}

      {/* Main Heatmap */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20"
              >
                <FireIcon className="h-5 w-5 text-orange-400" />
              </motion.div>
              <div>
                <span className="gradient-text text-xl font-bold">Question Streak Heatmap</span>
                {!compact && (
                  <p className="text-foreground-secondary text-sm mt-1">
                    {new Date(heatmapData.startDate).toLocaleDateString()} - {new Date(heatmapData.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {heatmapData.streakData && (
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" className="flex items-center gap-1">
                    <FireIcon className="h-3 w-3" />
                    {heatmapData.streakData.currentStreak} day streak
                  </Badge>
                </div>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Month labels */}
                <div className={`flex mb-3 ml-8`}>
                  {displayWeeks.map((weekNum, index) => {
                    const firstDayOfWeek = weeks[weekNum]?.find(day => day !== null)

                    if (!firstDayOfWeek) {
                      return <div key={weekNum} className={`${compact ? 'w-2' : 'w-4'} ${compact ? 'mr-0.5' : 'mr-1'}`}></div>
                    }

                    const date = new Date(firstDayOfWeek.date)
                    const isFirstWeekOfMonth = index === 0 ||
                      (weeks[displayWeeks[index - 1]]?.find(d => d !== null) &&
                        new Date(weeks[displayWeeks[index - 1]].find(d => d !== null)!.date).getMonth() !== date.getMonth())

                    if (!isFirstWeekOfMonth) {
                      return <div key={weekNum} className={`${compact ? 'w-2' : 'w-4'} ${compact ? 'mr-0.5' : 'mr-1'}`}></div>
                    }

                    return (
                      <div key={weekNum} className={`text-xs text-foreground-secondary ${compact ? 'w-2' : 'w-4'} ${compact ? 'mr-0.5' : 'mr-1'} text-left`}>
                        {monthLabels[date.getMonth()]}
                      </div>
                    )
                  })}
                </div>

                <div className="flex">
                  {/* Day labels */}
                  <div className={`flex flex-col mr-2 ${spacing}`}>
                    {dayLabels.map((day, index) => (
                      <div key={day} className={`${compact ? 'h-2' : 'h-4'} text-xs text-foreground-secondary w-6 flex items-center justify-end pr-1`}>
                        {index % 2 === 1 ? day : ''}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  <div className={`flex ${spacing}`}>
                    {displayWeeks.map((weekNum, weekIndex) => (
                      <div key={weekNum} className={`flex flex-col ${spacing}`}>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          const dayData = weeks[weekNum]?.[dayIndex]
                          const colorData = dayData ? (colorMap[dayData.color as keyof typeof colorMap] || colorMap['blank']) : colorMap['blank']

                          return (
                            <motion.div
                              key={`${weekNum}-${dayIndex}`}
                              className={`${cellSize} rounded-lg ${colorData.bg} border ${colorData.border} cursor-pointer transition-all duration-300 hover:scale-125 ${colorData.glow}`}
                              whileHover={{
                                scale: compact ? 1.4 : 1.3,
                                zIndex: 10
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: (weekIndex * 7 + dayIndex) * 0.01,
                                type: "spring",
                                stiffness: 200
                              }}
                              title={dayData ?
                                `${new Date(dayData.date).toLocaleDateString()}: ${dayData.count} questions` :
                                'No data'
                              }
                            >
                              {/* Special effects for high-intensity days */}
                              {dayData && dayData.count >= 500 && (
                                <motion.div
                                  className="absolute inset-0 rounded-lg"
                                  animate={{
                                    boxShadow: [
                                      '0 0 0 0 rgba(251, 191, 36, 0.7)',
                                      '0 0 0 4px rgba(251, 191, 36, 0)',
                                    ],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                  }}
                                />
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Legend */}
                <div className="flex items-center justify-between mt-6 text-sm">
                  <div className="flex items-center gap-2 text-foreground-secondary">
                    <span>Less</span>
                    <div className="flex items-center gap-1">
                      {Object.entries(colorMap).filter(([key]) => key !== 'blank').map(([key, colorData]) => (
                        <motion.div
                          key={key}
                          className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} rounded-lg ${colorData.bg} border ${colorData.border} ${colorData.glow}`}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-foreground-muted">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-400/30 rounded border border-green-400/50"></div>
                      <span>1-99</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500/50 rounded border border-green-500/70"></div>
                      <span>100-249</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-600/70 rounded border border-green-600/80"></div>
                      <span>250-499</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded border border-yellow-400"></div>
                      <span>500+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            {!compact && heatmapData.monthlyStats && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  Monthly Performance
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {heatmapData.monthlyStats.slice(-4).map((month, index) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-4 text-center hover:shadow-glow transition-all duration-300"
                    >
                      <div className="text-lg font-bold text-foreground mb-1">
                        {month.month}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            <AnimatedCounter value={month.total} />
                          </div>
                          <div className="text-xs text-foreground-secondary">Total Questions</div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <div>
                            <div className="font-medium text-foreground">{Math.round(month.average)}</div>
                            <div className="text-foreground-muted">Avg/day</div>
                          </div>
                          <div>
                            <div className="font-medium text-success-500">{month.bestDay}</div>
                            <div className="text-foreground-muted">Best day</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}