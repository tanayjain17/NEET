import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CycleOptimizationEngine } from '@/lib/cycle-optimization-engine'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const targetDate = dateParam ? new Date(dateParam) : new Date()

    const userId = session.user.email

    const schedule = await CycleOptimizationEngine.generateOptimizedSchedule(userId, targetDate)

    await prisma.cycleOptimizedSchedule.upsert({
      where: {
        userId_date: {
          userId,
          date: targetDate
        }
      },
      update: {
        cyclePhase: schedule.cyclePhase,
        energyLevel: schedule.energyLevel,
        studyBlocks: schedule.studyBlocks,
        mockTestSlot: schedule.mockTestSlot,
        difficultyFocus: schedule.difficultyFocus
      },
      create: {
        userId,
        date: targetDate,
        cyclePhase: schedule.cyclePhase,
        energyLevel: schedule.energyLevel,
        studyBlocks: schedule.studyBlocks,
        mockTestSlot: schedule.mockTestSlot,
        difficultyFocus: schedule.difficultyFocus
      }
    })

    return NextResponse.json({ success: true, data: schedule })
  } catch (error) {
    console.error('Cycle optimization schedule error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}