import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group transform-gpu",
  {
    variants: {
      variant: {
        default: "glass-effect text-foreground hover:bg-primary/20 hover:border-primary/30 hover:shadow-glow active:scale-95",
        primary: "bg-primary text-white hover:bg-primary-600 shadow-elevation-2 hover:shadow-elevation-3 active:scale-95",
        secondary: "bg-background-secondary text-foreground hover:bg-background-tertiary border border-gray-700/50 hover:border-gray-600/50",
        outline: "border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm",
        ghost: "text-foreground-secondary hover:text-foreground hover:bg-white/5 rounded-xl",
        destructive: "bg-error-500 text-white hover:bg-error-600 shadow-elevation-2 hover:shadow-elevation-3",
        success: "bg-success-500 text-white hover:bg-success-600 shadow-elevation-2 hover:shadow-elevation-3",
        gradient: "bg-primary-gradient text-white shadow-elevation-2 hover:shadow-elevation-3 hover:scale-105",
        neumorphic: "neumorphic text-foreground hover:shadow-neumorphic-inset active:shadow-neumorphic-inset",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-11 px-6 text-sm rounded-xl",
        lg: "h-13 px-8 text-base rounded-xl",
        xl: "h-16 px-10 text-lg rounded-2xl",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-13 w-13 rounded-xl",
      },
      glow: {
        none: "",
        subtle: "hover:shadow-glow",
        strong: "shadow-glow hover:shadow-glow-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button
    const isDisabled = disabled || loading

    const buttonContent = (
      <>
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Button content */}
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : leftIcon ? (
            <span className="flex-shrink-0">{leftIcon}</span>
          ) : null}
          
          {children && (
            <span className={cn(
              "transition-all duration-200",
              loading && "opacity-70"
            )}>
              {children}
            </span>
          )}
          
          {!loading && rightIcon && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>
      </>
    )

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, glow, className }))}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </Slot>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, className }))}
        ref={ref}
        disabled={isDisabled}
        whileHover={{ scale: variant === 'gradient' ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }