import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DailyGoalsRepository } from '@/lib/repositories/daily-goals-repository'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const comparison = await DailyGoalsRepository.getWeeklyComparison(session.user.email)

    return NextResponse.json({
      success: true,
      data: comparison
    })

  } catch (error) {
    console.error('Error fetching weekly comparison:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}