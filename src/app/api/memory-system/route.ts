import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MemoryRetentionSystem } from '@/lib/memory-retention-system'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'due-items') {
      const items = await MemoryRetentionSystem.getDueItems(session.user.email)
      return NextResponse.json({ success: true, data: items })
    }

    if (action === 'stats') {
      const stats = await MemoryRetentionSystem.getRetentionStats(session.user.email)
      return NextResponse.json({ success: true, data: stats })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Memory system error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { action, ...data } = await request.json()

    if (action === 'add-item') {
      const item = await MemoryRetentionSystem.addMemoryItem(session.user.email, data)
      return NextResponse.json({ success: true, data: item })
    }

    if (action === 'review-item') {
      await MemoryRetentionSystem.reviewItem(session.user.email, data.itemId, data.performance)
      return NextResponse.json({ success: true })
    }

    if (action === 'generate-flashcards') {
      const items = await MemoryRetentionSystem.generateFlashcards(session.user.email, data.subject, data.chapter)
      return NextResponse.json({ success: true, data: items })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Memory system error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}