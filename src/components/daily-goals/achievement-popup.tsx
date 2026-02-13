'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Stethoscope, Dna, Activity, Brain, CheckCircle } from 'lucide-react'

interface AchievementPopupProps {
  isOpen: boolean
  onClose: () => void
  achievementLevel: 300 | 400
  questionCount: number
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30) // Slightly faster for professional reading speed
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span className="whitespace-pre-wrap">{displayText}</span>
}

export default function AchievementPopup({ isOpen, onClose, achievementLevel, questionCount }: AchievementPopupProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  // Level 300: High Performance Messages
  const achievement300Commendations = [
    `Future Doctor,

🎯 **Benchmark Achieved:** ${questionCount} questions solved today.

Your cognitive endurance is showing remarkable growth. Solving 300+ questions in a single cycle puts you in the top 5% of aspirants regarding daily volume.

🧠 **Neural Adaptation:** Your brain is successfully adapting to high-load processing. This consistency is the primary differentiator between a good rank and a top rank.

Keep this momentum. This isn't just study; this is clinical discipline building.

— Academic Performance System`,

    `Excellent Work,

⚡ **Velocity Metric:** ${questionCount} Questions.

You are operating at high efficiency. At this rate, your syllabus coverage and revision cycles will outpace the standard cohort significantly.

🧬 **Bio-Rhythm Alignment:** Achieving this volume indicates your focus periods are perfectly synced. 

Maintain this standard. The white coat is earned in these quiet moments of effort.

— NEET Performance Engine`,

    `Performance Update: **Optimal**,

📈 Daily Output: ${questionCount} Questions.

You have successfully pushed past the mental fatigue barrier. This "second wind" is where true learning consolidation happens. 

Target AIIMS Delhi: This level of dedication is statistically correlated with Top 100 AIR. Don't let the intensity drop.

— Strategic Analysis Unit`
  ]

  // Level 400: Elite Performance Messages
  const achievement400Commendations = [
    `**ELITE PERFORMANCE DETECTED**

🚀 **Volume Alert:** ${questionCount} Questions Solved.

You have entered the "Distinction Cohort." This volume of practice is rare and indicates a fierce determination to dominate the exam.

🏆 **Trajectory Analysis:** Maintaining a 400+ daily average mathematically maximizes your probability of securing a seat in a premier Government Medical College.

You aren't just preparing; you are evolving into a top-tier professional.

— Elite Performance Tracker`,

    `**EXCEPTIONAL VELOCITY**

🔥 **Metric:** ${questionCount} Questions / 24hrs.

You have shattered the standard performance ceiling. This is the work ethic of a future specialist. 

🩺 **Clinical Precision:** Speed + Accuracy at this volume is the hallmark of a topper. You are conditioning your mind to handle the pressure of the actual exam day effortlessly.

Stay humble, stay hungry. The goal is 720/720.

— AI Ranking Engine`,

    `**MAXIMUM EFFICIENCY ACHIEVED**

💎 **Output:** ${questionCount} Questions.

This performance is statistically improbable for the average student. You are proving yourself to be an outlier. 

By pushing your limits today, you have expanded your cognitive capacity for tomorrow. This is how legends are made in the medical field.

Excellent execution. Now, ensure proper recovery (sleep) to consolidate these gains.

— Bio-Rhythm Sync Monitor`
  ]

  const getRandomLetter = (letters: string[]) => {
    // Use a simple hash of the date to get a "letter of the day" or random
    const randomIndex = Math.floor(Math.random() * letters.length)
    return letters[randomIndex]
  }

  const currentLetter = achievementLevel === 300 
    ? getRandomLetter(achievement300Commendations) 
    : getRandomLetter(achievement400Commendations)

  // Professional Gradients
  const bgGradient = achievementLevel === 300 
    ? 'from-blue-600/20 via-cyan-500/20 to-indigo-600/20' // Blue/Cyan for 300
    : 'from-indigo-600/20 via-purple-500/20 to-emerald-500/20' // Indigo/Emerald for 400 (Elite)
  
  const borderColor = achievementLevel === 300 ? 'border-cyan-500/30' : 'border-indigo-500/30'
  const iconColor = achievementLevel === 300 ? 'text-cyan-400' : 'text-emerald-400'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br ${bgGradient} backdrop-blur-xl border ${borderColor} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>

            {/* Header Section */}
            <div className="p-8 pb-4 relative z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${achievementLevel === 400 ? 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'shadow-[0_0_30px_rgba(6,182,212,0.3)]'}`}>
                    {achievementLevel === 300 ? (
                      <Activity className={`h-12 w-12 ${iconColor}`} />
                    ) : (
                      <Trophy className={`h-12 w-12 ${iconColor}`} />
                    )}
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white tracking-tight">
                  {achievementLevel === 300 ? 'HIGH VELOCITY DETECTED' : 'ELITE PERFORMANCE TIER'}
                </h1>
                
                <div className="flex items-center justify-center gap-2 text-white/80 font-mono text-sm">
                  <CheckCircle className={`h-4 w-4 ${iconColor}`} />
                  <span>Daily Protocol: {questionCount} Questions Executed</span>
                </div>
              </motion.div>
            </div>

            {/* Content Body */}
            <div className="px-8 pb-8 relative z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-950/40 rounded-xl p-6 border border-white/10 font-sans text-slate-200 leading-relaxed shadow-inner"
              >
                {showContent && (
                  <TypewriterText text={currentLetter} />
                )}
              </motion.div>
            </div>

            {/* Floating Medical Icons Background Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute opacity-10"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: '120%',
                    opacity: 0,
                    scale: 0.5
                  }}
                  animate={{
                    y: '-20%',
                    opacity: [0, 0.15, 0],
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "linear"
                  }}
                >
                  {/* Randomly select medical icons */}
                  {i % 4 === 0 && <Dna className={`h-12 w-12 ${iconColor}`} />}
                  {i % 4 === 1 && <Activity className={`h-8 w-8 ${iconColor}`} />}
                  {i % 4 === 2 && <Brain className={`h-10 w-10 ${iconColor}`} />}
                  {i % 4 === 3 && <Stethoscope className={`h-10 w-10 ${iconColor}`} />}
                </motion.div>
              ))}
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}