'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import LogoutButton from '@/components/auth/logout-button'
import CountdownTimer from './countdown-timer'
import MainNavigation from './main-navigation'
import { LoadingSpinner } from '@/components/ui/enhanced-components'
import { Container } from '@/components/ui/premium-layouts'
import { Activity, Brain, Dna, Stethoscope, Zap } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

// Floating particles background (Medical Theme)
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          initial={{ 
            x: Math.random() * 100 + 'vw', 
            y: Math.random() * 100 + 'vh',
            scale: 0.5 
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          {/* Random Medical Icons as particles */}
          {i % 3 === 0 ? (
            <Dna className="h-6 w-6 text-cyan-500" />
          ) : i % 3 === 1 ? (
            <Activity className="h-4 w-4 text-blue-500" />
          ) : (
            <div className="w-1 h-1 bg-indigo-400 rounded-full" />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Enhanced Header Component
const DashboardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-lg"
    >
      <Container size="full" padding="md">
        <div className="flex justify-between items-center">
          {/* Logo and Title Section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.2)",
                    "0 0 30px rgba(6, 182, 212, 0.4)",
                    "0 0 20px rgba(6, 182, 212, 0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Stethoscope className="text-white h-7 w-7" />
              </motion.div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            
            <div>
              <motion.h1 
                className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white"
                style={{ backgroundSize: '200% auto' }}
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </motion.div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10"
            >
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 font-medium">Session Status</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="h-8 w-[1px] bg-white/10 mx-1" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Target</span>
                <span className="text-sm font-bold text-white">AIIMS Delhi</span>
              </div>
            </motion.div>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </Container>
    </motion.header>
  )
}

// Enhanced Footer Component
const DashboardFooter = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-20 border-t border-white/10 bg-slate-950/50 backdrop-blur-sm"
    >
      <Container size="full" padding="lg">
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <Brain className="h-5 w-5 text-cyan-500" />
            <p className="text-slate-300 font-medium">
              Powered by Advanced Rank Prediction Engine
            </p>
          </motion.div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 uppercase tracking-widest">
            <span>© 2026 NEET Analytics</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Precision Data</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <motion.span
              className="text-cyan-400 font-bold cursor-default"
              whileHover={{ color: '#ffffff' }}
            >
              Future Doctor Profile Active
            </motion.span>
          </div>
        </div>
      </Container>
    </motion.footer>
  )
}

export default function DashboardLayout({
  children,
  title = "NEET Intelligence",
  subtitle = "Performance Dashboard"
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        <FloatingParticles />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-6 p-8 text-center max-w-md"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
            <LoadingSpinner size="lg" variant="orbit" />
          </div>
          
          <div>
            <motion.h2 
              className="text-xl font-bold text-white mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Initializing Neural Engine...
            </motion.h2>
            <p className="text-slate-400 text-sm">
              Syncing academic metrics and bio-rhythm data
            </p>
          </div>
          
          <div className="flex gap-2">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            >
              <Dna className="h-6 w-6 text-indigo-500" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            >
              <Brain className="h-6 w-6 text-blue-500" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            >
              <Zap className="h-6 w-6 text-cyan-500" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Enhanced Header */}
      <DashboardHeader title={title} subtitle={subtitle} />

      {/* Main Content */}
      <main className="relative z-10">
        <Container size="full" padding="lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Enhanced Countdown Timer */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CountdownTimer />
            </motion.div>

            {/* Enhanced Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MainNavigation />
            </motion.div>

            {/* Page Content with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key="dashboard-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Container>
      </main>

      {/* Enhanced Footer */}
      <DashboardFooter />
    </div>
  )
}