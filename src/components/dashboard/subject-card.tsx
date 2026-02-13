'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BookOpen, FlaskConical, Leaf, Bug, ChevronRight } from 'lucide-react'

interface SubjectCardProps {
  id: string
  name: string
  completionPercentage: number
  totalChapters: number
  totalLectures: number
  completedLectures: number
  totalQuestions: number
  emoji: string
  index?: number
}

export default function SubjectCard({
  id,
  name,
  completionPercentage,
  totalChapters,
  totalLectures,
  completedLectures,
  totalQuestions,
  emoji,
  index = 0
}: SubjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/subjects/${id}`)
  }

  // Get subject icon based on name
  const getSubjectIcon = (subjectName: string) => {
    const iconClass = "w-5 h-5"
    switch (subjectName.toLowerCase()) {
      case 'physics':
        return <FlaskConical className={iconClass} />
      case 'chemistry':
        return <FlaskConical className={iconClass} />
      case 'botany':
        return <Leaf className={iconClass} />
      case 'zoology':
        return <Bug className={iconClass} />
      default:
        return <BookOpen className={iconClass} />
    }
  }

  // Gradient colors based on completion
  const getProgressTheme = (percentage: number) => {
    if (percentage < 25) return {
      gradient: 'from-rose-500 to-red-600',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      glow: 'rgba(244, 63, 94, 0.4)'
    }
    if (percentage < 50) return {
      gradient: 'from-amber-500 to-orange-600',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      glow: 'rgba(245, 158, 11, 0.4)'
    }
    if (percentage < 75) return {
      gradient: 'from-yellow-500 to-lime-500',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      glow: 'rgba(234, 179, 8, 0.4)'
    }
    if (percentage < 90) return {
      gradient: 'from-emerald-500 to-green-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      glow: 'rgba(16, 185, 129, 0.4)'
    }
    return {
      gradient: 'from-pink-500 to-rose-500',
      text: 'text-pink-400',
      bg: 'bg-pink-500/10',
      glow: 'rgba(236, 72, 153, 0.4)'
    }
  }

  const theme = getProgressTheme(completionPercentage)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference * (1 - completionPercentage / 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="group cursor-pointer"
    >
      {/* Card Container - Glassmorphism */}
      <div className="relative rounded-2xl bg-[#18181B] border border-white/10 p-6 
                      transition-all duration-300 
                      hover:bg-[#27272A] hover:border-white/20
                      hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${theme.glow} 0%, transparent 60%)`
          }}
        />

        {/* Header Row */}
        <div className="relative flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Icon Container */}
            <div className={`p-2.5 rounded-xl ${theme.bg} border border-white/5`}>
              <span className={theme.text}>{getSubjectIcon(name)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              {/* Status Pills */}
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {totalChapters} Chapters
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {completedLectures}/{totalLectures} Lectures
                </span>
              </div>
            </div>
          </div>

          {/* Emoji */}
          <motion.span
            className="text-2xl"
            animate={completionPercentage > 90 ? {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {emoji}
          </motion.span>
        </div>

        {/* Progress Ring - Centered */}
        <div className="flex justify-center mb-5">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50" cy="50" r="40"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress Arc with Gradient */}
              <defs>
                <linearGradient id={`progress-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={theme.gradient.split(' ')[0].replace('from-', 'stop-color:')} style={{ stopColor: theme.gradient.includes('rose') ? '#f43f5e' : theme.gradient.includes('amber') ? '#f59e0b' : theme.gradient.includes('yellow') ? '#eab308' : theme.gradient.includes('emerald') ? '#10b981' : '#ec4899' }} />
                  <stop offset="100%" className={theme.gradient.split(' ')[1]?.replace('to-', 'stop-color:')} style={{ stopColor: theme.gradient.includes('red') ? '#dc2626' : theme.gradient.includes('orange') ? '#ea580c' : theme.gradient.includes('lime') ? '#84cc16' : theme.gradient.includes('green') ? '#22c55e' : '#f43f5e' }} />
                </linearGradient>
              </defs>
              <motion.circle
                cx="50" cy="50" r="40"
                stroke={`url(#progress-gradient-${id})`}
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ filter: `drop-shadow(0 0 8px ${theme.glow})` }}
              />
            </svg>
            {/* Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-2xl font-bold ${theme.text}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                {Math.round(completionPercentage)}%
              </motion.span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Complete</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
            <span className="text-base">📊</span>
            <span>{totalQuestions.toLocaleString()} Questions</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <span className="text-xs">View Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}