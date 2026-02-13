'use client'

import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Vercel-optimized real-time sync hook
 * Handles Vercel's serverless function limitations and edge caching
 */
export function useProductionSync() {
  const queryClient = useQueryClient()
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)
  const [isOnline, setIsOnline] = useState(true)
  const [syncCount, setSyncCount] = useState(0)

  useEffect(() => {
    // Monitor network status for Vercel edge cases
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    // Vercel-optimized sync function
    const forceSyncInterval = async () => {
      if (!isOnline) return
      
      const now = Date.now()
      
      // Prevent too frequent syncs (minimum 2 seconds for Vercel)
      if (now - lastSyncRef.current < 2000) return
      
      lastSyncRef.current = now
      setSyncCount(prev => prev + 1)
      
      try {
        // Add cache-busting timestamp for Vercel edge
        const timestamp = Date.now()
        
        // Invalidate with cache-busting
        await Promise.all([
          queryClient.invalidateQueries({ 
            queryKey: ['subjects-dashboard'],
            refetchType: 'all'
          }),
          queryClient.invalidateQueries({ 
            queryKey: ['dashboard-analytics'],
            refetchType: 'all'
          })
        ])
        
        // Force refetch with fresh data
        await Promise.all([
          queryClient.refetchQueries({ 
            queryKey: ['subjects-dashboard'],
            type: 'all'
          }),
          queryClient.refetchQueries({ 
            queryKey: ['dashboard-analytics'],
            type: 'all'
          })
        ])
      } catch (error) {
        console.warn('Sync failed, retrying...', error)
        // Retry after 5 seconds on failure
        setTimeout(forceSyncInterval, 5000)
      }
    }

    // Adaptive interval based on activity
    const getInterval = () => {
      // More frequent updates when user is active
      return document.hasFocus() ? 3000 : 5000
    }

    // Set up adaptive interval
    const setupInterval = () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
      syncIntervalRef.current = setInterval(forceSyncInterval, getInterval())
    }

    setupInterval()

    // Adjust interval on focus change
    const handleFocus = () => {
      setupInterval()
      forceSyncInterval() // Immediate sync on focus
    }
    
    const handleBlur = () => {
      setupInterval() // Slower interval when not focused
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Enhanced event listeners for immediate updates
    const handleImmediateSync = () => {
      forceSyncInterval()
    }

    const events = [
      'chapterProgressUpdated',
      'lectureCompleted', 
      'dppCompleted',
      'assignmentCompleted',
      'kattarCompleted',
      'revisionScoreUpdated',
      'dailyGoalUpdated',
      'testScoreAdded',
      'moodEntryAdded'
    ]

    events.forEach(event => {
      window.addEventListener(event, handleImmediateSync)
    })

    // Cleanup
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      events.forEach(event => {
        window.removeEventListener(event, handleImmediateSync)
      })
    }
  }, [queryClient, isOnline])

  // Manual sync with Vercel optimization
  const triggerSync = async () => {
    if (!isOnline) return
    
    const now = Date.now()
    lastSyncRef.current = now
    setSyncCount(prev => prev + 1)
    
    try {
      // Force fresh data from Vercel functions
      await queryClient.refetchQueries({ 
        queryKey: ['subjects-dashboard'],
        type: 'all'
      })
      await queryClient.refetchQueries({ 
        queryKey: ['dashboard-analytics'],
        type: 'all'
      })
    } catch (error) {
      console.warn('Manual sync failed:', error)
    }
  }

  return { 
    triggerSync, 
    isOnline, 
    syncCount,
    lastSync: lastSyncRef.current
  }
}