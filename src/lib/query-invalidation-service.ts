/**
 * Global Query Invalidation Service
 * Ensures real-time updates across all components when data changes
 */

import { QueryClient } from '@tanstack/react-query'

export class QueryInvalidationService {
  private static queryClient: QueryClient | null = null

  static setQueryClient(client: QueryClient) {
    this.queryClient = client
  }

  /**
   * Invalidate all dashboard-related queries when chapter progress changes
   */
  static async invalidateProgressQueries() {
    if (!this.queryClient) return

    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] }),
      this.queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] }),
      this.queryClient.invalidateQueries({ queryKey: ['question-analytics'] }),
      this.queryClient.invalidateQueries({ queryKey: ['daily-goals'] }),
      this.queryClient.invalidateQueries({ queryKey: ['study-sessions'] }),
      this.queryClient.invalidateQueries({ queryKey: ['achievements'] })
    ])

    // Trigger achievement update
    try {
      await fetch('/api/achievement-update', { method: 'POST' })
    } catch (error) {
      console.log('Achievement update failed:', error)
    }
  }

  /**
   * Invalidate subject-specific queries
   */
  static async invalidateSubjectQueries(subjectId: string) {
    if (!this.queryClient) return

    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: ['subject', subjectId] }),
      this.queryClient.invalidateQueries({ queryKey: ['chapters', subjectId] }),
      this.invalidateProgressQueries()
    ])
  }

  /**
   * Invalidate chapter-specific queries
   */
  static async invalidateChapterQueries(chapterId: string) {
    if (!this.queryClient) return

    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] }),
      this.invalidateProgressQueries()
    ])
  }

  /**
   * Force refresh all dashboard data immediately
   */
  static async forceRefreshDashboard() {
    if (!this.queryClient) return

    await Promise.all([
      this.queryClient.refetchQueries({ queryKey: ['subjects-dashboard'] }),
      this.queryClient.refetchQueries({ queryKey: ['dashboard-analytics'] })
    ])
  }

  /**
   * Invalidate achievement-related queries
   */
  static async invalidateAchievementQueries() {
    if (!this.queryClient) return

    await this.queryClient.invalidateQueries({ queryKey: ['achievements'] })
  }

  /**
   * Invalidate streak-related queries
   */
  static async invalidateStreakQueries() {
    if (!this.queryClient) return

    await this.queryClient.invalidateQueries({ queryKey: ['study-streaks'] })
  }
}