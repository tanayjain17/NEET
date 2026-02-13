import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChapterRepository } from '@/lib/repositories/chapter-repository'
import { RealTimeSyncService } from '@/lib/real-time-sync'
import { z } from 'zod'

const chapterUpdateSchema = z.object({
  lecturesCompleted: z.array(z.boolean()).optional(),
  dppCompleted: z.array(z.boolean()).optional(),
  assignmentQuestions: z.number().min(0).optional(),
  assignmentCompleted: z.array(z.boolean()).optional(),
  kattarQuestions: z.number().min(0).optional(),
  kattarCompleted: z.array(z.boolean()).optional(),
  revisionScore: z.number().min(1).max(10).optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validationResult = chapterUpdateSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const updatedChapter = await RealTimeSyncService.syncChapterProgress(id, validationResult.data)

    return NextResponse.json({
      success: true,
      data: updatedChapter
    })

  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}