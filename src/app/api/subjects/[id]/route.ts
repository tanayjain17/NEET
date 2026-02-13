import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SubjectRepository } from '@/lib/repositories/subject-repository'
import { ChapterRepository } from '@/lib/repositories/chapter-repository'

export async function GET(
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
    const subjectId = id

    // Get subject with chapters
    const subject = await SubjectRepository.getByIdWithChapters(subjectId)
    
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    // Get chapters with progress calculations
    const chaptersWithProgress = await ChapterRepository.getAllWithProgressBySubjectId(subjectId)

    return NextResponse.json({
      subject,
      chapters: chaptersWithProgress
    })
  } catch (error) {
    console.error('Error fetching subject details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}