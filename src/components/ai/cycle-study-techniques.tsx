'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function CycleStudyTechniques() {
  const [selectedPhase, setSelectedPhase] = useState('follicular')
  const [selectedSubject, setSelectedSubject] = useState('Physics')
  const [aiStudyTechniques, setAiStudyTechniques] = useState('')
  const [loadingStudyAI, setLoadingStudyAI] = useState(false)

  const { data: techniques, isLoading } = useQuery({
    queryKey: ['study-techniques', selectedPhase, selectedSubject],
    queryFn: async () => {
      const response = await fetch(`/api/cycle-optimization/techniques?phase=${selectedPhase}&subject=${selectedSubject}`)
      if (!response.ok) throw new Error('Failed to fetch techniques')
      return response.json()
    }
  })

  const phases = [
    { key: 'menstrual', label: 'Menstrual 🔴', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
    { key: 'follicular', label: 'Follicular 🌱', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
    { key: 'ovulation', label: 'Ovulation ⭐', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    { key: 'luteal', label: 'Luteal 🌙', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' }
  ]

  const subjects = ['Physics', 'Chemistry', 'Botany', 'Zoology']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'light': return 'text-blue-400 bg-blue-400/10'
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10'
      case 'intense': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">📚</span>
            Cycle-Specific Study Techniques for AIR 50
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Phase Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {phases.map(phase => (
              <button
                key={phase.key}
                onClick={() => setSelectedPhase(phase.key)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedPhase === phase.key 
                    ? phase.color 
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">{phase.label}</div>
              </button>
            ))}
          </div>

          {/* Subject Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`p-2 rounded-lg border transition-all ${
                  selectedSubject === subject 
                    ? 'border-primary text-primary bg-primary/10' 
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">{subject}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Techniques Display */}
      {isLoading ? (
        <Card className="glass-effect border-gray-700">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {techniques?.data?.map((technique: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">{technique.technique}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(technique.difficulty)}`}>
                          {technique.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">
                          {technique.duration} min
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{technique.description}</p>
                      
                      {/* Phase-specific benefits */}
                      <div className="p-3 bg-background-secondary/50 rounded-lg">
                        <div className="text-sm text-gray-300">
                          <strong className="text-pink-300">Why this works in {selectedPhase} phase:</strong>
                          <div className="mt-2">
                            {getPhaseSpecificBenefit(selectedPhase, technique.technique)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {Math.round(technique.effectiveness * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">Effectiveness</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Study Techniques */}
      <Card className="glass-effect border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>🤖 AI-Powered Vegetarian Study Optimization</span>
            <button
              onClick={async () => {
                setLoadingStudyAI(true)
                try {
                  const response = await fetch('/api/vegetarian-ai/study-techniques', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      cyclePhase: selectedPhase,
                      subject: selectedSubject,
                      energyLevel: 7,
                      focusLevel: 8,
                      studyDuration: 120
                    })
                  })
                  const result = await response.json()
                  setAiStudyTechniques(result.data)
                } catch (error) {
                  console.error('Failed to get AI study techniques:', error)
                } finally {
                  setLoadingStudyAI(false)
                }
              }}
              disabled={loadingStudyAI}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              {loadingStudyAI ? 'Generating...' : 'Get AI Techniques'}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiStudyTechniques ? (
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
              <div className="text-gray-100 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatAIResponse(aiStudyTechniques) }}></div>
            </div>
          ) : (
            <div className="text-center p-4 text-gray-400">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-sm">Click "Get AI Techniques" for personalized vegetarian study optimization</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phase Overview */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">🎯 {selectedPhase.charAt(0).toUpperCase() + selectedPhase.slice(1)} Phase Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getPhaseStrategy(selectedPhase).map((strategy: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-pink-400 text-sm mt-1">•</span>
                <span className="text-gray-300 text-sm">{strategy}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getPhaseSpecificBenefit(phase: string, technique: string): string {
  const benefits: Record<string, Record<string, string>> = {
    menstrual: {
      'Formula Review': 'Low cognitive load activity perfect for reduced energy levels',
      'Previous Year MCQs': 'Familiar patterns help maintain study momentum without stress',
      'Reaction Revision': 'Visual memory works better during this phase',
      'Diagram Practice': 'Fine motor skills remain intact, good for detailed work'
    },
    follicular: {
      'New Concept Learning': 'Rising estrogen enhances neuroplasticity and learning capacity',
      'Problem Solving': 'Peak analytical thinking and pattern recognition abilities',
      'Mechanism Learning': 'Enhanced memory formation for complex processes',
      'Detailed Notes': 'Improved attention to detail and information processing'
    },
    ovulation: {
      'Mock Test Marathon': 'Peak cognitive performance and stress handling ability',
      'Toughest Problems': 'Maximum problem-solving capacity and mental stamina',
      'Full Mock Tests': 'Optimal time for high-pressure performance simulation',
      'Memory Palace': 'Peak memory consolidation and spatial processing'
    },
    luteal: {
      'Formula Consolidation': 'Good for organizing and systematizing knowledge',
      'Error Analysis': 'Enhanced critical thinking for identifying mistakes',
      'Flashcard Review': 'Repetitive learning works well with steady energy levels',
      'System Integration': 'Excellent for connecting different concepts together'
    }
  }

  return benefits[phase]?.[technique] || 
         'Optimized for your current hormonal state and cognitive capacity'
}

function getPhaseStrategy(phase: string): string[] {
  const strategies: Record<string, string[]> = {
    menstrual: [
      'Focus on maintaining study momentum with light, familiar topics',
      'Use this time for organizing notes and creating study materials',
      'Practice relaxation techniques to manage any discomfort',
      'Avoid starting completely new or challenging concepts',
      'Take frequent breaks and stay hydrated'
    ],
    follicular: [
      'This is your LEARNING POWERHOUSE phase - tackle the hardest topics',
      'Start new chapters in Physics and Chemistry',
      'Memorize complex formulas and reaction mechanisms',
      'Build strong conceptual foundations for difficult topics',
      'Extended study sessions (6-8 hours) are optimal'
    ],
    ovulation: [
      'PEAK PERFORMANCE TIME - attempt your toughest challenges',
      'Take full-length NEET mock tests for maximum accuracy',
      'Solve the most difficult numerical problems',
      'Practice speed and accuracy under time pressure',
      'This is when you can achieve your highest scores'
    ],
    luteal: [
      'Perfect for consolidating and organizing learned material',
      'Focus on revision and practice rather than new learning',
      'Create comprehensive summary notes and mind maps',
      'Practice previous year questions for pattern recognition',
      'Moderate study sessions work best (4-6 hours)'
    ]
  }

  return strategies[phase] || []
}

function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-purple-200 italic">$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\d+\./g, '<span class="text-pink-300 font-medium">$&</span>')
    .replace(/- /g, '<span class="text-blue-300">•</span> ')
}