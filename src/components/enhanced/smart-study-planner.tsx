'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Activity, 
  Clock, 
  Zap, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BarChart3,
  Microscope,
  Stethoscope,
  Calendar,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Types
type StudyBlock = {
  id: string
  subject: string
  chapter?: string
  startTime: string
  endTime: string
  duration: number
  type: 'study' | 'break' | 'revision' | 'test'
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

type SmartPlan = {
  id: string
  date: string
  totalStudyHours: number
  energyLevel: number
  focusLevel: number
  schedule: StudyBlock[]
  completed: boolean
  aiGenerated: boolean
  targetHours: number
}

// Helper Functions
const getTypeEmoji = (type: string): string => {
  const emojiMap: Record<string, string> = {
    study: '📚',
    break: '☕',
    revision: '🔄',
    test: '📝',
    default: '📖'
  }
  return emojiMap[type] || emojiMap.default
}

const getPriorityBadge = (priority: string) => {
  const config = {
    high: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', label: 'CRITICAL LOAD' },
    medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'STANDARD LOAD' },
    low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'MAINTENANCE' }
  }
  return config[priority as keyof typeof config] || config.medium
}

// Metric Card Component
const MetricCard = ({ label, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-white/10 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-xl font-mono font-bold text-white tracking-tighter">{value}</div>
    {subtext && <div className="text-[8px] text-slate-600 uppercase tracking-wider mt-1">{subtext}</div>}
  </div>
)

export default function SmartStudyPlanner() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [energyLevel, setEnergyLevel] = useState(7)
  const [availableHours, setAvailableHours] = useState(12)
  const [weakAreas, setWeakAreas] = useState<string[]>(['Physics'])

  const { data: currentPlan, isLoading } = useQuery<SmartPlan>({
    queryKey: ['smart-study-plan', selectedDate, energyLevel, availableHours, weakAreas],
    queryFn: async () => {
      const response = await fetch('/api/smart-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          energyLevel,
          availableHours,
          weakAreas,
          clinicalContext: 'high_intensity'
        })
      })
      if (!response.ok) throw new Error('Failed to sync protocol')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 60000
  })

  const updateBlock = useMutation({
    mutationFn: async ({ blockId, completed }: { blockId: string; completed: boolean }) => {
      const response = await fetch('/api/smart-study-plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: currentPlan?.id, blockId, completed })
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smart-study-plan', selectedDate, energyLevel, availableHours, weakAreas] })
    }
  })

  // ✅ FIXED: progressPercentage calculation
  const progressPercentage = useMemo(() => {
    if (!currentPlan) return 0
    const completed = currentPlan.schedule.filter(b => b.completed).length
    const total = currentPlan.schedule.length
    return total > 0 ? (completed / total) * 100 : 0
  }, [currentPlan])

  const completedHours = useMemo(() => {
    return currentPlan?.schedule
      .filter(b => b.completed && b.type === 'study')
      .reduce((sum, b) => sum + (b.duration / 60), 0) || 0
  }, [currentPlan])

  const getBlockStyles = (block: StudyBlock) => {
    if (block.completed) return 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
    if (block.priority === 'high') return 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
    return 'bg-blue-500/5 border-blue-500/20'
  }

  return (
    <div className="space-y-6">
      {/* 1. PROTOCOL CONFIGURATION PANEL */}
      <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-lg tracking-tight uppercase">
            <Brain className="h-5 w-5 text-blue-400" />
            Cognitive Load Optimization Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Target Timeline
              </label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex justify-between items-center">
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Readiness Index</span>
                <span className="text-blue-400">{energyLevel}/10</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={energyLevel} 
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Operational Window
              </label>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0 border-white/10 hover:bg-white/5" 
                  onClick={() => setAvailableHours(Math.max(1, availableHours - 1))}
                >
                  -
                </Button>
                <span className="flex-1 text-center font-mono text-xl font-bold text-blue-400">{availableHours}h</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0 border-white/10 hover:bg-white/5" 
                  onClick={() => setAvailableHours(Math.min(16, availableHours + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Microscope className="h-3 w-3" /> Deficit Focus Area
              </label>
              <select 
                multiple 
                value={weakAreas} 
                onChange={(e) => setWeakAreas(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Physics">Physics [High Velocity]</option>
                <option value="Chemistry">Chemistry [Conceptual]</option>
                <option value="Biology">Biology [Retention]</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. REAL-TIME EXECUTION METRICS */}
      {currentPlan && (
        <Card className="bg-slate-950/40 border-white/10 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-2 bg-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Live Execution Briefing
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">Verified Protocol</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <MetricCard 
                 label="Clinical Target" 
                 value="14.0h" 
                 icon={Target} 
                 color="text-blue-400" 
                 subtext="AIIMS Benchmark"
               />
               <MetricCard 
                 label="Verified Load" 
                 value={`${completedHours.toFixed(1)}h`} 
                 icon={CheckCircle2} 
                 color="text-emerald-400" 
                 subtext="Protocol Complete"
               />
               <MetricCard 
                 label="Neural Load" 
                 value={energyLevel > 7 ? 'OPTIMAL' : 'MODERATE'} 
                 icon={Zap} 
                 color="text-yellow-400" 
                 subtext="Cognitive Capacity"
               />
               <MetricCard 
                 label="Consistency" 
                 value={`${Math.round(progressPercentage)}%`} 
                 icon={BarChart3} 
                 color="text-indigo-400" 
                 subtext="Protocol Adherence"
               />
            </div>

            {/* Performance Audit Message */}
            <AnimatePresence mode="wait">
              {completedHours > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed uppercase font-bold tracking-tight">
                    {completedHours >= 12 
                      ? "Elite execution verified. Trajectory aligns with AIIMS competitive benchmarks. Maintain peak-state hydration." 
                      : "Sustained session detected. Optimal neural consolidation achieved in high-deficit sectors."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* 3. SCHEDULED PROTOCOL LIST */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 pl-2">
        <Clock className="h-4 w-4" /> Daily Operation Sequence
      </h3>
      
      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse h-24 bg-slate-800/50 rounded-2xl border border-slate-700"></div>
          ))}
        </div>
      )}

      {/* ✅ FIXED: Empty State */}
      {!isLoading && !currentPlan && (
        <Card className="bg-slate-950/40 border-white/10 backdrop-blur-md">
          <CardContent className="p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/30">
                <Brain className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">No Protocol Generated</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Configure your readiness index, operational window, and deficit focus areas above to generate an optimized study protocol.
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Readiness</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Window</span>
              <span className="flex items-center gap-1"><Microscope className="h-3 w-3" /> Focus</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Display */}
      {currentPlan && (
        <div className="grid gap-3">
          {currentPlan.schedule.map((block, i) => {
            const priorityBadge = getPriorityBadge(block.priority)
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group p-5 rounded-2xl border transition-all flex items-center justify-between ${getBlockStyles(block)}`}
              >
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {getTypeEmoji(block.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">{block.subject}</h4>
                      {block.chapter && (
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> [{block.chapter}]
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {block.startTime} — {block.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" /> {block.duration} MIN PROTOCOL
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <Badge className={`${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border} uppercase text-[9px] font-black tracking-widest py-1`}>
                    {priorityBadge.label}
                  </Badge>
                  <button 
                    onClick={() => updateBlock.mutate({ blockId: block.id, completed: !block.completed })}
                    className={`h-10 w-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                      block.completed 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                    }`}
                  >
                    {block.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-700" />
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}