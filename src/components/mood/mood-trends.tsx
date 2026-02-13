'use client'

import { useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface TrendData {
  date: string
  sad: number
  neutral: number
  happy: number
  total: number
  happinessScore: number
}

interface MoodTrendsProps {
  trends: TrendData[]
  timeRange: 'week' | 'month' | 'quarter'
}

export default function MoodTrends({ trends, timeRange }: MoodTrendsProps) {
  const formatDateForDisplay = (dateStr: string, range: string) => {
    const date = new Date(dateStr)
    
    switch (range) {
      case 'week':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      case 'quarter':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const chartData = useMemo(() => {
    return trends.map(trend => ({
      ...trend,
      formattedDate: formatDateForDisplay(trend.date, timeRange)
    }))
  }, [trends, timeRange])



  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-secondary border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'happinessScore' && ` (${entry.value.toFixed(1)})`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (trends.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Mood Trends</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">
            Not enough data to show trends. Keep tracking your mood!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Happiness Score Trend */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Happiness Score Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                domain={[1, 3]}
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => {
                  if (value <= 1.5) return 'Sad'
                  if (value <= 2.5) return 'Neutral'
                  return 'Happy'
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="happinessScore" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-400 text-center">
          Higher scores indicate better mood (1 = Sad, 2 = Neutral, 3 = Happy)
        </div>
      </div>

      {/* Mood Distribution Over Time */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Mood Distribution Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="happy" stackId="a" fill="#10B981" name="Happy" />
              <Bar dataKey="neutral" stackId="a" fill="#F59E0B" name="Neutral" />
              <Bar dataKey="sad" stackId="a" fill="#EF4444" name="Sad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-300">Happy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-300">Neutral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-300">Sad</span>
          </div>
        </div>
      </div>
    </div>
  )
}