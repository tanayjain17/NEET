'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chapter } from '@prisma/client'
import { ChevronDown, AlertTriangle, BookOpen, FileText, ClipboardList, Zap } from 'lucide-react'
import LectureTracking from './lecture-tracking'
import DppTracking from './dpp-tracking'
import QuestionsTracking from './questions-tracking'
import RevisionScoring from './revision-scoring'

type ChapterWithProgress = Chapter & {
  progress: {
    lectureProgress: number
    dppProgress: number
    assignmentProgress: number
    kattarProgress: number
    overallProgress: number
    needsImprovement: boolean
  }
}

interface ChapterCardProps {
  chapter: ChapterWithProgress
  onUpdate: () => void
}

// Metric tile configurations
const metricConfig = {
  lectures: {
    label: 'Lectures',
    icon: BookOpen,
    gradient: 'from-cyan-400 to-blue-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]'
  },
  dpp: {
    label: 'DPP',
    icon: FileText,
    gradient: 'from-emerald-400 to-lime-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
  },
  assignments: {
    label: 'Assignments',
    icon: ClipboardList,
    gradient: 'from-violet-400 to-fuchsia-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    text: 'text-violet-400',
    hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]'
  },
  kattar: {
    label: 'Kattar',
    icon: Zap,
    gradient: 'from-amber-400 to-rose-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    hoverGlow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
  }
}

export default function ChapterCard({ chapter, onUpdate }: ChapterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { progress } = chapter

  // Get color based on overall progress
  const getOverallColor = (pct: number) => {
    if (pct < 50) return { from: '#ef4444', to: '#f87171' }
    if (pct < 75) return { from: '#f59e0b', to: '#fbbf24' }
    if (pct < 90) return { from: '#22c55e', to: '#4ade80' }
    return { from: '#ec4899', to: '#f472b6' }
  }

  const overallColor = getOverallColor(progress.overallProgress)
  const circumference = 2 * Math.PI * 16

  // Metric Tile Component
  const MetricTile = ({ type, percentage }: { type: keyof typeof metricConfig; percentage: number }) => {
    const config = metricConfig[type]
    const Icon = config.icon

    return (
      <div className={`group p-3 rounded-xl bg-white/[0.03] border ${config.border} transition-all duration-300 ${config.hoverGlow} cursor-default`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${config.text}`} />
          <span className="text-xs text-zinc-400">{config.label}</span>
        </div>
        <div className={`text-xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          {Math.round(percentage)}%
        </div>
        {/* Mini progress bar */}
        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${config.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className="rounded-2xl bg-[#18181B] border border-white/10 overflow-hidden transition-colors duration-300 hover:bg-[#1f1f23]"
    >
      {/* Header - Always Visible (Summary View) */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          {/* Left: Mini ring + Title + Pills */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mini Progress Ring */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="transparent" />
                <defs>
                  <linearGradient id={`mini-grad-${chapter.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: overallColor.from }} />
                    <stop offset="100%" style={{ stopColor: overallColor.to }} />
                  </linearGradient>
                </defs>
                <circle
                  cx="20" cy="20" r="16"
                  stroke={`url(#mini-grad-${chapter.id})`}
                  strokeWidth="3"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress.overallProgress / 100)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{Math.round(progress.overallProgress)}%</span>
              </div>
            </div>

            {/* Title & Pills */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate">{chapter.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {chapter.lectureCount} Lectures
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  Rev: {chapter.revisionScore}/10
                </span>
                {progress.needsImprovement && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-500/15 text-red-400 border border-red-500/20"
                    title="Score is below 50%"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Weak
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 text-zinc-500"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Thin Progress Line (visible when collapsed) */}
        {!isExpanded && (
          <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${overallColor.from}, ${overallColor.to})`,
                boxShadow: `0 0 8px ${overallColor.from}50`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.overallProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        )}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5">
              {/* 4-Column Metric Tiles Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-5">
                <MetricTile type="lectures" percentage={progress.lectureProgress} />
                <MetricTile type="dpp" percentage={progress.dppProgress} />
                <MetricTile type="assignments" percentage={progress.assignmentProgress} />
                <MetricTile type="kattar" percentage={progress.kattarProgress} />
              </div>

              {/* Detailed Tracking Sections */}
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <LectureTracking
                    chapterId={chapter.id}
                    lectureCount={chapter.lectureCount}
                    lecturesCompleted={Array.isArray(chapter.lecturesCompleted) ? chapter.lecturesCompleted as boolean[] : []}
                    onUpdate={onUpdate}
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <DppTracking
                    chapterId={chapter.id}
                    dppCount={chapter.lectureCount}
                    dppCompleted={Array.isArray(chapter.dppCompleted) ? chapter.dppCompleted as boolean[] : []}
                    dppQuestionCounts={Array.isArray(chapter.dppQuestionCounts) ? chapter.dppQuestionCounts as number[] : []}
                    onUpdate={onUpdate}
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <QuestionsTracking
                    chapterId={chapter.id}
                    assignmentQuestions={chapter.assignmentQuestions}
                    assignmentCompleted={Array.isArray(chapter.assignmentCompleted) ? chapter.assignmentCompleted as boolean[] : []}
                    kattarQuestions={chapter.kattarQuestions}
                    kattarCompleted={Array.isArray(chapter.kattarCompleted) ? chapter.kattarCompleted as boolean[] : []}
                    onUpdate={onUpdate}
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <RevisionScoring
                    chapterId={chapter.id}
                    revisionScore={chapter.revisionScore}
                    onUpdate={onUpdate}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}