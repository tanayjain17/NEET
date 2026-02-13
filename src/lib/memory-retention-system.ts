import { prisma } from './prisma'

export type MemoryItem = {
  id: string
  subject: string
  chapter: string
  concept: string
  content: string
  itemType: 'formula' | 'concept' | 'fact' | 'diagram'
  difficulty: number
  lastReviewed?: Date
  nextReview: Date
  reviewCount: number
  retentionScore: number
  isActive: boolean
}

export class MemoryRetentionSystem {
  // Spaced repetition intervals (in days)
  private static intervals = [1, 3, 7, 14, 30, 90, 180, 365]

  static async addMemoryItem(userId: string, item: Omit<MemoryItem, 'id' | 'lastReviewed' | 'nextReview' | 'reviewCount' | 'retentionScore' | 'isActive'>): Promise<MemoryItem> {
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + this.intervals[0])

    const memoryItem = await prisma.memoryItem.create({
      data: {
        userId,
        subject: item.subject,
        chapter: item.chapter,
        concept: item.concept,
        content: item.content,
        itemType: item.itemType,
        difficulty: item.difficulty,
        nextReview,
        reviewCount: 0,
        retentionScore: 0,
        isActive: true
      }
    })

    return this.mapToMemoryItem(memoryItem)
  }

  static async getDueItems(userId: string): Promise<MemoryItem[]> {
    const items = await prisma.memoryItem.findMany({
      where: {
        userId,
        isActive: true,
        nextReview: { lte: new Date() }
      },
      orderBy: [
        { difficulty: 'desc' },
        { nextReview: 'asc' }
      ],
      take: 20 // Limit to 20 items per session
    })

    return items.map(this.mapToMemoryItem)
  }

  static async reviewItem(userId: string, itemId: string, performance: 'easy' | 'good' | 'hard' | 'forgot'): Promise<void> {
    const item = await prisma.memoryItem.findUnique({
      where: { id: itemId }
    })

    if (!item || item.userId !== userId) return

    const reviewCount = item.reviewCount + 1
    let retentionScore = item.retentionScore

    // Update retention score based on performance
    switch (performance) {
      case 'easy':
        retentionScore = Math.min(1, retentionScore + 0.3)
        break
      case 'good':
        retentionScore = Math.min(1, retentionScore + 0.2)
        break
      case 'hard':
        retentionScore = Math.max(0, retentionScore - 0.1)
        break
      case 'forgot':
        retentionScore = Math.max(0, retentionScore - 0.3)
        break
    }

    // Calculate next review date
    const nextReview = this.calculateNextReview(reviewCount, retentionScore, performance)

    await prisma.memoryItem.update({
      where: { id: itemId },
      data: {
        lastReviewed: new Date(),
        nextReview,
        reviewCount,
        retentionScore,
        updatedAt: new Date()
      }
    })
  }

  private static calculateNextReview(reviewCount: number, retentionScore: number, performance: string): Date {
    let intervalIndex = Math.min(reviewCount, this.intervals.length - 1)
    
    // Adjust interval based on performance
    if (performance === 'forgot') {
      intervalIndex = Math.max(0, intervalIndex - 2)
    } else if (performance === 'hard') {
      intervalIndex = Math.max(0, intervalIndex - 1)
    } else if (performance === 'easy' && retentionScore > 0.8) {
      intervalIndex = Math.min(this.intervals.length - 1, intervalIndex + 1)
    }

    const days = this.intervals[intervalIndex]
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + days)
    
    return nextReview
  }

  static async getRetentionStats(userId: string): Promise<{
    totalItems: number
    dueToday: number
    averageRetention: number
    subjectBreakdown: { subject: string; items: number; avgRetention: number }[]
  }> {
    const [totalItems, dueItems, allItems] = await Promise.all([
      prisma.memoryItem.count({
        where: { userId, isActive: true }
      }),
      prisma.memoryItem.count({
        where: {
          userId,
          isActive: true,
          nextReview: { lte: new Date() }
        }
      }),
      prisma.memoryItem.findMany({
        where: { userId, isActive: true },
        select: { subject: true, retentionScore: true }
      })
    ])

    const averageRetention = allItems.length > 0 
      ? allItems.reduce((sum, item) => sum + item.retentionScore, 0) / allItems.length
      : 0

    // Group by subject
    const subjectMap = new Map<string, { items: number; totalRetention: number }>()
    
    allItems.forEach(item => {
      const existing = subjectMap.get(item.subject) || { items: 0, totalRetention: 0 }
      subjectMap.set(item.subject, {
        items: existing.items + 1,
        totalRetention: existing.totalRetention + item.retentionScore
      })
    })

    const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject,
      items: data.items,
      avgRetention: data.items > 0 ? data.totalRetention / data.items : 0
    }))

    return {
      totalItems,
      dueToday: dueItems,
      averageRetention,
      subjectBreakdown
    }
  }

  static async generateFlashcards(userId: string, subject: string, chapter: string): Promise<MemoryItem[]> {
    // Get chapter content and generate flashcards
    const chapterData = await prisma.chapter.findFirst({
      where: {
        subject: { name: subject },
        name: chapter
      },
      include: { subject: true }
    })

    if (!chapterData) return []

    // Auto-generate common memory items for the chapter
    const commonItems = this.getCommonMemoryItems(subject, chapter)
    
    const createdItems = await Promise.all(
      commonItems.map(item => this.addMemoryItem(userId, item))
    )

    return createdItems
  }

  private static getCommonMemoryItems(subject: string, chapter: string): Omit<MemoryItem, 'id' | 'lastReviewed' | 'nextReview' | 'reviewCount' | 'retentionScore' | 'isActive'>[] {
    // Predefined memory items for common NEET topics
    const items: any[] = []

    if (subject === 'Physics') {
      items.push(
        {
          subject,
          chapter,
          concept: 'Key Formulas',
          content: `Important formulas for ${chapter}`,
          itemType: 'formula',
          difficulty: 3
        },
        {
          subject,
          chapter,
          concept: 'Core Concepts',
          content: `Fundamental concepts in ${chapter}`,
          itemType: 'concept',
          difficulty: 4
        }
      )
    }

    if (subject === 'Chemistry') {
      items.push(
        {
          subject,
          chapter,
          concept: 'Chemical Reactions',
          content: `Key reactions in ${chapter}`,
          itemType: 'formula',
          difficulty: 4
        },
        {
          subject,
          chapter,
          concept: 'Important Facts',
          content: `Critical facts for ${chapter}`,
          itemType: 'fact',
          difficulty: 3
        }
      )
    }

    if (subject === 'Biology') {
      items.push(
        {
          subject,
          chapter,
          concept: 'Biological Processes',
          content: `Key processes in ${chapter}`,
          itemType: 'concept',
          difficulty: 3
        },
        {
          subject,
          chapter,
          concept: 'Diagrams',
          content: `Important diagrams for ${chapter}`,
          itemType: 'diagram',
          difficulty: 4
        }
      )
    }

    return items
  }

  private static mapToMemoryItem(item: any): MemoryItem {
    return {
      id: item.id,
      subject: item.subject,
      chapter: item.chapter,
      concept: item.concept,
      content: item.content,
      itemType: item.itemType,
      difficulty: item.difficulty,
      lastReviewed: item.lastReviewed,
      nextReview: item.nextReview,
      reviewCount: item.reviewCount,
      retentionScore: item.retentionScore,
      isActive: item.isActive
    }
  }
}