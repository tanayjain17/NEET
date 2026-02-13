import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300 transform-gpu",
  {
    variants: {
      variant: {
        default: "glass-card",
        premium: "premium-card",
        hero: "hero-card",
        neumorphic: "neumorphic p-6",
        elevated: "bg-background-card border border-gray-700/50 rounded-2xl shadow-elevation-2 hover:shadow-elevation-3",
        gradient: "bg-gradient-to-br from-primary/10 via-accent-purple/5 to-accent-cyan/10 border border-primary/20 rounded-2xl backdrop-blur-lg",
        minimal: "bg-background-secondary/50 border border-gray-800/50 rounded-xl",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:scale-[1.02] hover:shadow-elevation-3",
        glow: "hover:shadow-glow",
        both: "hover:scale-[1.02] hover:shadow-glow",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "none",
      interactive: false,
    },
  }
)

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof cardVariants> {
  asMotion?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, interactive, asMotion = false, ...props }, ref) => {
    const Comp = asMotion ? motion.div : "div"
    
    const motionProps = asMotion ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: "easeOut" },
      whileHover: hover === "lift" || hover === "both" ? { scale: 1.02 } : undefined,
    } : {}

    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, size, hover, interactive, className }))}
        {...motionProps}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { centered?: boolean }
>(({ className, centered = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 pb-4",
      centered && "text-center items-center",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    gradient?: boolean
  }
>(({ className, as: Comp = 'h3', gradient = false, ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight text-foreground",
      gradient && "gradient-text",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground-secondary leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { centered?: boolean }
>(({ className, centered = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-4",
      centered ? "justify-center" : "justify-between",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced Card Components
const StatsCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
      value: number
      isPositive: boolean
    }
    color?: 'primary' | 'success' | 'warning' | 'error'
  }
>(({ title, value, description, icon, trend, color = 'primary', className, ...props }, ref) => {
  const colorClasses = {
    primary: 'from-primary/10 to-accent-purple/10 border-primary/20',
    success: 'from-success/10 to-accent-cyan/10 border-success/20',
    warning: 'from-warning/10 to-error/10 border-warning/20',
    error: 'from-error/10 to-accent-pink/10 border-error/20',
  }

  return (
    <Card
      ref={ref}
      variant="gradient"
      hover="both"
      asMotion
      className={cn(
        'bg-gradient-to-br',
        colorClasses[color],
        className
      )}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground-secondary">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {trend && (
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  trend.isPositive ? "text-success-500" : "text-error-500"
                )}>
                  {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-foreground-muted">{description}</p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 p-3 rounded-xl bg-white/10">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
StatsCard.displayName = "StatsCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  StatsCard,
  cardVariants
}