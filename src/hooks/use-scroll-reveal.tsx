'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Custom hook for scroll reveal animations
 * Optimized for 60fps performance with GPU acceleration
 */
export function useScrollReveal(options?: {
  once?: boolean
  margin?: string
  amount?: number | 'some' | 'all'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin ?? '-50px') as any,
    amount: options?.amount ?? 0.3,
  })

  return { ref, isInView }
}

/**
 * Scroll reveal animation variants
 */
export const scrollRevealVariants = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 30,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
  },

  // Fade in from left
  fadeInLeft: {
    hidden: { 
      opacity: 0, 
      x: -30,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
  },

  // Fade in from right
  fadeInRight: {
    hidden: { 
      opacity: 0, 
      x: 30,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
  },

  // Scale in
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
  },

  // Fade in only
  fadeIn: {
    hidden: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
  },

  // Stagger container
  staggerContainer: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },

  // Stagger item
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  },
}
