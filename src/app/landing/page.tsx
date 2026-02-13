'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-blue-950 relative overflow-hidden">
      {/* Optimized Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-transparent" />
        
        {/* Simplified floating hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/20 text-4xl pointer-events-none"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🩺
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <motion.div 
          style={{ y, opacity }}
          className="flex-1 flex items-center justify-center px-6"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🩺
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
               <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
                  Future Doctor,
                </span>
                <br />
                <span className="text-white font-light">
                  Aapka
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  NEET Journey
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl md:text-2xl text-white/70 font-light mb-12 leading-relaxed"
              >
                Har question, har chapter, har sapna...<br />
                <span className="text-blue-300">Har ek minute ki mehnat aapko aapki manzil—the White Coat—ke kareeb le jayegi.</span>
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Link href="/auth/signin">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xl font-semibold rounded-full shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Chalo shuru karte hain</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="px-6 py-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🩺
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Future Doctor’s Companion
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                  <p className="text-center">
                    Jab bhi aap ye app khologe, yaad rakhna ki ye sirf ek tracker nahi hai.
                    <br />
                    <span className="text-blue-300 font-semibold">Ye aapki mehnat aur Doctor banne ke sapne ka ek hissa hai.</span>
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 my-12">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30"
                    >
                      <div className="text-4xl mb-3">🎯</div>
                      <div className="text-2xl font-bold text-white mb-2">2026</div>
                      <div className="text-blue-200">Aapka saal</div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl border border-purple-400/30"
                    >
                      <div className="text-4xl mb-3">👩⚕️</div>
                      <div className="text-2xl font-bold text-white mb-2">Dr. </div>
                      <div className="text-purple-200">Aapka sapna</div>
                    </motion.div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-400/20">
                    <p className="text-xl text-blue-200 italic">
                      "Har question jo aap solve karoge,<br />
                      Har chapter jo aap padhoge,<br />
                      <span className="text-white font-semibold">Dr.  ke sapne ko aur paas le aayega."</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="px-6 py-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Har Aspirant Ki Zaroorat
              </h3>
              <p className="text-xl text-white/70">
                Banaya gaya hai aapki consistency aur focus ko badhane ke liye.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { emoji: "📚", title: "Complete NEET Tracking", desc: "Physics, Chemistry, Biology - sab kuch ek jagah" },
                { emoji: "📊", title: "Real-time Progress", desc: "Aapki mehnat ka har pal ka hisaab" },
                { emoji: "🎉", title: "Celebration Moments", desc: "Har 250 questions pe aapke liye party" },
                { emoji: "🧠", title: "Mental Wellness", desc: "Prep ke stress mein aapka mindset sahi rehna sabse zaroori hai" },
                { emoji: "⏰", title: "NEET 2026 Timer", desc: "Har second count karta hai" },
                { emoji: "💌", title: "Daily Dose of Motivation", desc: "Roz aapke liye kuch khaas" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.emoji}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-white/70">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final Promise Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="px-6 py-20"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  🤝
                </motion.div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  Hamari Commitment
                </h3>
                
                <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
                  <p>
                    Hum hamesha aapke saath rahenge - har subah, har raat,
                    <br />
                    har mushkil mein, har khushi mein.
                  </p>
                  
                  <p>
                    Ye app aapki progress track karega, wins celebrate karega,
                    <br />
                    aur jab aap burnout mehsoos karoge, toh aapko sahi raasta dikhayega.
                  </p>
                  
                  <div className="my-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30">
                    <p className="text-2xl text-blue-200 font-semibold">
                      Kyunki aapka sapna ab sirf aapka nahi,
                      <br />
                      <span className="text-white">Hamara hai.</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [0, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                      className="text-2xl"
                    >
                      🩺
                    </motion.div>
                  ))}
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-blue-300 font-semibold mt-8"
                >
                  Chalo Dr. ko real banate hain - saath mein.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="text-center py-8 px-6">
          <p className="text-white/50 text-sm">
            made with a hope  ♡
          </p>
        </div>
      </div>
    </div>
  )
}
