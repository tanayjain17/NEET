'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

type ProgressStats = {
  daily: any[]
  weekly: any[]
  monthly: any[]
  lifetime: any
}

export default function ProgressAnalytics() {
  const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'monthly' | 'lifetime'>('daily')
  const [chartType, setChartType] = useState<'hours' | 'focus' | 'questions'>('hours')

  const { data: stats, isLoading } = useQuery<ProgressStats>({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const response = await fetch('/api/study-sessions?action=progress-stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 60000
  })

  const { data: praiseMessage } = useQuery({
    queryKey: ['praise-message', stats?.daily?.[0]?.totalHours],
    queryFn: async () => {
      const todayHours = stats?.daily?.[0]?.totalHours || 0
      const response = await fetch(`/api/study-sessions?action=praise-message&hours=${todayHours}&target=8`)
      if (!response.ok) throw new Error('Failed to fetch praise')
      const result = await response.json()
      return result.data
    },
    enabled: !!stats?.daily?.[0]
  })

  const getChartData = () => {
    if (!stats) return []
    
    const data = stats[activeView]
    if (activeView === 'lifetime') return []

    return data.map((item: any) => ({
      name: activeView === 'daily' ? new Date(item.date || item.week || item.month).toLocaleDateString() :
            activeView === 'weekly' ? `Week ${item.week}` :
            item.month,
      hours: item.totalHours || 0,
      focus: item.focusAvg || item.avgFocus || 0,
      questions: item.questionsTotal || 0,
      productivity: item.productivity || item.avgProductivity || 0
    })).reverse()
  }

  const chartData = getChartData()

  const getYAxisKey = () => {
    switch (chartType) {
      case 'hours': return 'hours'
      case 'focus': return 'focus'
      case 'questions': return 'questions'
      default: return 'hours'
    }
  }

  const getYAxisLabel = () => {
    switch (chartType) {
      case 'hours': return 'Study Hours'
      case 'focus': return 'Focus Score (1-10)'
      case 'questions': return 'Questions Attempted'
      default: return 'Study Hours'
    }
  }

  const getLineColor = () => {
    switch (chartType) {
      case 'hours': return '#3B82F6'
      case 'focus': return '#10B981'
      case 'questions': return '#F59E0B'
      default: return '#3B82F6'
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Praise Message */}
      {praiseMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-400/30"
        >
          <div className="text-center text-white font-medium">
            {praiseMessage}
          </div>
        </motion.div>
      )}

      {/* Lifetime Stats Overview */}
      {stats?.lifetime && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="glass-effect border-blue-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {stats.lifetime.totalHours}h
              </div>
              <div className="text-sm text-gray-300">Total Hours</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-green-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {stats.lifetime.totalQuestions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">Questions</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {stats.lifetime.avgTestScore}
              </div>
              <div className="text-sm text-gray-300">Avg Test Score</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-purple-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {stats.lifetime.accuracy}%
              </div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-pink-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {stats.lifetime.totalPlans}
              </div>
              <div className="text-sm text-gray-300">Study Plans</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-indigo-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-1">
                {stats.lifetime.goalSuccessRate}%
              </div>
              <div className="text-sm text-gray-300">Goals Achieved</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart Controls */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>📊 Progress Analytics</span>
            <div className="flex space-x-2">
              <select
                value={activeView}
                onChange={(e) => setActiveView(e.target.value as any)}
                className="px-3 py-1 bg-background-secondary border border-gray-600 rounded text-white text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as any)}
                className="px-3 py-1 bg-background-secondary border border-gray-600 rounded text-white text-sm"
              >
                <option value="hours">Study Hours</option>
                <option value="focus">Focus Score</option>
                <option value="questions">Questions</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={getYAxisKey()} 
                  stroke={getLineColor()}
                  strokeWidth={3}
                  dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: getLineColor(), strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats Table */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">📋 Detailed {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 p-2">Period</th>
                  <th className="text-left text-gray-300 p-2">Hours</th>
                  <th className="text-left text-gray-300 p-2">Focus</th>
                  <th className="text-left text-gray-300 p-2">Productivity</th>
                  <th className="text-left text-gray-300 p-2">Questions</th>
                </tr>
              </thead>
              <tbody>
                {chartData.slice(0, 10).map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="text-white p-2">{item.name}</td>
                    <td className="text-blue-400 p-2 font-medium">{item.hours}h</td>
                    <td className="text-green-400 p-2">{item.focus}/10</td>
                    <td className="text-purple-400 p-2">{item.productivity}/10</td>
                    <td className="text-yellow-400 p-2">{item.questions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}