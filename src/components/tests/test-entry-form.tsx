'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TestType } from '@/lib/repositories/test-performance-repository'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import TestScoreMotivationPopup from '@/components/tests/test-score-motivation-popup'

const testTypes: { value: TestType; label: string; description: string }[] = [
  { value: 'Weekly Test', label: 'Weekly Test', description: 'Regular weekly assessment' },
  { value: 'Rank Booster', label: 'Rank Booster', description: 'Topic-specific practice test' },
  { value: 'Test Series', label: 'Test Series', description: 'Subject-wise comprehensive test' },
  { value: 'AITS', label: 'AITS', description: 'All India Test Series' },
  { value: 'Full Length Test', label: 'Full Length Test', description: 'Complete NEET mock test' }
]

export default function TestEntryForm() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    testType: '' as TestType | '',
    testNumber: '',
    score: '',
    testDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showMotivationPopup, setShowMotivationPopup] = useState(false)
  const [motivationScore, setMotivationScore] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      setErrorMessage('Please sign in to add test scores')
      setSubmitStatus('error')
      return
    }

    if (!formData.testType || !formData.testNumber || !formData.score || !formData.testDate) {
      setErrorMessage('Please fill in all fields')
      setSubmitStatus('error')
      return
    }

    const score = parseInt(formData.score)
    if (isNaN(score) || score < 0 || score > 720) {
      setErrorMessage('Score must be between 0 and 720')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: formData.testType,
          testNumber: formData.testNumber,
          score: score,
          testDate: new Date(formData.testDate).toISOString()
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save test score')
      }

      // Show motivation popup based on score
      setMotivationScore(score)
      setShowMotivationPopup(true)
      
      // Complete the save process
      setSubmitStatus('success')
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['test-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-performance-trend'] })
      
      // Reset form
      setFormData({
        testType: '',
        testNumber: '',
        score: '',
        testDate: new Date().toISOString().split('T')[0]
      })
      
      setTimeout(() => setSubmitStatus('idle'), 3000)

    } catch (error) {
      console.error('Error saving test score:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save test score')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScorePercentage = () => {
    const score = parseInt(formData.score)
    if (isNaN(score)) return 0
    return Math.round((score / 720) * 100 * 100) / 100
  }

  const getPerformanceEmoji = () => {
    const percentage = getScorePercentage()
    if (percentage < 75) return '😢'
    if (percentage < 85) return '😟'
    if (percentage < 95) return '😊'
    return '😘'
  }

  const getPerformanceColor = () => {
    const percentage = getScorePercentage()
    if (percentage < 75) return 'text-red-400'
    if (percentage < 85) return 'text-yellow-400'
    if (percentage < 95) return 'text-green-400'
    return 'text-pink-400'
  }

  return (
    <>
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Add Test Score</span>
            {formData.score && (
              <span className={`text-2xl ${getPerformanceColor()}`}>
                {getPerformanceEmoji()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Test Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {testTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.testType === type.value
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-gray-600 bg-background-secondary/30 text-gray-300 hover:border-gray-500 hover:bg-background-secondary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="testType"
                      value={type.value}
                      checked={formData.testType === type.value}
                      onChange={(e) => setFormData({ ...formData, testType: e.target.value as TestType })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm opacity-70">{type.description}</div>
                    </div>
                    {formData.testType === type.value && (
                      <CheckCircleIcon className="h-5 w-5 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Test Number Input */}
            <div>
              <label htmlFor="testNumber" className="block text-sm font-medium text-gray-300 mb-2">
                Test Number
              </label>
              <input
                type="text"
                id="testNumber"
                value={formData.testNumber}
                onChange={(e) => setFormData({ ...formData, testNumber: e.target.value })}
                className="w-full px-4 py-3 bg-background-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="e.g., Test-01, Test-02, RB-05"
              />
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">
                  Enter test identifier (e.g., Test-01, RB-05, AITS-03)
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.testType && (
                    <div className="text-xs text-gray-500">
                      Suggestions: 
                      {formData.testType === 'Weekly Test' && (
                        <span className="text-blue-400">Test-01, Test-02, Test-03...</span>
                      )}
                      {formData.testType === 'Rank Booster' && (
                        <span className="text-blue-400">RB-01, RB-02, RB-03...</span>
                      )}
                      {formData.testType === 'Test Series' && (
                        <span className="text-blue-400">TS-01, TS-02, TS-03...</span>
                      )}
                      {formData.testType === 'AITS' && (
                        <span className="text-blue-400">AITS-01, AITS-02, AITS-03...</span>
                      )}
                      {formData.testType === 'Full Length Test' && (
                        <span className="text-blue-400">FL-01, FL-02, FL-03...</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Score Input */}
            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-300 mb-2">
                Score (out of 720)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="score"
                  min="0"
                  max="720"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full px-4 py-3 bg-background-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Enter your score (0-720)"
                />
                {formData.score && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getPerformanceColor()}`}>
                      {getScorePercentage()}%
                    </span>
                  </div>
                )}
              </div>
              {formData.score && (parseInt(formData.score) < 0 || parseInt(formData.score) > 720) && (
                <p className="mt-1 text-sm text-red-400">Score must be between 0 and 720</p>
              )}
            </div>

            {/* Test Date */}
            <div>
              <label htmlFor="testDate" className="block text-sm font-medium text-gray-300 mb-2">
                Test Date
              </label>
              <input
                type="date"
                id="testDate"
                value={formData.testDate}
                onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]} // Can't select future dates
                className="w-full px-4 py-3 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <span className="text-green-400 text-sm">Test score saved successfully!</span>
              </div>
            )}

            {submitStatus === 'error' && errorMessage && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <span className="text-red-400 text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.testType || !formData.testNumber || !formData.score || !formData.testDate}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Test Score'}
            </button>
          </form>
        </CardContent>
      </Card>
      
      {/* Test Score Motivation Popup */}
      <TestScoreMotivationPopup
        isOpen={showMotivationPopup}
        onClose={() => setShowMotivationPopup(false)}
        score={motivationScore}
      />
    </>
  )
}