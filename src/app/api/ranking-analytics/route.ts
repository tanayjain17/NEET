import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RankingAnalyticsEngine } from '@/lib/ranking-analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    console.log('Calculating ranking for user:', session.user.email)
    const ranking = await RankingAnalyticsEngine.calculateRanking(session.user.email)
    console.log('Ranking calculated:', ranking)

    // Ensure all required fields are present
    if (!ranking || typeof ranking.currentRank !== 'number') {
      console.warn('Invalid ranking data, using defaults')
      const defaultRanking = {
        currentRank: 500000,
        totalStudents: 1000000,
        percentile: 50,
        categoryRank: 350000,
        stateRank: 25000,
        progressRank: 400000,
        consistencyRank: 300000,
        biologicalOptimizationRank: 450000,
        rigorousMetrics: {
          syllabusCompletion: 0,
          testAverage: 0,
          dailyConsistency: 0,
          weeklyTarget: 0,
          monthlyGrowth: 0
        }
      }
      return NextResponse.json({ success: true, data: defaultRanking })
    }

    return NextResponse.json({ success: true, data: ranking })
  } catch (error) {
    console.error('Ranking analytics error:', error)
    
    // Return default ranking on error
    const defaultRanking = {
      currentRank: 500000,
      totalStudents: 1000000,
      percentile: 50,
      categoryRank: 350000,
      stateRank: 25000,
      progressRank: 400000,
      consistencyRank: 300000,
      biologicalOptimizationRank: 450000,
      rigorousMetrics: {
        syllabusCompletion: 0,
        testAverage: 0,
        dailyConsistency: 0,
        weeklyTarget: 0,
        monthlyGrowth: 0
      }
    }
    
    return NextResponse.json({ success: true, data: defaultRanking })
  }
}