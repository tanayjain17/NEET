'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Clock, TrendingUp, Target, AlertTriangle } from 'lucide-react'

export default function AfternoonPerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/afternoon-sessions?userId=1')
      if (response.ok) {
        const data = await response.json()
        setPerformanceData(data.data)
      }
    } catch (error) {
      console.error('Error fetching performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-700 rounded-lg h-32"></div>
        <div className="animate-pulse bg-gray-700 rounded-lg h-48"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {performanceData?.currentStatus && (
        <Card className="glass-effect border-blue-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Afternoon Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceData.currentStatus.afternoonStats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background-secondary/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(performanceData.currentStatus.afternoonStats.accuracy * 100)}%
                  </div>
                  <div className="text-sm text-gray-300">Accuracy</div>
                </div>
                <div className="bg-background-secondary/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.currentStatus.afternoonStats.focus.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-gray-300">Focus</div>
                </div>
                <div className="bg-background-secondary/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {performanceData.currentStatus.afternoonStats.productivity.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-gray-300">Productivity</div>
                </div>
              </div>
            )}

            {/* Performance Insights */}
            {performanceData.currentStatus.insights && performanceData.currentStatus.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Performance Insights</h4>
                {performanceData.currentStatus.insights.map((insight: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      insight.type === 'critical' ? 'bg-red-500/10 border-red-400/30 text-red-300' :
                      insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300' :
                      insight.type === 'positive' ? 'bg-green-500/10 border-green-400/30 text-green-300' :
                      'bg-blue-500/10 border-blue-400/30 text-blue-300'
                    }`}
                  >
                    <div className="font-semibold">{insight.message}</div>
                    <div className="text-sm mt-1 opacity-80">{insight.action}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {performanceData?.currentStatus?.recommendations && (
        <Card className="glass-effect border-green-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceData.currentStatus.recommendations.map((rec: any, index: number) => (
              <div key={index} className="bg-background-secondary/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">{rec.category}</h4>
                <div className="space-y-1">
                  {rec.actions.map((action: string, actionIndex: number) => (
                    <div key={actionIndex} className="text-sm text-gray-300 flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}



      {/* Weekly Plan */}
      {performanceData?.weeklyPlan && (
        <Card className="glass-effect border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              4-Week Afternoon Training Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(performanceData.weeklyPlan).map(([week, plan]: [string, any]) => (
              <div key={week} className="bg-background-secondary/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold capitalize">{week.replace('week', 'Week ')}</h4>
                  <span className="text-sm text-purple-300">{plan.dailyTarget}</span>
                </div>
                <div className="text-sm text-gray-300 mb-2">{plan.focus}</div>
                <div className="text-xs text-gray-400">
                  Subjects: {Array.isArray(plan.subjects) ? plan.subjects.join(', ') : plan.subjects}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Daily Protocol */}
      {performanceData?.dailyProtocol && (
        <Card className="glass-effect border-orange-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Daily Afternoon Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(performanceData.dailyProtocol).map(([time, activity]: [string, any]) => (
                <div key={time} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                  <span className="text-orange-300 font-mono text-sm">{time}</span>
                  <span className="text-white text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}