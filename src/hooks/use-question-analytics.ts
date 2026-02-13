import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type QuestionCounts = {
  daily: number
  weekly: number
  monthly: number
  lifetime: number
}

export type QuestionBreakdown = {
  assignment: number
  kattar: number
  dpp: number
  dailyGoals: number
  total: number
}

export type QuestionStatsSummary = {
  today: QuestionCounts
  yesterday: QuestionCounts
  thisWeek: number
  thisMonth: number
  breakdown: QuestionBreakdown
}

export type TrendData = {
  date?: Date
  weekStart?: Date
  month?: Date
  count: number
}

/**
 * Hook for fetching question analytics summary
 */
export function useQuestionAnalytics() {
  return useQuery<QuestionStatsSummary>({
    queryKey: ['question-analytics', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/questions?type=summary')
      if (!response.ok) {
        throw new Error('Failed to fetch question analytics')
      }
      return response.json()
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchOnWindowFocus: true
  })
}

/**
 * Hook for fetching question counts for a specific date
 */
export function useQuestionCounts(date?: Date) {
  const dateParam = date ? `&date=${date.toISOString()}` : ''
  
  return useQuery<QuestionCounts>({
    queryKey: ['question-analytics', 'counts', date?.toISOString()],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/questions?type=counts${dateParam}`)
      if (!response.ok) {
        throw new Error('Failed to fetch question counts')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for fetching daily question trend
 */
export function useDailyQuestionTrend(days: number = 30) {
  return useQuery<{ trend: TrendData[] }>({
    queryKey: ['question-analytics', 'daily-trend', days],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/questions?type=daily&days=${days}`)
      if (!response.ok) {
        throw new Error('Failed to fetch daily question trend')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook for fetching weekly question trend
 */
export function useWeeklyQuestionTrend(weeks: number = 12) {
  return useQuery<{ trend: TrendData[] }>({
    queryKey: ['question-analytics', 'weekly-trend', weeks],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/questions?type=weekly&weeks=${weeks}`)
      if (!response.ok) {
        throw new Error('Failed to fetch weekly question trend')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
}

/**
 * Hook for fetching monthly question trend
 */
export function useMonthlyQuestionTrend(months: number = 12) {
  return useQuery<{ trend: TrendData[] }>({
    queryKey: ['question-analytics', 'monthly-trend', months],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/questions?type=monthly&months=${months}`)
      if (!response.ok) {
        throw new Error('Failed to fetch monthly question trend')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

/**
 * Hook for updating question counts
 */
export function useUpdateQuestionCounts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (date?: Date) => {
      const response = await fetch('/api/analytics/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date?.toISOString() }),
      })

      if (!response.ok) {
        throw new Error('Failed to update question counts')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate all question analytics queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['question-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/**
 * Hook for real-time question analytics updates
 */
export function useQuestionAnalyticsSync() {
  const queryClient = useQueryClient()
  const updateMutation = useUpdateQuestionCounts()

  const syncQuestionCounts = async (date?: Date) => {
    try {
      await updateMutation.mutateAsync(date)
    } catch (error) {
      console.error('Failed to sync question counts:', error)
    }
  }

  return {
    syncQuestionCounts,
    isSyncing: updateMutation.isPending
  }
}

/**
 * Hook to check if user deserves motivational message
 */
export function useMotivationalTrigger() {
  const { data: analytics } = useQuestionAnalytics()
  
  if (!analytics) return { shouldShowMessage: false, messageType: null }
  
  const { today } = analytics
  
  if (today.daily >= 500) {
    return { shouldShowMessage: true, messageType: 'boost' }
  }
  
  if (today.daily >= 250) {
    return { shouldShowMessage: true, messageType: 'praise' }
  }
  
  if (today.daily > 0) {
    return { shouldShowMessage: true, messageType: 'encouragement' }
  }
  
  return { shouldShowMessage: false, messageType: null }
}