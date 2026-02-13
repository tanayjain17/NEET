'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuestionAnalyticsSync } from '@/hooks/use-question-analytics'
import { useSubjectChanges } from '@/contexts/subject-changes-context'
import { ClipboardList, Zap, CheckCircle2, RotateCcw } from 'lucide-react'

interface QuestionsTrackingProps {
  chapterId: string
  assignmentQuestions: number
  assignmentCompleted: boolean[]
  kattarQuestions: number
  kattarCompleted: boolean[]
  onUpdate: () => void
}

export default function QuestionsTracking({
  chapterId,
  assignmentQuestions,
  assignmentCompleted,
  kattarQuestions,
  kattarCompleted,
  onUpdate
}: QuestionsTrackingProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [assignmentCount, setAssignmentCount] = useState(assignmentQuestions.toString())
  const [kattarCount, setKattarCount] = useState(kattarQuestions.toString())

  const [localAssignmentCompleted, setLocalAssignmentCompleted] = useState<boolean[]>(assignmentCompleted)
  const [localKattarCompleted, setLocalKattarCompleted] = useState<boolean[]>(kattarCompleted)

  const { syncQuestionCounts } = useQuestionAnalyticsSync()
  const { addChange } = useSubjectChanges()

  useEffect(() => {
    setLocalAssignmentCompleted(assignmentCompleted)
    setLocalKattarCompleted(kattarCompleted)
  }, [assignmentCompleted, kattarCompleted])

  const handleQuestionToggle = (type: 'assignment' | 'kattar', questionIndex: number) => {
    if (type === 'assignment') {
      const newCompleted = [...localAssignmentCompleted]
      newCompleted[questionIndex] = !newCompleted[questionIndex]
      setLocalAssignmentCompleted(newCompleted)
      addChange({ chapterId, field: 'assignmentCompleted', value: newCompleted })
    } else {
      const newCompleted = [...localKattarCompleted]
      newCompleted[questionIndex] = !newCompleted[questionIndex]
      setLocalKattarCompleted(newCompleted)
      addChange({ chapterId, field: 'kattarCompleted', value: newCompleted })
    }
  }

  const handleCountUpdate = async (type: 'assignment' | 'kattar', count: number) => {
    try {
      setLoading(`${type}-count`)
      const response = await fetch(`/api/chapters/${chapterId}/questions/count`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, count })
      })
      if (!response.ok) throw new Error(`Failed to update ${type} count`)
      onUpdate()
    } catch (error) {
      console.error(`Error updating ${type} count:`, error)
    } finally {
      setLoading(null)
    }
  }

  const assignmentCompletedCount = localAssignmentCompleted.filter(Boolean).length
  const assignmentProgress = assignmentQuestions > 0 ? (assignmentCompletedCount / assignmentQuestions) * 100 : 0
  const kattarCompletedCount = localKattarCompleted.filter(Boolean).length
  const kattarProgress = kattarQuestions > 0 ? (kattarCompletedCount / kattarQuestions) * 100 : 0

  // Shared section renderer
  const renderSection = (
    type: 'assignment' | 'kattar',
    title: string,
    Icon: React.ElementType,
    count: number,
    completed: boolean[],
    progress: number,
    completedCount: number,
    countState: string,
    setCountState: (v: string) => void,
    gradient: string,
    colors: { bg: string; border: string; text: string }
  ) => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colors.text}`} />
          <h5 className="text-sm font-semibold text-white">{title}</h5>
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {completedCount}/{count}
          </span>
        </div>
        <span className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Count Input */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-400">Total:</span>
        <input
          type="number"
          min="0"
          max="1000"
          value={countState}
          onChange={(e) => setCountState(e.target.value)}
          onBlur={() => {
            const newCount = parseInt(countState) || 0
            if (newCount !== count) handleCountUpdate(type, newCount)
          }}
          className="w-16 px-2 py-1 text-sm bg-white/5 border border-white/10 rounded-lg text-white 
                     focus:border-white/20 focus:outline-none"
          disabled={loading === `${type}-count`}
        />
        {loading === `${type}-count` && (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        )}
      </div>

      {/* Progress Bar */}
      {count > 0 && (
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Checkbox Grid */}
      {count > 0 && (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: count }, (_, index) => {
            const isCompleted = completed[index] || false
            return (
              <motion.button
                key={index}
                onClick={() => handleQuestionToggle(type, index)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`
                  aspect-square rounded-lg border text-xs font-medium transition-all duration-200
                  flex items-center justify-center
                  ${isCompleted
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-white/[0.02] border-white/10 text-zinc-500 hover:border-white/20'
                  }
                `}
              >
                {isCompleted ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Actions */}
      {count > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newCompleted = new Array(count).fill(true)
                if (type === 'assignment') {
                  setLocalAssignmentCompleted(newCompleted)
                  addChange({ chapterId, field: 'assignmentCompleted', value: newCompleted })
                } else {
                  setLocalKattarCompleted(newCompleted)
                  addChange({ chapterId, field: 'kattarCompleted', value: newCompleted })
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                         ${colors.bg} ${colors.text} border ${colors.border} hover:brightness-110 transition-all`}
            >
              <CheckCircle2 className="w-3 h-3" />
              All Done
            </button>
            <button
              onClick={() => {
                const newCompleted = new Array(count).fill(false)
                if (type === 'assignment') {
                  setLocalAssignmentCompleted(newCompleted)
                  addChange({ chapterId, field: 'assignmentCompleted', value: newCompleted })
                } else {
                  setLocalKattarCompleted(newCompleted)
                  addChange({ chapterId, field: 'kattarCompleted', value: newCompleted })
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                         bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Assignments - Purple Theme */}
      {renderSection(
        'assignment',
        'Assignments',
        ClipboardList,
        assignmentQuestions,
        localAssignmentCompleted,
        assignmentProgress,
        assignmentCompletedCount,
        assignmentCount,
        setAssignmentCount,
        'from-violet-400 to-fuchsia-500',
        { bg: 'bg-violet-500/15', border: 'border-violet-500/20', text: 'text-violet-400' }
      )}

      {/* Kattar - Challenge Mode Theme */}
      <div className="relative">
        {kattarQuestions > 0 && (
          <div className="absolute -top-2 right-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider 
                          bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-400 
                          border border-amber-500/30 rounded-full">
            Challenge Mode
          </div>
        )}
        {renderSection(
          'kattar',
          'Kattar Questions',
          Zap,
          kattarQuestions,
          localKattarCompleted,
          kattarProgress,
          kattarCompletedCount,
          kattarCount,
          setKattarCount,
          'from-amber-400 to-rose-500',
          { bg: 'bg-amber-500/15', border: 'border-amber-500/20', text: 'text-amber-400' }
        )}
      </div>
    </div>
  )
}