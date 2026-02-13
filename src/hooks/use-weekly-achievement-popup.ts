'use client'

import { useState } from 'react'

export function useWeeklyAchievementPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [achievementLevel, setAchievementLevel] = useState<2000 | 6800 | null>(null)
  const [questionCount, setQuestionCount] = useState(0)

  const checkWeeklyAchievement = (weeklyQuestions: number) => {
    const today = new Date().toDateString()
    
    // Check if we should show popup for 6800+ (higher priority)
    if (weeklyQuestions >= 6800) {
      const hasShown6800ThisWeek = localStorage.getItem(`weekly-achievement-6800-${today}`)
      if (!hasShown6800ThisWeek) {
        setAchievementLevel(6800)
        setQuestionCount(weeklyQuestions)
        setShowPopup(true)
        localStorage.setItem(`weekly-achievement-6800-${today}`, 'true')
        return
      }
    }
    
    // Check if we should show popup for 2000+
    if (weeklyQuestions >= 2000) {
      const hasShown2000ThisWeek = localStorage.getItem(`weekly-achievement-2000-${today}`)
      if (!hasShown2000ThisWeek) {
        setAchievementLevel(2000)
        setQuestionCount(weeklyQuestions)
        setShowPopup(true)
        localStorage.setItem(`weekly-achievement-2000-${today}`, 'true')
        return
      }
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
    checkWeeklyAchievement,
    closePopup
  }
}