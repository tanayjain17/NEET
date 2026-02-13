import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'react-hot-toast'

/**
 * Hook for real-time data synchronization
 * Ensures all changes are immediately saved and UI is updated
 */
export function useRealTimeSync() {
  const queryClient = useQueryClient()

  // Sync chapter progress
  const syncChapter = useMutation({
    mutationFn: async ({ chapterId, updates }: { chapterId: string; updates: any }) => {
      const response = await fetch('/api/sync/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, updates })
      })
      
      if (!response.ok) throw new Error('Failed to sync chapter')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
    },
    onError: (error) => {
      console.error('Chapter sync error:', error)
      console.error('Failed to save progress. Please try again.')
    }
  })

  // Sync daily goals
  const syncDailyGoals = useMutation({
    mutationFn: async ({ date, updates }: { date: Date; updates: any }) => {
      const response = await fetch('/api/sync/daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString(), updates })
      })
      
      if (!response.ok) throw new Error('Failed to sync daily goals')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['daily-goals'] })
      queryClient.invalidateQueries({ queryKey: ['question-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['question-analytics'] })
    },
    onError: (error) => {
      console.error('Daily goals sync error:', error)
      console.error('Failed to save daily goals. Please try again.')
    }
  })

  // Sync test performance
  const syncTestPerformance = useMutation({
    mutationFn: async (testData: {
      testType: string
      testNumber: string
      score: number
      testDate: Date
    }) => {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (!response.ok) throw new Error('Failed to sync test performance')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-trend'] })
      console.log('Test score saved successfully! 📊')
    },
    onError: (error) => {
      console.error('Test sync error:', error)
      console.error('Failed to save test score. Please try again.')
    }
  })

  // Delete test performance
  const deleteTestPerformance = useMutation({
    mutationFn: async (testId: string) => {
      const response = await fetch(`/api/tests?id=${testId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete test')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['test-trend'] })
      console.log('Test deleted successfully! 🗑️')
    },
    onError: (error) => {
      console.error('Test delete error:', error)
      console.error('Failed to delete test. Please try again.')
    }
  })

  // Sync mood entry
  const syncMoodEntry = useMutation({
    mutationFn: async ({ date, mood }: { date: Date; mood: string }) => {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString(), mood })
      })
      
      if (!response.ok) throw new Error('Failed to sync mood')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      console.log('Mood updated! 😊')
    },
    onError: (error) => {
      console.error('Mood sync error:', error)
      console.error('Failed to save mood. Please try again.')
    }
  })

  return {
    syncChapter,
    syncDailyGoals,
    syncTestPerformance,
    deleteTestPerformance,
    syncMoodEntry,
    isLoading: syncChapter.isPending || syncDailyGoals.isPending || 
               syncTestPerformance.isPending || deleteTestPerformance.isPending || syncMoodEntry.isPending
  }
}

/**
 * Hook for optimistic updates with automatic rollback on failure
 */
export function useOptimisticSync() {
  const queryClient = useQueryClient()

  const updateWithOptimism = async <T>(
    queryKey: string[],
    updater: (oldData: T) => T,
    syncFn: () => Promise<any>
  ) => {
    // Snapshot the previous value
    const previousData = queryClient.getQueryData<T>(queryKey)

    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData
      return updater(oldData)
    })

    try {
      // Perform the actual sync
      await syncFn()
    } catch (error) {
      // On error, roll back to the previous value
      queryClient.setQueryData(queryKey, previousData)
      throw error
    }
  }

  return { updateWithOptimism }
}