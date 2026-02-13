import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RealTimeSyncService } from '@/lib/real-time-sync'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { chapterId, updates } = await request.json()

    if (!chapterId || !updates) {
      return NextResponse.json(
        { error: 'Chapter ID and updates are required' },
        { status: 400 }
      )
    }

    const updatedChapter = await RealTimeSyncService.syncChapterProgress(chapterId, updates)

    return NextResponse.json({
      success: true,
      data: updatedChapter
    })

  } catch (error) {
    console.error('Error syncing chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}