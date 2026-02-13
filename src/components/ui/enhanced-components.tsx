'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Enhanced Loading Spinner
export const LoadingSpinner = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        size?: 'sm' | 'md' | 'lg'
        variant?: 'default' | 'dots' | 'pulse' | 'orbit'
    }
>(({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    if (variant === 'dots') {
        return (
            <div ref={ref} className={cn("flex space-x-1", className)} {...props}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                    />
                ))}
            </div>
        )
    }

    if (variant === 'pulse') {
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
                    "rounded-full bg-primary/20 border-2 border-primary/30",
                    sizeClasses[size],
                    className
                )}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                {...restProps}
            />
        )
    }

    if (variant === 'orbit') {
        return (
            <div ref={ref} className={cn("relative", sizeClasses[size], className)} {...props}>
                <motion.div
                    className="absolute inset-0 border-2 border-primary/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `50% ${sizeClasses[size] === 'w-4 h-4' ? '10px' : sizeClasses[size] === 'w-8 h-8' ? '18px' : '26px'}` }}
                />
            </div>
        )
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
                "border-2 border-primary/30 border-t-primary rounded-full",
                sizeClasses[size],
                className
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            {...restProps}
        />
    )
})
LoadingSpinner.displayName = "LoadingSpinner"

// Enhanced Badge Component
export const Badge = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'glass'
        size?: 'sm' | 'md' | 'lg'
        pulse?: boolean
    }
>(({ className, variant = 'default', size = 'md', pulse = false, children, ...props }, ref) => {
    const variants = {
        default: 'bg-primary/20 text-primary border-primary/30',
        success: 'bg-success/20 text-success-500 border-success/30',
        warning: 'bg-warning/20 text-warning-500 border-warning/30',
        error: 'bg-error/20 text-error-500 border-error/30',
        info: 'bg-accent-cyan/20 text-accent-cyan-500 border-accent-cyan/30',
        outline: 'border-2 border-foreground-muted text-foreground-secondary bg-transparent',
        glass: 'glass-effect text-foreground border-white/20'
    }

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
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
                "inline-flex items-center rounded-full font-medium border transition-all duration-200",
                variants[variant],
                sizes[size],
                pulse && "animate-pulse",
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...restProps}
        >
            {children}
        </motion.div>
    )
})
Badge.displayName = "Badge"

// Enhanced Progress Component
export const Progress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        value: number
        max?: number
        variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient'
        size?: 'sm' | 'md' | 'lg'
        animated?: boolean
        showValue?: boolean
    }
>(({
    className,
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    animated = false,
    showValue = false,
    ...props
}, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const variants = {
        default: 'bg-primary',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
        gradient: 'bg-gradient-to-r from-primary to-accent-purple-500'
    }

    const sizes = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    }

    return (
        <div ref={ref} className={cn("relative", className)} {...props}>
            <div className={cn(
                "w-full bg-background-secondary rounded-full overflow-hidden",
                sizes[size]
            )}>
                <motion.div
                    className={cn(
                        "h-full rounded-full transition-all duration-300",
                        variants[variant],
                        animated && "animate-pulse"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
        </div>
    )
})
Progress.displayName = "Progress"

// Enhanced Avatar Component
export const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        src?: string
        alt?: string
        fallback?: string
        size?: 'sm' | 'md' | 'lg' | 'xl'
        status?: 'online' | 'offline' | 'away' | 'busy'
        ring?: boolean
    }
>(({
    className,
    src,
    alt,
    fallback,
    size = 'md',
    status,
    ring = false,
    ...props
}, ref) => {
    const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-24 h-24 text-2xl'
    }

    const statusColors = {
        online: 'bg-success-500',
        offline: 'bg-gray-500',
        away: 'bg-warning-500',
        busy: 'bg-error-500'
    }

    return (
        <div
            ref={ref}
            className={cn(
                "relative inline-flex items-center justify-center rounded-full bg-background-secondary overflow-hidden",
                sizes[size],
                ring && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                className
            )}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="font-medium text-foreground-secondary">
                    {fallback || '?'}
                </span>
            )}

            {status && (
                <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                    statusColors[status]
                )} />
            )}
        </div>
    )
})
Avatar.displayName = "Avatar"

// Enhanced Tooltip Component
export const Tooltip = ({
    children,
    content,
    side = 'top',
    className
}: {
    children: React.ReactNode
    content: React.ReactNode
    side?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
}) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    }

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 px-3 py-2 text-sm text-foreground glass-effect rounded-lg pointer-events-none whitespace-nowrap",
                            positions[side],
                            className
                        )}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Enhanced Switch Component
export const Switch = React.forwardRef<
    HTMLButtonElement,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
        checked?: boolean
        onChange?: (checked: boolean) => void
        size?: 'sm' | 'md' | 'lg'
        variant?: 'default' | 'success' | 'warning' | 'error'
    }
>(({
    className,
    checked = false,
    onChange,
    size = 'md',
    variant = 'default',
    disabled,
    ...props
}, ref) => {
    const sizes = {
        sm: { track: 'w-8 h-4', thumb: 'w-3 h-3' },
        md: { track: 'w-11 h-6', thumb: 'w-4 h-4' },
        lg: { track: 'w-14 h-7', thumb: 'w-5 h-5' }
    }

    const variants = {
        default: checked ? 'bg-primary' : 'bg-background-secondary',
        success: checked ? 'bg-success-500' : 'bg-background-secondary',
        warning: checked ? 'bg-warning-500' : 'bg-background-secondary',
        error: checked ? 'bg-error-500' : 'bg-background-secondary'
    }

    return (
        <button
            ref={ref}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={cn(
                "relative inline-flex items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
                sizes[size].track,
                variants[variant],
                className
            )}
            onClick={() => onChange?.(!checked)}
            {...props}
        >
            <motion.div
                className={cn(
                    "bg-white rounded-full shadow-lg",
                    sizes[size].thumb
                )}
                animate={{
                    x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 2
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    )
})
Switch.displayName = "Switch"

// Enhanced Skeleton Component
export const Skeleton = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: 'default' | 'circular' | 'rectangular'
        animation?: 'pulse' | 'wave' | 'none'
    }
>(({ className, variant = 'default', animation = 'pulse', ...props }, ref) => {
    const animations = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: ''
    }

    const variants = {
        default: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-none'
    }

    return (
        <div
            ref={ref}
            className={cn(
                "bg-background-secondary",
                variants[variant],
                animations[animation],
                className
            )}
            {...props}
        />
    )
})
Skeleton.displayName = "Skeleton"