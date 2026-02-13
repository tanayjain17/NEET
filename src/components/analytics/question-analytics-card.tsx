'use client'

import { useQuestionAnalytics } from '@/hooks/use-question-analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react'

export function QuestionAnalyticsCard() {
  const { data: analytics, isLoading, error } = useQuestionAnalytics()

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Question Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analytics) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Question Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Failed to load analytics</p>
        </CardContent>
      </Card>
    )
  }

  const { today, yesterday, breakdown } = analytics

  // Calculate daily change
  const dailyChange = today.daily - yesterday.daily
  const isPositiveChange = dailyChange >= 0

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Question Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-gray-300">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={today.daily >= 250 ? "default" : "secondary"} className="bg-blue-600">
              {today.daily} questions
            </Badge>
            {dailyChange !== 0 && (
              <Badge 
                variant={isPositiveChange ? "default" : "destructive"}
                className={isPositiveChange ? "bg-green-600" : "bg-red-600"}
              >
                {isPositiveChange ? '+' : ''}{dailyChange}
              </Badge>
            )}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">This Week</span>
          </div>
          <Badge variant="outline" className="border-green-600 text-green-400">
            {today.weekly} questions
          </Badge>
        </div>

        {/* Monthly Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-gray-300">This Month</span>
          </div>
          <Badge variant="outline" className="border-purple-600 text-purple-400">
            {today.monthly} questions
          </Badge>
        </div>

        {/* Lifetime Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-300">Lifetime</span>
          </div>
          <Badge variant="outline" className="border-yellow-600 text-yellow-400">
            {today.lifetime} questions
          </Badge>
        </div>

        {/* Question Breakdown */}
        <div className="pt-2 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Question Sources</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{breakdown.dailyGoals || 0}</div>
              <div className="text-xs text-gray-400">Daily Goals</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{breakdown.dpp || 0}</div>
              <div className="text-xs text-gray-400">DPP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{breakdown.assignment || 0}</div>
              <div className="text-xs text-gray-400">Assignment</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{breakdown.kattar || 0}</div>
              <div className="text-xs text-gray-400">Kattar</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}