'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function HormonalOptimizationPanel() {
  const queryClient = useQueryClient()
  const [selectedPhase, setSelectedPhase] = useState('follicular')
  const [implementedToday, setImplementedToday] = useState(false)
  const [effectiveness, setEffectiveness] = useState(0)
  const [aiRecommendations, setAiRecommendations] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  const { data: optimization, isLoading } = useQuery({
    queryKey: ['hormonal-optimization', selectedPhase],
    queryFn: async () => {
      const response = await fetch(`/api/cycle-optimization/hormonal?phase=${selectedPhase}`)
      if (!response.ok) throw new Error('Failed to fetch optimization')
      return response.json()
    }
  })

  const saveImplementation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/cycle-optimization/hormonal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to save implementation')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hormonal-optimization'] })
    }
  })

  const phases = [
    { key: 'menstrual', label: 'Menstrual 🔴', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
    { key: 'follicular', label: 'Follicular 🌱', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
    { key: 'ovulation', label: 'Ovulation ⭐', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    { key: 'luteal', label: 'Luteal 🌙', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' }
  ]

  const handleSaveImplementation = () => {
    saveImplementation.mutate({
      date: new Date().toISOString().split('T')[0],
      cyclePhase: selectedPhase,
      implemented: implementedToday,
      effectiveness: effectiveness
    })
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-2">🧬</span>
              Vegetarian Hormonal Optimization for Peak NEET Performance
            </span>
            <button
              onClick={async () => {
                setLoadingAI(true)
                try {
                  const response = await fetch('/api/vegetarian-ai/optimization', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      cyclePhase: selectedPhase,
                      currentDay: 1,
                      energyLevel: 7,
                      studyHours: 8,
                      symptoms: [],
                      preferences: {
                        spiceLevel: 'medium',
                        mealTiming: ['7:00 AM', '12:00 PM', '7:00 PM'],
                        allergies: []
                      }
                    })
                  })
                  const result = await response.json()
                  setAiRecommendations(result.data)
                } catch (error) {
                  console.error('Failed to get AI recommendations:', error)
                } finally {
                  setLoadingAI(false)
                }
              }}
              disabled={loadingAI}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              {loadingAI ? '🤖 Generating...' : '🤖 Get AI Advice'}
            </button>
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
        </CardContent>
      </Card>

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
        <div className="space-y-6">
          {/* Supplements */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">💊</span>
                Cognitive Enhancement Supplements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimization?.data?.supplements?.map((supplement: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-background-secondary/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{supplement}</span>
                      <span className="text-green-400 text-sm">✓ Safe</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {getSupplementBenefit(supplement)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nutrition */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">🥗</span>
                Brain-Boosting Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {optimization?.data?.nutrition?.map((food: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-green-500/10 rounded-lg border border-green-400/20 text-center"
                  >
                    <div className="text-2xl mb-2">{getFoodEmoji(food)}</div>
                    <div className="text-white text-sm font-medium">{food}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getFoodBenefit(food)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Caffeine Timing */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">☕</span>
                Optimal Caffeine Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-yellow-400 font-semibold">Best Time:</span>
                  <span className="text-white font-bold">{optimization?.data?.caffeineTime}</span>
                </div>
                <div className="text-gray-300 text-sm">
                  {getCaffeineStrategy(selectedPhase)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Natural Nootropics */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">🌿</span>
                Natural Cognitive Enhancers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimization?.data?.nootropics?.map((nootropic: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-medium">{nootropic}</span>
                      <span className="text-xs text-gray-400">Natural</span>
                    </div>
                    <div className="text-sm text-gray-300 mt-2">
                      {getNootropicBenefit(nootropic)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stress Management */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">🧘</span>
                Stress Management Techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimization?.data?.stressManagement?.map((technique: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20"
                  >
                    <div className="text-blue-300 font-medium mb-2">{technique}</div>
                    <div className="text-sm text-gray-300">
                      {getStressTechniqueBenefit(technique)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          {aiRecommendations && (
            <Card className="glass-effect border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">🤖</span>
                  Personalized Vegetarian AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
                  <div className="text-gray-100 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatAIResponse(aiRecommendations) }}></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Implementation Tracker */}
          <Card className="glass-effect border-pink-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">📊</span>
                Today's Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={implementedToday}
                      onChange={(e) => setImplementedToday(e.target.checked)}
                      className="rounded border-gray-600 bg-background-secondary"
                    />
                    <span className="text-white">I followed today's optimization plan</span>
                  </label>
                </div>
                
                {implementedToday && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        How effective did you find it? (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={effectiveness}
                        onChange={(e) => setEffectiveness(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Not effective</span>
                        <span className="text-white font-medium">{effectiveness}/10</span>
                        <span>Very effective</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSaveImplementation}
                      disabled={saveImplementation.isPending}
                      className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      {saveImplementation.isPending ? 'Saving...' : 'Save Today\'s Results'}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getSupplementBenefit(supplement: string): string {
  const benefits = {
    'Iron': 'Prevents fatigue, improves oxygen transport to brain',
    'Magnesium': 'Reduces stress, improves sleep quality',
    'Omega-3': 'Enhances memory and cognitive function',
    'Vitamin D': 'Supports mood and brain health',
    'B-Complex': 'Boosts energy and neurotransmitter production',
    'Rhodiola': 'Reduces mental fatigue, improves focus',
    'Ginkgo Biloba': 'Enhances blood flow to brain'
  }
  
  for (const [key, benefit] of Object.entries(benefits)) {
    if (supplement.includes(key)) return benefit
  }
  return 'Supports cognitive performance'
}

function getFoodEmoji(food: string): string {
  const emojis = {
    'leafy greens': '🥬', 'lentils': '🫘', 'chocolate': '🍫',
    'fish': '🐟', 'walnuts': '🥜', 'blueberries': '🫐',
    'avocados': '🥑', 'nuts': '🌰', 'seeds': '🌻',
    'turkey': '🦃', 'bananas': '🍌', 'herbal teas': '🍵'
  }
  
  for (const [key, emoji] of Object.entries(emojis)) {
    if (food.toLowerCase().includes(key)) return emoji
  }
  return '🥗'
}

function getFoodBenefit(food: string): string {
  return 'Brain fuel'
}

function getCaffeineStrategy(phase: string): string {
  const strategies = {
    menstrual: 'Reduced caffeine to avoid increasing anxiety and cramps',
    follicular: 'Optimal timing for maximum cognitive enhancement',
    ovulation: 'Peak effectiveness for intense study sessions',
    luteal: 'Limited to morning only to prevent sleep disruption'
  }
  
  return strategies[phase as keyof typeof strategies] || 'Optimized for your cycle phase'
}

function getNootropicBenefit(nootropic: string): string {
  const benefits = {
    'Green tea': 'L-theanine promotes calm focus',
    'Dark chocolate': 'Flavonoids improve blood flow to brain',
    'Ginger tea': 'Reduces inflammation, aids digestion',
    'Chamomile': 'Promotes relaxation and better sleep',
    'Bacopa monnieri': 'Enhances memory formation',
    'Lion\'s mane': 'Supports nerve growth and brain health',
    'Ashwagandha': 'Reduces cortisol and stress',
    'Lemon balm': 'Calms mind, improves focus'
  }
  
  for (const [key, benefit] of Object.entries(benefits)) {
    if (nootropic.includes(key)) return benefit
  }
  return 'Natural cognitive support'
}

function getStressTechniqueBenefit(technique: string): string {
  const benefits = {
    'Deep breathing': 'Activates parasympathetic nervous system',
    'Gentle yoga': 'Reduces cortisol, improves flexibility',
    'Meditation': 'Enhances focus and emotional regulation',
    'Cold shower': 'Boosts alertness and resilience',
    'Progressive relaxation': 'Releases physical tension'
  }
  
  for (const [key, benefit] of Object.entries(benefits)) {
    if (technique.includes(key)) return benefit
  }
  return 'Reduces stress and improves performance'
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