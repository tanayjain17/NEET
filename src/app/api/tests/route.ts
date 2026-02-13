import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TestPerformanceRepository, TestType } from '@/lib/repositories/test-performance-repository'
import { z } from 'zod'

// Validation schema for test performance data
const testPerformanceSchema = z.object({
  testType: z.enum(['Weekly Test', 'Rank Booster', 'Test Series', 'AITS', 'Full Length Test']),
  testNumber: z.string().min(1, 'Test number is required'),
  score: z.number().min(0).max(720),
  testDate: z.string().datetime()
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
    
    // Validate request body
    const validationResult = testPerformanceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { testType, testNumber, score, testDate } = validationResult.data

    // Create test performance record
    const testPerformance = await TestPerformanceRepository.create({
      userId: session.user.email,
      testType: testType as TestType,
      testNumber,
      score,
      testDate: new Date(testDate)
    })

    // Update achievements (test adds 180 questions to total)
    try {
      const { AchievementTracker } = await import('@/lib/achievement-tracker')
      await AchievementTracker.checkAndUpdateAchievements(session.user.email)
    } catch (error) {
      console.log('Achievement update failed:', error)
    }

    return NextResponse.json({
      success: true,
      data: testPerformance,
      showMistakePopup: true // Trigger mistake analysis popup
    })

  } catch (error) {
    console.error('Error creating test performance:', error)
    
    if (error instanceof Error && error.message.includes('Score must be between 0 and 720')) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 720' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('testType') as TestType | null
    const limit = searchParams.get('limit')

    let tests
    if (testType) {
      tests = await TestPerformanceRepository.getByUserIdAndType(session.user.email, testType)
    } else if (limit) {
      tests = await TestPerformanceRepository.getRecentTests(session.user.email, parseInt(limit))
    } else {
      tests = await TestPerformanceRepository.getAllByUserId(session.user.email)
    }

    return NextResponse.json({
      success: true,
      data: tests
    })

  } catch (error) {
    console.error('Error fetching test performances:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    const validationResult = testPerformanceSchema.safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { testType, testNumber, score, testDate } = validationResult.data

    const updatedTest = await TestPerformanceRepository.update(id, {
      testType: testType as TestType,
      testNumber,
      score,
      testDate: new Date(testDate)
    })

    return NextResponse.json({
      success: true,
      data: updatedTest
    })

  } catch (error) {
    console.error('Error updating test performance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      )
    }

    await TestPerformanceRepository.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Test deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting test performance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}