'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Save, 
  Atom, 
  Beaker, 
  Leaf, 
  Brain, 
  CheckCircle2, 
  Activity, 
  Microscope,
  Stethoscope,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useRealTimeSync } from '@/hooks/use-real-time-sync'

interface SubjectConfig {
  key: keyof Goals
  label: string
  subLabel: string // Educational context
  icon: React.ElementType
  color: string
  gradient: string
  borderFocus: string
  ringFocus: string
}

interface Goals {
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
}

// Professional configuration with Educational Sub-labels
const SUBJECT_CONFIG: SubjectConfig[] = [
  { 
    key: 'physicsQuestions', 
    label: 'Physics', 
    subLabel: 'Critical Thinking',
    icon: Atom, 
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-400',
    borderFocus: 'focus:border-blue-500',
    ringFocus: 'focus:ring-blue-500/20'
  },
  { 
    key: 'chemistryQuestions', 
    label: 'Chemistry', 
    subLabel: 'Analytical Precision',
    icon: Beaker, 
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-teal-400',
    borderFocus: 'focus:border-cyan-500',
    ringFocus: 'focus:ring-cyan-500/20'
  },
  { 
    key: 'botanyQuestions', 
    label: 'Botany', 
    subLabel: 'Retention & Recall',
    icon: Leaf, 
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-green-400',
    borderFocus: 'focus:border-emerald-500',
    ringFocus: 'focus:ring-emerald-500/20'
  },
  { 
    key: 'zoologyQuestions', 
    label: 'Zoology', 
    subLabel: 'Systemic Logic',
    icon: Brain, 
    color: 'text-indigo-400',
    gradient: 'from-indigo-500 to-purple-400',
    borderFocus: 'focus:border-indigo-500',
    ringFocus: 'focus:ring-indigo-500/20'
  }
]

export default function EnhancedDailyGoals() {
  const [goals, setGoals] = useState<Goals>({
    physicsQuestions: 0,
    chemistryQuestions: 0,
    botanyQuestions: 0,
    zoologyQuestions: 0
  })
  
  const [hasUpdatedToday, setHasUpdatedToday] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const realTimeSync = useRealTimeSync()

  // Advanced Metric Calculation (The "Brain" of Option 3)
  const metrics = useMemo(() => {
    const total = Object.values(goals).reduce((sum, val) => sum + val, 0)
    const activeSubjects = Object.values(goals).filter(val => val > 0).length
    
    // Educational Logic (The "Value" of Option 2)
    let intensityLabel = "Resting State"
    let intensityColor = "text-slate-500"
    let clinicalInsight = "Input metrics to begin analysis."

    if (total > 0 && total < 50) {
      intensityLabel = "Maintenance Dose"
      intensityColor = "text-yellow-400"
      clinicalInsight = "Sufficient for retention, but insufficient for rank advancement."
    } else if (total >= 50 && total < 100) {
      intensityLabel = "Active Acquisition"
      intensityColor = "text-cyan-400"
      clinicalInsight = "Good baseline. Consistent execution at this level stabilizes AIR < 10,000."
    } else if (total >= 100) {
      intensityLabel = "High-Yield Velocity"
      intensityColor = "text-emerald-400"
      clinicalInsight = "Excellent. This volume correlates with top-tier selection probabilities (AIIMS trajectory)."
    }

    return {
      total,
      activeSubjects,
      intensityLabel,
      intensityColor,
      clinicalInsight,
      isElite: total >= 100
    }
  }, [goals])

  // Background analysis
  const runBackgroundAnalysis = async (sessionData: any) => {
    try {
      await fetch('/api/mistake-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'daily_study',
          sessionData,
          mistakeData: { /* ... default empty structure ... */ }
        })
      })
    } catch (error) {
      console.error('Background analysis failed:', error)
    }
  }

  const handleInputChange = (key: keyof Goals, value: string) => {
    const numValue = value === '' ? 0 : Math.min(999, Math.max(0, Number(value)))
    setGoals(prev => ({ ...prev, [key]: numValue }))
  }

  const handleSaveGoals = async () => {
    if (metrics.total === 0) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          ...goals,
          metrics
        })
      })

      if (!response.ok) throw new Error('Failed to save goals')

      if (metrics.total > 50 && !hasUpdatedToday) {
        await runBackgroundAnalysis({ ...goals, currentSubject: 'Mixed' })
        setHasUpdatedToday(true)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

    } catch (error) {
      console.error('Error saving goals:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && metrics.total > 0) {
      handleSaveGoals()
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-950 via-indigo-950/30 to-cyan-950/30 border-cyan-500/20 shadow-2xl overflow-hidden">
          
          {/* Animated gradient border */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scaleX: [0.95, 1, 0.95]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Activity className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Daily Clinical Targets
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">Status:</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${metrics.intensityColor}`}>
                      {metrics.intensityLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Score Badge */}
              {metrics.total > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-end"
                >
                  <div className="text-3xl font-bold text-white font-mono leading-none">
                    {metrics.total}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Questions</div>
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-6">
            
            {/* Subject Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBJECT_CONFIG.map((subject, index) => {
                const Icon = subject.icon
                const value = goals[subject.key]
                const isFocused = focusedField === subject.key
                
                return (
                  <motion.div 
                    key={subject.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${subject.color}`} />
                        <label className="text-sm font-medium text-slate-200">
                          {subject.label}
                        </label>
                      </div>
                      {isFocused && (
                        <motion.span 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-[10px] text-slate-500 font-medium"
                        >
                          {subject.subLabel}
                        </motion.span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <input
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleInputChange(subject.key, e.target.value)}
                        onFocus={() => setFocusedField(subject.key)}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-4 bg-slate-950/50 border ${
                          isFocused ? subject.borderFocus : 'border-white/10'
                        } rounded-xl text-white transition-all duration-300 ${subject.ringFocus} focus:ring-2 outline-none placeholder-slate-700 text-lg font-mono`}
                        min="0"
                        max="999"
                        placeholder="0"
                      />
                      
                      {/* Success Checkmark */}
                      <AnimatePresence>
                        {value > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 rounded-full"
                          >
                            <CheckCircle2 className={`h-4 w-4 ${subject.color}`} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Live Clinical Analysis (The Educational Value) */}
            <AnimatePresence>
              <motion.div
                layout
                className="bg-slate-900/50 rounded-xl border border-white/5 p-4 flex items-start gap-4"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                  {metrics.isElite ? (
                    <Stethoscope className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Microscope className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">
                    Live Clinical Analysis
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {metrics.clinicalInsight}
                  </p>
                  
                  {metrics.activeSubjects > 0 && metrics.activeSubjects < 4 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-amber-400/80">
                      <AlertCircle className="h-3 w-3" />
                      <span>Subject balance incomplete ({metrics.activeSubjects}/4 active)</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Save Button */}
            <motion.button
              whileHover={metrics.total > 0 ? { scale: 1.01 } : {}}
              whileTap={metrics.total > 0 ? { scale: 0.99 } : {}}
              onClick={handleSaveGoals}
              disabled={isSaving || metrics.total === 0}
              className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                metrics.total > 0
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synchronizing Metrics...</span>
                  </motion.div>
                ) : saveSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-emerald-100"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Targets Locked</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{metrics.total > 0 ? 'Commit Performance Targets' : 'Enter Questions to Begin'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}