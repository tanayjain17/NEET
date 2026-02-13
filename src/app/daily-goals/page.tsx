'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DailyGoalsForm from '@/components/daily-goals/daily-goals-form'
import QuestionStats from '@/components/daily-goals/question-stats'
import RecentGoals from '@/components/daily-goals/recent-goals'
import DailyGoalsCharts from '@/components/daily-goals/daily-goals-charts'
import QuestionHeatmap from '@/components/daily-goals/question-heatmap'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress } from '@/components/ui/enhanced-components'
import { ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid, TabsLayout } from '@/components/ui/premium-layouts'
import {
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  RocketLaunchIcon,
  BoltIcon,
  HeartIcon,
  SparklesIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

type TabKey = 'today' | 'stats' | 'history'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export default function DailyGoalsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')

  const performanceLevels = [
    {
      icon: <FireIcon className="h-5 w-5" />,
      threshold: 500,
      label: 'LEGENDARY',
      color: 'error',
      description: 'Exceptional performance',
      gradient: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30',
      indicatorColor: 'bg-red-500'
    },
    {
      icon: <StarIcon className="h-5 w-5" />,
      threshold: 300,
      label: 'AMAZING',
      color: 'warning',
      description: 'Outstanding work',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30',
      indicatorColor: 'bg-yellow-500'
    },
    {
      icon: <CheckCircleIcon className="h-5 w-5" />,
      threshold: 250,
      label: 'EXCELLENT',
      color: 'success',
      description: 'Great progress',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      indicatorColor: 'bg-green-500'
    },
    {
      icon: <BoltIcon className="h-5 w-5" />,
      threshold: 150,
      label: 'GOOD',
      color: 'info',
      description: 'Steady progress',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      indicatorColor: 'bg-blue-500'
    },
    {
      icon: <HeartIcon className="h-5 w-5" />,
      threshold: 1,
      label: 'KEEP GOING',
      color: 'primary',
      description: 'Every step counts',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/30',
      indicatorColor: 'bg-purple-500'
    }
  ]

  const dailyTargets = [
    {
      label: 'Daily Questions',
      target: 250,
      icon: <AcademicCapIcon className="h-5 w-5" />,
      color: 'primary',
      description: 'Minimum daily target',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Excellence Level',
      target: 500,
      icon: <StarIcon className="h-5 w-5" />,
      color: 'warning',
      description: 'Peak performance',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      label: 'Weekly Goal',
      target: 6800,
      icon: <TrophyIcon className="h-5 w-5" />,
      color: 'success',
      description: 'Weekly milestone',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Monthly Goal',
      target: 27500,
      icon: <RocketLaunchIcon className="h-5 w-5" />,
      color: 'error',
      description: 'Monthly achievement',
      gradient: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30'
    }
  ]

  return (
    <DashboardLayout
      title="Daily Goals"
      subtitle="Track your daily NEET preparation progress with gamification"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8"
      >
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-4"
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
              className="relative"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-glow">
                <TrophyIcon className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <SparklesIcon className="h-4 w-4 text-yellow-900" />
              </motion.div>
            </motion.div>

            <div>
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text break-words"
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
                Daily Goals
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center justify-center gap-2 mt-3"
              >
                {['🎯', '📚', '💪', '🏆', '⭐', '🔥', '💎'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      delay: i * 0.2,
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="text-2xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed px-2 break-words"
          >
            Track your daily NEET preparation progress with
            <motion.span
              className="font-bold text-primary mx-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              gamification
            </motion.span>
            and achieve excellence
          </motion.p>
        </motion.div>

        {/* Premium Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <TabsLayout
            activeTab={activeTab}
            onTabChange={(tabId: string) => setActiveTab(tabId as TabKey)}
            variant="pills"
            tabs={[
              {
                id: 'today',
                label: "Today's Goals",
                icon: <PlusIcon className="h-4 w-4" />,
                content: renderTodayTab()
              },
              {
                id: 'stats',
                label: 'Statistics',
                icon: <ChartBarIcon className="h-4 w-4" />,
                content: renderStatsTab()
              },
              {
                id: 'history',
                label: 'History',
                icon: <CalendarIcon className="h-4 w-4" />,
                content: renderHistoryTab()
              }
            ]}
          />
        </motion.div>
      </motion.div>
    </DashboardLayout >
  )

  function renderTodayTab() {
    return (
      <motion.div
        key="today"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Hero Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {dailyTargets.map((target, index) => (
            <motion.div
              key={target.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${target.gradient} opacity-50`} />
              <div className={`relative glass-effect border ${target.borderColor} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08] group-hover:bg-white/[0.12] transition-all">
                    {target.icon}
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-2xl opacity-20"
                  >
                    {target.icon}
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">
                    {target.target.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-foreground-secondary">
                    {target.label}
                  </div>
                  <div className="text-xs text-foreground-tertiary">
                    {target.description}
                  </div>
                </div>
            </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Form Section - Takes 2 columns */}
            <div className="xl:col-span-2">
              <DailyGoalsForm />
            </div>

            {/* Performance Scale - Takes 1 column */}
            <div>
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <FireIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="gradient-text text-lg">Performance Scale</div>
                    <div className="text-xs text-foreground-tertiary font-normal mt-1">
                      Track your excellence level
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceLevels.map((level, index) => (
                    <motion.div
                      key={level.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="relative overflow-hidden rounded-2xl group cursor-pointer"
                        >
                      <div className={`absolute inset-0 bg-gradient-to-r ${level.gradient}`} />
                      <div className={`relative glass-effect border ${level.borderColor} p-4`}>
                        <div className="flex items-center gap-4">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            className="p-3 rounded-xl bg-white/[0.12] group-hover:bg-white/[0.16] transition-all"
                          >
                            {level.icon}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${level.indicatorColor} animate-pulse`} />
                              <span className="text-sm font-bold text-foreground">
                                {level.threshold}+
                              </span>
                              <Badge variant={level.color as any} size="sm">
                                {level.label}
                              </Badge>
                            </div>
                            <div className="text-xs text-foreground-tertiary">
                              {level.description}
                            </div>
                          </div>
                        </div>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    )
  }

  function renderStatsTab() {
    return (
      <motion.div
        key="stats"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Heatmap Hero */}
        <QuestionHeatmap />
        
        {/* Stats Grid */}
        <QuestionStats />
      </motion.div>
    )
  }

  function renderHistoryTab() {
    return (
      <motion.div
        key="history"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Full-Size Heatmap */}
        <QuestionHeatmap />
        
        {/* Charts Section */}
        <DailyGoalsCharts />
        
        {/* Recent Activity */}
        <RecentGoals />
      </motion.div>
    )
  }
}