'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface MistakeData {
  mistakeCategories: string[]
  specificMistakes: string[]
  improvementAreas: string[]
  timeWasted: number
  stressLevel: number
  energyLevel: number
  focusLevel: number
}

interface SessionData {
  physicsQuestions?: number
  chemistryQuestions?: number
  botanyQuestions?: number
  zoologyQuestions?: number
  testScore?: number
  testType?: string
  sessionStartTime?: string
  isAfternoonSession?: boolean
  currentSubject?: string
}

export function useMistakeAnalysis() {
  const [showPopup, setShowPopup] = useState(false)
  const [sessionData, setSessionData] = useState<SessionData>({})
  const [sessionType, setSessionType] = useState<'daily_study' | 'test'>('daily_study')
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const triggerAnalysis = (type: 'daily_study' | 'test', data: SessionData) => {
    setSessionType(type)
    setSessionData(data)
    setShowPopup(true)
  }

  const submitAnalysis = async (mistakeData: MistakeData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/mistakes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          sessionData,
          mistakeData
        })
      })

      if (!response.ok) throw new Error('Failed to analyze mistakes')

      const result = await response.json()
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goals'] })
      queryClient.invalidateQueries({ queryKey: ['mistake-patterns'] })
      
      return result.data
    } catch (error) {
      console.error('Error submitting mistake analysis:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    setSessionData({})
  }

  return {
    showPopup,
    sessionData,
    sessionType,
    loading,
    triggerAnalysis,
    submitAnalysis,
    closePopup
  }
}