'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { 
  Brain, 
  Trophy, 
  Target, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Award,
  Microscope,
  Stethoscope,
  HeartPulse,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react'

interface TestScoreAnalysisPopupProps {
  isOpen: boolean
  onClose: () => void
  score: number
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 25)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayText}</span>
}

export default function TestScoreAnalysisPopup({ isOpen, onClose, score }: TestScoreAnalysisPopupProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 400)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  const getClinicalAnalysis = (score: number) => {
    // Elite Performance Tier (715-720)
    if (score >= 715) {
      return {
        tier: 'ELITE PERFORMANCE',
        institution: 'AIIMS Delhi',
        confidence: '99.9% Selection Probability',
        bgGradient: 'from-amber-900/30 via-yellow-900/30 to-orange-900/30',
        borderColor: 'border-amber-500/40',
        icon: <Trophy className="h-12 w-12 text-amber-400" />,
        metrics: {
          percentile: '99.99',
          rank: '1-50',
          selection: 'AIIMS Delhi - MBBS'
        },
        analysis: `CLINICAL PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━

SCORE: ${score}/720 • PERCENTILE: 99.99% • PROJECTED RANK: 1-50

━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION ELIGIBILITY:
• AIIMS Delhi (MBBS) - CONFIRMED
• Top Central Medical Colleges - CONFIRMED
• Premier Research Institutes - ELIGIBLE

━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE METRICS:
• Exceptional across all subjects
• Zero conceptual gaps detected
• Optimal time management demonstrated
• Elite problem-solving velocity

━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS:
• Maintain current preparation protocol
• Focus on advanced clinical reasoning
• Begin interview preparation
• Consider research mentorship opportunities

━━━━━━━━━━━━━━━━━━━━━━━

This performance places you in the top 0.01% of candidates nationwide. Your demonstrated competency ensures admission to premier medical institutions with high probability of top choice selection.`
      }
    }
    
    // Superior Performance Tier (710-714)
    if (score >= 710) {
      const institutions = [
        { name: 'MAMC Delhi', threshold: 714 },
        { name: 'Safdarjung Medical College', threshold: 712 },
        { name: 'JIPMER Puducherry', threshold: 710 }
      ]
      const matchedInstitution = institutions.find(i => score >= i.threshold) || institutions[2]
      
      return {
        tier: 'SUPERIOR PERFORMANCE',
        institution: matchedInstitution.name,
        confidence: '95% Selection Probability',
        bgGradient: 'from-emerald-900/30 via-teal-900/30 to-cyan-900/30',
        borderColor: 'border-emerald-500/40',
        icon: <Award className="h-12 w-12 text-emerald-400" />,
        metrics: {
          percentile: '99.9',
          rank: '51-500',
          selection: `${matchedInstitution.name} - MBBS`
        },
        analysis: `CLINICAL PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━

SCORE: ${score}/720 • PERCENTILE: 99.9% • PROJECTED RANK: 51-500

━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION ELIGIBILITY:
• ${matchedInstitution.name} - CONFIRMED
• Top Central Medical Colleges - CONFIRMED
• Premier State Medical Colleges - ELIGIBLE

━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE METRICS:
• Strong performance across subjects
• Minimal conceptual gaps identified
• Efficient time management
• High problem-solving accuracy

━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS:
• Intensify focus on weaker subject areas
• Increase mock test frequency to 2-3/week
• Review error patterns systematically
• Target 715+ in upcoming assessments

━━━━━━━━━━━━━━━━━━━━━━━

This performance demonstrates superior competency. With targeted improvements in specific areas, progression to Elite Tier (715+) is achievable within 4-6 weeks.`
      }
    }
    
    // Advanced Performance Tier (695-709)
    if (score >= 695) {
      const institutions = [
        { name: 'AIIMS Rishikesh', threshold: 705 },
        { name: 'AIIMS Jodhpur', threshold: 700 },
        { name: 'AIIMS Bhopal', threshold: 697 },
        { name: 'Lady Hardinge Medical College', threshold: 695 }
      ]
      const matchedInstitution = institutions.find(i => score >= i.threshold) || institutions[3]
      
      return {
        tier: 'ADVANCED PERFORMANCE',
        institution: matchedInstitution.name,
        confidence: '85% Selection Probability',
        bgGradient: 'from-blue-900/30 via-indigo-900/30 to-cyan-900/30',
        borderColor: 'border-blue-500/40',
        icon: <Target className="h-12 w-12 text-blue-400" />,
        metrics: {
          percentile: '99.5',
          rank: '501-2000',
          selection: `${matchedInstitution.name} - MBBS`
        },
        analysis: `CLINICAL PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━

SCORE: ${score}/720 • PERCENTILE: 99.5% • PROJECTED RANK: 501-2000

━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION ELIGIBILITY:
• ${matchedInstitution.name} - CONFIRMED
• Central Medical Colleges - CONFIRMED
• Top State Medical Colleges - ELIGIBLE

━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE METRICS:
• Good performance in most subjects
• Moderate conceptual gaps in 1-2 areas
• Satisfactory time management
• Acceptable accuracy rate

━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS:
• Increase daily question volume to 400+
• Conduct structured error analysis
• Focus on identified weak topics
• Target 710+ in next 8-10 weeks

━━━━━━━━━━━━━━━━━━━━━━━

This performance represents strong foundational knowledge. Systematic improvement in identified gap areas will enable progression to Superior Tier within 2-3 months.`
      }
    }
    
    // Proficient Performance Tier (660-694)
    if (score >= 660) {
      const institutions = [
        { name: 'AIIMS Raipur', threshold: 685 },
        { name: 'AIIMS Patna', threshold: 680 },
        { name: 'KGMU Lucknow', threshold: 675 },
        { name: 'IMS BHU', threshold: 670 },
        { name: 'Medical College Kolkata', threshold: 665 },
        { name: 'SMS Jaipur', threshold: 660 }
      ]
      const matchedInstitution = institutions.find(i => score >= i.threshold) || institutions[5]
      
      return {
        tier: 'PROFICIENT PERFORMANCE',
        institution: matchedInstitution.name,
        confidence: '75% Selection Probability',
        bgGradient: 'from-cyan-900/30 via-teal-900/30 to-emerald-900/30',
        borderColor: 'border-cyan-500/40',
        icon: <Activity className="h-12 w-12 text-cyan-400" />,
        metrics: {
          percentile: '98.5',
          rank: '2001-10000',
          selection: `${matchedInstitution.name} - MBBS`
        },
        analysis: `CLINICAL PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━

SCORE: ${score}/720 • PERCENTILE: 98.5% • PROJECTED RANK: 2001-10000

━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION ELIGIBILITY:
• ${matchedInstitution.name} - ELIGIBLE
• State Medical Colleges - CONFIRMED
• Private Medical Colleges - ELIGIBLE

━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE METRICS:
• Satisfactory performance in core subjects
• Significant gaps in 2-3 areas
• Time management requires optimization
• Accuracy needs improvement

━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS:
• Implement intensive daily practice (500+ questions)
• Conduct systematic error pattern analysis
• Focus on high-yield topics first
• Increase mock test frequency to weekly
• Target 695+ in next 3-4 months

━━━━━━━━━━━━━━━━━━━━━━━

This performance indicates adequate preparation but requires significant intensification to achieve Advanced Tier status. Immediate intervention in identified weak areas is recommended.`
      }
    }
    
    // Developing Performance Tier (600-659)
    if (score >= 600) {
      const institutions = [
        { name: 'AIIMS Bhatinda', threshold: 650 },
        { name: 'AIIMS Gorakhpur', threshold: 640 },
        { name: 'AIIMS Kalyani', threshold: 630 },
        { name: 'GMC Chandigarh', threshold: 600 }
      ]
      const matchedInstitution = institutions.find(i => score >= i.threshold) || institutions[3]
      
      return {
        tier: 'DEVELOPING PERFORMANCE',
        institution: matchedInstitution.name,
        confidence: '60% Selection Probability',
        bgGradient: 'from-amber-900/30 via-orange-900/30 to-yellow-900/30',
        borderColor: 'border-amber-500/40',
        icon: <AlertCircle className="h-12 w-12 text-amber-400" />,
        metrics: {
          percentile: '95',
          rank: '10001-50000',
          selection: `${matchedInstitution.name} - MBBS`
        },
        analysis: `CLINICAL PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━

SCORE: ${score}/720 • PERCENTILE: 95% • PROJECTED RANK: 10001-50000

━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION ELIGIBILITY:
• ${matchedInstitution.name} - POSSIBLE
• State Medical Colleges - CONTINGENT
• Private Medical Colleges - CONFIRMED

━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE METRICS:
• Inconsistent performance across subjects
• Significant conceptual gaps in multiple areas
• Time management needs restructuring
• Accuracy requires focused improvement

━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS:
• URGENT: Restructure study protocol
• Implement high-intensity practice (600+ questions daily)
• Conduct comprehensive topic-wise revision
• Weekly mock tests with detailed analysis
• Target 660+ in next 2-3 months

━━━━━━━━━━━━━━━━━━━━━━━

This performance indicates preparation requires significant enhancement to achieve government medical college admission. Immediate intervention with structured protocol is strongly recommended.`
      }
    }
    
    // Foundational Performance Tier (Below 600)
    return {
      tier: 'FOUNDATIONAL PERFORMANCE',
      institution: 'Private Medical Colleges',
      confidence: 'High Tuition Fee Option',
      bgGradient: 'from-rose-900/40 via-red-900/40 to-pink-900/40',
      borderColor: 'border-rose-500/50',
      icon: <TrendingDown className="h-12 w-12 text-rose-400" />,
      metrics: {
        percentile: '<90',
        rank: '50000+',
        selection: 'Private Medical Colleges - MBBS'
      },
      analysis: `CLINICAL PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━

SCORE: ${score}/720 • PERCENTILE: <90% • PROJECTED RANK: 50000+

━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION ELIGIBILITY:
• Government Medical Colleges - LOW PROBABILITY
• Private Medical Colleges - ELIGIBLE
• Deemed Universities - ELIGIBLE

━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL FINDINGS:
• Substantial gaps across all subjects
• Foundational concepts need reinforcement
• Time management requires complete overhaul
• Accuracy needs systematic improvement

━━━━━━━━━━━━━━━━━━━━━━━

URGENT RECOMMENDATIONS:
• IMMEDIATE: Restructure entire preparation protocol
• Implement intensive daily practice (700+ questions)
• Focus on NCERT fundamentals comprehensively
• Weekly 3-4 mock tests with error analysis
• Target 600+ in next 4-6 weeks

━━━━━━━━━━━━━━━━━━━━━━━

This performance indicates urgent intervention required to achieve government medical college admission. With structured high-intensity preparation, progression to Developing Tier is achievable within 6-8 weeks.`
    }
  }

  const analysis = getClinicalAnalysis(score)
  
  // Determine if this is a critical score requiring immediate attention
  const isCritical = score < 660

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br ${analysis.bgGradient} backdrop-blur-xl border ${analysis.borderColor} rounded-2xl shadow-2xl`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
              aria-label="Close analysis"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>

            {/* Critical Warning Banner */}
            {isCritical && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-0 left-0 right-0 bg-rose-500/20 border-b border-rose-400/30 p-3 z-20"
              >
                <div className="flex items-center justify-center gap-3 text-rose-200">
                  <AlertCircle className="h-5 w-5 animate-pulse" />
                  <span className="text-sm font-bold tracking-wider">IMMEDIATE INTERVENTION RECOMMENDED</span>
                  <AlertCircle className="h-5 w-5 animate-pulse" />
                </div>
              </motion.div>
            )}

            {/* Header Section */}
            <div className={`p-8 pb-4 ${isCritical ? 'pt-16' : ''}`}>
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                {/* Icon with medical pulse animation */}
                <motion.div
                  animate={isCritical ? {
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1]
                  } : {
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: isCritical ? 1.5 : 3,
                    repeat: Infinity,
                    repeatDelay: isCritical ? 1 : 2
                  }}
                  className="flex justify-center mb-4"
                >
                  <div className={`p-4 rounded-2xl ${analysis.borderColor} bg-white/5`}>
                    {analysis.icon}
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
                    score >= 715 ? 'from-amber-300 to-yellow-300' :
                    score >= 710 ? 'from-emerald-300 to-teal-300' :
                    score >= 695 ? 'from-blue-300 to-indigo-300' :
                    score >= 660 ? 'from-cyan-300 to-teal-300' :
                    score >= 600 ? 'from-amber-300 to-orange-300' :
                    'from-rose-300 to-red-300'
                  } bg-clip-text text-transparent`}
                >
                  {analysis.tier}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-3 mt-2"
                >
                  <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <span className="text-white font-mono text-sm">{score}/720</span>
                  </div>
                  <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <span className="text-white/80 text-sm">{analysis.metrics.percentile}%ile</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Analysis Content */}
            <div className="px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                {showContent && (
                  <div className="text-slate-200 leading-relaxed whitespace-pre-line text-sm md:text-base font-mono">
                    <TypewriterText text={analysis.analysis} />
                  </div>
                )}
              </motion.div>

              {/* Key Metrics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-3 mt-4"
              >
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Projected Rank</div>
                  <div className="text-sm font-bold text-white">{analysis.metrics.rank}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Selection</div>
                  <div className="text-sm font-bold text-white">{analysis.confidence}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Target</div>
                  <div className="text-sm font-bold text-white">{analysis.institution}</div>
                </div>
              </motion.div>

              {/* Professional Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 text-center"
              >
                <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
                  <Stethoscope className="h-3 w-3" />
                  Analysis based on NEET 2026 projected cutoffs • Update frequency: Daily
                  <HeartPulse className="h-3 w-3" />
                </p>
              </motion.div>
            </div>

            {/* Floating Medical Icons Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl opacity-10"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    opacity: 0
                  }}
                  animate={{
                    y: '-20%',
                    opacity: [0, 0.2, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "linear"
                  }}
                >
                  {i % 4 === 0 && '🧠'}
                  {i % 4 === 1 && '🔬'}
                  {i % 4 === 2 && '⚕️'}
                  {i % 4 === 3 && '📊'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
