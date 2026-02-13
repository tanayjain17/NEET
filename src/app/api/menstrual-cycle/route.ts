import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { cycleStartDate, periodEndDate, cycleLength, periodLength, energyLevel, symptoms, notes } = await request.json()

    // Calculate period length from dates if provided
    let calculatedPeriodLength = periodLength
    if (cycleStartDate && periodEndDate) {
      const startDate = new Date(cycleStartDate)
      const endDate = new Date(periodEndDate)
      calculatedPeriodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }

    const cycle = await prisma.menstrualCycle.create({
      data: {
        userId: session.user.email,
        cycleStartDate: new Date(cycleStartDate),
        cycleLength: cycleLength || 28,
        periodLength: calculatedPeriodLength || 5,
        energyLevel: energyLevel || 5,
        studyCapacity: energyLevel || 5,
        symptoms: symptoms || [],
        notes: notes || ''
      }
    })

    return NextResponse.json({ success: true, data: cycle })
  } catch (error) {
    console.error('Menstrual cycle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const cycles = await prisma.menstrualCycle.findMany({
      where: { userId: session.user.email },
      orderBy: { cycleStartDate: 'desc' },
      take: 12 // Last 12 cycles
    })

    return NextResponse.json({ success: true, data: cycles })
  } catch (error) {
    console.error('Fetch cycles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}