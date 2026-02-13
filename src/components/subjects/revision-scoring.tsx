'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingDown, TrendingUp, Sparkles, Zap } from 'lucide-react'

interface RevisionScoringProps {
  chapterId: string
  revisionScore: number
  onUpdate: () => void
}

export default function RevisionScoring({
  chapterId,
  revisionScore,
  onUpdate
}: RevisionScoringProps) {
  const [loading, setLoading] = useState(false)
  const [currentScore, setCurrentScore] = useState(revisionScore)

  const handleScoreUpdate = async (newScore: number) => {
    try {
      setLoading(true)
      setCurrentScore(newScore)

      const response = await fetch(`/api/chapters/${chapterId}/revision`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionScore: newScore })
      })

      if (!response.ok) throw new Error('Failed to update')
      onUpdate()
    } catch (error) {
      console.error('Error:', error)
      setCurrentScore(revisionScore)
    } finally {
      setLoading(false)
    }
  }

  // Dynamic theme based on score
  const getTheme = (score: number) => {
    if (score <= 3) return {
      gradient: 'from-rose-500 to-red-600',
      text: 'text-rose-400',
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/20',
      label: 'Needs Work',
      icon: TrendingDown
    }
    if (score <= 5) return {
      gradient: 'from-amber-500 to-orange-600',
      text: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/20',
      label: 'Building Up',
      icon: Zap
    }
    if (score <= 7) return {
      gradient: 'from-yellow-500 to-lime-500',
      text: 'text-lime-400',
      bg: 'bg-lime-500/15',
      border: 'border-lime-500/20',
      label: 'Good Progress',
      icon: TrendingUp
    }
    return {
      gradient: 'from-emerald-500 to-teal-500',
      text: 'text-teal-400',
      bg: 'bg-teal-500/15',
      border: 'border-teal-500/20',
      label: 'Mastered',
      icon: Sparkles
    }
  }

  const theme = getTheme(currentScore)
  const Icon = theme.icon
  const progressPercent = (currentScore / 10) * 100

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${theme.bg} border ${theme.border}`}>
            <Star className={`w-5 h-5 ${theme.text}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Revision Quality</h4>
            <span className={`text-xs ${theme.text}`}>{theme.label}</span>
          </div>
        </div>
        <div className={`text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
          {currentScore}<span className="text-lg text-zinc-500">/10</span>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative py-3">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-white/5" />
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
          style={{ boxShadow: `0 0 12px ${theme.text.includes('rose') ? 'rgba(244,63,94,0.5)' : theme.text.includes('amber') ? 'rgba(245,158,11,0.5)' : theme.text.includes('lime') ? 'rgba(132,204,22,0.5)' : 'rgba(20,184,166,0.5)'}` }}
        />
        <input
          type="range"
          min="1"
          max="10"
          value={currentScore}
          onChange={(e) => setCurrentScore(parseInt(e.target.value))}
          onMouseUp={(e) => {
            const val = parseInt((e.target as HTMLInputElement).value)
            if (val !== revisionScore) handleScoreUpdate(val)
          }}
          onTouchEnd={(e) => {
            const val = parseInt((e.target as HTMLInputElement).value)
            if (val !== revisionScore) handleScoreUpdate(val)
          }}
          disabled={loading}
          className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                     [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab
                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/30
                     [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                     [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
        />
      </div>

      {/* Score Markers */}
      <div className="flex justify-between">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.button
            key={i + 1}
            onClick={() => handleScoreUpdate(i + 1)}
            disabled={loading}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`w-7 h-7 rounded-full text-xs font-medium transition-all
              ${i + 1 === currentScore
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                : i + 1 <= currentScore
                  ? `${theme.bg} ${theme.text} border ${theme.border}`
                  : 'bg-white/5 text-zinc-600 hover:bg-white/10 hover:text-zinc-400'
              }`}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { score: 2, label: 'Weak', emoji: '😰' },
          { score: 5, label: 'Fair', emoji: '🤔' },
          { score: 7, label: 'Good', emoji: '😊' },
          { score: 10, label: 'Perfect', emoji: '🔥' },
        ].map(({ score, label, emoji }) => {
          const btnTheme = getTheme(score)
          const isActive = currentScore === score

          return (
            <motion.button
              key={score}
              onClick={() => handleScoreUpdate(score)}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`
                py-2.5 px-2 rounded-xl text-center transition-all overflow-hidden
                ${isActive
                  ? `bg-gradient-to-r ${btnTheme.gradient} text-white shadow-lg`
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
                }
              `}
            >
              <span className="text-lg">{emoji}</span>
              <div className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                {label}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-zinc-400">Saving...</span>
        </div>
      )}

      {/* Tip */}
      <div className={`p-3 rounded-xl ${theme.bg} border ${theme.border}`}>
        <div className="flex items-start gap-2">
          <Icon className={`w-4 h-4 ${theme.text} mt-0.5`} />
          <p className={`text-xs ${theme.text}`}>
            {currentScore <= 3 && "Focus on core concepts first. Review theory before problems."}
            {currentScore > 3 && currentScore <= 5 && "You're building momentum! Practice more to strengthen."}
            {currentScore > 5 && currentScore <= 7 && "Great progress! Focus on edge cases to level up."}
            {currentScore > 7 && "Excellent mastery! Maintain with periodic quick revisions."}
          </p>
        </div>
      </div>
    </div>
  )
}