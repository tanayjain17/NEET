'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import TestEntryForm from '@/components/tests/test-entry-form'
import TestPerformanceChart from '@/components/tests/test-performance-chart'
import TestAnalytics from '@/components/tests/test-analytics'
import RecentTestsList from '@/components/tests/recent-tests-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  PlusIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

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

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState<'entry' | 'analytics'>('analytics')

  const testTypes = [
    {
      title: 'Weekly Tests',
      description: 'Regular practice tests to assess weekly progress',
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Rank Booster',
      description: 'Targeted tests for specific topics',
      icon: <ArrowTrendingUpIcon className="h-5 w-5" />,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Test Series',
      description: 'Comprehensive subject-wise tests',
      icon: <AcademicCapIcon className="h-5 w-5" />,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'AITS',
      description: 'All India Test Series for national ranking',
      icon: <TrophyIcon className="h-5 w-5" />,
      color: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      title: 'Full Length',
      description: 'Complete NEET mock tests (720 marks)',
      icon: <SparklesIcon className="h-5 w-5" />,
      color: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30'
    }
  ]

  const performanceIndicators = [
    { range: '< 75%', label: 'Needs Improvement', color: 'bg-red-500', icon: <div className="w-3 h-3 rounded-full bg-red-500" /> },
    { range: '75-85%', label: 'Good Progress', color: 'bg-orange-500', icon: <div className="w-3 h-3 rounded-full bg-orange-500" /> },
    { range: '85-95%', label: 'Excellent', color: 'bg-green-500', icon: <div className="w-3 h-3 rounded-full bg-green-500" /> },
    { range: '> 95%', label: 'Outstanding', color: 'bg-primary', icon: <CheckCircleIcon className="h-4 w-4 text-primary" /> }
  ]

  return (
    <DashboardLayout 
      title="Test Performance"
      subtitle="Track your test scores and analyze performance trends"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-3xl bg-mesh-gradient">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-purple/10" />
            <div className="relative glass-effect border-white/[0.08] p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-primary/20">
                      <ChartBarIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold gradient-text">Test Performance</h1>
                      <p className="text-foreground-tertiary mt-1">Track scores and analyze trends</p>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="hidden md:block"
                >
                  <TrophyIcon className="h-16 w-16 text-primary/30" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation - Apple Style */}
        <motion.div variants={itemVariants}>
          <div className="glass-effect rounded-2xl p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'text-white'
                  : 'text-foreground-tertiary hover:text-foreground'
              }`}
            >
              {activeTab === 'analytics' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Analytics
              </span>
            </button>
            <button
              onClick={() => setActiveTab('entry')}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'entry'
                  ? 'text-white'
                  : 'text-foreground-tertiary hover:text-foreground'
              }`}
            >
              {activeTab === 'entry' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Add Score
              </span>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'entry' && (
            <motion.div
              key="entry"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="space-y-6"
            >
              {/* Test Types Grid - Full Width */}
              <Card variant="premium" hover="both" asMotion>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <AcademicCapIcon className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <div className="gradient-text text-lg">Test Types</div>
                        <div className="text-xs text-foreground-tertiary font-normal mt-1">
                          Select the type of test you want to record
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {testTypes.map((type, index) => (
                        <motion.div
                          key={type.title}
                              whileHover={{ scale: 1.05, y: -4 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative overflow-hidden rounded-2xl cursor-pointer group"
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-50`} />
                              <div className={`relative glass-effect border ${type.borderColor} p-5 h-full`}>
                                <div className="flex flex-col items-center text-center space-y-3">
                                  <div className="p-4 rounded-2xl bg-white/[0.08] group-hover:bg-white/[0.16] transition-all">
                                    {type.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-foreground text-sm mb-1">
                                      {type.title}
                                    </h4>
                                    <p className="text-xs text-foreground-tertiary leading-relaxed">
                                      {type.description}
                                    </p>
                                  </div>
                                </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

              {/* Form and Performance Scale - Side by Side */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Form - Takes 2 columns */}
                <div className="xl:col-span-2">
                  <TestEntryForm />
                </div>

                {/* Performance Scale - Takes 1 column */}
                <div>
                    <Card variant="premium" hover="both" asMotion>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                            <SparklesIcon className="h-6 w-6 text-yellow-500" />
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
                          {performanceIndicators.map((indicator, index) => (
                            <motion.div
                              key={indicator.range}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  className="flex items-center justify-between p-4 rounded-2xl glass-effect border border-white/[0.08] group cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/[0.08] group-hover:bg-white/[0.12] transition-all">
                                      {indicator.icon}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-foreground">
                                        {indicator.range}
                                      </div>
                                      <div className="text-xs text-foreground-tertiary">
                                        {indicator.label}
                                      </div>
                                    </div>
                                  </div>
                                <div className={`w-2 h-2 rounded-full ${indicator.color} animate-pulse`} />
                              </motion.div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="space-y-6"
            >
              {/* Analytics Cards */}
              <motion.div variants={itemVariants}>
                <TestAnalytics />
              </motion.div>
              
              {/* Charts Section - Bento Layout */}
              <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main Performance Chart - Takes 2 columns */}
                    <div className="xl:col-span-2">
                      <TestPerformanceChart />
                    </div>
                    
                    {/* Recent Tests List - Takes 1 column */}
                    <div className="xl:col-span-1">
                      <RecentTestsList />
                    </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  )
}