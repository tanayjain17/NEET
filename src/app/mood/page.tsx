'use client'

import type { ComponentType, SVGProps } from 'react'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  CalendarIcon,
  SparklesIcon,
  BoltIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

type Mood = 'sad' | 'neutral' | 'happy'
type MoodEntry = { id: string; date: string; mood: Mood }

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>

const MOOD_ORDER: Mood[] = ['happy', 'neutral', 'sad']

const MOOD_UI: Record<
  Mood,
  {
    id: Mood
    label: string
    desc: string
    icon: HeroIcon
    emoji: string
    color: string
    tint: string
    border: string
  }
> = {
  happy: {
    id: 'happy',
    label: 'High Focus',
    desc: 'High cognitive energy and sustained attention',
    icon: SparklesIcon,
    emoji: '🧠',
    color: 'bg-emerald-500',
    tint: 'bg-emerald-500/15',
    border: 'border-emerald-500/40'
  },
  neutral: {
    id: 'neutral',
    label: 'Steady',
    desc: 'Stable baseline performance and routine execution',
    icon: BoltIcon,
    emoji: '🩺',
    color: 'bg-blue-500',
    tint: 'bg-blue-500/15',
    border: 'border-blue-500/40'
  },
  sad: {
    id: 'sad',
    label: 'Burnout Risk',
    desc: 'Low energy, distraction, or recovery needed',
    icon: ExclamationTriangleIcon,
    emoji: '📉',
    color: 'bg-rose-500',
    tint: 'bg-rose-500/15',
    border: 'border-rose-500/40'
  }
}

export default function MoodPage() {
  const queryClient = useQueryClient()

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [selectedDate, setSelectedDate] = useState(todayISO)

  const { data: moodEntries = [] } = useQuery<MoodEntry[]>({
    queryKey: ['mood-entries'],
    queryFn: async () => {
      const response = await fetch('/api/mood')
      if (!response.ok) throw new Error('Failed to fetch mood entries')
      const result = await response.json()
      return Array.isArray(result?.data) ? result.data : []
    }
  })

  const handleMoodSelect = async (mood: Mood) => {
    const response = await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate, mood })
    })
    if (!response.ok) throw new Error('Failed to save mood')
    queryClient.invalidateQueries({ queryKey: ['mood-entries'] })
  }

  const getMoodForDate = (date: string): Mood | undefined =>
    moodEntries.find(entry => entry.date.split('T')[0] === date)?.mood

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const calendarDays: Array<number | null> = []
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null)
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day)

  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-`
  const monthEntries = moodEntries.filter(e => e.date.split('T')[0].startsWith(monthPrefix))

  return (
    <DashboardLayout
      title="Cognitive Resilience"
      subtitle="Monitor cognitive energy, focus quality, and recovery signals"
    >
      <div className="relative space-y-6">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-blue-600/10 blur-[110px]" />
          <div className="absolute bottom-0 left-0 w-[520px] h-[520px] bg-cyan-600/10 blur-[110px]" />
          <div className="absolute top-1/3 left-1/3 w-[520px] h-[520px] bg-indigo-600/10 blur-[110px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-cyan-300" />
                  <span>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-white/40 text-[11px] font-semibold uppercase tracking-wider p-2">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} />

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const mood = getMoodForDate(dateStr)
                    const ui = mood ? MOOD_UI[mood] : null
                    const isSelected = selectedDate === dateStr
                    const isToday = dateStr === todayISO

                    return (
                      <motion.button
                        key={dateStr}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={[
                          'aspect-square rounded-xl border transition-all duration-300',
                          'flex flex-col items-center justify-center relative overflow-hidden',
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.18)]'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10',
                          isToday ? 'ring-1 ring-cyan-300 ring-offset-2 ring-offset-black' : ''
                        ].join(' ')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {ui && <div className={`absolute inset-0 opacity-25 ${ui.color}`} />}
                        <span className={`text-sm font-semibold z-10 ${isSelected ? 'text-cyan-300' : 'text-white/80'}`}>
                          {day}
                        </span>
                        {ui && <span className="text-lg z-10 mt-1 drop-shadow-md filter">{ui.emoji}</span>}
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Focus State <span className="text-white/40 text-sm font-normal ml-2">{selectedDate}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-white/60 text-sm">
                    Select the state that best reflects your cognitive performance today.
                  </p>

                  <div className="space-y-3">
                    {MOOD_ORDER.map((key) => {
                      const option = MOOD_UI[key]
                      const isSelected = getMoodForDate(selectedDate) === option.id
                      const Icon = option.icon

                      return (
                        <motion.button
                          key={option.id}
                          type="button"
                          onClick={() => handleMoodSelect(option.id)}
                          className={[
                            'w-full flex items-center p-4 rounded-xl border transition-all duration-300 relative overflow-hidden',
                            isSelected
                              ? `${option.border} ${option.tint} shadow-lg`
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          ].join(' ')}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="active-glow"
                              className={`absolute inset-0 opacity-20 ${option.color} blur-xl`}
                            />
                          )}

                          <div className={`p-2 rounded-lg mr-4 ${option.tint} border border-white/10`}>
                            <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-white/70'}`} />
                          </div>

                          <div className="text-left relative z-10">
                            <div className="text-white font-semibold flex items-center gap-2">
                              {option.label} <span>{option.emoji}</span>
                            </div>
                            <div className="text-xs text-white/50">{option.desc}</div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  <div className="text-[11px] text-white/35 leading-relaxed pt-2">
                    Note: This tracker is for self-monitoring and performance calibration, not medical diagnosis.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
              <CardHeader>
                <CardTitle className="text-white">Monthly Analytics</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {MOOD_ORDER.map((key) => {
                    const option = MOOD_UI[key]
                    const count = monthEntries.filter(entry => entry.mood === option.id).length
                    const percentage = monthEntries.length > 0 ? (count / monthEntries.length) * 100 : 0

                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-white/80">
                            <span>{option.emoji}</span>
                            <span>{option.label}</span>
                          </div>
                          <span className="text-white/60 font-mono">{count} days</span>
                        </div>

                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${option.color}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="text-[11px] text-white/35 mt-4">
                  Scope: counts computed from entries in <span className="font-mono">{monthPrefix}*</span>.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
