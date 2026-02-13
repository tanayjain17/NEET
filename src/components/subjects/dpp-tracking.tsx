'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSubjectChanges } from '@/contexts/subject-changes-context'
import DppQuestionInput from './dpp-question-input'
import { FileText, CheckCircle2, RotateCcw, Info } from 'lucide-react'

interface DppTrackingProps {
  chapterId: string
  dppCount: number
  dppCompleted: boolean[]
  dppQuestionCounts: number[]
  onUpdate: () => void
}

export default function DppTracking({
  chapterId,
  dppCount,
  dppCompleted,
  dppQuestionCounts,
  onUpdate
}: DppTrackingProps) {
  const [loading, setLoading] = useState<number | null>(null)
  const { addChange } = useSubjectChanges()
  const [localDpp, setLocalDpp] = useState(dppCompleted)

  useEffect(() => {
    setLocalDpp(dppCompleted)
  }, [dppCompleted])

  const handleDppToggle = (dppIndex: number) => {
    const newDpp = [...localDpp]
    newDpp[dppIndex] = !newDpp[dppIndex]
    setLocalDpp(newDpp)

    addChange({ chapterId, field: 'dppCompleted', value: newDpp })
    window.dispatchEvent(new CustomEvent('dppCompleted', { detail: { chapterId, dppIndex } }))
  }

  const completedCount = localDpp.filter(Boolean).length
  const progressPercentage = dppCount > 0 ? (completedCount / dppCount) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">Daily Practice Problems</h4>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            {completedCount}/{dppCount}
          </span>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-lime-500 bg-clip-text text-transparent">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-lime-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}
        />
      </div>

      {/* Checkbox Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {Array.from({ length: dppCount }, (_, index) => {
          const isCompleted = localDpp[index] || false
          const isLoading = loading === index
          const qCount = dppQuestionCounts[index] || 0

          return (
            <motion.button
              key={index}
              onClick={() => handleDppToggle(index)}
              disabled={isLoading}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`
                relative aspect-square rounded-lg border text-xs font-medium transition-all duration-200
                flex items-center justify-center
                ${isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-white/[0.02] border-white/10 text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400'
                }
              `}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : isCompleted ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
              ) : (
                <span>D{index + 1}</span>
              )}
              {isCompleted && qCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {qCount}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Question Count Inputs */}
      {localDpp.some(Boolean) && (
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Questions Solved</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {localDpp.map((isCompleted, index) =>
              isCompleted && (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-400 font-medium w-8">D{index + 1}:</span>
                  <DppQuestionInput
                    chapterId={chapterId}
                    dppIndex={index}
                    currentCount={dppQuestionCounts[index] || 0}
                    isCompleted={isCompleted}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newDpp = Array(dppCount).fill(true)
              setLocalDpp(newDpp)
              addChange({ chapterId, field: 'dppCompleted', value: newDpp })
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                       bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 
                       hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCircle2 className="w-3 h-3" />
            All Done
          </button>
          <button
            onClick={() => {
              const newDpp = Array(dppCount).fill(false)
              setLocalDpp(newDpp)
              addChange({ chapterId, field: 'dppCompleted', value: newDpp })
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                       bg-white/5 text-zinc-400 border border-white/10 
                       hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {completedCount > 0 && (
          <span className="text-xs text-zinc-500">
            {progressPercentage >= 100 ? '🎉 Complete!' :
              progressPercentage >= 75 ? '🔥 Almost!' : '📝 Keep going!'}
          </span>
        )}
      </div>
    </div>
  )
}