'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealTimeSync } from '@/hooks/use-real-time-sync'
import { Activity, Atom, Beaker, Leaf, Brain, Save, CheckCircle2, Target, TrendingUp } from 'lucide-react'

export default function EnhancedDailyGoals() {
  const [goals, setGoals] = useState({
    physicsQuestions: 0,
    chemistryQuestions: 0,
    botanyQuestions: 0,
    zoologyQuestions: 0
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [hasUpdatedToday, setHasUpdatedToday] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const realTimeSync = useRealTimeSync()

  // Subject configuration for clean, maintainable code
  const subjectConfig = [
    { 
      key: 'physicsQuestions', 
      label: 'Physics', 
      icon: Atom, 
      color: 'text-blue-400', 
      borderFocus: 'focus:border-blue-500',
      ringFocus: 'focus:ring-blue-500/20'
    },
    { 
      key: 'chemistryQuestions', 
      label: 'Chemistry', 
      icon: Beaker, 
      color: 'text-cyan-400', 
      borderFocus: 'focus:border-cyan-500',
      ringFocus: 'focus:ring-cyan-500/20'
    },
    { 
      key: 'botanyQuestions', 
      label: 'Botany', 
      icon: Leaf, 
      color: 'text-emerald-400', 
      borderFocus: 'focus:border-emerald-500',
      ringFocus: 'focus:ring-emerald-500/20'
    },
    { 
      key: 'zoologyQuestions', 
      label: 'Zoology', 
      icon: Brain, 
      color: 'text-indigo-400', 
      borderFocus: 'focus:border-indigo-500',
      ringFocus: 'focus:ring-indigo-500/20'
    }
  ]

  // Background analysis without popup
  const runBackgroundAnalysis = async (sessionData: any) => {
    try {
      await fetch('/api/mistake-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'daily_study',
          sessionData,
          mistakeData: {
            mistakeCategories: [],
            specificMistakes: [],
            improvementAreas: [],
            timeWasted: 0,
            stressLevel: 5,
            energyLevel: 7,
            focusLevel: 6,
            subjectSpecificMistakes: {},
            mistakeContext: {
              timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon',
              questionDifficulty: 'medium',
              topicArea: 'General'
            }
          }
        })
      })
    } catch (error) {
      console.error('Background analysis failed:', error)
    }
  }

  const handleSaveGoals = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      // Save daily goals
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          ...goals
        })
      })

      if (!response.ok) throw new Error('Failed to save goals')

      // Run background analysis without popup
      const totalQuestions = Object.values(goals).reduce((sum, val) => sum + val, 0)
      
      if (totalQuestions > 50 && !hasUpdatedToday) {
        await runBackgroundAnalysis({
          ...goals,
          currentSubject: 'Mixed'
        })
        setHasUpdatedToday(true)
      }

      // Show success state
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

    } catch (error) {
      console.error('Error saving goals:', error)
    } finally {
      setTimeout(() => setIsSaving(false), 800)
    }
  }

  // Calculate metrics
  const totalQuestions = Object.values(goals).reduce((sum, val) => sum + val, 0)
  const completedSubjects = Object.values(goals).filter(val => val > 0).length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-effect border-blue-400/30 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-indigo-600/5 shadow-lg shadow-blue-500/10">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Target className="h-6 w-6 text-blue-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                    Daily Practice Analytics
                  </h3>
                  <p className="text-sm text-foreground-secondary font-normal mt-1">
                    Track question-solving performance across all subjects
                  </p>
                </div>
              </div>
              
              {/* Metrics Summary */}
              {totalQuestions > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      {totalQuestions}
                    </div>
                    <div className="text-xs text-foreground-secondary">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                      {completedSubjects}
                    </div>
                    <div className="text-xs text-foreground-secondary">Subjects</div>
                  </div>
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Subject Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjectConfig.map((subject, index) => (
                <motion.div 
                  key={subject.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <subject.icon className={`h-4 w-4 ${subject.color}`} />
                    <label className="text-sm font-medium text-gray-300">
                      {subject.label}
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="number"
                      value={goals[subject.key as keyof typeof goals]}
                      onChange={(e) => setGoals(prev => ({ 
                        ...prev, 
                        [subject.key]: Number(e.target.value) 
                      }))}
                      className={`w-full p-3 bg-background-secondary/50 border border-white/10 rounded-xl text-white transition-all duration-300 ${subject.borderFocus} ${subject.ringFocus} focus:ring-2 outline-none placeholder-gray-500`}
                      min="0"
                      max="999"
                      placeholder="0"
                    />
                    
                    {/* Success Indicator */}
                    <AnimatePresence>
                      {goals[subject.key as keyof typeof goals] > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <CheckCircle2 className={`h-4 w-4 ${subject.color}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Summary */}
            <AnimatePresence>
              {totalQuestions > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-600/10 rounded-xl border border-blue-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Today's Target Progress</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                        {totalQuestions} Questions
                      </div>
                      <div className="text-xs text-gray-400">
                        {completedSubjects}/4 Subjects Active
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: totalQuestions > 0 ? 1.01 : 1 }}
              whileTap={{ scale: totalQuestions > 0 ? 0.99 : 1 }}
              onClick={handleSaveGoals}
              disabled={isSaving || totalQuestions === 0}
              className={`w-full relative overflow-hidden py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                totalQuestions > 0
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Syncing Analytics Data...</span>
                  </motion.div>
                ) : saveSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Progress Saved Successfully</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Update Practice Analytics</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Performance Milestone */}
            <AnimatePresence>
              {totalQuestions >= 50 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <p className="text-emerald-400 font-medium">
                      Excellent daily performance metrics achieved!
                    </p>
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-emerald-400/80 mt-1">
                    Maintaining consistent high-volume practice
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background Analysis Status */}
            <AnimatePresence>
              {hasUpdatedToday && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-xs text-blue-400/80"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Performance data synchronized with analytics engine</span>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
