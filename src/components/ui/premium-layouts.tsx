'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Enhanced Grid Layout with Masonry Support
export const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cols?: 1 | 2 | 3 | 4 | 5 | 6
    gap?: 'sm' | 'md' | 'lg' | 'xl'
    masonry?: boolean
    responsive?: {
      sm?: 1 | 2 | 3 | 4 | 5 | 6
      md?: 1 | 2 | 3 | 4 | 5 | 6
      lg?: 1 | 2 | 3 | 4 | 5 | 6
      xl?: 1 | 2 | 3 | 4 | 5 | 6
    }
  }
>(({ 
  className, 
  cols = 1, 
  gap = 'md', 
  masonry = false,
  responsive,
  children,
  ...props 
}, ref) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  const responsiveClasses = responsive ? [
    responsive.sm && `sm:grid-cols-${responsive.sm}`,
    responsive.md && `md:grid-cols-${responsive.md}`,
    responsive.lg && `lg:grid-cols-${responsive.lg}`,
    responsive.xl && `xl:grid-cols-${responsive.xl}`
  ].filter(Boolean).join(' ') : ''

  if (masonry) {
    return (
      <div
        ref={ref}
        className={cn(
          "columns-1 md:columns-2 lg:columns-3 xl:columns-4",
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="break-inside-avoid mb-4"
          >
            {child}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid",
        colClasses[cols],
        gapClasses[gap],
        responsiveClasses,
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
})
Grid.displayName = "Grid"

// Enhanced Stack Layout
export const Stack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: 'vertical' | 'horizontal'
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    wrap?: boolean
  }
>(({ 
  className, 
  direction = 'vertical', 
  spacing = 'md', 
  align = 'stretch',
  justify = 'start',
  wrap = false,
  children,
  ...props 
}, ref) => {
  const spacingClasses = {
    xs: direction === 'vertical' ? 'space-y-1' : 'space-x-1',
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
    xl: direction === 'vertical' ? 'space-y-8' : 'space-x-8'
  }

  const alignClasses = {
    start: direction === 'vertical' ? 'items-start' : 'items-start',
    center: 'items-center',
    end: direction === 'vertical' ? 'items-end' : 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Stack.displayName = "Stack"

// Enhanced Container with Responsive Breakpoints
export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    center?: boolean
  }
>(({ 
  className, 
  size = 'xl', 
  padding = 'md',
  center = true,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8'
  }

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        sizeClasses[size],
        paddingClasses[padding],
        center && "mx-auto",
        className
      )}
      {...props}
    />
  )
})
Container.displayName = "Container"

// Enhanced Section with Background Variants
export const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    variant?: 'default' | 'glass' | 'gradient' | 'neumorphic'
    padding?: 'sm' | 'md' | 'lg' | 'xl'
    fullHeight?: boolean
  }
>(({ 
  className, 
  variant = 'default', 
  padding = 'lg',
  fullHeight = false,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-background',
    glass: 'glass-effect',
    gradient: 'bg-gradient-to-br from-background via-background-secondary to-background-tertiary',
    neumorphic: 'neumorphic'
  }

  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  }

  return (
    <section
      ref={ref}
      className={cn(
        variants[variant],
        paddingClasses[padding],
        fullHeight && "min-h-screen",
        className
      )}
      {...props}
    />
  )
})
Section.displayName = "Section"

// Enhanced Sidebar Layout
export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: 'left' | 'right'
    width?: 'sm' | 'md' | 'lg'
    collapsible?: boolean
    collapsed?: boolean
    onToggle?: () => void
  }
>(({ 
  className, 
  side = 'left', 
  width = 'md',
  collapsible = false,
  collapsed = false,
  onToggle,
  children,
  ...props 
}, ref) => {
  const widthClasses = {
    sm: collapsed ? 'w-16' : 'w-48',
    md: collapsed ? 'w-16' : 'w-64',
    lg: collapsed ? 'w-16' : 'w-80'
  }

  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    onDrag,
    onDragEnd,
    onDragStart,
    ...restProps 
  } = props

  return (
    <motion.div
      ref={ref}
      className={cn(
        "glass-effect border-r border-gray-700/50 transition-all duration-300",
        widthClasses[width],
        side === 'right' && "border-r-0 border-l",
        className
      )}
      animate={{ width: collapsed ? 64 : width === 'sm' ? 192 : width === 'md' ? 256 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      {...restProps}
    >
      {collapsible && (
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 p-2 rounded-lg glass-effect hover:bg-white/10 transition-colors"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {side === 'left' ? '←' : '→'}
          </motion.div>
        </button>
      )}
      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </motion.div>
  )
})
Sidebar.displayName = "Sidebar"

// Enhanced Modal/Dialog Layout
export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md',
  className 
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "glass-card w-full",
                sizeClasses[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Enhanced Tabs Layout
export const TabsLayout = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  className 
}: {
  tabs: Array<{ id: string; label: string; content: React.ReactNode; icon?: React.ReactNode }>
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}) => {
  const variants = {
    default: {
      container: 'glass-effect rounded-xl',
      tab: 'px-4 py-2 rounded-lg transition-all duration-200',
      activeTab: 'bg-primary/20 text-primary border border-primary/30',
      inactiveTab: 'text-foreground-secondary hover:text-foreground hover:bg-white/5'
    },
    pills: {
      container: 'bg-background-secondary rounded-xl p-1',
      tab: 'px-4 py-2 rounded-lg transition-all duration-200',
      activeTab: 'bg-primary text-white shadow-lg',
      inactiveTab: 'text-foreground-secondary hover:text-foreground hover:bg-white/10'
    },
    underline: {
      container: 'border-b border-gray-700',
      tab: 'px-4 py-3 border-b-2 border-transparent transition-all duration-200',
      activeTab: 'border-primary text-primary',
      inactiveTab: 'text-foreground-secondary hover:text-foreground hover:border-gray-600'
    }
  }

  const currentVariant = variants[variant]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Tab Navigation */}
      <div className={cn("flex space-x-1", currentVariant.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              currentVariant.tab,
              activeTab === tab.id ? currentVariant.activeTab : currentVariant.inactiveTab
            )}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  )
}