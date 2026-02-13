'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress, LoadingSpinner } from '@/components/ui/enhanced-components'
import { PremiumAreaChart, ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid } from '@/components/ui/premium-layouts'
import { 
  TrophyIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

type AIRPrediction = {
  predictedAIR: number
  confidence: number
  factors: {
    progressScore: number
    testTrend: number
    consistency: number
    biologicalFactor: number
    externalFactor: number
  }
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  comprehensiveData?: any
  aiInsights?: {
    motivation: string
    schedulePlanner: string
    weakAreaAnalysis: string
    strategicSuggestions: string
    timelineOptimization: string
  }
}

export default function AIRPredictionDashboard() {
  const { data: prediction, isLoading } = useQuery<AIRPrediction>({
    queryKey: ['air-prediction'],
    queryFn: async () => {
      const response = await fetch('/api/air-prediction')
      if (!response.ok) throw new Error('Failed to fetch prediction')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
    staleTime: 5000 // Consider data stale after 5 seconds
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return '✅'
      case 'medium': return '⚠️'
      case 'high': return '🚨'
      default: return '📊'
    }
  }

  const getAIRColor = (air: number) => {
    if (air <= 50) return 'text-green-500'
    if (air <= 100) return 'text-yellow-500'
    if (air <= 500) return 'text-orange-500'
    return 'text-red-500'
  }

  if (isLoading) {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <LoadingSpinner size="lg" variant="orbit" />
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Analyzing Your Performance
              </div>
              <div className="text-sm text-foreground-tertiary">
                Calculating AIR prediction with AI...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prediction) return null

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case 'low':
        return {
          color: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
          label: 'LOW RISK',
          description: 'Excellent trajectory',
          textColor: 'text-green-500'
        }
      case 'medium':
        return {
          color: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />,
          label: 'MEDIUM RISK',
          description: 'Needs attention',
          textColor: 'text-yellow-500'
        }
      case 'high':
        return {
          color: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: <FireIcon className="h-8 w-8 text-red-500" />,
          label: 'HIGH RISK',
          description: 'Immediate action required',
          textColor: 'text-red-500'
        }
      default:
        return {
          color: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          icon: <SparklesIcon className="h-8 w-8 text-blue-500" />,
          label: 'ANALYZING',
          description: 'Calculating risk',
          textColor: 'text-blue-500'
        }
    }
  }

  const riskConfig = getRiskConfig(prediction.riskLevel)

  return (
    <div className="space-y-6">
      {/* Hero Prediction Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className={`absolute inset-0 bg-gradient-to-br ${riskConfig.color}`} />
        <div className={`relative glass-effect border ${riskConfig.border} p-8 md:p-12`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-4 rounded-3xl bg-white/[0.08]"
              >
                <TrophyIcon className="h-10 w-10 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">AIR Prediction</h2>
                <p className="text-foreground-tertiary text-sm mt-1">NEET UG 2026 Forecast</p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {riskConfig.icon}
            </motion.div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Predicted AIR */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                <RocketLaunchIcon className="h-8 w-8 text-primary mx-auto" />
              </div>
              <div className={`text-6xl font-bold mb-3 ${getAIRColor(prediction.predictedAIR)} drop-shadow-glow`}>
                <AnimatedCounter value={prediction.predictedAIR} />
              </div>
              <div className="text-sm font-semibold text-foreground-secondary mb-2">Predicted AIR</div>
              <div className="text-xs text-foreground-tertiary">
                {prediction.predictedAIR <= 50 ? 'Target Achieved!' : 
                 prediction.predictedAIR <= 100 ? 'Very Close!' : 
                 prediction.predictedAIR <= 500 ? 'Good Progress!' : 'Keep Going!'}
              </div>
            </motion.div>
            
            {/* Confidence Score */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4 flex justify-center">
                <ProgressRing
                  progress={prediction.confidence * 100}
                  size={80}
                  strokeWidth={8}
                  color="#0071e3"
                  showValue={false}
                />
              </div>
              <div className="text-6xl font-bold text-primary mb-3 drop-shadow-glow">
                {Math.round(prediction.confidence * 100)}%
              </div>
              <div className="text-sm font-semibold text-foreground-secondary mb-2">Confidence</div>
              <div className="text-xs text-foreground-tertiary">
                {prediction.confidence > 0.8 ? 'High Accuracy' : 
                 prediction.confidence > 0.6 ? 'Good Accuracy' : 'Moderate Accuracy'}
              </div>
            </motion.div>
            
            {/* Risk Assessment */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className={`text-center p-6 rounded-3xl glass-effect border ${riskConfig.border}`}
            >
              <div className="mb-4">
                {riskConfig.icon}
              </div>
              <div className={`text-2xl font-bold mb-3 ${riskConfig.textColor}`}>
                {riskConfig.label}
              </div>
              <div className="text-sm font-semibold text-foreground mb-2">Risk Level</div>
              <div className="text-xs text-foreground-tertiary">
                {riskConfig.description}
              </div>
            </motion.div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
              <CalendarIcon className="h-5 w-5 text-foreground-tertiary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-foreground-tertiary">Days to NEET</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
              <AcademicCapIcon className="h-5 w-5 text-foreground-tertiary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {prediction?.comprehensiveData?.totalQuestionsLifetime?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-foreground-tertiary">Total Questions</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
              <CheckCircleIcon className="h-5 w-5 text-foreground-tertiary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round(prediction?.comprehensiveData?.consistencyScore || 0)}%
              </div>
              <div className="text-xs text-foreground-tertiary">Consistency</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
              <ArrowTrendingUpIcon className="h-5 w-5 text-foreground-tertiary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round((prediction.confidence * 100))}%
              </div>
              <div className="text-xs text-foreground-tertiary">Success Rate</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Factors - Clean Linear Design */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/20">
              <ChartBarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="gradient-text text-xl">Performance Factors</div>
              <div className="text-xs text-foreground-tertiary font-normal mt-1">
                Key metrics driving your prediction
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(prediction.factors).map(([key, value], index) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
              const percentage = Math.round(value)
              
              const getFactorConfig = (pct: number) => {
                if (pct >= 80) return { color: '#10b981', gradient: 'from-green-500 to-emerald-500', icon: <CheckCircleIcon className="h-5 w-5" />, bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' }
                if (pct >= 60) return { color: '#0071e3', gradient: 'from-blue-500 to-cyan-500', icon: <StarIcon className="h-5 w-5" />, bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' }
                if (pct >= 40) return { color: '#f59e0b', gradient: 'from-yellow-500 to-orange-500', icon: <BoltIcon className="h-5 w-5" />, bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30' }
                return { color: '#ef4444', gradient: 'from-red-500 to-pink-500', icon: <FireIcon className="h-5 w-5" />, bg: 'from-red-500/20 to-pink-500/20', border: 'border-red-500/30' }
              }
              
              const config = getFactorConfig(percentage)
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="relative overflow-hidden rounded-3xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.bg}`} />
                  <div className={`relative glass-effect border ${config.border} p-6`}>
                    <div className="flex items-center gap-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative flex-shrink-0"
                      >
                        <ProgressRing
                          progress={percentage}
                          size={80}
                          strokeWidth={8}
                          color={config.color}
                          showValue={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`text-xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                            {percentage}
                          </div>
                        </div>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-r ${config.gradient} bg-opacity-20`}>
                            {config.icon}
                          </div>
                          <div className="font-semibold text-foreground">{label}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-white/[0.08] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-foreground-tertiary">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations - Redesigned */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <SparklesIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <div className="gradient-text text-xl">AI Recommendations</div>
              <div className="text-xs text-foreground-tertiary font-normal mt-1">
                Personalized action items for success
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prediction.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative overflow-hidden rounded-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-purple/10" />
                <div className="relative glass-effect border border-white/[0.08] p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-all flex-shrink-0">
                      <BoltIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}