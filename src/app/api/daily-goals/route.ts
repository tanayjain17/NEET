import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DailyGoalsRepository } from '@/lib/repositories/daily-goals-repository'
import { RealTimeSyncService } from '@/lib/real-time-sync'
import { z } from 'zod'

const dailyGoalSchema = z.object({
  physicsQuestions: z.number().min(0),
  chemistryQuestions: z.number().min(0),
  botanyQuestions: z.number().min(0),
  zoologyQuestions: z.number().min(0),
  physicsDpp: z.number().min(0),
  chemistryDpp: z.number().min(0),
  botanyDpp: z.number().min(0),
  zoologyDpp: z.number().min(0),
  physicsRevision: z.number().min(0),
  chemistryRevision: z.number().min(0),
  botanyRevision: z.number().min(0),
  zoologyRevision: z.number().min(0)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = dailyGoalSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    // Get current date in IST
    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const today = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate())

    const dailyGoal = await RealTimeSyncService.syncDailyGoals(
      session.user.email,
      today,
      validationResult.data
    )

    return NextResponse.json({
      success: true,
      data: dailyGoal,
      showMistakePopup: true // Trigger mistake analysis popup
    })

  } catch (error) {
    console.error('Error saving daily goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}