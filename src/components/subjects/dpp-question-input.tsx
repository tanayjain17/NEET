'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface DppQuestionInputProps {
  chapterId: string
  dppIndex: number
  currentCount: number
  isCompleted: boolean
}

export default function DppQuestionInput({ 
  chapterId, 
  dppIndex, 
  currentCount, 
  isCompleted 
}: DppQuestionInputProps) {
  const [questionCount, setQuestionCount] = useState(currentCount || 0)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (count: number) => {
      const response = await fetch(`/api/chapters/${chapterId}/dpp-questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dppIndex, questionCount: count })
      })
      if (!response.ok) throw new Error('Failed to update')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
    }
  })

  const handleUpdate = (count: number) => {
    setQuestionCount(count)
    updateMutation.mutate(count)
  }

  if (!isCompleted) {
    return null
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max="100"
        value={questionCount}
        onChange={(e) => handleUpdate(parseInt(e.target.value) || 0)}
        className="w-14 px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-400 focus:outline-none"
        placeholder="0"
      />
      <span className="text-xs text-gray-500">Q</span>
    </div>
  )
}