import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db-utils'
import { MoodRepository } from '@/lib/repositories/mood-repository'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { month } = await params
    
    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/
    if (!monthRegex.test(month)) {
      return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 })
    }

    const [year, monthNum] = month.split('-').map(Number)

    // Fetch mood entries for the month using repository
    const moodEntries = await MoodRepository.getMoodEntriesForMonth(session.user.email, year, monthNum)

    // Format the response
    const formattedEntries = moodEntries.map(entry => ({
      id: entry.id,
      date: entry.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      mood: entry.mood
    }))

    return NextResponse.json({
      moodEntries: formattedEntries,
      month,
      totalEntries: formattedEntries.length
    })

  } catch (error) {
    console.error('Error fetching mood data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}