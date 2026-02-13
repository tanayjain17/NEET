'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Target,
  Calendar,
  Heart,
  Trophy,
  Clock,
  Sparkles,
  AlertTriangle,
  Activity,
  Zap,
  Star,
  Flame,
} from 'lucide-react'

/* ------------------------- Types ------------------------- */

interface AIRPrediction {
  predictedAIR: number
  confidenceScore: number // 0..1
  riskAssessment: 'low' | 'medium' | 'high'
  keyFactors: string[]
  recommendations: string[]
  milestones: Array<{
    date: string
    target: string
    description: string
  }>
}

interface SmartSchedule {
  dailySchedule: Array<{
    timeSlot: string
    subject: string
    activity: string
    duration: number
    intensity: 'high' | 'medium' | 'low'
    reasoning: string
  }>
  weeklyPlan: {
    [key: string]: {
      focus: string
      adjustments: string[]
    }
  }
  biologicalOptimizations: string[]
  festivalAdjustments: string[]
  bscIntegration: string[]
  emergencyPlan: string
}

// PROFESSIONAL TERM: Bio‑Rhythm data model (replaces personal wording)
interface BioRhythmProfile {
  cycleStartDate: string
  cycleLength: number
  periodLength: number
  energyLevel: number // 0..10
  studyCapacity: number // 0..10
  symptoms: string[]
}

/* ------------------------- Small UI helpers ------------------------- */

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function Pill({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode
  tone?: 'slate' | 'emerald' | 'blue' | 'rose'
}) {
  // UPDATED palette: Rose / Blue / Emerald (modern + softer)
  const toneClass =
    tone === 'emerald'
      ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30'
      : tone === 'blue'
      ? 'bg-blue-500/15 text-blue-200 border-blue-500/30'
      : tone === 'rose'
      ? 'bg-rose-500/15 text-rose-200 border-rose-500/30'
      : 'bg-slate-500/15 text-slate-200 border-slate-500/30'

  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', toneClass)}>
      {children}
    </span>
  )
}

function ProgressBar({ value, colorClass = 'bg-cyan-400' }: { value: number; colorClass?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
      <div className={cn('h-full rounded-full', colorClass)} style={{ width: `${v}%` }} />
    </div>
  )
}

function CardShell({
  title,
  subtitle,
  right,
  children,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* UPDATED: Blue/Cyan/Indigo accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
      <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white text-lg font-semibold">{title}</div>
          {subtitle ? <div className="text-white/50 text-sm mt-1">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition border border-white/10',
        'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white',
        'disabled:opacity-60 disabled:cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition border',
        active
          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function StatTile({
  label,
  value,
  desc,
  icon,
}: {
  label: string
  value: React.ReactNode
  desc?: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">{label}</div>
          <div className="text-white text-2xl font-bold mt-1">{value}</div>
          {desc ? <div className="text-white/50 text-sm mt-1">{desc}</div> : null}
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">{icon}</div>
      </div>
    </div>
  )
}

/* ------------------------- Main Component ------------------------- */

export function ComprehensiveAIDashboard() {
  const [airPrediction, setAirPrediction] = useState<AIRPrediction | null>(null)
  const [smartSchedule, setSmartSchedule] = useState<SmartSchedule | null>(null)

  // UPDATED term: Bio‑Rhythm Sync (formerly menstrual)
  const [bioRhythm, setBioRhythm] = useState<BioRhythmProfile | null>(null)

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'prediction' | 'schedule' | 'bio' | 'integration'>('prediction')

  /* ---------- API helpers ---------- */
  const generateAIRPrediction = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/air-prediction', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to generate AIR prediction')
      const result = await response.json()
      if (result?.success) setAirPrediction(result.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const generateSmartSchedule = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/smart-schedule', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to generate smart schedule')
      const result = await response.json()
      if (result?.success) setSmartSchedule(result.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Derived helpers ---------- */
  const daysToNeet = useMemo(() => {
    const exam = new Date('2026-05-03').getTime()
    return Math.max(0, Math.ceil((exam - Date.now()) / (1000 * 60 * 60 * 24)))
  }, [])

  // UPDATED palette mapping: low=Emerald, medium=Blue, high=Rose
  const riskTone = (risk: AIRPrediction['riskAssessment'] | undefined) => {
    if (risk === 'low') return 'emerald'
    if (risk === 'medium') return 'blue'
    if (risk === 'high') return 'rose'
    return 'slate'
  }

  const intensityTone = (intensity: 'high' | 'medium' | 'low') => {
    if (intensity === 'low') return 'emerald'
    if (intensity === 'medium') return 'blue'
    return 'rose'
  }

  const getCurrentBioPhase = () => {
    if (!bioRhythm) return 'Unknown'
    if (bioRhythm.cycleLength <= 0) return 'Unknown'

    const cycleStart = new Date(bioRhythm.cycleStartDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceStart % bioRhythm.cycleLength) + 1

    if (bioRhythm.periodLength > 0 && cycleDay <= bioRhythm.periodLength) return 'Menstrual'
    if (cycleDay <= 13) return 'Follicular'
    if (cycleDay <= 16) return 'Ovulation'
    return 'Luteal'
  }

  /* ---------- Initial load ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [airRes, cycleRes] = await Promise.all([fetch('/api/air-prediction'), fetch('/api/menstrual-cycle')])

        if (airRes.ok) {
          const airJson = await airRes.json()
          if (airJson?.success) setAirPrediction(airJson.data)
        }

        if (cycleRes.ok) {
          const cycleJson = await cycleRes.json()
          const first = Array.isArray(cycleJson?.data) ? cycleJson.data[0] : cycleJson?.data
          if (first) setBioRhythm(first)
        }
      } catch (e) {
        console.error('Error loading dashboard data:', e)
      }
    }

    load()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-8">
      {/* UPDATED: Blue/Cyan/Indigo glow (professional) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-blue-600/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 w-[520px] h-[520px] bg-cyan-600/10 blur-[110px]" />
        <div className="absolute top-1/3 left-1/3 w-[520px] h-[520px] bg-indigo-600/10 blur-[110px]" />
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center border border-white/10">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              AI Success Engine
            </div>
            <div className="text-white/50 text-sm">NEET UG 2026 • Predictive analytics & scheduling</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatTile
          label="Predicted AIR"
          value={airPrediction ? airPrediction.predictedAIR.toLocaleString() : '—'}
          desc="Model output from current inputs"
          icon={<Trophy className="h-6 w-6 text-amber-300" />}
        />
        <StatTile
          label="Days to NEET"
          value={daysToNeet}
          desc="Countdown to exam day"
          icon={<Clock className="h-6 w-6 text-cyan-300" />}
        />
        <StatTile
          label="Bio‑Rhythm Phase"
          value={getCurrentBioPhase()}
          desc="Physiological phase indicator"
          icon={<Heart className="h-6 w-6 text-rose-300" />}
        />
        <StatTile
          label="Energy Index"
          value={bioRhythm ? `${bioRhythm.energyLevel}/10` : '—'}
          desc="Self‑reported capacity today"
          icon={<Activity className="h-6 w-6 text-emerald-300" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={activeTab === 'prediction'} onClick={() => setActiveTab('prediction')} icon={<Target className="h-4 w-4" />} label="AIR Prediction" />
        <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar className="h-4 w-4" />} label="Smart Schedule" />
        <TabButton active={activeTab === 'bio'} onClick={() => setActiveTab('bio')} icon={<Heart className="h-4 w-4" />} label="Bio‑Rhythm Sync" />
        <TabButton active={activeTab === 'integration'} onClick={() => setActiveTab('integration')} icon={<Sparkles className="h-4 w-4" />} label="Life Integration" />
      </div>

      {/* Prediction Tab */}
      {activeTab === 'prediction' && (
        <CardShell
          title={
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-300" />
              AIR Prediction
            </div>
          }
          subtitle="Forecast based on performance signals, trajectory, and risk envelope"
          right={
            <PrimaryButton onClick={generateAIRPrediction} disabled={loading}>
              <Sparkles className="h-4 w-4" />
              {loading ? 'Analyzing…' : 'Generate'}
            </PrimaryButton>
          }
        >
          {airPrediction ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-white/60 text-sm">Predicted Rank</div>
                    <div className="text-4xl font-extrabold text-white">AIR {airPrediction.predictedAIR.toLocaleString()}</div>
                    <div className="mt-3">
                      <Pill tone={riskTone(airPrediction.riskAssessment)}>{airPrediction.riskAssessment.toUpperCase()} RISK</Pill>
                    </div>
                  </div>

                  <div className="md:w-72 w-full">
                    <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                      <span>Confidence</span>
                      <span className="font-mono">
                        {(Math.max(0, Math.min(1, airPrediction.confidenceScore)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar value={airPrediction.confidenceScore * 100} colorClass="bg-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Star className="h-5 w-5 text-blue-300" />
                    Key factors
                  </div>
                  <div className="space-y-2">
                    {airPrediction.keyFactors.map((k, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/85">
                        {k}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Flame className="h-5 w-5 text-rose-300" />
                    Recommendations
                  </div>
                  <div className="space-y-2">
                    {airPrediction.recommendations.map((r, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/85 flex gap-2">
                        <Zap className="h-4 w-4 text-cyan-300 mt-0.5 shrink-0" />
                        <div>{r}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Trophy className="h-5 w-5 text-amber-300" />
                  Milestones
                </div>
                <div className="space-y-2">
                  {airPrediction.milestones.map((m, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-white font-semibold">{m.target}</div>
                        <Pill tone="blue">{new Date(m.date).toLocaleDateString()}</Pill>
                      </div>
                      <div className="text-white/70 mt-2">{m.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white/70 text-sm">
              No prediction available yet. Generate to produce an AIR forecast.
            </div>
          )}
        </CardShell>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <CardShell
          title={
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-300" />
              Smart Schedule
            </div>
          }
          subtitle="Adaptive daily plan with energy-aware intensity management"
          right={
            <PrimaryButton onClick={generateSmartSchedule} disabled={loading}>
              <Brain className="h-4 w-4" />
              {loading ? 'Optimizing…' : 'Generate'}
            </PrimaryButton>
          }
        >
          {smartSchedule ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-white font-semibold">Today’s schedule</div>
                <div className="space-y-2">
                  {smartSchedule.dailySchedule.map((s, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill tone="slate">{s.timeSlot}</Pill>
                          <div className="text-white font-semibold">
                            {s.subject} • {s.activity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pill tone={intensityTone(s.intensity)}>{s.intensity.toUpperCase()}</Pill>
                          <span className="text-white/60 text-sm font-mono">{s.duration} min</span>
                        </div>
                      </div>
                      <div className="text-white/70 mt-2">{s.reasoning}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-white font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-300" />
                  Low‑energy fallback protocol
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-white/80">
                  {smartSchedule.emergencyPlan}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white/70 text-sm">No schedule yet. Generate to create one.</div>
          )}
        </CardShell>
      )}

      {/* Bio‑Rhythm Tab */}
      {activeTab === 'bio' && (
        <CardShell
          title={
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-300" />
              Bio‑Rhythm Sync
            </div>
          }
          subtitle="Phase + capacity indicators for pacing, recovery, and workload allocation"
        >
          {bioRhythm ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-white font-semibold text-lg">{getCurrentBioPhase()} phase</div>
                <div className="text-white/60 text-sm mt-1">
                  Start date: <span className="font-mono">{bioRhythm.cycleStartDate}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-white/80 text-sm flex items-center justify-between">
                  <span>Energy index</span>
                  <span className="font-mono">{bioRhythm.energyLevel}/10</span>
                </div>
                <ProgressBar value={(bioRhythm.energyLevel / 10) * 100} colorClass="bg-emerald-400" />

                <div className="text-white/80 text-sm flex items-center justify-between mt-4">
                  <span>Study capacity</span>
                  <span className="font-mono">{bioRhythm.studyCapacity}/10</span>
                </div>
                <ProgressBar value={(bioRhythm.studyCapacity / 10) * 100} colorClass="bg-blue-400" />
              </div>

              {bioRhythm.symptoms?.length ? (
                <div className="space-y-2">
                  <div className="text-white font-semibold">Symptoms</div>
                  <div className="flex flex-wrap gap-2">
                    {bioRhythm.symptoms.map((s, i) => (
                      <Pill key={i} tone="slate">
                        {s}
                      </Pill>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-white/70 text-sm">
              No bio‑rhythm data found from <span className="font-mono">/api/menstrual-cycle</span>.
            </div>
          )}
        </CardShell>
      )}

      {/* Integration Tab */}
      {activeTab === 'integration' && (
        <CardShell
          title={
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              Life Integration
            </div>
          }
          subtitle="Replace placeholders with your real constraints (festivals, exams, commute, etc.)"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-white font-semibold">Upcoming events</div>
              <div className="text-white/70 text-sm mt-2">Add event windows and constraints here.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-white font-semibold">Academic commitments</div>
              <div className="text-white/70 text-sm mt-2">Add timetable and assessment periods here.</div>
            </div>
          </div>
        </CardShell>
      )}
    </motion.div>
  )
}

export default ComprehensiveAIDashboard
