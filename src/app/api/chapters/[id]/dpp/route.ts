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
    const { dppIndex, completed } = await request.json()

    // Validate input
    if (typeof dppIndex !== 'number' || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Update DPP completion status
    const updatedChapter = await ChapterRepository.updateDppCompletion(
      chapterId,
      dppIndex,
      completed
    )

    // Calculate progress for response
    const progress = ChapterRepository.calculateProgress(updatedChapter)

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      progress
    })
  } catch (error) {
    console.error('Error updating DPP completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}