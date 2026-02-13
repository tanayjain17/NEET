'use client'

import { motion } from 'framer-motion'
import { useScrollReveal, scrollRevealVariants } from '@/hooks/use-scroll-reveal'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  variant?: keyof typeof scrollRevealVariants
  delay?: number
  duration?: number
  once?: boolean
  margin?: string
  amount?: number | 'some' | 'all'
  className?: string
}

/**
 * ScrollReveal component for smooth scroll animations
 * GPU-accelerated and optimized for 60fps performance
 */
export function ScrollReveal({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration,
  once = true,
  margin = '-50px',
  amount = 0.3,
  className,
}: ScrollRevealProps) {
  const { ref, isInView } = useScrollReveal({ once, margin, amount })
  
  const variants = scrollRevealVariants[variant]
  
  // Override duration if provided
  const customVariants = duration ? {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible.transition,
        duration,
        delay,
      }
    }
  } : {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible.transition,
        delay,
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants}
      className={className}
      style={{
        transform: 'translateZ(0)', // GPU acceleration
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealStagger component for staggered animations
 */
export function ScrollRevealStagger({
  children,
  delay = 0,
  staggerDelay = 0.05,
  once = true,
  margin = '-50px',
  amount = 0.3,
  className,
}: {
  children: ReactNode
  delay?: number
  staggerDelay?: number
  once?: boolean
  margin?: string
  amount?: number | 'some' | 'all'
  className?: string
}) {
  const { ref, isInView } = useScrollReveal({ once, margin, amount })

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealItem component for use inside ScrollRevealStagger
 */
export function ScrollRevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={scrollRevealVariants.staggerItem}
      className={className}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  )
}
