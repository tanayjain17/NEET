'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

type MemoryItem = {
  id: string
  subject: string
  chapter: string
  concept: string
  content: string
  itemType: 'formula' | 'concept' | 'fact' | 'diagram'
  difficulty: number
  nextReview: string
  reviewCount: number
  retentionScore: number
}

export default function MemoryRetentionSystem() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'review' | 'add' | 'stats'>('review')
  const [currentItem, setCurrentItem] = useState<MemoryItem | null>(null)

  const { data: dueItems } = useQuery({
    queryKey: ['memory-due-items'],
    queryFn: async () => {
      const response = await fetch('/api/memory-system?action=due-items')
      if (!response.ok) throw new Error('Failed to fetch due items')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 60000
  })

  const { data: stats } = useQuery({
    queryKey: ['memory-stats'],
    queryFn: async () => {
      const response = await fetch('/api/memory-system?action=stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000
  })

  const reviewItem = useMutation({
    mutationFn: async ({ itemId, performance }: { itemId: string; performance: string }) => {
      const response = await fetch('/api/memory-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review-item',
          itemId,
          performance
        })
      })
      if (!response.ok) throw new Error('Failed to review item')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory-due-items'] })
      queryClient.invalidateQueries({ queryKey: ['memory-stats'] })
      setCurrentItem(null)
    }
  })

  const addItem = useMutation({
    mutationFn: async (itemData: any) => {
      const response = await fetch('/api/memory-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-item',
          ...itemData
        })
      })
      if (!response.ok) throw new Error('Failed to add item')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory-due-items'] })
      queryClient.invalidateQueries({ queryKey: ['memory-stats'] })
    }
  })

  const handleReview = (performance: 'easy' | 'good' | 'hard' | 'forgot') => {
    if (currentItem) {
      reviewItem.mutate({ itemId: currentItem.id, performance })
    }
  }

  const getNextItem = () => {
    if (dueItems && dueItems.length > 0) {
      const nextIndex = currentItem 
        ? (dueItems.findIndex((item: MemoryItem) => item.id === currentItem.id) + 1) % dueItems.length
        : 0
      setCurrentItem(dueItems[nextIndex])
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'easy': return 'bg-green-500 hover:bg-green-600'
      case 'good': return 'bg-blue-500 hover:bg-blue-600'
      case 'hard': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'forgot': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-background-secondary/50 p-1 rounded-lg">
        {[
          { key: 'review', label: '🧠 Review', count: dueItems?.length || 0 },
          { key: 'add', label: '➕ Add Item' },
          { key: 'stats', label: '📊 Statistics' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            {tab.label} {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          {!currentItem ? (
            <Card className="glass-effect border-purple-400/30">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-white font-semibold mb-4">Memory Review Session</h3>
                {dueItems && dueItems.length > 0 ? (
                  <>
                    <p className="text-gray-300 mb-4">
                      You have {dueItems.length} items due for review
                    </p>
                    <button
                      onClick={getNextItem}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg"
                    >
                      Start Review Session
                    </button>
                  </>
                ) : (
                  <p className="text-gray-300">No items due for review. Great job! 🎉</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="glass-effect border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{currentItem.subject} - {currentItem.chapter}</span>
                    <span className="text-sm text-gray-400">
                      Review #{currentItem.reviewCount + 1}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300 mb-2">
                      {currentItem.concept}
                    </div>
                    <div className="text-gray-300 mb-4">
                      {currentItem.content}
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className={`px-3 py-1 rounded text-sm ${
                        currentItem.itemType === 'formula' ? 'bg-blue-500/20 text-blue-300' :
                        currentItem.itemType === 'concept' ? 'bg-green-500/20 text-green-300' :
                        currentItem.itemType === 'fact' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {currentItem.itemType}
                      </span>
                      <span className="text-gray-400">
                        Difficulty: {currentItem.difficulty}/5
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">How well did you remember this?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'forgot', label: 'Forgot', desc: 'Completely forgot' },
                      { key: 'hard', label: 'Hard', desc: 'Struggled to recall' },
                      { key: 'good', label: 'Good', desc: 'Recalled with effort' },
                      { key: 'easy', label: 'Easy', desc: 'Instant recall' }
                    ].map(option => (
                      <button
                        key={option.key}
                        onClick={() => handleReview(option.key as any)}
                        disabled={reviewItem.isPending}
                        className={`p-4 rounded-lg text-white transition-colors ${getPerformanceColor(option.key)}`}
                      >
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm opacity-80">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Add Item Tab */}
      {activeTab === 'add' && (
        <Card className="glass-effect border-green-400/30">
          <CardHeader>
            <CardTitle className="text-white">➕ Add Memory Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              addItem.mutate({
                subject: formData.get('subject'),
                chapter: formData.get('chapter'),
                concept: formData.get('concept'),
                content: formData.get('content'),
                itemType: formData.get('itemType'),
                difficulty: parseInt(formData.get('difficulty') as string)
              })
              ;(e.target as HTMLFormElement).reset()
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Subject</label>
                  <select name="subject" required className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Chapter</label>
                  <input name="chapter" required className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white" placeholder="Chapter name" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Concept</label>
                <input name="concept" required className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white" placeholder="Concept or formula name" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Content</label>
                <textarea name="content" required rows={3} className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white" placeholder="Formula, definition, or explanation" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Type</label>
                  <select name="itemType" required className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white">
                    <option value="formula">Formula</option>
                    <option value="concept">Concept</option>
                    <option value="fact">Fact</option>
                    <option value="diagram">Diagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Difficulty (1-5)</label>
                  <input name="difficulty" type="number" min="1" max="5" defaultValue="3" required className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white" />
                </div>
              </div>
              <button type="submit" disabled={addItem.isPending} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg transition-colors">
                {addItem.isPending ? 'Adding...' : 'Add Memory Item'}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stats.totalItems}
                </div>
                <div className="text-gray-300">Total Items</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {stats.dueToday}
                </div>
                <div className="text-gray-300">Due Today</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.round(stats.averageRetention * 100)}%
                </div>
                <div className="text-gray-300">Avg Retention</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Subject Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.subjectBreakdown.map((subject: any) => (
                  <div key={subject.subject} className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{subject.subject}</div>
                      <div className="text-sm text-gray-400">{subject.items} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-400">
                        {Math.round(subject.avgRetention * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">retention</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}