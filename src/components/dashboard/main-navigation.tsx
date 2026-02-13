'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  LightBulbIcon,
  HomeIcon,
  AcademicCapIcon,
  FlagIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    description: 'Overview and progress',
    color: 'from-blue-500 to-cyan-500',
    emoji: '🏠'
  },
  {
    name: 'Daily Goals',
    href: '/daily-goals',
    icon: FlagIcon,
    description: 'Track daily progress',
    color: 'from-green-500 to-emerald-500',
    emoji: '🎯'
  },
  {
    name: 'Tests',
    href: '/tests',
    icon: AcademicCapIcon,
    description: 'Performance analytics',
    color: 'from-purple-500 to-pink-500',
    emoji: '📊'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Question insights',
    color: 'from-orange-500 to-red-500',
    emoji: '📈'
  },
  {
    name: 'Mood Calendar',
    href: '/mood',
    icon: CalendarDaysIcon,
    description: 'Daily mood tracking',
    color: 'from-pink-500 to-rose-500',
    emoji: '😊'
  },
  {
    name: 'AI Insights',
    href: '/insights',
    icon: LightBulbIcon,
    description: 'Smart recommendations',
    color: 'from-yellow-500 to-amber-500',
    emoji: '🤖'
  },
  {
    name: 'Achievements',
    href: '/achievements',
    icon: TrophyIcon,
    description: 'Badges & rewards',
    color: 'from-amber-500 to-yellow-500',
    emoji: '🏆'
  }
]

export default function MainNavigation() {
  const pathname = usePathname()

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card p-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className={`
                  nav-item group relative block p-5 rounded-2xl transition-all duration-300 transform-gpu
                  ${isActive 
                    ? 'glass-effect border border-primary/30 shadow-glow text-primary' 
                    : 'bg-background-secondary/30 border border-gray-700/30 text-foreground-secondary hover:text-foreground hover:border-primary/20'
                  }
                `}
              >
                {/* Background Gradient Overlay */}
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  bg-gradient-to-br ${item.color}
                `} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center space-y-3">
                  {/* Icon Container */}
                  <div className="relative">
                    <motion.div
                      className={`
                        p-3 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-primary/20 shadow-glow' 
                          : 'bg-background-tertiary/50 group-hover:bg-primary/10'
                        }
                      `}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    
                    {/* Emoji Badge */}
                    <motion.div
                      className="absolute -top-1 -right-1 text-sm"
                      animate={{ 
                        rotate: isActive ? [0, 10, -10, 0] : 0,
                        scale: isActive ? [1, 1.2, 1] : 1
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: isActive ? Infinity : 0 
                      }}
                    >
                      {item.emoji}
                    </motion.div>
                  </div>

                  {/* Text Content */}
                  <div className="text-center space-y-1">
                    <motion.div 
                      className="text-sm font-semibold"
                      animate={{ 
                        color: isActive ? '#3b82f6' : undefined 
                      }}
                    >
                      {item.name}
                    </motion.div>
                    <div className="text-xs opacity-70 leading-tight">
                      {item.description}
                    </div>
                  </div>
                </div>

                {/* Active Indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full shadow-glow"
                    >
                      <motion.div
                        className="w-full h-full bg-primary rounded-full"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity 
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`
                    absolute inset-0 rounded-2xl blur-xl
                    bg-gradient-to-br ${item.color} opacity-20
                  `} />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-4 border-t border-white/10"
      >
        <div className="flex items-center justify-center gap-6 text-xs text-foreground-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 border border-primary/50 border-t-primary rounded-full"
            />
            <span>Real-time sync active</span>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  )
}