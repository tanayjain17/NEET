'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import ChapterCard from '@/components/subjects/chapter-card'
import FloatingSaveButton from '@/components/subjects/floating-save-button'
import { SubjectChangesProvider } from '@/contexts/subject-changes-context'
import { SubjectRepository, SubjectWithChapters } from '@/lib/repositories/subject-repository'
import { ChapterRepository } from '@/lib/repositories/chapter-repository'
import { Chapter } from '@prisma/client'

type ChapterWithProgress = Chapter & {
  progress: {
    lectureProgress: number
    dppProgress: number
    assignmentProgress: number
    kattarProgress: number
    overallProgress: number
    needsImprovement: boolean
  }
}

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.id as string

  const [subject, setSubject] = useState<SubjectWithChapters | null>(null)
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSubjectData()
  }, [subjectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadSubjectData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch subject details
      const response = await fetch(`/api/subjects/${subjectId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch subject data')
      }

      const subjectData = await response.json()
      setSubject(subjectData.subject)
      setChapters(subjectData.chapters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChapterUpdate = async () => {
    // Reload data when chapter is updated
    await loadSubjectData()
  }

  if (loading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Fetching subject details">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !subject) {
    return (
      <DashboardLayout title="Error" subtitle="Failed to load subject">
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {error || 'Subject not found'}
          </h2>
          <p className="text-gray-400 mb-6">
            We couldn&apos;t load the subject details. Please try again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate subject-level stats
  const totalChapters = chapters.length
  const completedChapters = chapters.filter(ch => ch.progress.overallProgress >= 95).length
  const averageProgress = chapters.length > 0 
    ? chapters.reduce((sum, ch) => sum + ch.progress.overallProgress, 0) / chapters.length 
    : 0

  const getSubjectEmoji = (progress: number) => {
    if (progress < 75) return '😢'
    if (progress < 85) return '😟'
    if (progress < 95) return '😊'
    return '😘'
  }

  return (
    <SubjectChangesProvider onSaveComplete={handleChapterUpdate}>
      <DashboardLayout 
        title={subject.name}
        subtitle={`Track your progress across ${totalChapters} chapters`}
      >
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Overall Progress</div>
              <div className="text-lg font-semibold text-white">
                {Math.round(averageProgress)}%
              </div>
            </div>
            <div className="text-3xl">
              {getSubjectEmoji(averageProgress)}
            </div>
            <FloatingSaveButton />
          </div>
        </div>

        {/* Subject Overview */}
        <div className="glass-effect rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {totalChapters}
              </div>
              <div className="text-sm text-gray-400">Total Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {completedChapters}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {totalChapters - completedChapters}
              </div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(averageProgress)}%
              </div>
              <div className="text-sm text-gray-400">Average Progress</div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Chapters ({chapters.length})
          </h2>
          
          {chapters.length === 0 ? (
            <div className="glass-effect rounded-xl p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No chapters found
              </h3>
              <p className="text-gray-400">
                This subject doesn&apos;t have any chapters yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ChapterCard
                    chapter={chapter}
                    onUpdate={handleChapterUpdate}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors text-left">
              <div className="text-primary text-2xl mb-2">📊</div>
              <div className="font-medium text-white mb-1">View Analytics</div>
              <div className="text-sm text-gray-400">
                See detailed progress analytics
              </div>
            </button>
            <button className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors text-left">
              <div className="text-primary text-2xl mb-2">🎯</div>
              <div className="font-medium text-white mb-1">Set Goals</div>
              <div className="text-sm text-gray-400">
                Define chapter completion targets
              </div>
            </button>
            <button className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors text-left">
              <div className="text-primary text-2xl mb-2">📝</div>
              <div className="font-medium text-white mb-1">Add Notes</div>
              <div className="text-sm text-gray-400">
                Keep track of important points
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </SubjectChangesProvider>
  )
}