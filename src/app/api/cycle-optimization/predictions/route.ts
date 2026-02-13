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

    const userId = session.user.email
    const predictions = await CycleOptimizationEngine.generateEnergyMoodPredictions(userId)

    // Save predictions to database with error handling
    try {
      await prisma.$transaction(async (tx) => {
        for (const prediction of predictions) {
          await tx.energyMoodPrediction.upsert({
            where: {
              userId_date: {
                userId,
                date: prediction.date
              }
            },
            update: {
              predictedEnergy: prediction.predictedEnergy,
              predictedMood: prediction.predictedMood,
              predictedFocus: prediction.predictedFocus,
              cycleDay: prediction.cycleDay,
              cyclePhase: prediction.cyclePhase,
              confidence: prediction.confidence
            },
            create: {
              userId,
              date: prediction.date,
              predictedEnergy: prediction.predictedEnergy,
              predictedMood: prediction.predictedMood,
              predictedFocus: prediction.predictedFocus,
              cycleDay: prediction.cycleDay,
              cyclePhase: prediction.cyclePhase,
              confidence: prediction.confidence
            }
          })
        }
      })
    } catch (dbError) {
      console.log('Database save error (non-critical):', dbError)
    }

    return NextResponse.json({ success: true, data: predictions })
  } catch (error) {
    console.error('Energy mood predictions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, actualEnergy, actualMood, actualFocus } = await request.json()
    const userId = session.user.email

    await prisma.energyMoodPrediction.update({
      where: {
        userId_date: {
          userId,
          date: new Date(date)
        }
      },
      data: {
        actualEnergy,
        actualMood,
        actualFocus
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Actual energy mood update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}