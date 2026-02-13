import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChapterRepository } from '@/lib/repositories/chapter-repository'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const chapterId = id
    const { type, count } = await request.json()

    // Validate input
    if (!['assignment', 'kattar'].includes(type) || 
        typeof count !== 'number' || 
        count < 0 || 
        count > 1000) {
      return NextResponse.json(
        { error: 'Invalid input data. Count must be between 0 and 1000.' },
        { status: 400 }
      )
    }

    let updatedChapter

    // Update question count based on type
    if (type === 'assignment') {
      updatedChapter = await ChapterRepository.updateAssignmentQuestions(chapterId, count)
    } else {
      updatedChapter = await ChapterRepository.updateKattarQuestions(chapterId, count)
    }

    // Calculate progress for response
    const progress = ChapterRepository.calculateProgress(updatedChapter)

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      progress
    })
  } catch (error) {
    console.error('Error updating question count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}