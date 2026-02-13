'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Activity, Zap, Award, BarChart3, Stethoscope, Brain } from 'lucide-react'

interface WeeklyAchievementPopupProps {
  isOpen: boolean
  onClose: () => void
  achievementLevel: 2000 | 6800
  questionCount: number
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Reset if text changes
    setDisplayText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 25) // Slightly faster for better flow
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span className="whitespace-pre-wrap">{displayText}</span>
}

export default function WeeklyAchievementPopup({ isOpen, onClose, achievementLevel, questionCount }: WeeklyAchievementPopupProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  // Level 2000: High Consistency (Future Doctor Theme)
  const achievement2000Reports = [
    `**WEEKLY CLINICAL REPORT**

📊 **Status:** Consistency Protocol Verified.
🎯 **Output:** ${questionCount} Questions / Week.

You have successfully maintained the "High-Yield" study rhythm. Solving 2000+ questions weekly is the baseline requirement for **Top-Tier Government Medical Colleges**.

**Clinical Insight:** Your ability to sustain this volume indicates strong neural pathway formation. The foundation for your white coat is being built right now. 

Maintain this trajectory to ensure peak retention.

— Academic Performance System`,

    `**MOMENTUM ANALYTICS**

✅ **Target Achieved:** Weekly Volume Threshold Met.

By crossing the 2000-question mark, you have statistically increased your probability of clearing the NEET cutoff by **15%** compared to the standard cohort.

**Recommendation:** Focus the next cycle on error analysis. Convert this quantity into clinical accuracy.

Steady pulse. Strong vitals. Keep operating.

— NEET Strategic Engine`
  ]

  // Level 6800: Elite/God-Tier (AIIMS/Rank 1 Theme)
  const achievement6800Reports = [
    `**ELITE COHORT ALERT**

🚀 **Status:** EXCEPTIONAL VELOCITY DETECTED.
🏆 **Output:** ${questionCount} Questions / Week.

This volume represents an outlier data point (**Top 0.1%**). You are operating at a level of intensity that defines **Rank 1 Contenders**. 

**Physiological Note:** This level of output requires immense cognitive endurance. You have effectively conditioned your mind for the rigors of medical specialization at institutes like AIIMS.

You aren't just practicing; you are dominating the syllabus.

— Elite Performance Tracker`,

    `**MAXIMUM CAPACITY REACHED**

⚡ **Metric:** ${questionCount} Questions. **Rating:** LEGENDARY.

You have transcended standard preparation limits. This week's performance will go down in your data history as a peak performance block.

**Strategic Outlook:** Future competitors cannot match this work rate. You are building an insurmountable lead towards that dream medical seat.

Ensure adequate recovery (sleep/nutrition) to allow neural consolidation of this massive data intake.

— Bio-Rhythm Sync Monitor`
  ]

  // useMemo ensures the message doesn't change randomly on re-renders
  const currentReport = useMemo(() => {
    const reports = achievementLevel === 2000 ? achievement2000Reports : achievement6800Reports
    return reports[Math.floor(Math.random() * reports.length)]
  }, [achievementLevel])

  // Professional Color Palettes
  // Level 2000: Teal/Emerald (Growth/Health)
  // Level 6800: Indigo/Purple (Royal/Elite)
  const bgGradient = achievementLevel === 2000 
    ? 'from-emerald-900/95 via-teal-900/95 to-green-900/95'
    : 'from-indigo-900/95 via-purple-900/95 to-slate-900/95'
  
  const borderColor = achievementLevel === 2000 ? 'border-emerald-500/30' : 'border-indigo-500/30'
  const iconColor = achievementLevel === 2000 ? 'text-emerald-400' : 'text-indigo-400'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br ${bgGradient} backdrop-blur-xl border ${borderColor} rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>

            <div className="p-8 pb-4 relative z-10">
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                {/* Main Icon Animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="mb-6 flex justify-center"
                >
                  <div className={`p-6 rounded-full bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]`}>
                    {achievementLevel === 2000 ? (
                      <Stethoscope className={`h-16 w-16 ${iconColor}`} />
                    ) : (
                      <Brain className={`h-16 w-16 ${iconColor}`} />
                    )}
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-3xl md:text-4xl font-bold mb-2 ${
                    achievementLevel === 2000 
                      ? 'text-emerald-400' 
                      : 'text-indigo-400'
                  } tracking-tight`}
                >
                  {achievementLevel === 2000 ? 'CONSISTENCY UNLOCKED' : 'ELITE PERFORMANCE TIER'}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-2 text-white/80 text-lg font-mono"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>{questionCount.toLocaleString()} Questions Executed</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Content Body */}
            <div className="px-8 pb-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-slate-950/50 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-inner"
              >
                {showContent && (
                  <div className="text-slate-200 leading-relaxed font-sans text-sm md:text-base">
                    <TypewriterText text={currentReport} />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Floating Medical Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute opacity-10"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: '110%',
                    opacity: 0,
                    scale: 0.5
                  }}
                  animate={{
                    y: '-10%',
                    opacity: [0, 0.2, 0],
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 10,
                    repeat: Infinity,
                    delay: i * 2,
                    ease: "linear"
                  }}
                >
                  {i % 3 === 0 && <Activity className={`h-12 w-12 ${iconColor}`} />}
                  {i % 3 === 1 && <Award className={`h-10 w-10 ${iconColor}`} />}
                  {i % 3 === 2 && <Zap className={`h-8 w-8 ${iconColor}`} />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}