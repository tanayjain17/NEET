'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Target, 
  Activity, 
  Sparkles, 
  Stethoscope, 
  Microscope, 
  Award, 
  TrendingUp, 
  HeartPulse,
  CheckCircle2
} from 'lucide-react'

interface UnifiedPerformanceCardProps {
  className?: string
  isMilestone?: boolean
  score?: number
}

export default function UnifiedPerformanceCard({ 
  className = "", 
  isMilestone = false,
  score
}: UnifiedPerformanceCardProps) {

  // Messages merged from both options
  const briefings = {
    standard: [
      "Cognitive endurance protocol active. Maintain focus. 🧠",
      "Current practice velocity correlates with AIIMS selection metrics. 📈",
      "Conceptual mastery is an iterative process. Every session counts. 🧬",
      "Each question solved strengthens the neural architecture required for mastery. 🩺",
      "Consistent effort creates compounding returns in knowledge retention. ✨"
    ],
    milestone: [
      "Exceptional progress detected. Building strong neural pathways for excellence.",
      "Significant milestone achieved. Trajectory analysis shows strong AIIMS correlation.",
      "Critical mass of practice questions reached. Knowledge integration at optimal levels.",
      "Optimal performance metrics verified. Continue protocol for peak clinical retention."
    ]
  }

  const currentMessage = isMilestone 
    ? briefings.milestone[Math.floor(Math.random() * briefings.milestone.length)]
    : briefings.standard[Math.floor(Math.random() * briefings.standard.length)]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-500 ${
        isMilestone 
          ? 'bg-gradient-to-br from-emerald-900/40 via-slate-900/90 to-teal-900/40 border-emerald-500/40 p-8' 
          : 'bg-gradient-to-br from-slate-900/80 via-blue-900/20 to-cyan-900/20 border-blue-500/30 p-6'
      } ${className}`}
    >
      {/* Background Medical Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div 
          className="absolute inset-0 bg-blue-500/5"
          animate={isMilestone ? { opacity: [0.1, 0.2, 0.1] } : { opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${10 + i * 35}%`, top: `${20 + (i % 2) * 40}%` }}
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          >
            {isMilestone ? <Award className="w-12 h-12 text-emerald-400" /> : <Activity className="w-10 h-10 text-cyan-400" />}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-xl border ${isMilestone ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-blue-500/10 border-blue-500/20'}`}>
            {isMilestone ? <Award className="w-5 h-5 text-emerald-400" /> : <Brain className="w-5 h-5 text-blue-400" />}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {isMilestone ? 'Elite Milestone Verified' : 'Aspirant Performance Briefing'}
            </h3>
            <span className={`text-sm font-bold ${isMilestone ? 'text-emerald-400' : 'text-blue-400'}`}>
              {isMilestone ? 'Rank Trajectory: OPTIMAL' : 'Cognitive Pulse: ACTIVE'}
            </span>
          </div>
          
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-full border border-white/5"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isMilestone ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'}`} />
            <span className="text-[9px] font-mono text-slate-300 tracking-tighter">DATA_SYNC</span>
          </motion.div>
        </div>

        {/* Message Body */}
        <motion.p
          layout
          className={`leading-relaxed mb-6 font-medium ${isMilestone ? 'text-slate-100 text-xl' : 'text-slate-200 text-base'}`}
        >
          {currentMessage}
        </motion.p>

        {/* Footer Metrics Section */}
        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className={`w-4 h-4 ${isMilestone ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                NEET-UG 2026 Execution Protocol
              </span>
            </div>
            
            <div className="flex items-center gap-3">
               <Stethoscope className="w-4 h-4 text-slate-500 opacity-50" />
               <Sparkles className={`w-4 h-4 ${isMilestone ? 'text-emerald-400' : 'text-blue-400'}`} />
            </div>
          </div>

          {/* Conditional Professional Metrics (Option 2 Integration) */}
          <AnimatePresence>
            {isMilestone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-3 gap-2 pt-2"
              >
                <div className="bg-white/5 rounded-lg p-2 border border-white/5 text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Neural Load</div>
                  <div className="text-xs font-mono text-emerald-400">OPTIMAL</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5 text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Retention</div>
                  <div className="text-xs font-mono text-emerald-400">94.2%</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5 text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <div className="text-[9px] text-emerald-400 uppercase font-bold">Verified</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}