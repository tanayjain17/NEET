/**
 * Ultra-optimized Framer Motion configuration for 120fps-ready animations
 * Apple-inspired motion design with maximum GPU acceleration
 */

// Apple's signature easing curves
export const appleEase = [0.16, 1, 0.3, 1] as const
export const appleEaseOut = [0.19, 1, 0.22, 1] as const
export const appleEaseIn = [0.42, 0, 1, 1] as const

// Ultra-responsive spring (lighter, faster)
export const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
  mass: 0.6,
}

// Smooth tween (shorter duration)
export const smoothTransition = {
  type: "tween" as const,
  duration: 0.25,
  ease: appleEase,
}

// Quick transition for interactions
export const quickTransition = {
  type: "tween" as const,
  duration: 0.15,
  ease: appleEaseOut,
}

// Fade in with upward motion
export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: smoothTransition,
}

// Simple fade
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: appleEase },
}

// Scale with fade
export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: smoothTransition,
}

// Ultra-responsive hover (Apple-style)
export const hoverScale = {
  whileHover: { 
    scale: 1.02, 
    y: -2,
    transition: quickTransition
  },
  whileTap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
}

// Gentle hover (for cards)
export const hoverLift = {
  whileHover: { 
    y: -4,
    transition: quickTransition
  },
  whileTap: { 
    scale: 0.99,
    transition: { duration: 0.1 }
  },
}

// Fast stagger (minimal delay)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

// Reduced motion for accessibility
export const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 },
}

// Layout animation (ultra-fast)
export const layoutTransition = {
  type: "spring" as const,
  stiffness: 600,
  damping: 32,
}

// Slide animations
export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: smoothTransition,
}

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: smoothTransition,
}

// Global motion config for Framer Motion
export const motionConfig = {
  // Reduce motion for better performance
  reducedMotion: "user",
  // Use GPU acceleration
  transformPagePoint: (point: { x: number; y: number }) => point,
}
