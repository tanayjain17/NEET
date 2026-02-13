import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TestPerformanceRepository, TestType } from '@/lib/repositories/test-performance-repository'

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

    let trend
    if (testType) {
      const tests = await TestPerformanceRepository.getByUserIdAndType(session.user.email, testType)
      trend = tests.map(test => ({
        date: test.testDate.toISOString().split('T')[0],
        score: test.score,
        percentage: Math.round((test.score / 720) * 100 * 100) / 100,
        testType: test.testType,
        testNumber: test.testNumber
      })).reverse() // Show chronological order
    } else {
      trend = await TestPerformanceRepository.getPerformanceTrend(
        session.user.email, 
        limit ? parseInt(limit) : 100 // Default limit of 100 tests
      )
    }

    return NextResponse.json({
      success: true,
      data: trend
    })

  } catch (error) {
    console.error('Error fetching performance trend:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}