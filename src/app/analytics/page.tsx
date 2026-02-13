'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { QuestionAnalyticsCard } from '@/components/analytics/question-analytics-card'
import { MotivationalMessages } from '@/components/analytics/motivational-messages'
import { useQuestionAnalytics, useDailyQuestionTrend, useWeeklyQuestionTrend } from '@/hooks/use-question-analytics'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('daily')
  const { data: analytics, isLoading: analyticsLoading } = useQuestionAnalytics()
  const { data: dailyTrend, isLoading: dailyLoading } = useDailyQuestionTrend(30)
  const { data: weeklyTrend, isLoading: weeklyLoading } = useWeeklyQuestionTrend(12)

  const isLoading = analyticsLoading || dailyLoading || weeklyLoading

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Analytics Dashboard"
        subtitle="Detailed insights into your question-solving progress"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  const chartData = timeRange === 'daily' 
    ? dailyTrend?.trend?.map(item => ({
        date: new Date(item.date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        questions: item.count
      })) || []
    : weeklyTrend?.trend?.map(item => ({
        date: new Date(item.weekStart!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        questions: item.count
      })) || []

  const getPerformanceLevel = (dailyCount: number) => {
    if (dailyCount >= 500) return { level: 'Exceptional', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' }
    if (dailyCount >= 300) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-400/10' }
    if (dailyCount >= 250) return { level: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-400/10' }
    if (dailyCount >= 100) return { level: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' }
    return { level: 'Needs Improvement', color: 'text-red-400', bgColor: 'bg-red-400/10' }
  }

  const performance = analytics ? getPerformanceLevel(analytics.today.daily) : null

  return (
    <DashboardLayout 
      title="Analytics Dashboard"
      subtitle="Detailed insights into your question-solving progress"
    >
      <div className="space-y-6">
        {/* Motivational Messages */}
        <MotivationalMessages />

        {/* Performance Overview */}
        {analytics && performance && (
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {analytics.today.daily}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">Questions Today</div>
                  <Badge className={`${performance.bgColor} ${performance.color} border-current`}>
                    {performance.level}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {analytics.today.weekly}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">This Week</div>
                  <div className="text-xs text-gray-500">
                    Avg: {Math.round(analytics.today.weekly / 7)} per day
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {analytics.today.monthly}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">This Month</div>
                  <div className="text-xs text-gray-500">
                    Avg: {Math.round(analytics.today.monthly / 30)} per day
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {analytics.today.lifetime.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">Lifetime Total</div>
                  <div className="text-xs text-gray-500">
                    Keep going! 🚀
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Trend Chart */}
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Question Solving Trend
                  </CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimeRange('daily')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        timeRange === 'daily'
                          ? 'bg-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setTimeRange('weekly')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        timeRange === 'weekly'
                          ? 'bg-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
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
                        dataKey="questions" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <QuestionAnalyticsCard />
            
            {/* Daily Goals */}
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Minimum Target</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      250 questions
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Optimal Target</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      300 questions
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Excellence Target</span>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                      500 questions
                    </Badge>
                  </div>
                </div>
                
                {analytics && (
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Today's Progress</div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((analytics.today.daily / 500) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0</span>
                      <span>250</span>
                      <span>500</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Question Type Breakdown */}
        {analytics && (
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Question Type Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Today's Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Assignment Questions</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${analytics.breakdown.total > 0 ? (analytics.breakdown.assignment / analytics.breakdown.total) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-12 text-right">
                          {analytics.breakdown.assignment}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Kattar Questions</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ 
                              width: `${analytics.breakdown.total > 0 ? (analytics.breakdown.kattar / analytics.breakdown.total) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-12 text-right">
                          {analytics.breakdown.kattar}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Performance Insights</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-gray-300">
                        Assignment questions help build conceptual understanding
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-300">
                        Kattar questions enhance problem-solving speed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-gray-300">
                        Maintain a balanced mix for optimal preparation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}