'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  X, 
  Brain, 
  AlertTriangle, 
  Target, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Calculator, 
  FileQuestion, 
  Activity,
  Microscope,
  AlertCircle
} from 'lucide-react'

interface MistakeAnalysisPopupProps {
  isOpen: boolean
  onClose: () => void
  sessionType: 'daily_study' | 'test'
  sessionData: {
    physicsQuestions?: number
    chemistryQuestions?: number
    botanyQuestions?: number
    zoologyQuestions?: number
    testScore?: number
    testType?: string
  }
  onSubmit: (mistakeData: MistakeData) => void
}

interface MistakeData {
  mistakeCategories: string[]
  specificMistakes: string[]
  improvementAreas: string[]
  timeWasted: number
  stressLevel: number
  energyLevel: number
  focusLevel: number
}

// Updated Categories with Lucide Icons and Professional Colors
const MISTAKE_CATEGORIES = [
  { id: 'no_mistakes', label: 'Zero Errors', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10' },
  { id: 'conceptual_gaps', label: 'Conceptual Gap', icon: Brain, color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-500/10' },
  { id: 'calculation_errors', label: 'Calculation Error', icon: Calculator, color: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-500/10' },
  { id: 'time_management', label: 'Time Efficiency', icon: Clock, color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-500/10' },
  { id: 'silly_mistakes', label: 'Attention Lapse', icon: AlertCircle, color: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10' },
  { id: 'panic_response', label: 'Anxiety Spike', icon: Activity, color: 'text-rose-500', border: 'border-rose-500/50', bg: 'bg-rose-500/10' },
  { id: 'pattern_confusion', label: 'Pattern Error', icon: FileQuestion, color: 'text-indigo-400', border: 'border-indigo-500/50', bg: 'bg-indigo-500/10' },
  { id: 'overthinking', label: 'Over-Analysis', icon: Microscope, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-500/10' },
  { id: 'memory_lapse', label: 'Recall Failure', icon: Zap, color: 'text-slate-400', border: 'border-slate-500/50', bg: 'bg-slate-500/10' }
]

const IMPROVEMENT_AREAS = [
  'Velocity / Speed',
  'Conceptual Depth',
  'Recall Accuracy',
  'Numerical Precision',
  'Stress Regulation',
  'Focus Endurance',
  'Exam Temperament',
  'Biological Recovery',
  'Environment Control'
]

export default function MistakeAnalysisPopup({ 
  isOpen, 
  onClose, 
  sessionType, 
  sessionData, 
  onSubmit 
}: MistakeAnalysisPopupProps) {
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [specificMistakes, setSpecificMistakes] = useState<string[]>([''])
  const [improvementAreas, setImprovementAreas] = useState<string[]>([])
  const [timeWasted, setTimeWasted] = useState(0)
  const [stressLevel, setStressLevel] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [focusLevel, setFocusLevel] = useState(5)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    // Validation: Must select at least one category
    if (selectedCategories.length === 0) {
      return // Button is disabled anyway, but safety check
    }
    
    // Logic: If "no mistakes" is selected, clear specific errors
    const isPerfect = selectedCategories.includes('no_mistakes')

    setLoading(true)
    
    const mistakeData: MistakeData = {
      mistakeCategories: selectedCategories,
      specificMistakes: isPerfect ? ['Optimal performance achieved'] : specificMistakes.filter(m => m.trim() !== ''),
      improvementAreas: isPerfect ? ['Protocol Maintenance'] : improvementAreas,
      timeWasted: isPerfect ? 0 : timeWasted,
      stressLevel,
      energyLevel,
      focusLevel
    }

    await onSubmit(mistakeData)
    setLoading(false)
    onClose()
  }

  const addSpecificMistake = () => {
    setSpecificMistakes([...specificMistakes, ''])
  }

  const updateSpecificMistake = (index: number, value: string) => {
    const updated = [...specificMistakes]
    updated[index] = value
    setSpecificMistakes(updated)
  }

  // Exclusive logic: If "Zero Errors" is selected, unselect others.
  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'no_mistakes') {
      setSelectedCategories(['no_mistakes'])
      setSpecificMistakes(['']) // Clear manual entries
      setImprovementAreas([])
      setTimeWasted(0)
    } else {
      setSelectedCategories(prev => {
        const filtered = prev.filter(id => id !== 'no_mistakes')
        return filtered.includes(categoryId) 
          ? filtered.filter(id => id !== categoryId)
          : [...filtered, categoryId]
      })
    }
  }

  const toggleImprovementArea = (area: string) => {
    setImprovementAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  // Validation state
  const isFormInvalid = selectedCategories.length === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
          >
            <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Medical Gradient Top Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-6">
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Activity className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">Session Performance Audit</div>
                    <div className="text-sm text-white/50 font-normal">
                      {sessionType === 'daily_study' ? 'Academic Session Protocol' : 'Mock Test Analysis'}
                    </div>
                  </div>
                </CardTitle>
                <div className="text-xs text-blue-200/70 font-mono bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  ⚠️ Submission Required
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 pt-6">
                
                {/* 1. Session Summary - Medical Style */}
                <div className="p-5 bg-gradient-to-br from-blue-900/20 via-slate-900/40 to-indigo-900/20 rounded-xl border border-blue-500/20">
                  <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-3">Metric Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    {sessionType === 'daily_study' ? (
                      <>
                        <div><div className="text-white/50 text-xs">Physics</div><div className="text-white font-mono">{sessionData.physicsQuestions || 0} Qs</div></div>
                        <div><div className="text-white/50 text-xs">Chemistry</div><div className="text-white font-mono">{sessionData.chemistryQuestions || 0} Qs</div></div>
                        <div><div className="text-white/50 text-xs">Botany</div><div className="text-white font-mono">{sessionData.botanyQuestions || 0} Qs</div></div>
                        <div><div className="text-white/50 text-xs">Zoology</div><div className="text-white font-mono">{sessionData.zoologyQuestions || 0} Qs</div></div>
                      </>
                    ) : (
                      <>
                        <div><div className="text-white/50 text-xs">Test Type</div><div className="text-white">{sessionData.testType}</div></div>
                        <div><div className="text-white/50 text-xs">Score</div><div className="text-white font-mono text-lg">{sessionData.testScore}/720</div></div>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Mistake Classification Grid */}
                <div>
                  <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    Error Classification
                  </h3>
                  
                  {sessionType === 'test' && sessionData.testScore && sessionData.testScore < 710 && selectedCategories.includes('no_mistakes') && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex gap-3 items-center animate-pulse">
                      <AlertCircle className="h-5 w-5 text-rose-400" />
                      <p className="text-rose-200 text-xs">
                        Anomaly Check: 'Zero Errors' is statistically improbable for scores below 710. Please verify.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {MISTAKE_CATEGORIES.map(category => {
                      const Icon = category.icon
                      const isSelected = selectedCategories.includes(category.id)
                      return (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`
                            p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2
                            ${isSelected 
                              ? `${category.bg} ${category.border} ${category.color}` 
                              : 'border-white/5 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'
                            }
                          `}
                        >
                          <Icon className="h-6 w-6" />
                          <div className="text-xs font-medium">{category.label}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Conditional Logic: Hide inputs if "Zero Errors" selected */}
                {!selectedCategories.includes('no_mistakes') && (
                  <>
                    {/* 3. Specific Logs */}
                    <div className="space-y-3">
                      <h3 className="text-md font-semibold text-white">Error Logs (Details)</h3>
                      {specificMistakes.map((mistake, index) => (
                        <input
                          key={index}
                          type="text"
                          value={mistake}
                          onChange={(e) => updateSpecificMistake(index, e.target.value)}
                          placeholder={`Log entry ${index + 1}: e.g., "Calculation error in Rotational Motion Q12"`}
                          className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      ))}
                      <button
                        onClick={addSpecificMistake}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 pl-1"
                      >
                        + Add log entry
                      </button>
                    </div>

                    {/* 4. Improvement Targets */}
                    <div>
                      <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-emerald-400" />
                        Optimization Targets
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {IMPROVEMENT_AREAS.map(area => (
                          <button
                            key={area}
                            onClick={() => toggleImprovementArea(area)}
                            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                              improvementAreas.includes(area)
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                : 'border-white/5 bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. Metrics Sliders */}
                    <div className="p-5 border border-white/5 bg-white/5 rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Time Loss (Min)</label>
                          <input
                            type="number"
                            value={timeWasted}
                            onChange={(e) => setTimeWasted(Number(e.target.value))}
                            className="w-full p-2 bg-slate-950/50 border border-white/10 rounded-lg text-white text-center font-mono"
                            min="0"
                            max="480"
                          />
                        </div>
                        
                        {[
                          { label: 'Stress Index', val: stressLevel, set: setStressLevel, color: 'text-rose-400' },
                          { label: 'Energy Index', val: energyLevel, set: setEnergyLevel, color: 'text-blue-400' },
                          { label: 'Focus Quality', val: focusLevel, set: setFocusLevel, color: 'text-emerald-400' }
                        ].map((metric) => (
                          <div key={metric.label}>
                            <div className="flex justify-between mb-2">
                              <label className="text-xs text-white/50 uppercase tracking-wider">{metric.label}</label>
                              <span className={`text-xs font-bold ${metric.color}`}>{metric.val}/10</span>
                            </div>
                            <input
                              type="range"
                              value={metric.val}
                              onChange={(e) => metric.set(Number(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                              min="1"
                              max="10"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Footer / Submit */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || isFormInvalid}
                    className={`
                      px-8 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2
                      ${isFormInvalid 
                        ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' 
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]'
                      }
                    `}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Activity className="h-4 w-4 animate-spin" /> Processing...
                      </span>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" /> Finalize Audit
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}