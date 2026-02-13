import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { dppIndex, questionCount } = await request.json()

    const chapter = await prisma.chapter.findUnique({
      where: { id }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Update DPP question count
    const currentCounts = Array.isArray(chapter.dppQuestionCounts) 
      ? chapter.dppQuestionCounts as number[]
      : []
    const updatedCounts = [...currentCounts]
    updatedCounts[dppIndex] = questionCount

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: { dppQuestionCounts: updatedCounts }
    })

    return NextResponse.json({
      success: true,
      data: updatedChapter
    })

  } catch (error) {
    console.error('Error updating DPP questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}