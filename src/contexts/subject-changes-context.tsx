'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type ChapterUpdate = {
  chapterId: string
  field: string
  value: any
}

type PendingChange = {
  type: string
  chapterId: string
  data: any
}

type SubjectChangesContextType = {
  pendingChanges: ChapterUpdate[]
  addChange: (change: ChapterUpdate) => void
  removeChange: (chapterId: string, field: string) => void
  addPendingChange: (key: string, change: PendingChange) => void
  removePendingChange: (key: string) => void
  clearChanges: () => void
  hasChanges: boolean
  saveAllChanges: () => Promise<void>
  isSaving: boolean
}

const SubjectChangesContext = createContext<SubjectChangesContextType | undefined>(undefined)

export function useSubjectChanges() {
  const context = useContext(SubjectChangesContext)
  if (!context) {
    throw new Error('useSubjectChanges must be used within a SubjectChangesProvider')
  }
  return context
}

interface SubjectChangesProviderProps {
  children: ReactNode
  onSaveComplete?: () => void
}

export function SubjectChangesProvider({ children, onSaveComplete }: SubjectChangesProviderProps) {
  const [pendingChanges, setPendingChanges] = useState<ChapterUpdate[]>([])
  const [pendingChangeMap, setPendingChangeMap] = useState<Record<string, PendingChange>>({})
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  const addChange = useCallback((change: ChapterUpdate) => {
    setPendingChanges(prev => {
      // Remove existing change for the same field
      const filtered = prev.filter(c => !(c.chapterId === change.chapterId && c.field === change.field))
      return [...filtered, change]
    })
  }, [])

  const removeChange = useCallback((chapterId: string, field: string) => {
    setPendingChanges(prev => prev.filter(c => !(c.chapterId === chapterId && c.field === field)))
  }, [])
  
  const addPendingChange = useCallback((key: string, change: PendingChange) => {
    setPendingChangeMap(prev => ({ ...prev, [key]: change }))
  }, [])
  
  const removePendingChange = useCallback((key: string) => {
    setPendingChangeMap(prev => {
      const newMap = { ...prev }
      delete newMap[key]
      return newMap
    })
  }, [])

  const clearChanges = useCallback(() => {
    setPendingChanges([])
    setPendingChangeMap({})
  }, [])

  const saveAllChanges = useCallback(async () => {
    if (pendingChanges.length === 0) return

    setIsSaving(true)
    try {
      // Group changes by chapter
      const changesByChapter = pendingChanges.reduce((acc, change) => {
        if (!acc[change.chapterId]) {
          acc[change.chapterId] = {}
        }
        acc[change.chapterId][change.field] = change.value
        return acc
      }, {} as Record<string, Record<string, any>>)

      // Save all changes in parallel
      const savePromises = Object.entries(changesByChapter).map(([chapterId, updates]) => {
        // Handle assignment and kattar questions separately
        if (updates.assignmentCompleted || updates.kattarCompleted) {
          const questionPromises = []
          
          if (updates.assignmentCompleted) {
            questionPromises.push(
              fetch(`/api/chapters/${chapterId}/questions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'assignment',
                  completed: updates.assignmentCompleted
                })
              })
            )
            delete updates.assignmentCompleted
          }
          
          if (updates.kattarCompleted) {
            questionPromises.push(
              fetch(`/api/chapters/${chapterId}/questions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'kattar',
                  completed: updates.kattarCompleted
                })
              })
            )
            delete updates.kattarCompleted
          }
          
          // If there are other updates, save them too
          if (Object.keys(updates).length > 0) {
            questionPromises.push(
              fetch(`/api/chapters/${chapterId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
              })
            )
          }
          
          return Promise.all(questionPromises)
        } else {
          // Regular chapter updates
          return fetch(`/api/chapters/${chapterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          })
        }
      })

      const results = await Promise.all(savePromises)
      
      // Flatten results in case of nested promises
      const flatResults = results.flat()
      
      // Check if all saves were successful
      const failedSaves = flatResults.filter(r => r && !r.ok)
      if (failedSaves.length > 0) {
        throw new Error(`Failed to save ${failedSaves.length} changes`)
      }

      clearChanges()
      
      // Invalidate React Query cache for real-time updates
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['subjects'] }),
          queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] }),
          queryClient.invalidateQueries({ queryKey: ['chapters'] }),
          queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
          queryClient.invalidateQueries({ queryKey: ['daily-goals'] }),
          queryClient.invalidateQueries({ queryKey: ['analytics'] })
        ])
        console.log('Cache invalidated successfully')
      } catch (cacheError) {
        console.error('Error invalidating cache:', cacheError)
      }
      
      onSaveComplete?.()
    } catch (error) {
      console.error('Error saving changes:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [pendingChanges, clearChanges, onSaveComplete, queryClient])

  const hasChanges = pendingChanges.length > 0 || Object.keys(pendingChangeMap).length > 0

  return (
    <SubjectChangesContext.Provider value={{
      pendingChanges,
      addChange,
      removeChange,
      addPendingChange,
      removePendingChange,
      clearChanges,
      hasChanges,
      saveAllChanges,
      isSaving
    }}>
      {children}
    </SubjectChangesContext.Provider>
  )
}