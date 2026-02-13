'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { 
  Brain, 
  Target, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Microscope,
  Stethoscope,
  Calendar,
  Award
} from 'lucide-react'

export default function ClinicalQuestionTracker() {
  const { user } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ['question-stats', user?.email],
    queryFn: async () => {
      const response = await fetch('/api/achievement-update', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.stats
    },
    enabled: !!user?.email,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  if (!stats) {
    return (
      <div className="glass-effect rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-48 mb-4"></div>
        <div className="h-32 bg-slate-800 rounded"></div>
      </div>
    )
  }

  const TOTAL_TARGET = 188000
  const progress = (stats.totalQuestionsSolved / TOTAL_TARGET) * 100
  const targetDate = new Date('2026-05-03')
  const daysLeft = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const dailyTarget = Math.ceil(stats.questionsRemaining / Math.max(1, daysLeft))

  const getClinicalProgressStatus = () => {
    if (progress >= 90) return { label: 'Critical Milestone Approaching', color: 'text-emerald-400', icon: CheckCircle2 }
    if (progress >= 75) return { label: 'Optimal Performance Trajectory', color: 'text-cyan-400', icon: TrendingUp }
    if (progress >= 50) return { label: 'Moderate Progress Rate', color: 'text-blue-400', icon: Activity }
    if (progress >= 25) return { label: 'Acceleration Required', color: 'text-amber-400', icon: AlertCircle }
    return { label: 'Intervention Recommended', color: 'text-rose-400', icon: AlertCircle }
  }

  const getDailyTargetStatus = () => {
    if (dailyTarget > 600) return { 
      label: 'High-Intensity Protocol', 
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30'
    }
    if (dailyTarget > 400) return { 
      label: 'Standard Clinical Pace', 
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    }
    return { 
      label: 'Maintenance Phase', 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    }
  }

  const clinicalStatus = getClinicalProgressStatus()
  const StatusIcon = clinicalStatus.icon
  const dailyStatus = getDailyTargetStatus()

  return (
    <div className="glass-effect rounded-xl p-6 bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-indigo-900/20 border border-blue-500/30">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <Brain className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Clinical Question Registry
          </h3>
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            <Microscope className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <p className="text-slate-400 text-sm">Lifetime question volume tracking for NEET 2026</p>
      </div>

      {/* Main Progress Circle */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        <div className="relative w-44 h-44">
          <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-blue-400" stopColor="#60a5fa" />
                <stop offset="50%" className="text-cyan-400" stopColor="#22d3ee" />
                <stop offset="100%" className="text-indigo-400" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {Math.round(progress)}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Completion</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 min-w-[140px]">
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {stats.totalQuestionsSolved.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Completed</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 min-w-[140px]">
            <div className="text-2xl font-bold text-indigo-400 font-mono">
              {stats.questionsRemaining.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Remaining</div>
          </div>
        </div>
      </div>

      {/* Clinical Status Indicator */}
      <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 border ${clinicalStatus.color} bg-opacity-10`}>
        <StatusIcon className={`h-4 w-4 ${clinicalStatus.color}`} />
        <span className={`text-sm font-medium ${clinicalStatus.color}`}>
          Clinical Assessment: {clinicalStatus.label}
        </span>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          Question Type Distribution
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-slate-400">DPP Questions</span>
            </div>
            <span className="text-lg font-bold text-white font-mono">{stats.completedDppQuestions.toLocaleString()}</span>
          </div>
          
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-3 w-3 text-cyan-400" />
              <span className="text-xs text-slate-400">Assignments</span>
            </div>
            <span className="text-lg font-bold text-white font-mono">{stats.completedAssignmentQuestions.toLocaleString()}</span>
          </div>
          
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3 w-3 text-indigo-400" />
              <span className="text-xs text-slate-400">Kattar Questions</span>
            </div>
            <span className="text-lg font-bold text-white font-mono">{stats.completedKattarQuestions.toLocaleString()}</span>
          </div>
          
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-slate-400">Daily Goals</span>
            </div>
            <span className="text-lg font-bold text-white font-mono">{stats.lifetimeQuestions.toLocaleString()}</span>
          </div>
          
          <div className="col-span-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Microscope className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-slate-400">Test Questions</span>
            </div>
            <span className="text-lg font-bold text-white font-mono">{stats.testQuestions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Daily Target Protocol */}
      <div className={`p-5 rounded-xl border-2 mb-6 ${dailyStatus.bg} ${dailyStatus.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className={`h-4 w-4 ${dailyStatus.color}`} />
            <span className={`text-sm font-bold ${dailyStatus.color}`}>Daily Protocol</span>
          </div>
          <span className={`text-xs font-mono ${dailyStatus.color}`}>{dailyStatus.label}</span>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-white font-mono mb-2">
            {dailyTarget}
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{daysLeft} days remaining until NEET 2026</span>
          </div>
        </div>
      </div>

      {/* Timeline Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400">Target: {TOTAL_TARGET.toLocaleString()} questions</span>
          <span className="text-xs text-slate-400">Current: {stats.totalQuestionsSolved.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="p-4 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-cyan-500/5 rounded-lg border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Stethoscope className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Performance Analysis
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on current trajectory, you are on track to achieve {Math.round(progress)}% of the 
              target volume by NEET 2026. {dailyTarget > 400 
                ? 'Recommended to increase daily volume to meet the 188K target.' 
                : 'Current pace is sustainable for target achievement.'}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
          <Award className="h-3 w-3" />
          Total question volume tracking from initiation through NEET 2026 examination
          <Award className="h-3 w-3" />
        </p>
      </div>
    </div>
  )
}