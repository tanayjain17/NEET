import { prisma } from '../prisma'
import { Subject, Chapter } from '@prisma/client'

export type SubjectWithChapters = Subject & {
  chapters: Chapter[]
}

export type ChapterProgress = {
  lectureProgress: number
  dppProgress: number
  assignmentProgress: number
  kattarProgress: number
  overallProgress: number
}

export type SubjectProgress = {
  totalLectures: number
  completedLectures: number
  totalDpp: number
  completedDpp: number
  totalAssignments: number
  completedAssignments: number
  totalKattar: number
  completedKattar: number
  overallCompletion: number
}

/**
 * Subject Repository - CRUD operations for subjects
 */
export class SubjectRepository {
  /**
   * Get all subjects with their chapters
   */
  static async getAll(): Promise<SubjectWithChapters[]> {
    return await prisma.subject.findMany({
      include: {
        chapters: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Get a specific subject by ID with chapters
   */
  static async getByIdWithChapters(subjectId: string): Promise<SubjectWithChapters | null> {
    return await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        chapters: {
          orderBy: { name: 'asc' }
        }
      }
    })
  }

  /**
   * Get a subject by name
   */
  static async getByName(name: string): Promise<SubjectWithChapters | null> {
    return await prisma.subject.findFirst({
      where: {
        name
      },
      include: {
        chapters: {
          orderBy: { name: 'asc' }
        }
      }
    })
  }

  /**
   * Create a new subject
   */
  static async create(data: {
    name: string
    totalQuestions?: number
    completionPercentage?: number
  }): Promise<Subject> {
    return await prisma.subject.create({
      data: {
        name: data.name,
        totalQuestions: data.totalQuestions ?? 0,
        completionPercentage: data.completionPercentage ?? 0
      }
    })
  }

  /**
   * Update subject completion percentage and total questions
   */
  static async updateProgress(subjectId: string, data: {
    completionPercentage?: number
    totalQuestions?: number
  }): Promise<Subject> {
    return await prisma.subject.update({
      where: { id: subjectId },
      data
    })
  }

  /**
   * Calculate and update subject progress based on chapters
   */
  static async calculateAndUpdateProgress(subjectId: string): Promise<SubjectProgress> {
    const chapters = await prisma.chapter.findMany({
      where: { subjectId }
    })

    if (chapters.length === 0) {
      await this.updateProgress(subjectId, { completionPercentage: 0, totalQuestions: 0 })
      return {
        totalLectures: 0,
        completedLectures: 0,
        totalDpp: 0,
        completedDpp: 0,
        totalAssignments: 0,
        completedAssignments: 0,
        totalKattar: 0,
        completedKattar: 0,
        overallCompletion: 0
      }
    }

    let totalLectures = 0
    let completedLectures = 0
    let totalDpp = 0
    let completedDpp = 0
    let totalAssignments = 0
    let completedAssignments = 0
    let totalKattar = 0
    let completedKattar = 0
    let totalQuestions = 0

    chapters.forEach(chapter => {
      // Lectures
      totalLectures += chapter.lectureCount
      completedLectures += Array.isArray(chapter.lecturesCompleted) 
        ? (chapter.lecturesCompleted as boolean[]).filter(Boolean).length 
        : 0

      // DPP (equals lecture count)
      totalDpp += chapter.lectureCount
      completedDpp += Array.isArray(chapter.dppCompleted) 
        ? (chapter.dppCompleted as boolean[]).filter(Boolean).length 
        : 0

      // Assignments
      totalAssignments += chapter.assignmentQuestions
      completedAssignments += Array.isArray(chapter.assignmentCompleted) 
        ? (chapter.assignmentCompleted as boolean[]).filter(Boolean).length 
        : 0

      // Kattar questions
      totalKattar += chapter.kattarQuestions
      completedKattar += Array.isArray(chapter.kattarCompleted) 
        ? (chapter.kattarCompleted as boolean[]).filter(Boolean).length 
        : 0

      // Total questions for analytics
      totalQuestions += chapter.assignmentQuestions + chapter.kattarQuestions
    })

    // Calculate overall completion percentage
    const totalItems = totalLectures + totalDpp + totalAssignments + totalKattar
    const completedItems = completedLectures + completedDpp + completedAssignments + completedKattar
    const overallCompletion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    // Update subject in database
    await this.updateProgress(subjectId, {
      completionPercentage: Math.round(overallCompletion * 100) / 100, // Round to 2 decimal places
      totalQuestions
    })

    return {
      totalLectures,
      completedLectures,
      totalDpp,
      completedDpp,
      totalAssignments,
      completedAssignments,
      totalKattar,
      completedKattar,
      overallCompletion
    }
  }

  /**
   * Delete a subject and all its chapters
   */
  static async delete(subjectId: string): Promise<void> {
    await prisma.subject.delete({
      where: { id: subjectId }
    })
  }

  /**
   * Get subjects with progress summary for dashboard
   */
  static async getDashboardSummary() {
    const subjects = await this.getAll()
    
    // Filter out only cardiology and neurology, keep all other subjects
    const filteredSubjects = subjects.filter(subject => 
      !['Cardiology', 'Neurology', 'cardiology', 'neurology'].includes(subject.name)
    )
    
    return filteredSubjects.map(subject => {
      const totalChapters = subject.chapters.length
      let totalLectures = 0
      let completedLectures = 0
      let totalDpp = 0
      let completedDpp = 0
      let totalAssignments = 0
      let completedAssignments = 0
      let totalKattar = 0
      let completedKattar = 0
      let totalQuestions = 0

      subject.chapters.forEach(chapter => {
        // Lectures
        totalLectures += chapter.lectureCount
        completedLectures += Array.isArray(chapter.lecturesCompleted) 
          ? (chapter.lecturesCompleted as boolean[]).filter(Boolean).length 
          : 0

        // DPP (equals lecture count)
        totalDpp += chapter.lectureCount
        completedDpp += Array.isArray(chapter.dppCompleted) 
          ? (chapter.dppCompleted as boolean[]).filter(Boolean).length 
          : 0

        // Assignments
        totalAssignments += chapter.assignmentQuestions
        completedAssignments += Array.isArray(chapter.assignmentCompleted) 
          ? (chapter.assignmentCompleted as boolean[]).filter(Boolean).length 
          : 0

        // Kattar questions
        totalKattar += chapter.kattarQuestions
        completedKattar += Array.isArray(chapter.kattarCompleted) 
          ? (chapter.kattarCompleted as boolean[]).filter(Boolean).length 
          : 0

        totalQuestions += chapter.assignmentQuestions + chapter.kattarQuestions
      })

      // Calculate real-time completion percentage
      const totalItems = totalLectures + totalDpp + totalAssignments + totalKattar
      const completedItems = completedLectures + completedDpp + completedAssignments + completedKattar
      const realTimeCompletionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

      return {
        id: subject.id,
        name: subject.name,
        totalChapters,
        completionPercentage: Math.round(realTimeCompletionPercentage * 100) / 100, // Round to 2 decimal places
        totalLectures,
        completedLectures,
        totalQuestions,
        // Emoji logic based on completion percentage
        emoji: realTimeCompletionPercentage < 75 ? '😢' : 
               realTimeCompletionPercentage < 85 ? '😟' :
               realTimeCompletionPercentage < 95 ? '😊' : '😘'
      }
    })
  }
}