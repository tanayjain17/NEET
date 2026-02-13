'use client'

import { useState, useEffect } from 'react'

export function useAchievementPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [achievementLevel, setAchievementLevel] = useState<300 | 400 | null>(null)
  const [questionCount, setQuestionCount] = useState(0)

  const checkAchievement = (totalQuestions: number) => {
    const today = new Date().toISOString().split('T')[0]
    let triggered = false
    
    // Check if we should show popup for 400+ (higher priority)
    if (totalQuestions >= 400) {
      const storageKey = `achievement-400-${today}`
      const hasShown400Today = localStorage.getItem(storageKey)
      if (!hasShown400Today) {
        setAchievementLevel(400)
        setQuestionCount(totalQuestions)
        setShowPopup(true)
        localStorage.setItem(storageKey, 'true')
        triggered = true
        return
      }
    }
    
    // Check if we should show popup for 300+
    if (totalQuestions >= 300) {
      const storageKey = `achievement-300-${today}`
      const hasShown300Today = localStorage.getItem(storageKey)
      if (!hasShown300Today) {
        setAchievementLevel(300)
        setQuestionCount(totalQuestions)
        setShowPopup(true)
        localStorage.setItem(storageKey, 'true')
        triggered = true
        return
      }
    }
    
    // Debug fallback - only log if achievement should have triggered but didn't
    if (!triggered && totalQuestions >= 300) {
      console.log('🚨 Achievement Debug:', {
        totalQuestions,
        today,
        localStorage300: localStorage.getItem(`achievement-300-${today}`),
        localStorage400: localStorage.getItem(`achievement-400-${today}`)
      })
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    setAchievementLevel(null)
    setQuestionCount(0)
  }

  return {
    showPopup,
    achievementLevel,
    questionCount,
    checkAchievement,
    closePopup
  }
}