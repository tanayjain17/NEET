import { SubjectRepository, ChapterRepository } from './repositories'

/**
 * Real-time data synchronization utilities
 * These functions handle automatic updates and progress calculations
 */

/**
 * Sync chapter progress and update subject completion
 * This function should be called whenever chapter data changes
 */
export async function syncChapterProgress(chapterId: string): Promise<void> {
  try {
    const chapter = await ChapterRepository.getById(chapterId)
    if (!chapter) {
      throw new Error('Chapter not found')
    }

    // Recalculate and update subject progress
    await SubjectRepository.calculateAndUpdateProgress(chapter.subjectId)
  } catch (error) {
    console.error('Error syncing chapter progress:', error)
    throw error
  }
}

/**
 * Sync all subjects progress for a user
 * Useful for bulk updates or data consistency checks
 */
export async function syncAllSubjectsProgress(userId: string): Promise<void> {
  try {
    const subjects = await SubjectRepository.getAll()
    
    // Update progress for each subject
    await Promise.all(
      subjects.map(subject => 
        SubjectRepository.calculateAndUpdateProgress(subject.id)
      )
    )
  } catch (error) {
    console.error('Error syncing all subjects progress:', error)
    throw error
  }
}

/**
 * Batch update multiple chapters and sync progress
 * Optimized for multiple simultaneous updates
 */
export async function batchUpdateChapters(
  updates: { chapterId: string; data: any }[]
): Promise<void> {
  try {
    // Use the bulk update method from ChapterRepository
    await ChapterRepository.bulkUpdate(updates)
  } catch (error) {
    console.error('Error in batch chapter updates:', error)
    throw error
  }
}

/**
 * Get real-time dashboard data
 * Returns complete dashboard state with all calculations
 */
export async function getDashboardData(userId: string) {
  try {
    // Get subjects with dashboard summary
    const subjects = await SubjectRepository.getDashboardSummary()
    
    // Calculate overall statistics
    const totalSubjects = subjects.length
    const totalChapters = subjects.reduce((sum, subject) => sum + subject.totalChapters, 0)
    const totalLectures = subjects.reduce((sum, subject) => sum + subject.totalLectures, 0)
    const completedLectures = subjects.reduce((sum, subject) => sum + subject.completedLectures, 0)
    const totalQuestions = subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0)
    
    const overallProgress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0
    
    return {
      subjects,
      statistics: {
        totalSubjects,
        totalChapters,
        totalLectures,
        completedLectures,
        totalQuestions,
        overallProgress: Math.round(overallProgress * 100) / 100
      }
    }
  } catch (error) {
    console.error('Error getting dashboard data:', error)
    throw error
  }
}

/**
 * Get subject detail data with all chapters and progress
 */
export async function getSubjectDetailData(subjectId: string) {
  try {
    const subject = await SubjectRepository.getByIdWithChapters(subjectId)
    if (!subject) {
      throw new Error('Subject not found')
    }

    // Get chapters with progress calculations
    const chaptersWithProgress = await ChapterRepository.getAllWithProgressBySubjectId(subjectId)
    
    return {
      subject,
      chapters: chaptersWithProgress
    }
  } catch (error) {
    console.error('Error getting subject detail data:', error)
    throw error
  }
}

/**
 * Update lecture completion and sync progress
 */
export async function updateLectureAndSync(
  chapterId: string, 
  lectureIndex: number, 
  completed: boolean
): Promise<void> {
  try {
    await ChapterRepository.updateLectureCompletion(chapterId, lectureIndex, completed)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating lecture completion:', error)
    throw error
  }
}

/**
 * Update DPP completion and sync progress
 */
export async function updateDppAndSync(
  chapterId: string, 
  dppIndex: number, 
  completed: boolean
): Promise<void> {
  try {
    await ChapterRepository.updateDppCompletion(chapterId, dppIndex, completed)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating DPP completion:', error)
    throw error
  }
}

/**
 * Update assignment questions and sync progress
 */
export async function updateAssignmentQuestionsAndSync(
  chapterId: string, 
  count: number
): Promise<void> {
  try {
    await ChapterRepository.updateAssignmentQuestions(chapterId, count)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating assignment questions:', error)
    throw error
  }
}

/**
 * Update assignment completion and sync progress
 */
export async function updateAssignmentCompletionAndSync(
  chapterId: string, 
  assignmentIndex: number, 
  completed: boolean
): Promise<void> {
  try {
    await ChapterRepository.updateAssignmentCompletion(chapterId, assignmentIndex, completed)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating assignment completion:', error)
    throw error
  }
}

/**
 * Update kattar questions and sync progress
 */
export async function updateKattarQuestionsAndSync(
  chapterId: string, 
  count: number
): Promise<void> {
  try {
    await ChapterRepository.updateKattarQuestions(chapterId, count)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating kattar questions:', error)
    throw error
  }
}

/**
 * Update kattar completion and sync progress
 */
export async function updateKattarCompletionAndSync(
  chapterId: string, 
  kattarIndex: number, 
  completed: boolean
): Promise<void> {
  try {
    await ChapterRepository.updateKattarCompletion(chapterId, kattarIndex, completed)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating kattar completion:', error)
    throw error
  }
}

/**
 * Update revision score and sync progress
 */
export async function updateRevisionScoreAndSync(
  chapterId: string, 
  score: number
): Promise<void> {
  try {
    await ChapterRepository.updateRevisionScore(chapterId, score)
    // Progress sync is automatically handled in the repository
  } catch (error) {
    console.error('Error updating revision score:', error)
    throw error
  }
}

/**
 * Data validation utilities
 */
export const DataValidation = {
  /**
   * Validate revision score
   */
  isValidRevisionScore(score: number): boolean {
    return Number.isInteger(score) && score >= 1 && score <= 10
  },

  /**
   * Validate test score
   */
  isValidTestScore(score: number): boolean {
    return Number.isInteger(score) && score >= 0 && score <= 720
  },

  /**
   * Validate array index
   */
  isValidArrayIndex(index: number, arrayLength: number): boolean {
    return Number.isInteger(index) && index >= 0 && index < arrayLength
  },

  /**
   * Validate question count
   */
  isValidQuestionCount(count: number): boolean {
    return Number.isInteger(count) && count >= 0 && count <= 1000 // reasonable upper limit
  }
}

/**
 * Error handling utilities
 */
export class DataSyncError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'DataSyncError'
  }
}

/**
 * Retry mechanism for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw new DataSyncError(
          `Operation failed after ${maxRetries} attempts: ${lastError.message}`,
          lastError
        )
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError!
}