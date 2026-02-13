'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { 
  Trophy, 
  Activity, 
  Target, 
  Award, 
  Microscope, 
  Stethoscope, 
  Brain, 
  RefreshCw,
  CheckCircle2,
  Lock,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react'

export default function ClinicalAchievementSystem() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: achievements, refetch, isFetching } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: async () => {
      const response = await fetch('/api/achievements')
      if (!response.ok) throw new Error('Failed to fetch achievements')
      const result = await response.json()
      return result.data
    },
    enabled: !!user?.email,
    refetchInterval: 30000,
  })

  const categories = [
    { id: 'all', label: 'All', icon: Award },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'consistency', label: 'Consistency', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: Trophy }
  ]
  
  const filteredAchievements = achievements?.filter((achievement: any) => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  ) || []

  const getTierConfig = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': 
        return { 
          gradient: 'from-indigo-600 to-blue-600',
          border: 'border-indigo-400/30',
          bg: 'bg-indigo-500/10',
          text: 'text-indigo-400'
        }
      case 'epic': 
        return { 
          gradient: 'from-purple-600 to-indigo-600',
          border: 'border-purple-400/30',
          bg: 'bg-purple-500/10',
          text: 'text-purple-400'
        }
      case 'rare': 
        return { 
          gradient: 'from-cyan-600 to-blue-600',
          border: 'border-cyan-400/30',
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400'
        }
      case 'uncommon': 
        return { 
          gradient: 'from-emerald-600 to-teal-600',
          border: 'border-emerald-400/30',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400'
        }
      default: 
        return { 
          gradient: 'from-slate-500 to-slate-600',
          border: 'border-slate-400/30',
          bg: 'bg-slate-500/10',
          text: 'text-slate-400'
        }
    }
  }

  const completedCount = achievements?.filter((a: any) => a.isCompleted).length || 0
  const totalCount = achievements?.length || 0
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Clinical Header */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Trophy className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Clinical Achievement Registry</h2>
              <p className="text-slate-400 text-sm">Medical competency tracking and milestone verification</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-cyan-400">
                {completedCount}<span className="text-slate-600 mx-1">/</span>{totalCount}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Verified Competencies</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-colors"
              title="Synchronize registry"
            >
              <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Clinical Progress Tracking */}
        <div className="mt-8 relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Knowledge Integration</span>
            <span className="text-sm font-mono font-bold text-blue-400">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 border border-white/5 p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6 relative z-10">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Icon className="h-3 w-3" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Verified Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode='popLayout'>
          {filteredAchievements.map((achievement: any, index: number) => {
            const tierConfig = getTierConfig(achievement.rarity)
            
            return (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative overflow-hidden group rounded-2xl p-5 border-2 ${tierConfig.border} ${
                  achievement.isCompleted ? tierConfig.bg : 'bg-black/20 opacity-60'
                }`}
              >
                {/* Achievement verification glow */}
                {achievement.isCompleted && (
                  <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-20 bg-gradient-to-br ${tierConfig.gradient}`} />
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${achievement.isCompleted ? 'text-white' : 'text-slate-600'}`}>
                    {achievement.isCompleted ? (
                      <Award className="h-6 w-6" />
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter bg-gradient-to-r ${tierConfig.gradient} text-white`}>
                    {achievement.rarity}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                    {achievement.name}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed min-h-[32px]">
                    {achievement.description}
                  </p>
                </div>

                {/* Clinical progress indicator */}
                {!achievement.isCompleted && achievement.progress !== undefined && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                      <span>Clinical Progress</span>
                      <span>{Math.round(achievement.progress * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${tierConfig.gradient}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Achievement footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/80">
                    <Activity className="h-3 w-3" />
                    <span>{achievement.points} CLINICAL CREDITS</span>
                  </div>
                  {achievement.isCompleted && achievement.unlockedAt && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center">
          <div className="bg-white/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-slate-600 h-8 w-8" />
          </div>
          <h3 className="text-slate-300 font-bold">No Clinical Data Points</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
            Continue daily practice protocols to generate verified medical competencies.
          </p>
        </div>
      )}

      {/* Clinical Performance Summary */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-blue-900/20 border border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Brain className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Clinical Performance Insight
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Each verified competency represents mastery of high-yield medical concepts. 
              Consistent achievement at the {completedCount >= 5 ? 'Legendary' : 'Rare'} tier 
              correlates with enhanced clinical reasoning capabilities and improved admission 
              probability to premier medical institutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}