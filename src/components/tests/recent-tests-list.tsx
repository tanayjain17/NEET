'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, AcademicCapIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TestPerformance = {
  id: string
  testType: string
  testNumber: string
  score: number
  testDate: string
  createdAt: string
}

type EditingTest = {
  id: string
  testType: string
  testNumber: string
  score: number
  testDate: string
}

export default function RecentTestsList() {
  const queryClient = useQueryClient()
  const [editingTest, setEditingTest] = useState<EditingTest | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const { data: recentTests, isLoading, error } = useQuery<TestPerformance[]>({
    queryKey: ['recent-tests'],
    queryFn: async () => {
      const response = await fetch('/api/tests?limit=10')
      if (!response.ok) {
        throw new Error('Failed to fetch recent tests')
      }
      const result = await response.json()
      return result.data
    }
  })

  const getPerformanceEmoji = (score: number) => {
    const percentage = (score / 720) * 100
    if (percentage < 75) return '😢'
    if (percentage < 85) return '😟'
    if (percentage < 95) return '😊'
    return '😘'
  }

  const getPerformanceColor = (score: number) => {
    const percentage = (score / 720) * 100
    if (percentage < 75) return 'text-red-400'
    if (percentage < 85) return 'text-yellow-400'
    if (percentage < 95) return 'text-green-400'
    return 'text-pink-400'
  }

  const handleEdit = (test: TestPerformance) => {
    setEditingTest({
      id: test.id,
      testType: test.testType,
      testNumber: test.testNumber,
      score: test.score,
      testDate: test.testDate.split('T')[0]
    })
  }

  const handleSaveEdit = async () => {
    if (!editingTest) return

    try {
      const response = await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTest.id,
          testType: editingTest.testType,
          testNumber: editingTest.testNumber,
          score: editingTest.score,
          testDate: new Date(editingTest.testDate).toISOString()
        })
      })

      if (!response.ok) throw new Error('Failed to update test')

      queryClient.invalidateQueries({ queryKey: ['recent-tests'] })
      queryClient.invalidateQueries({ queryKey: ['test-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-performance-trend'] })
      setEditingTest(null)
    } catch (error) {
      console.error('Error updating test:', error)
    }
  }

  const handleDelete = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return

    setIsDeleting(testId)
    try {
      const response = await fetch(`/api/tests?id=${testId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete test')

      queryClient.invalidateQueries({ queryKey: ['recent-tests'] })
      queryClient.invalidateQueries({ queryKey: ['test-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-performance-trend'] })
    } catch (error) {
      console.error('Error deleting test:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !recentTests || recentTests.length === 0) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <AcademicCapIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No tests recorded yet</p>
            <p className="text-sm mt-1">Add your first test score to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {recentTests.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 bg-background-secondary/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                {editingTest?.id === test.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Test Type
                        </label>
                        <select
                          value={editingTest.testType}
                          onChange={(e) => setEditingTest({...editingTest, testType: e.target.value})}
                          className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                        >
                          <option value="Weekly Test">Weekly Test</option>
                          <option value="Rank Booster">Rank Booster</option>
                          <option value="Test Series">Test Series</option>
                          <option value="AITS">AITS</option>
                          <option value="Full Length Test">Full Length Test</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Test Number
                        </label>
                        <input
                          type="text"
                          value={editingTest.testNumber}
                          onChange={(e) => setEditingTest({...editingTest, testNumber: e.target.value})}
                          className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Score
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="720"
                          value={editingTest.score}
                          onChange={(e) => setEditingTest({...editingTest, score: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Test Date
                        </label>
                        <input
                          type="date"
                          value={editingTest.testDate}
                          onChange={(e) => setEditingTest({...editingTest, testDate: e.target.value})}
                          className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTest(null)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getPerformanceEmoji(test.score)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">
                            {test.testNumber}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({test.testType})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(test.testDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getPerformanceColor(test.score)}`}>
                          {test.score}
                        </div>
                        <div className="text-sm text-gray-400">
                          {Math.round((test.score / 720) * 100)}%
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(test)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit test"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(test.id)}
                          disabled={isDeleting === test.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete test"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}