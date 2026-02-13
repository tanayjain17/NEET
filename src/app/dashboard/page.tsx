'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useProductionSync } from '@/hooks/use-production-sync'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import SubjectsGrid from '@/components/dashboard/subjects-grid'
import { QuestionAnalyticsCard } from '@/components/analytics/question-analytics-card'
import { MotivationalMessages } from '@/components/analytics/motivational-messages'
import { QuestionMilestoneNotification } from '@/components/analytics/question-milestone-notification'
import MotivationCard from '@/components/ui/motivation-card'
import DailyGoalsCard from '@/components/dashboard/daily-goals-card'
import YesterdayPerformance from '@/components/dashboard/yesterday-performance'
import RealTimeAnalytics from '@/components/dashboard/real-time-analytics'
import BackupManager from '@/components/backup/backup-manager'
import SyncIndicator from '@/components/dashboard/sync-indicator'
import {
  SparklesIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

// Adaptive Theme based on Indian Standard Time (IST)
const getTimeBasedTheme = () => {
  const now = new Date()
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
  const hour = istTime.getHours()
  if (hour >= 5 && hour < 12) return 'morning'   // Sunrise energy
  if (hour >= 12 && hour < 17) return 'day'      // Focused study
  if (hour >= 17 && hour < 21) return 'evening'  // Golden hour calm
  return 'night'                                 // Deep focus & rest
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [theme, setTheme] = useState<'morning' | 'day' | 'evening' | 'night'>('day')
  const { triggerSync } = useProductionSync()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/landing')
    }
    setTheme(getTimeBasedTheme())
  }, [session, status, router])

  // Re-calculate theme every minute
  useEffect(() => {
    const interval = setInterval(() => setTheme(getTimeBasedTheme()), 60000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-600 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-t-blue-500 border-r-purple-500 border-b-cyan-500 border-l-transparent rounded-full"
        />
        <p className="absolute text-white text-xl mt-32 font-light">Loading your study universe... ♡</p>
      </div>
    )
  }

  const quickActions = [
    { href: '/daily-goals', icon: ChartBarIcon, title: 'Aaj ke Goals', desc: 'Questions & targets', emoji: '🎯', gradient: 'from-emerald-500 to-teal-600' },
    { href: '/tests', icon: AcademicCapIcon, title: 'Test Scores', desc: 'Tumhara performance', emoji: '📊', gradient: 'from-purple-500 to-blue-600' },
    { href: '/subjects/physics', icon: SparklesIcon, title: 'Padhai Shuru', desc: 'Chalo padhte hain', emoji: '📚', gradient: 'from-blue-500 to-cyan-500' },
    { href: '/mood', icon: HeartIcon, title: 'Wellness Check', desc: 'Track your mental energy', emoji: '🧠', ... },
    { href: '/pomodoro', icon: ClockIcon, title: 'Focus Time', desc: 'Deep study session', emoji: '⏱', gradient: 'from-orange-500 to-red-600' },
  ]

  // Theme-based background layers
  const themeGradients = {
    morning: 'from-orange-400/20 via-yellow-300/20 to-cyan-500/20',
    day: 'from-blue-500/20 via-cyan-400/20 to-teal-500/20',
    evening: 'from-amber-500/30 via-orange-500/20 to-purple-600/20',
    night: 'from-indigo-600/30 via-purple-700/30 to-blue-600/20',
  }

  return (
    <>
      <QuestionMilestoneNotification />

      {/* Full-screen Spatial Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${themeGradients[theme]} blur-3xl`} />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/20 to-transparent rounded-full"
        />
        <motion.div
          animate={{ rotate: [-360, 0] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-96 -right-96 w-[1000px] h-[1000px] bg-gradient-radial from-cyan-500/20 to-transparent rounded-full"
        />
      </div>

      <DashboardLayout
        title="Dashboard"
        subtitle="Every question brings you closer to the white coat"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pb-12"
        >
          {/* Immersive Hero – Vision Pro Style with Romantic Touch */}
          <motion.section
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="relative isolate"
          >
            <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-cyan-500/20" />
              
              {/* Floating hearts background */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-blue-500/20 text-2xl pointer-events-none"
                    style={{
                      left: `${10 + i * 12}%`,
                      top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 6 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🩺
                  </motion.div>
                ))}
              </div>
              
              <div className="relative p-10 md:p-16 lg:p-20">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="flex items-center gap-4 mb-6"
                >
                  <motion.span 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-5xl"
                  >
                    {theme === 'morning' ? '🌅' : theme === 'evening' ? '🌇' : theme === 'night' ? '🌙' : '✨'}
                  </motion.span>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    {theme === 'morning' ? 'Subah bakhair' : 
                     theme === 'day' ? 'Namaskar' : 
                     theme === 'evening' ? 'Shaam mubarak' : 
                     'Good night'}, 
                  </h1>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed mb-10"
                >
                  {theme === 'morning' ? 'Aaj ka din naye targets achieve karne ka hai. Consistency is key.' :
                   theme === 'day' ? 'Padhai mein focus rakho... Har question tumhe success ke paas le ja raha hai.' :
                   theme === 'evening' ? 'Aaj ki progress track karo. Chhoti jeet bhi important hoti hai.' :
                   'Rest karo, kal phir se mehnat karenge. Tumhara Dr. banne ka sapna haqeeqat banayenge.'} ♡
                </motion.p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/insights">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 flex items-center gap-3 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <RocketLaunchIcon className="h-6 w-6 relative z-10" />
                      <span className="relative z-10">Ask AI Mentor</span>
                    </motion.button>
                  </Link>
                  <Link href="/analytics">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <span>Deep Analytics</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Floating Dynamic Islands */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {quickActions.map((action, i) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: i * 0.1 + 0.4, 
                    type: "spring", 
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative h-48 rounded-3xl overflow-hidden bg-black/30 backdrop-blur-3xl border border-white/10 shadow-xl cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-60 group-hover:opacity-90 transition-all duration-300`} />
                  
                  {/* Subtle floating particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(3)].map((_, pi) => (
                      <motion.div
                        key={pi}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                          left: `${20 + pi * 30}%`,
                          top: `${30 + pi * 20}%`,
                        }}
                        animate={{
                          y: [-10, 10, -10],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 3 + pi,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative h-full p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-3 rounded-2xl bg-white/20 backdrop-blur group-hover:bg-white/30 transition-all"
                      >
                        <action.icon className="h-8 w-8" />
                      </motion.div>
                      <motion.span
                        animate={{ 
                          rotate: [0, 15, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          delay: i * 0.3 
                        }}
                        className="text-4xl group-hover:scale-110 transition-transform"
                      >
                        {action.emoji}
                      </motion.span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors">{action.title}</h3>
                      <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">{action.desc}</p>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Real-time Analytics Island */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="relative rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Live Progress</h2>
              <p className="text-white/70 mb-6">Watching you grow in real-time ♡</p>
              <RealTimeAnalytics />
            </div>
          </motion.div>

          {/* Bento Grid – Spatial Layers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Subjects – Main Island */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="lg:col-span-8 rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-2">Subject Mastery</h2>
                <p className="text-white/70 mb-6">NEET syllabus, conquered chapter by chapter</p>
                <SubjectsGrid />
              </div>
            </motion.div>

            {/* Right Sidebar Islands */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Today's Mission</h3>
                <DailyGoalsCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Yesterday's Glory</h3>
                <YesterdayPerformance />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
              >
                <BackupManager />
              </motion.div>
            </div>
          </div>

          {/* Bottom Row – Emotional & Analytical */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Question Journey</h2>
              <QuestionAnalyticsCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="rounded-3xl bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-purple-600/20 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
            >
              <MotivationCard showName={true} />
            </motion.div>
          </div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="text-center py-16"
          >
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                 <span>Designed for Future Doctors</span>
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👩‍⚕️
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </DashboardLayout>
      <SyncIndicator />
    </>
  )
}