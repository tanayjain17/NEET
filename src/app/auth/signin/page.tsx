'use client'

import { useState, useMemo } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, Mail, ChevronLeft, Database, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorType, setErrorType] = useState<'NONE' | 'CREDENTIALS' | 'SYSTEM' | 'INCOMPLETE'>('NONE')
  const router = useRouter()

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorType('INCOMPLETE')
      return
    }
    
    setIsLoading(true)
    setErrorType('NONE')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setErrorType('CREDENTIALS')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setErrorType('SYSTEM')
    } finally {
      setIsLoading(false)
    }
  }

  // Optimized Error Context Mapper
  const errorContext = useMemo(() => {
    const map = {
      NONE: null,
      INCOMPLETE: { label: 'REGISTRY ERROR', msg: 'Identification parameters required.' },
      CREDENTIALS: { label: 'ACCESS DENIED', msg: 'Invalid clinical credentials provided.' },
      SYSTEM: { label: 'GATEWAY ERROR', msg: 'Secure server synchronization failed.' }
    }
    return map[errorType]
  }, [errorType])

  return (
    <div className="min-h-[100dvh] bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* 1. Performance-Optimized Background: Hardware Accelerated */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] will-change-transform" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Navigation Layer */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <Link 
            href="/landing" 
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Portal Exit
          </Link>
        </motion.div>

        {/* 2. Clinical Terminal: Mobile-First Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Progress Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
             {isLoading && (
               <motion.div 
                 className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 style={{ width: '40%' }}
               />
             )}
          </div>
          
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 shadow-inner">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-1">
              Clinical Access
            </h1>
            <p className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em]">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-4 sm:space-y-5">
            {/* Input Groups with Touch-Target Optimization */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Registry Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-slate-950/50 border border-white/5 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all font-mono text-sm"
                  placeholder="name@institute.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Security Token</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-slate-950/50 border border-white/5 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all font-mono text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* 3. Contextual Error Feedback Layer */}
            <AnimatePresence mode="wait">
              {errorContext && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] font-black text-rose-500 uppercase tracking-tighter">{errorContext.label}</div>
                      <div className="text-rose-200/70 text-[11px] leading-tight">{errorContext.msg}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-900/20 active:bg-blue-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  Initialize Link
                </>
              )}
            </motion.button>
          </form>

          {/* Verification Footer */}
          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
               <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-950/50 border border-white/5 rounded-full">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Encrypted v2.6</span>
               </div>
               <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">AIIMS DELHI TRAJECTORY: ACTIVE</span>
             </div>
          </div>
        </motion.div>

        {/* Tactical Axiom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center px-4"
        >
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.25em] leading-relaxed">
            "Preparation is the strategic mitigation of future clinical risk."
          </p>
        </motion.div>
      </div>
    </div>
  )
}