'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { MenstrualCyclePredictor } from '@/lib/menstrual-cycle-predictor'

type CycleData = {
  id: string
  cycleStartDate: string
  cycleLength: number
  periodLength: number
  energyLevel: number
  studyCapacity: number
  symptoms: string[]
  notes?: string
}

type CyclePhase = {
  name: string
  day: number
  energy: number
  studyCapacity: number
  recommendations: string[]
  color: string
  emoji: string
}

export default function MenstrualCycleTracker() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(7)
  const [studyCapacity, setStudyCapacity] = useState(7)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [activeTab, setActiveTab] = useState<'tracker' | 'calendar' | 'insights'>('tracker')
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date().toISOString().split('T')[0])

  const { data: cycles } = useQuery<CycleData[]>({
    queryKey: ['menstrual-cycles'],
    queryFn: async () => {
      const response = await fetch('/api/menstrual-cycle')
      if (!response.ok) throw new Error('Failed to fetch cycles')
      const result = await response.json()
      return result.data
    }
  })

  const saveCycle = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/menstrual-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to save cycle')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menstrual-cycles'] })
    }
  })

  const handleSave = () => {
    saveCycle.mutate({
      cycleStartDate: selectedDate,
      cycleLength: 28,
      periodLength: 5,
      energyLevel,
      symptoms
    })
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'text-red-400'
      case 'follicular': return 'text-green-400'
      case 'ovulation': return 'text-yellow-400'
      case 'luteal': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case 'menstrual': return '🔴'
      case 'follicular': return '🌱'
      case 'ovulation': return '⭐'
      case 'luteal': return '🌙'
      default: return '📅'
    }
  }

  const getCurrentPhase = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayCycle = cycles?.find(c => c.cycleStartDate.split('T')[0] === today)
    return todayCycle ? 'menstrual' : 'follicular'
  }

  const getStudyRecommendation = (phase: string, energy: number) => {
    if (phase === 'menstrual' || energy < 4) {
      return 'Light study: Review notes, easy practice questions'
    }
    if (phase === 'ovulation' || energy > 8) {
      return 'Peak performance: Tackle difficult topics, intensive practice'
    }
    if (phase === 'follicular') {
      return 'Learning phase: New concepts, theory building'
    }
    return 'Consolidation: Practice tests, revision'
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>🌸</span>
            <span>Cycle Intelligence</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className="text-2xl mb-2">{getPhaseEmoji(getCurrentPhase())}</div>
              <div className={`font-semibold ${getPhaseColor(getCurrentPhase())}`}>
                {getCurrentPhase().charAt(0).toUpperCase() + getCurrentPhase().slice(1)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Current Phase</div>
            </div>
            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-white">
                {cycles?.find(c => c.cycleStartDate.split('T')[0] === new Date().toISOString().split('T')[0])?.energyLevel || 7}/10
              </div>
              <div className="text-xs text-gray-400 mt-1">Energy Level</div>
            </div>
          </div>

          {/* Study Recommendation */}
          <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
            <h4 className="text-pink-300 font-medium mb-2">Today's Study Strategy</h4>
            <p className="text-white text-sm">
              {getStudyRecommendation(getCurrentPhase(), cycles?.find(c => c.cycleStartDate.split('T')[0] === new Date().toISOString().split('T')[0])?.energyLevel || 7)}
            </p>
          </div>

          {/* Quick Entry */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Quick Entry</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Cycle Start Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Cycle Length</label>
                <input
                  type="number"
                  min="21"
                  max="35"
                  value={28}
                  className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Energy Level: {energyLevel}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saveCycle.isPending}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition-colors"
            >
              {saveCycle.isPending ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}