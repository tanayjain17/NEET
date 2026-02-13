'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function WeakTopicIdentifier() {
  const { user } = useAuth()

  const { data: weakTopics } = useQuery({
    queryKey: ['weak-topics', user?.email],
    queryFn: async () => {
      const response = await fetch('/api/weak-topics')
      if (!response.ok) throw new Error('Failed to fetch weak topics')
      return response.json()
    },
    enabled: !!user?.email
  })

  const getWeaknessLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' }
    if (score >= 60) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' }
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' }
  }

  const getSubjectEmoji = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'physics': return '⚡'
      case 'chemistry': return '🧪'
      case 'botany': return '🌱'
      case 'zoology': return '🐾'
      default: return '📚'
    }
  }

  const sortedTopics = weakTopics?.sort((a: any, b: any) => b.weaknessScore - a.weaknessScore) || []
  const criticalTopics = sortedTopics.filter((topic: any) => topic.weaknessScore >= 80)
  const improvingTopics = sortedTopics.filter((topic: any) => topic.isResolved)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>🎯</span>
            <span>Weak Topic Analysis</span>
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-400">{criticalTopics.length}</div>
            <div className="text-sm text-gray-400">Critical Areas</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-400/10 rounded-lg border border-red-400/30">
            <div className="text-xl font-bold text-red-400">{criticalTopics.length}</div>
            <div className="text-xs text-gray-400">Critical</div>
          </div>
          <div className="text-center p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
            <div className="text-xl font-bold text-yellow-400">
              {sortedTopics.filter((t: any) => t.weaknessScore >= 40 && t.weaknessScore < 80).length}
            </div>
            <div className="text-xs text-gray-400">Needs Work</div>
          </div>
          <div className="text-center p-3 bg-green-400/10 rounded-lg border border-green-400/30">
            <div className="text-xl font-bold text-green-400">{improvingTopics.length}</div>
            <div className="text-xs text-gray-400">Improved</div>
          </div>
        </div>
      </div>

      {/* Critical Topics Alert */}
      {criticalTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6 bg-red-400/5 border-2 border-red-400/30"
        >
          <div className="flex items-center mb-4">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl mr-3"
            >
              🚨
            </motion.span>
            <h3 className="text-lg font-bold text-red-400">
              Urgent Attention Required!
            </h3>
          </div>
          <p className="text-red-300 mb-4">
            These topics need immediate focus to improve your NEET performance:
          </p>
          <div className="space-y-2">
            {criticalTopics.slice(0, 3).map((topic: any) => (
              <div key={topic.id} className="flex items-center justify-between p-2 bg-red-400/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSubjectEmoji(topic.subject)}</span>
                  <div>
                    <div className="font-medium text-white">{topic.topic}</div>
                    <div className="text-xs text-gray-400">{topic.subject} • {topic.chapter}</div>
                  </div>
                </div>
                <div className="text-red-400 font-bold">{Math.round(topic.weaknessScore)}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Weak Topics */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">All Identified Weak Areas</h3>
        
        {sortedTopics.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No weak topics identified yet!
            </h3>
            <p className="text-gray-400">
              Keep practicing to get personalized weakness analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTopics.map((topic: any, index: number) => {
              const weakness = getWeaknessLevel(topic.weaknessScore)
              
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${weakness.bg} ${weakness.border} ${
                    topic.isResolved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getSubjectEmoji(topic.subject)}</span>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {topic.topic}
                          {topic.isResolved && <span className="text-green-400">✅</span>}
                        </div>
                        <div className="text-sm text-gray-400">
                          {topic.subject} • {topic.chapter}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${weakness.color}`}>
                        {Math.round(topic.weaknessScore)}%
                      </div>
                      <div className={`text-xs ${weakness.color}`}>
                        {weakness.level}
                      </div>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-background-secondary/30 rounded">
                      <div className="text-sm font-bold text-white">{topic.attempts}</div>
                      <div className="text-xs text-gray-400">Attempts</div>
                    </div>
                    <div className="text-center p-2 bg-background-secondary/30 rounded">
                      <div className="text-sm font-bold text-white">{topic.correctAnswers}</div>
                      <div className="text-xs text-gray-400">Correct</div>
                    </div>
                    <div className="text-center p-2 bg-background-secondary/30 rounded">
                      <div className="text-sm font-bold text-white">
                        {topic.attempts > 0 ? Math.round((topic.correctAnswers / topic.attempts) * 100) : 0}%
                      </div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/subjects/${topic.subject.toLowerCase()}`}
                      className="flex-1 py-2 px-3 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg text-center transition-colors"
                    >
                      📚 Study Chapter
                    </Link>
                    <button className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                      🎯 Practice Questions
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
        <h3 className="text-lg font-bold text-blue-300 mb-3">
          🤖 AI Study Recommendations
        </h3>
        <div className="space-y-2 text-blue-200 text-sm">
          <p>• Focus on critical topics first - they have the highest impact on your score</p>
          <p>• Practice 10-15 questions daily on your weakest topic</p>
          <p>• Review concepts before attempting questions</p>
          <p>• Track improvement weekly to stay motivated</p>
        </div>
      </div>
    </div>
  )
}