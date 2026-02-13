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
    const { revisionScore } = await request.json()

    // Validate input
    if (typeof revisionScore !== 'number' || revisionScore < 1 || revisionScore > 10) {
      return NextResponse.json(
        { error: 'Revision score must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Update revision score
    const updatedChapter = await ChapterRepository.updateRevisionScore(chapterId, revisionScore)

    // Calculate progress for response
    const progress = ChapterRepository.calculateProgress(updatedChapter)

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      progress
    })
  } catch (error) {
    console.error('Error updating revision score:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}