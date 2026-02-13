'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSubjectChanges } from '@/contexts/subject-changes-context'
import { BookOpen, CheckCircle2, RotateCcw } from 'lucide-react'

interface LectureTrackingProps {
  chapterId: string
  lectureCount: number
  lecturesCompleted: boolean[]
  onUpdate: () => void
}

export default function LectureTracking({
  chapterId,
  lectureCount,
  lecturesCompleted,
  onUpdate
}: LectureTrackingProps) {
  const [loading, setLoading] = useState<number | null>(null)
  const { addChange } = useSubjectChanges()
  const [localLectures, setLocalLectures] = useState(lecturesCompleted)

  useEffect(() => {
    setLocalLectures(lecturesCompleted)
  }, [lecturesCompleted])

  const handleLectureToggle = (lectureIndex: number) => {
    const newLectures = [...localLectures]
    newLectures[lectureIndex] = !newLectures[lectureIndex]
    setLocalLectures(newLectures)

    addChange({
      chapterId,
      field: 'lecturesCompleted',
      value: newLectures
    })

    window.dispatchEvent(new CustomEvent('lectureCompleted', { detail: { chapterId, lectureIndex } }))
  }

  const completedCount = localLectures.filter(Boolean).length
  const progressPercentage = lectureCount > 0 ? (completedCount / lectureCount) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-semibold text-white">Lectures</h4>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
            {completedCount}/{lectureCount}
          </span>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: '0 0 10px rgba(6. 182, 212, 0.4)' }}
        />
      </div>

      {/* Checkbox Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {Array.from({ length: lectureCount }, (_, index) => {
          const isCompleted = localLectures[index] || false
          const isLoading = loading === index

          return (
            <motion.button
              key={index}
              onClick={() => handleLectureToggle(index)}
              disabled={isLoading}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`
                aspect-square rounded-lg border text-xs font-medium transition-all duration-200
                flex items-center justify-center
                ${isCompleted
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-white/[0.02] border-white/10 text-zinc-500 hover:border-cyan-500/30 hover:text-cyan-400'
                }
              `}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : isCompleted ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newLectures = Array(lectureCount).fill(true)
              setLocalLectures(newLectures)
              addChange({ chapterId, field: 'lecturesCompleted', value: newLectures })
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                       bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 
                       hover:bg-cyan-500/20 transition-colors"
          >
            <CheckCircle2 className="w-3 h-3" />
            All Done
          </button>
          <button
            onClick={() => {
              const newLectures = Array(lectureCount).fill(false)
              setLocalLectures(newLectures)
              addChange({ chapterId, field: 'lecturesCompleted', value: newLectures })
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
              progressPercentage >= 75 ? '🔥 Almost!' :
                progressPercentage >= 50 ? '💪 Good!' : '🚀 Go!'}
          </span>
        )}
      </div>
    </div>
  )
}