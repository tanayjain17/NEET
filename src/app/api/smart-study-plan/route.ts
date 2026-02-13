import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SmartStudyPlanner } from '@/lib/smart-study-planner'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { date, energyLevel, availableHours, weakAreas, menstrualPhase } = await request.json()

    const plan = await SmartStudyPlanner.generateDailyPlan(
      session.user.email,
      new Date(date),
      { energyLevel, availableHours, weakAreas, menstrualPhase }
    )

    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error('Smart study plan error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { planId, blockId, completed } = await request.json()
    
    console.log('PATCH request:', { planId, blockId, completed, userId: session.user.email })

    if (!planId || !blockId) {
      return NextResponse.json({ error: 'Missing planId or blockId' }, { status: 400 })
    }

    await SmartStudyPlanner.updateBlockCompletion(
      session.user.email,
      planId,
      blockId,
      completed
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update block error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}