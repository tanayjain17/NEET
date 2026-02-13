'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

export default function EmergencySupportSystem() {
  const [selectedType, setSelectedType] = useState('pain_relief')
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild')
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [aiEmergencySupport, setAiEmergencySupport] = useState('')
  const [loadingEmergencyAI, setLoadingEmergencyAI] = useState(false)

  const { data: support, isLoading } = useQuery({
    queryKey: ['emergency-support', selectedType, selectedSeverity],
    queryFn: async () => {
      const response = await fetch(`/api/cycle-optimization/emergency?type=${selectedType}&severity=${selectedSeverity}`)
      if (!response.ok) throw new Error('Failed to fetch support')
      return response.json()
    }
  })

  const emergencyTypes = [
    { key: 'pain_relief', label: '🩹 Pain Relief', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
    { key: 'energy_boost', label: '⚡ Energy Boost', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    { key: 'mood_stabilizer', label: '😌 Mood Stabilizer', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
    { key: 'study_technique', label: '📚 Study Emergency', color: 'text-green-400 bg-green-400/10 border-green-400/30' }
  ]

  const severityLevels = [
    { key: 'mild', label: 'Mild', color: 'text-green-400' },
    { key: 'moderate', label: 'Moderate', color: 'text-yellow-400' },
    { key: 'severe', label: 'Severe', color: 'text-red-400' }
  ]

  const quickAccessButtons = [
    { type: 'pain_relief', severity: 'severe', label: '🚨 Severe Cramps', urgent: true },
    { type: 'energy_boost', severity: 'moderate', label: '😴 Energy Crash', urgent: false },
    { type: 'mood_stabilizer', severity: 'moderate', label: '😢 Mood Drop', urgent: false },
    { type: 'study_technique', severity: 'mild', label: '📖 Can\'t Focus', urgent: false }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Emergency Access */}
      <Card className="glass-effect border-red-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">🚨</span>
            Emergency Support - Keep Studying No Matter What!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAccessButtons.map((button, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setSelectedType(button.type)
                  setSelectedSeverity(button.severity as any)
                  setIsEmergencyActive(true)
                }}
                className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                  button.urgent 
                    ? 'border-red-400 bg-red-400/10 text-red-400' 
                    : 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-sm font-medium">{button.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {button.urgent ? 'Immediate help' : 'Quick relief'}
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Type Selector */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">🎯 Select Emergency Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {emergencyTypes.map(type => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedType === type.key 
                    ? type.color 
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>

          {/* Severity Selector */}
          <div className="flex space-x-2">
            {severityLevels.map(severity => (
              <button
                key={severity.key}
                onClick={() => setSelectedSeverity(severity.key as any)}
                className={`flex-1 p-2 rounded-lg border transition-all ${
                  selectedSeverity === severity.key 
                    ? `border-current ${severity.color} bg-current bg-opacity-10` 
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">{severity.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Protocol Display */}
      <AnimatePresence>
        {(support?.data || isEmergencyActive) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-effect border-pink-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>🆘 {support?.data?.title || 'Emergency Protocol'}</span>
                  <span className="text-sm text-pink-400">
                    {support?.data?.duration || 5} min solution
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Step-by-step instructions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Follow these steps immediately:
                      </h3>
                      {support?.data?.steps?.map((step: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="flex items-start space-x-4 p-4 bg-background-secondary/30 rounded-lg border border-gray-700"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{step}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Timer */}
                    <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400 mb-2">
                          ⏱️ {support?.data?.duration || 5} Minutes
                        </div>
                        <div className="text-gray-300 text-sm">
                          Take this time to implement the protocol, then return to studying
                        </div>
                      </div>
                    </div>

                    {/* Continuation Strategy */}
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                      <h4 className="text-green-300 font-medium mb-2">
                        📚 After Relief - Study Continuation Strategy:
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        {getContinuationStrategy(selectedType, selectedSeverity).map((strategy: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-green-400 text-sm mt-1">•</span>
                            <span>{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    {selectedSeverity === 'severe' && (
                      <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/20">
                        <h4 className="text-red-300 font-medium mb-2">
                          🚨 When to Seek Medical Help:
                        </h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          {getMedicalWarnings(selectedType).map((warning: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="text-red-400 text-sm mt-1">⚠️</span>
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Emergency Support */}
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-blue-300 font-medium">
                          🤖 Get Personalized Vegetarian Emergency Support
                        </h4>
                        <button
                          onClick={async () => {
                            setLoadingEmergencyAI(true)
                            try {
                              const response = await fetch('/api/vegetarian-ai/emergency', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  issue: selectedType.replace('_', ' '),
                                  severity: selectedSeverity,
                                  cyclePhase: 'follicular',
                                  availableTime: support?.data?.duration || 5
                                })
                              })
                              const result = await response.json()
                              setAiEmergencySupport(result.data)
                            } catch (error) {
                              console.error('Failed to get AI emergency support:', error)
                            } finally {
                              setLoadingEmergencyAI(false)
                            }
                          }}
                          disabled={loadingEmergencyAI}
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          {loadingEmergencyAI ? 'Generating...' : 'Get AI Help'}
                        </button>
                      </div>
                      {aiEmergencySupport && (
                        <div className="text-gray-100 text-sm leading-relaxed bg-gray-800/50 p-3 rounded border border-gray-600" dangerouslySetInnerHTML={{ __html: formatAIResponse(aiEmergencySupport) }}></div>
                      )}
                    </div>

                    {/* Success Tracking */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEmergencyActive(false)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                      >
                        ✅ Protocol Helped - Back to Study
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSeverity('severe')
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                      >
                        ❌ Need More Help
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prevention Tips */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">🛡️</span>
            Prevention is Better Than Cure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getPreventionTips().map((tip: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-background-secondary/30 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{tip.emoji}</span>
                  <span className="text-white font-medium">{tip.title}</span>
                </div>
                <p className="text-gray-300 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getContinuationStrategy(type: string, severity: string): string[] {
  const strategies = {
    pain_relief: [
      'Switch to lighter topics like Biology revision',
      'Use standing desk or comfortable seating position',
      'Take breaks every 30 minutes instead of 45',
      'Focus on reading and note-making rather than problem-solving'
    ],
    energy_boost: [
      'Start with easiest subject to build momentum',
      'Use Pomodoro technique with shorter intervals (15-20 min)',
      'Do active recall instead of passive reading',
      'Take a 5-minute walk between study sessions'
    ],
    mood_stabilizer: [
      'Choose favorite subject to rebuild confidence',
      'Set smaller, achievable goals for the session',
      'Use positive self-talk and affirmations',
      'Reward yourself after completing each topic'
    ],
    study_technique: [
      'Switch study methods (visual to auditory or vice versa)',
      'Change study location or environment',
      'Use active learning techniques like teaching concepts aloud',
      'Break complex topics into smaller, manageable chunks'
    ]
  }

  return strategies[type as keyof typeof strategies] || []
}

function getMedicalWarnings(type: string): string[] {
  const warnings = {
    pain_relief: [
      'Pain is severe and doesn\'t improve with medication',
      'Accompanied by heavy bleeding or clots',
      'Fever, nausea, or vomiting occurs',
      'Pain interferes with daily activities for more than 2 days'
    ],
    energy_boost: [
      'Extreme fatigue persists for more than 3 days',
      'Accompanied by dizziness or fainting',
      'Difficulty concentrating affects all daily activities',
      'Sleep disturbances continue despite good sleep hygiene'
    ],
    mood_stabilizer: [
      'Persistent sadness or anxiety for more than a week',
      'Thoughts of self-harm or hopelessness',
      'Complete loss of interest in all activities',
      'Mood changes severely impact relationships or studies'
    ]
  }

  return warnings[type as keyof typeof warnings] || [
    'Symptoms persist or worsen despite treatment',
    'Any concerning changes in your normal patterns'
  ]
}

function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-blue-200 italic">$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\d+\./g, '<span class="text-green-300 font-medium">$&</span>')
    .replace(/- /g, '<span class="text-yellow-300">•</span> ')
}

function getPreventionTips(): any[] {
  return [
    {
      emoji: '💧',
      title: 'Stay Hydrated',
      description: 'Drink 8-10 glasses of water daily to prevent fatigue and maintain focus'
    },
    {
      emoji: '😴',
      title: 'Regular Sleep',
      description: '7-8 hours of quality sleep helps regulate hormones and mood'
    },
    {
      emoji: '🏃‍♀️',
      title: 'Light Exercise',
      description: 'Daily 20-minute walks reduce cramps and boost energy levels'
    },
    {
      emoji: '🥗',
      title: 'Balanced Nutrition',
      description: 'Iron-rich foods and complex carbs maintain stable energy'
    },
    {
      emoji: '🧘‍♀️',
      title: 'Stress Management',
      description: 'Daily meditation or breathing exercises prevent mood swings'
    },
    {
      emoji: '📅',
      title: 'Track Patterns',
      description: 'Monitor your cycle to predict and prepare for challenging days'
    }
  ]
}