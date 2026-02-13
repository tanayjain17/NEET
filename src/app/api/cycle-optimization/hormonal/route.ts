import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CycleOptimizationEngine } from '@/lib/cycle-optimization-engine'
import { CyclePhase } from '@/lib/menstrual-cycle-predictor'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cyclePhase = searchParams.get('phase') as CyclePhase

    if (!cyclePhase) {
      return NextResponse.json({ error: 'Cycle phase is required' }, { status: 400 })
    }

    const optimization = CycleOptimizationEngine.getHormonalOptimization(cyclePhase)
    return NextResponse.json({ success: true, data: optimization })
  } catch (error) {
    console.error('Hormonal optimization error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, cyclePhase, implemented, effectiveness } = await request.json()
    const userId = session.user.email

    const optimization = CycleOptimizationEngine.getHormonalOptimization(cyclePhase)

    await prisma.hormonalOptimization.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date)
        }
      },
      update: {
        implemented,
        effectiveness
      },
      create: {
        userId,
        date: new Date(date),
        cyclePhase,
        supplements: optimization.supplements,
        nutrition: optimization.nutrition,
        caffeineTime: optimization.caffeineTime,
        nootropics: optimization.nootropics,
        stressManagement: optimization.stressManagement,
        implemented,
        effectiveness
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Hormonal optimization save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}