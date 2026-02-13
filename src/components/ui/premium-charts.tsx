'use client'

import * as React from "react"
import { motion } from "framer-motion"
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Legend
} from 'recharts'
import { cn } from "@/lib/utils"

// Enhanced Chart Container
const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        title?: string
        description?: string
        height?: number
        children: React.ReactElement
    }
>(({ className, title, description, height = 300, children, ...props }, ref) => {
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("chart-container", className)}
            {...restProps}
        >
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                    )}
                    {description && (
                        <p className="text-sm text-foreground-secondary">{description}</p>
                    )}
                </div>
            )}
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
})
ChartContainer.displayName = "ChartContainer"

// Enhanced Tooltip Component
const CustomTooltip = ({
    active,
    payload,
    label,
    formatter,
    labelFormatter
}: any) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-effect rounded-lg p-3 border border-white/20 shadow-lg"
            >
                {label && (
                    <p className="text-sm font-medium text-foreground mb-2">
                        {labelFormatter ? labelFormatter(label) : label}
                    </p>
                )}
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-foreground-secondary">{entry.name}:</span>
                        <span className="font-medium text-foreground">
                            {formatter ? formatter(entry.value, entry.name) : entry.value}
                        </span>
                    </div>
                ))}
            </motion.div>
        )
    }
    return null
}

// Premium Line Chart
export const PremiumLineChart = ({
    data,
    lines,
    title,
    description,
    height = 300,
    showGrid = true,
    showTooltip = true,
    animate = true,
    className
}: {
    data: any[]
    lines: Array<{
        dataKey: string
        name?: string
        color?: string
        strokeWidth?: number
        type?: 'monotone' | 'linear' | 'step'
    }>
    title?: string
    description?: string
    height?: number
    showGrid?: boolean
    showTooltip?: boolean
    animate?: boolean
    className?: string
}) => {
    return (
        <ChartContainer
            title={title}
            description={description}
            height={height}
            className={className}
        >
            <LineChart data={data}>
                {showGrid && (
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        className="chart-grid"
                    />
                )}
                <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {lines.map((line, index) => (
                    <Line
                        key={line.dataKey}
                        type={line.type || 'monotone'}
                        dataKey={line.dataKey}
                        stroke={line.color || `hsl(${index * 60}, 70%, 60%)`}
                        strokeWidth={line.strokeWidth || 3}
                        dot={{ fill: line.color || `hsl(${index * 60}, 70%, 60%)`, strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, stroke: line.color, strokeWidth: 2, fill: 'white' }}
                        animationDuration={animate ? 1000 : 0}
                        animationBegin={index * 200}
                    />
                ))}
            </LineChart>
        </ChartContainer>
    )
}

// Premium Area Chart
export const PremiumAreaChart = ({
    data,
    areas,
    title,
    description,
    height = 300,
    showGrid = true,
    showTooltip = true,
    animate = true,
    className
}: {
    data: any[]
    areas: Array<{
        dataKey: string
        name?: string
        color?: string
        fillOpacity?: number
        type?: 'monotone' | 'linear' | 'step'
    }>
    title?: string
    description?: string
    height?: number
    showGrid?: boolean
    showTooltip?: boolean
    animate?: boolean
    className?: string
}) => {
    return (
        <ChartContainer
            title={title}
            description={description}
            height={height}
            className={className}
        >
            <AreaChart data={data}>
                <defs>
                    {areas.map((area, index) => (
                        <linearGradient key={area.dataKey} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={area.color || `hsl(${index * 60}, 70%, 60%)`} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={area.color || `hsl(${index * 60}, 70%, 60%)`} stopOpacity={0.1} />
                        </linearGradient>
                    ))}
                </defs>
                {showGrid && (
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        className="chart-grid"
                    />
                )}
                <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {areas.map((area, index) => (
                    <Area
                        key={area.dataKey}
                        type={area.type || 'monotone'}
                        dataKey={area.dataKey}
                        stroke={area.color || `hsl(${index * 60}, 70%, 60%)`}
                        fill={`url(#gradient-${area.dataKey})`}
                        strokeWidth={2}
                        animationDuration={animate ? 1000 : 0}
                        animationBegin={index * 200}
                    />
                ))}
            </AreaChart>
        </ChartContainer>
    )
}

// Premium Bar Chart
export const PremiumBarChart = ({
    data,
    bars,
    title,
    description,
    height = 300,
    showGrid = true,
    showTooltip = true,
    animate = true,
    className
}: {
    data: any[]
    bars: Array<{
        dataKey: string
        name?: string
        color?: string
        radius?: number
    }>
    title?: string
    description?: string
    height?: number
    showGrid?: boolean
    showTooltip?: boolean
    animate?: boolean
    className?: string
}) => {
    return (
        <ChartContainer
            title={title}
            description={description}
            height={height}
            className={className}
        >
            <BarChart data={data}>
                {showGrid && (
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        className="chart-grid"
                    />
                )}
                <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {bars.map((bar, index) => (
                    <Bar
                        key={bar.dataKey}
                        dataKey={bar.dataKey}
                        fill={bar.color || `hsl(${index * 60}, 70%, 60%)`}
                        radius={bar.radius || [4, 4, 0, 0]}
                        animationDuration={animate ? 1000 : 0}
                        animationBegin={index * 100}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    )
}

// Premium Pie Chart
export const PremiumPieChart = ({
    data,
    title,
    description,
    height = 300,
    showTooltip = true,
    showLegend = true,
    animate = true,
    innerRadius = 0,
    outerRadius = 80,
    className
}: {
    data: Array<{ name: string; value: number; color?: string }>
    title?: string
    description?: string
    height?: number
    showTooltip?: boolean
    showLegend?: boolean
    animate?: boolean
    innerRadius?: number
    outerRadius?: number
    className?: string
}) => {
    const COLORS = [
        '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
        '#f59e0b', '#ef4444', '#ec4899', '#6366f1'
    ]

    return (
        <ChartContainer
            title={title}
            description={description}
            height={height}
            className={className}
        >
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={animate ? 1000 : 0}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
                {showLegend && (
                    <Legend
                        wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
                        iconType="circle"
                    />
                )}
            </PieChart>
        </ChartContainer>
    )
}

// Premium Radial Progress Chart
export const PremiumRadialChart = ({
    data,
    title,
    description,
    height = 300,
    showTooltip = true,
    animate = true,
    className
}: {
    data: Array<{ name: string; value: number; fill?: string }>
    title?: string
    description?: string
    height?: number
    showTooltip?: boolean
    animate?: boolean
    className?: string
}) => {
    return (
        <ChartContainer
            title={title}
            description={description}
            height={height}
            className={className}
        >
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={data}
            >
                <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="#3b82f6"
                    animationDuration={animate ? 1000 : 0}
                />
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
            </RadialBarChart>
        </ChartContainer>
    )
}

// Animated Progress Ring
export const ProgressRing = ({
    progress,
    size = 120,
    strokeWidth = 8,
    color = '#3b82f6',
    backgroundColor = 'rgba(255,255,255,0.1)',
    showValue = true,
    className
}: {
    progress: number
    size?: number
    strokeWidth?: number
    color?: string
    backgroundColor?: string
    showValue?: boolean
    className?: string
}) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="text-lg font-bold text-foreground"
                    >
                        {Math.round(progress)}%
                    </motion.span>
                </div>
            )}
        </div>
    )
}

// Animated Counter
export const AnimatedCounter = ({
    value,
    duration = 1000,
    prefix = '',
    suffix = '',
    className
}: {
    value: number
    duration?: number
    prefix?: string
    suffix?: string
    className?: string
}) => {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            setCount(Math.floor(progress * value))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [value, duration])

    return (
        <span className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}