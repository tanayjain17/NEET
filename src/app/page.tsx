'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Core Layout & Navigation
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import SubjectsGrid from '@/components/dashboard/subjects-grid'

// AI & Analytics Layers
import { QuestionAnalyticsCard } from '@/components/analytics/question-analytics-card'
import { ClinicalMotivationBriefings } from '@/components/analytics/clinical-motivation-briefings'
import { QuestionMilestoneNotification } from '@/components/analytics/question-milestone-notification'
import ProfessionalMotivationCard from '@/components/ui/professional-motivation-card'
import RealTimeAnalytics from '@/components/dashboard/real-time-analytics'
import AIR50CycleSummary from '@/components/dashboard/air50-cycle-summary'

// Operational Trackers
import DailyGoalsCard from '@/components/dashboard/daily-goals-card'
import YesterdayPerformance from '@/components/dashboard/yesterday-performance'
import StudyStreakTracker from '@/components/enhanced/study-streak-tracker'
import QuestionProgressTracker from '@/components/enhanced/question-progress-tracker'
import NEETCountdownTimer from '@/components/ui/neet-countdown-timer'

// Cognitive & Strategic Tools
import PomodoroTimer from '@/components/enhanced/pomodoro-timer'
import WeakTopicIdentifier from '@/components/enhanced/weak-topic-identifier'
import { CompetitiveEdgeSystem } from '@/components/competitive/edge-system'

// Wellness & Bio-Sync
import { WellnessBalanceSystem } from '@/components/wellness/balance-system'
import { DailyWisdom } from '@/components/wellness/daily-wisdom'

// Icons
import { 
  Activity, 
  Zap, 
  Target, 
  BookOpen, 
  Brain, 
  Microscope, 
  ShieldCheck, 
  Timer,
  ChevronRight
} from 'lucide-react'

export default function ClinicalDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/landing')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
          <ShieldCheck className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-slate-200 font-black uppercase tracking-[0.3em] text-xs">Clinical Intelligence Engine</p>
          <p className="text-slate-500 font-mono text-[10px] uppercase">Authenticating Protocol v2.6...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <>
      <QuestionMilestoneNotification />
      <DashboardLayout
        title="Diagnostic Command Center"
        subtitle="Operational Performance Suite: Target AIIMS Delhi 2026"
      >
        <div className="space-y-8 pb-12">
          
          {/* 1. EXECUTIVE TIER: BRIEFING & TEMPORAL MONITOR */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 relative overflow-hidden shadow-2xl"
              >
                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:3rem_3rem]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Brain className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">Authorized Personnel</p>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                          Aspirant <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent underline decoration-blue-500/30 underline-offset-8">{session.user?.name || 'Medical Professional'}</span>
                        </h2>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                      Trajectory analysis confirms alignment with <strong className="text-white">AIR &lt; 50</strong> benchmarks. 
                      Syllabus consolidation protocols are active across all 4 clinical quadrants.
                    </p>
                  </div>
                  
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 shadow-inner min-w-[160px]">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center">System Alert Status</div>
                    <div className="text-emerald-400 font-mono font-bold flex items-center justify-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      NOMINAL PREP
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-1">
              <NEETCountdownTimer />
            </div>
          </div>

          {/* 2. ANALYTICS TIER: REAL-TIME TELEMETRY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <RealTimeAnalytics />
          </div>

          {/* 3. PERFORMANCE BRIEFINGS LAYER */}
          <ClinicalMotivationBriefings />

          {/* 4. CORE OPERATIONAL TIER: MASTERY & DEFICITS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-10">
              {/* Module Competency */}
              <div>
                <div className="flex items-center justify-between mb-6 px-1">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Microscope className="h-4 w-4 text-blue-500" />
                    Curriculum Competency Quadrants
                  </h3>
                  <div className="h-[1px] flex-grow mx-6 bg-white/5" />
                </div>
                <SubjectsGrid />
              </div>
              
              {/* Cognitive Loaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Timer className="h-4 w-4 text-amber-500" />
                    Focus Interval Protocol
                  </h3>
                  <PomodoroTimer />
                </div>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Target className="h-4 w-4 text-rose-500" />
                    Clinical Deficit Audit
                  </h3>
                  <WeakTopicIdentifier />
                </div>
              </div>

              {/* Bio-Rhythm Management */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Activity className="h-4 w-4 text-purple-500" />
                  Bio-Rhythm & Wellness Homeostasis
                </h3>
                <WellnessBalanceSystem />
              </div>
            </div>

            {/* Side Statistical Pillar */}
            <div className="lg:col-span-4 space-y-6">
              <QuestionProgressTracker />
              <AIR50CycleSummary />
              <StudyStreakTracker />
              <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl">
                <DailyGoalsCard />
              </div>
              <YesterdayPerformance />
              <QuestionAnalyticsCard />
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="pt-4"
              >
                <ProfessionalMotivationCard showHeader={false} variant="default" />
              </motion.div>
            </div>
          </div>

          {/* 5. STRATEGIC INSIGHTS TIER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10 border-t border-white/5">
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <Zap className="h-4 w-4 text-blue-400" />
                Spiritual Optimization Wisdom
              </h3>
              <DailyWisdom />
            </div>
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Competitive Position Diagnostics
              </h3>
              <CompetitiveEdgeSystem />
            </div>
          </div>

          {/* 6. RAPID EXECUTION SHORTCUTS */}
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-white/5 mt-10">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 text-center">
              Protocol Execution Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProtocolActionCard 
                label="Module Sync" 
                detail="Update syllabus completion data."
                uri="/subjects" 
                icon={<BookOpen className="h-4 w-4" />}
              />
              <ProtocolActionCard 
                label="Volume Archive" 
                detail="Log daily question execution."
                uri="/daily-goals" 
                icon={<Target className="h-4 w-4" />}
              />
              <ProtocolActionCard 
                label="Score Entry" 
                detail="Initialize performance audit."
                uri="/tests" 
                icon={<Activity className="h-4 w-4" />}
              />
              <ProtocolActionCard 
                label="State Log" 
                detail="Record bio-rhythm metadata."
                uri="/wellness" 
                icon={<Zap className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

function ProtocolActionCard({ label, detail, uri, icon }: { label: string, detail: string, uri: string, icon: React.ReactNode }) {
  return (
    <Link href={uri} className="group">
      <div className="h-full p-5 bg-slate-950/40 border border-white/5 rounded-2xl hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
            {icon}
          </div>
          <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
        <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-widest mb-1.5">{label}</h4>
        <p className="text-[10px] text-slate-600 leading-relaxed group-hover:text-slate-400 transition-colors">
          {detail}
        </p>
      </div>
    </Link>
  )
}