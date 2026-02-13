'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import AIRPredictionDashboard from '@/components/ai/air-prediction-dashboard'
import EnhancedMenstrualTracker from '@/components/ai/enhanced-menstrual-tracker'
import CycleOptimizedScheduler from '@/components/ai/cycle-optimized-scheduler'
import EnergyMoodPredictor from '@/components/ai/energy-mood-predictor'
import CycleStudyTechniques from '@/components/ai/cycle-study-techniques'
import HormonalOptimizationPanel from '@/components/ai/hormonal-optimization-panel'
import EmergencySupportSystem from '@/components/ai/emergency-support-system'
import RigorousRankingDashboard from '@/components/ai/rigorous-ranking-dashboard'
import AISuggestionsSection from '@/components/ai/ai-suggestions-section'
import SmartStudyPlanner from '@/components/enhanced/smart-study-planner'
import MemoryRetentionSystem from '@/components/enhanced/memory-retention-system'
import ProgressAnalytics from '@/components/enhanced/progress-analytics'
import { CompetitiveEdgeSystem } from '@/components/competitive/edge-system'
import {
  CpuChipIcon,
  SparklesIcon,
  CalendarIcon,
  HeartIcon,
  BookOpenIcon,
  BeakerIcon,
  ShieldExclamationIcon,
  RocketLaunchIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

type TabKey = 'prediction' | 'biology' | 'cycle-schedule' | 'energy-prediction' | 'study-techniques' | 'hormonal' | 'emergency' | 'ai-suggestions' | 'schedule' | 'memory' | 'progress' | 'competitive'

const tabs = [
  {
    key: 'prediction' as TabKey,
    label: 'AIR Prediction',
    icon: RocketLaunchIcon,
    emoji: '🎯',
    color: 'from-blue-600 to-cyan-600',
    description: 'AI-powered rank prediction'
  },
  {
    key: 'biology' as TabKey,
    label: 'Cycle Tracker',
    icon: HeartIcon,
    emoji: '🌸',
    color: 'from-pink-500 to-rose-500',
    description: 'Menstrual cycle insights'
  },
  {
    key: 'cycle-schedule' as TabKey,
    label: 'AI Schedule',
    icon: CalendarIcon,
    emoji: '🗓️',
    color: 'from-purple-500 to-indigo-500',
    description: 'Optimized study planning'
  },
  {
    key: 'energy-prediction' as TabKey,
    label: 'Energy Predictor',
    icon: SparklesIcon,
    emoji: '🔮',
    color: 'from-amber-500 to-orange-500',
    description: 'Mood & energy forecasting'
  },
  {
    key: 'study-techniques' as TabKey,
    label: 'Study Techniques',
    icon: BookOpenIcon,
    emoji: '📚',
    color: 'from-green-500 to-emerald-500',
    description: 'Personalized study methods'
  },
  {
    key: 'hormonal' as TabKey,
    label: 'Hormonal Boost',
    icon: BeakerIcon,
    emoji: '🧬',
    color: 'from-violet-500 to-purple-500',
    description: 'Hormonal optimization'
  },
  {
    key: 'emergency' as TabKey,
    label: 'Emergency Support',
    icon: ShieldExclamationIcon,
    emoji: '🆘',
    color: 'from-red-500 to-pink-500',
    description: 'Crisis management system'
  },
  {
    key: 'ai-suggestions' as TabKey,
    label: 'AI Suggestions',
    icon: CpuChipIcon,
    emoji: '🤖',
    color: 'from-cyan-500 to-blue-500',
    description: 'Smart recommendations'
  },
  {
    key: 'schedule' as TabKey,
    label: 'Smart Schedule',
    icon: ClockIcon,
    emoji: '📅',
    color: 'from-teal-500 to-cyan-500',
    description: 'Intelligent time management'
  },
  {
    key: 'memory' as TabKey,
    label: 'Memory System',
    icon: CpuChipIcon,
    emoji: '🧠',
    color: 'from-indigo-500 to-blue-500',
    description: 'Memory enhancement tools'
  },
  {
    key: 'progress' as TabKey,
    label: 'Progress Analytics',
    icon: ChartBarIcon,
    emoji: '📈',
    color: 'from-emerald-500 to-green-500',
    description: 'Performance tracking'
  },
  {
    key: 'competitive' as TabKey,
    label: 'Competitive Edge',
    icon: TrophyIcon,
    emoji: '🏆',
    color: 'from-yellow-500 to-amber-500',
    description: 'Competitive advantage'
  }
]

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('prediction')

  const activeTabData = tabs.find(tab => tab.key === activeTab)

  return (
    <DashboardLayout
      title="AI Success Engine"
      subtitle="Advanced intelligence to help you achieve AIR under 50 in NEET UG 2026"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
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
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-glow">
                <CpuChipIcon className="h-10 w-10 text-white" />
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
                className="text-4xl md:text-6xl font-bold gradient-text"
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
                AI Success Engine
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center justify-center gap-2 mt-3"
              >
                {['🚀', '⭐', '💎', '🎯', '✨', '🌟', '💫'].map((emoji, i) => (
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
            className="text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed"
          >
            Advanced AI-powered insights designed to help you achieve
            <motion.span
              className="font-bold text-primary mx-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AIR under 50
            </motion.span>
            in NEET UG 2026
          </motion.p>
        </motion.div>

        {/* Premium Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="glass-card p-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key

              return (
                <motion.button
                  key={tab.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative p-4 rounded-2xl transition-all duration-300 group ${isActive
                    ? 'glass-effect border border-primary/30 shadow-glow'
                    : 'bg-background-secondary/30 border border-gray-700/30 hover:border-primary/20 hover:bg-background-secondary/50'
                    }`}
                >
                  {/* Background Gradient Overlay */}
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300
                    bg-gradient-to-br ${tab.color}
                  `} />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center space-y-3">
                    {/* Icon Container */}
                    <div className={`
                      p-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? 'bg-primary/20 shadow-glow'
                        : 'bg-background-tertiary/50 group-hover:bg-primary/10'
                      }
                    `}>
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>

                    {/* Emoji Badge */}
                    <motion.div
                      className="absolute -top-1 -right-1 text-lg"
                      animate={{
                        rotate: isActive ? [0, 10, -10, 0] : 0,
                        scale: isActive ? [1, 1.2, 1] : 1
                      }}
                      transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0
                      }}
                    >
                      {tab.emoji}
                    </motion.div>

                    {/* Text Content */}
                    <div className="text-center space-y-1">
                      <div className={`text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                        {tab.label}
                      </div>
                      <div className="text-xs text-foreground-muted leading-tight">
                        {tab.description}
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full shadow-glow"
                      >
                        <motion.div
                          className="w-full h-full bg-primary rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className={`
                      absolute inset-0 rounded-2xl blur-xl
                      bg-gradient-to-br ${tab.color} opacity-20
                    `} />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Active Tab Indicator */}
        {activeTabData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className={`inline-flex items-center gap-3 glass-effect px-6 py-3 rounded-2xl border bg-gradient-to-r ${activeTabData.color} bg-opacity-10`}>
              <span className="text-2xl">{activeTabData.emoji}</span>
              <div>
                <div className="font-semibold text-foreground">{activeTabData.label}</div>
                <div className="text-sm text-foreground-secondary">{activeTabData.description}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content with Enhanced Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {activeTab === 'prediction' && (
              <div className="space-y-6">
                <AIRPredictionDashboard />
                <RigorousRankingDashboard />
              </div>
            )}
            {activeTab === 'biology' && <EnhancedMenstrualTracker />}
            {activeTab === 'cycle-schedule' && <CycleOptimizedScheduler />}
            {activeTab === 'energy-prediction' && <EnergyMoodPredictor />}
            {activeTab === 'study-techniques' && <CycleStudyTechniques />}
            {activeTab === 'hormonal' && <HormonalOptimizationPanel />}
            {activeTab === 'emergency' && <EmergencySupportSystem />}
            {activeTab === 'ai-suggestions' && <AISuggestionsSection predictedAIR={1250} />}
            {activeTab === 'schedule' && <SmartStudyPlanner />}
            {activeTab === 'memory' && <MemoryRetentionSystem />}
            {activeTab === 'progress' && <ProgressAnalytics />}
            {activeTab === 'competitive' && <CompetitiveEdgeSystem />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  )
}