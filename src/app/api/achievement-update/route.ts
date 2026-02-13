import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AchievementTracker } from '@/lib/achievement-tracker'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update achievements based on current progress
    const stats = await AchievementTracker.checkAndUpdateAchievements(session.user.email)

    return NextResponse.json({ 
      success: true, 
      message: 'Achievements updated',
      stats
    })
  } catch (error) {
    console.error('Error updating achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}