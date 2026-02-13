'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import AchievementPopup from './achievement-popup'
import WeeklyAchievementPopup from './weekly-achievement-popup'
import { useAchievementPopup } from '@/hooks/use-achievement-popup'
import { useWeeklyAchievementPopup } from '@/hooks/use-weekly-achievement-popup'


type DailyGoalFormData = {
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
  physicsDpp: number
  chemistryDpp: number
  botanyDpp: number
  zoologyDpp: number
  physicsRevision: number
  chemistryRevision: number
  botanyRevision: number
  zoologyRevision: number
}

type DailyGoalSummary = {
  totalQuestions: number
  totalDpp: number
  totalRevision: number
  emoji: string
  motivationalMessage: string
}

export default function DailyGoalsForm() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<DailyGoalFormData>({
    physicsQuestions: 0,
    chemistryQuestions: 0,
    botanyQuestions: 0,
    zoologyQuestions: 0,
    physicsDpp: 0,
    chemistryDpp: 0,
    botanyDpp: 0,
    zoologyDpp: 0,
    physicsRevision: 0,
    chemistryRevision: 0,
    botanyRevision: 0,
    zoologyRevision: 0
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const { showPopup, achievementLevel, questionCount, checkAchievement, closePopup } = useAchievementPopup()
  const { 
    showPopup: showWeeklyPopup, 
    achievementLevel: weeklyAchievementLevel, 
    questionCount: weeklyQuestionCount, 
    checkWeeklyAchievement, 
    closePopup: closeWeeklyPopup 
  } = useWeeklyAchievementPopup()


  // Fetch today's goal
  const { data: todayGoal, isLoading } = useQuery({
    queryKey: ['daily-goal-today'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/today')
      if (!response.ok) throw new Error('Failed to fetch today\'s goal')
      const result = await response.json()
      return result.data
    }
  })

  // Fetch daily summary
  const { data: summary } = useQuery<DailyGoalSummary>({
    queryKey: ['daily-goal-summary'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/summary')
      if (!response.ok) throw new Error('Failed to fetch summary')
      const result = await response.json()
      return result.data
    }
  })

  // Load existing data when component mounts
  useEffect(() => {
    if (todayGoal) {
      setFormData({
        physicsQuestions: todayGoal.physicsQuestions || 0,
        chemistryQuestions: todayGoal.chemistryQuestions || 0,
        botanyQuestions: todayGoal.botanyQuestions || 0,
        zoologyQuestions: todayGoal.zoologyQuestions || 0,
        physicsDpp: todayGoal.physicsDpp || 0,
        chemistryDpp: todayGoal.chemistryDpp || 0,
        botanyDpp: todayGoal.botanyDpp || 0,
        zoologyDpp: todayGoal.zoologyDpp || 0,
        physicsRevision: todayGoal.physicsRevision || 0,
        chemistryRevision: todayGoal.chemistryRevision || 0,
        botanyRevision: todayGoal.botanyRevision || 0,
        zoologyRevision: todayGoal.zoologyRevision || 0
      })
      setHasUnsavedChanges(false)
    }
  }, [todayGoal])

  const handleInputChange = (field: keyof DailyGoalFormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, value) }))
    setHasUnsavedChanges(true)
    setSubmitStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      setErrorMessage('Please sign in to save daily goals')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save daily goals')
      }

      // Run background analysis if flagged
      if (result.showMistakePopup) {
        // Run silent analysis in background
        fetch('/api/mistakes/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionType: 'daily_study',
            sessionData: {
              physicsQuestions: formData.physicsQuestions,
              chemistryQuestions: formData.chemistryQuestions,
              botanyQuestions: formData.botanyQuestions,
              zoologyQuestions: formData.zoologyQuestions
            },
            mistakeData: {
              mistakeCategories: [],
              specificMistakes: [],
              improvementAreas: [],
              timeWasted: 0,
              stressLevel: 5,
              energyLevel: 7,
              focusLevel: 6,
              subjectSpecificMistakes: {},
              mistakeContext: {
                timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon',
                questionDifficulty: 'medium',
                topicArea: 'General'
              }
            }
          })
        }).catch(console.error)
      }
      
      setSubmitStatus('success')
      setHasUnsavedChanges(false)
      
      // Check for achievement popup
      const totalQuestions = Object.entries(formData)
        .filter(([key]) => key.includes('Questions'))
        .reduce((sum, [, value]) => sum + value, 0)
      
      checkAchievement(totalQuestions)
      
      // Check for weekly achievement
      try {
        const weeklyResponse = await fetch('/api/daily-goals/weekly-comparison')
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json()
          const currentWeekQuestions = weeklyData.data?.currentWeek?.totalQuestions || 0
          checkWeeklyAchievement(currentWeekQuestions)
        }
      } catch (error) {
        // Weekly achievement check failed silently
      }
      
      // Invalidate all related queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ['daily-goal-today'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goal-summary'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goals-heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goals-trend'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-goals-trend'] })
      queryClient.invalidateQueries({ queryKey: ['monthly-goals-trend'] })
      queryClient.invalidateQueries({ queryKey: ['question-stats'] })
      queryClient.invalidateQueries({ queryKey: ['question-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['recent-goals'] })
      queryClient.invalidateQueries({ queryKey: ['study-streaks'] })
      
      // Sync analytics for real-time updates
      fetch('/api/sync-analytics', { method: 'POST' })
      
      // Auto-update study streak
      fetch('/api/study-streaks', { method: 'POST' })
        .catch(error => console.log('Study streak update failed:', error))

      setTimeout(() => setSubmitStatus('idle'), 3000)

    } catch (error) {
      console.error('Error saving daily goals:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save daily goals')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!todayGoal?.id || !confirm('Are you sure you want to delete today\'s progress?')) return

    try {
      const response = await fetch(`/api/daily-goals/${todayGoal.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete daily goal')

      // Reset form
      setFormData({
        physicsQuestions: 0, chemistryQuestions: 0, botanyQuestions: 0, zoologyQuestions: 0,
        physicsDpp: 0, chemistryDpp: 0, botanyDpp: 0, zoologyDpp: 0,
        physicsRevision: 0, chemistryRevision: 0, botanyRevision: 0, zoologyRevision: 0
      })
      setHasUnsavedChanges(false)
      
      queryClient.invalidateQueries({ queryKey: ['daily-goal-today'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goal-summary'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goals-heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['daily-goals-trend'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-goals-trend'] })
      queryClient.invalidateQueries({ queryKey: ['monthly-goals-trend'] })
      queryClient.invalidateQueries({ queryKey: ['question-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['study-streaks'] })

    } catch (error) {
      console.error('Error deleting daily goal:', error)
      setErrorMessage('Failed to delete daily goal')
      setSubmitStatus('error')
    }
  }

  const totalQuestions = Object.entries(formData)
    .filter(([key]) => key.includes('Questions'))
    .reduce((sum, [, value]) => sum + value, 0)

  const getPerformanceEmoji = () => {
    if (totalQuestions >= 500) return '🔥'
    if (totalQuestions >= 300) return '😘'
    if (totalQuestions >= 250) return '😊'
    if (totalQuestions >= 150) return '😐'
    if (totalQuestions > 0) return '😟'
    return '😴'
  }

  const subjects = [
    { key: 'physics', name: 'Physics', color: 'text-blue-400' },
    { key: 'chemistry', name: 'Chemistry', color: 'text-green-400' },
    { key: 'botany', name: 'Botany', color: 'text-emerald-400' },
    { key: 'zoology', name: 'Zoology', color: 'text-purple-400' }
  ]

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Today's Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
    <div className="space-y-6">
      {/* Performance Summary */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-effect border-gray-700 bg-gradient-to-r from-primary/10 to-pink-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{summary.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {summary.totalQuestions} Questions Today
                        </h3>
                        <p className="text-gray-300">{summary.motivationalMessage}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">DPPs: {summary.totalDpp}</div>
                    <div className="text-sm text-gray-400">Revision: {summary.totalRevision}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <Card className="glass-effect border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Today's Progress</span>
            <span className="text-2xl">{getPerformanceEmoji()}</span>
          </CardTitle>
          {todayGoal && (
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Delete today's progress"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {subjects.map((subject) => (
              <motion.div
                key={subject.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: subjects.indexOf(subject) * 0.1 }}
                className="p-4 bg-background-secondary/30 rounded-lg border border-gray-700"
              >
                <h3 className={`text-lg font-semibold mb-4 ${subject.color}`}>
                  {subject.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Questions
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData[`${subject.key}Questions` as keyof DailyGoalFormData]}
                      onChange={(e) => handleInputChange(
                        `${subject.key}Questions` as keyof DailyGoalFormData,
                        parseInt(e.target.value) || 0
                      )}
                      className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      DPPs
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData[`${subject.key}Dpp` as keyof DailyGoalFormData]}
                      onChange={(e) => handleInputChange(
                        `${subject.key}Dpp` as keyof DailyGoalFormData,
                        parseInt(e.target.value) || 0
                      )}
                      className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Revision (hrs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData[`${subject.key}Revision` as keyof DailyGoalFormData]}
                      onChange={(e) => handleInputChange(
                        `${subject.key}Revision` as keyof DailyGoalFormData,
                        parseFloat(e.target.value) || 0
                      )}
                      className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Status Messages */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 text-sm">Daily goals saved successfully!</span>
                </motion.div>
              )}

              {submitStatus === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 text-sm">{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>



            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !hasUnsavedChanges}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                hasUnsavedChanges
                  ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={hasUnsavedChanges ? { scale: 1.02 } : {}}
              whileTap={hasUnsavedChanges ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Saving...' : hasUnsavedChanges ? 'Save Progress' : 'No Changes'}
            </motion.button>
          </form>
        </CardContent>
      </Card>
      

    </div>
    
    {/* Achievement Popup */}
    {showPopup && achievementLevel && (
      <AchievementPopup
        isOpen={showPopup}
        onClose={closePopup}
        achievementLevel={achievementLevel}
        questionCount={questionCount}
      />
    )}
    
    {/* Weekly Achievement Popup */}
    {showWeeklyPopup && weeklyAchievementLevel && (
      <WeeklyAchievementPopup
        isOpen={showWeeklyPopup}
        onClose={closeWeeklyPopup}
        achievementLevel={weeklyAchievementLevel}
        questionCount={weeklyQuestionCount}
      />
    )}
    </>
  )
}