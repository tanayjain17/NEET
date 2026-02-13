'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

type AISuggestions = {
  motivation: string
  schedulePlanner: string
  weakAreaAnalysis: string
  strategicSuggestions: string
  timelineOptimization: string
}

type Props = {
  predictedAIR: number
}

export default function AISuggestionsSection({ predictedAIR }: Props) {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeInsight, setActiveInsight] = useState<keyof AISuggestions | null>(null)

  const generateAISuggestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictedAIR })
      })
      const result = await response.json()
      setAiSuggestions(result.data)
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const insightSections = [
    { key: 'motivation', title: 'AI Motivation Coach', icon: '💪', color: 'pink' },
    { key: 'schedulePlanner', title: 'AI Schedule Planner', icon: '📅', color: 'blue' },
    { key: 'weakAreaAnalysis', title: 'Weak Area Analysis', icon: '🎯', color: 'orange' },
    { key: 'strategicSuggestions', title: 'Strategic AI Suggestions', icon: '🧠', color: 'green' }
  ] as const

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'pink': return 'border-pink-400/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10'
      case 'blue': return 'border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10'
      case 'orange': return 'border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-red-500/10'
      case 'green': return 'border-green-400/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10'
      default: return 'border-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Generate AI Suggestions Button */}
      <Card className="glass-effect border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span>🤖</span>
              <span>AI-Powered Insights & Suggestions</span>
            </span>
            <button
              onClick={generateAISuggestions}
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate AI Insights</span>
                </>
              )}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm">
            Get personalized AI-powered insights based on your comprehensive NEET preparation data. 
            Click the button above to generate detailed analysis, motivation, schedule planning, and strategic suggestions.
          </p>
        </CardContent>
      </Card>

      {/* AI Suggestions Content */}
      {aiSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Insight Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {insightSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveInsight(activeInsight === section.key ? null : section.key)}
                className={`p-3 rounded-lg border transition-all ${
                  activeInsight === section.key
                    ? getColorClasses(section.color)
                    : 'border-gray-600 bg-background-secondary/30 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{section.icon}</div>
                <div className="text-sm text-white font-medium">{section.title}</div>
              </button>
            ))}
          </div>

          {/* Active Insight Display */}
          {activeInsight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`glass-effect ${getColorClasses(
                insightSections.find(s => s.key === activeInsight)?.color || 'gray'
              )}`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>{insightSections.find(s => s.key === activeInsight)?.icon}</span>
                    <span>{insightSections.find(s => s.key === activeInsight)?.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-300 leading-relaxed prose prose-invert max-w-none ai-suggestions-content"
                    dangerouslySetInnerHTML={{ __html: aiSuggestions[activeInsight] }}
                  />
                  <style jsx>{`
                    .ai-suggestions-content {
                      line-height: 1.6;
                    }
                    .ai-suggestions-content h3,
                    .ai-suggestions-content h4,
                    .ai-suggestions-content h5 {
                      margin-bottom: 0.75rem;
                    }
                    .ai-suggestions-content p {
                      margin-bottom: 1rem;
                    }
                    .ai-suggestions-content ul {
                      margin-bottom: 1rem;
                    }
                    .ai-suggestions-content li {
                      margin-bottom: 0.25rem;
                    }
                  `}</style>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Overview */}
          {!activeInsight && (
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📋 AI Insights Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insightSections.map((section) => (
                    <div 
                      key={section.key}
                      className="p-3 bg-background-secondary/30 rounded-lg cursor-pointer hover:bg-background-secondary/50 transition-colors"
                      onClick={() => setActiveInsight(section.key)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{section.icon}</span>
                        <div>
                          <div className="text-white font-medium text-sm">{section.title}</div>
                          <div className="text-gray-400 text-xs">Click to view detailed insights</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}