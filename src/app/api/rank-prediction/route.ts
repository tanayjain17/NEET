import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RankPredictionEngine, type Profile } from '@/lib/rank-prediction-engine'
import { MistakeAnalysisEngine } from '@/lib/mistake-analysis-engine'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = '1' // user ID

    // Get real-time data from mistake analysis
    const realTimeData = await MistakeAnalysisEngine.getDataForRankPrediction(userId)

    //  profile with REAL NEET 2025 data and current improvement
    const Profile: Profile = {
      category: 'General',
      homeState: 'Bihar',
      coachingInstitute: 'Physics Wallah Online',
      preparationYears: 3,
      attemptNumber: 4, // NEET 2026 will be 4th attempt (2025 was 3rd)
      class12Percentage: 79,
      board: 'State Board',
      schoolRank: 'Top 5',
      foundationStrength: 'Significantly Improved', // 320→530-640 shows major improvement
      mockScoreRange: { 
        min: Math.max(realTimeData.performanceMetrics.worstTestScore || 530, 530), 
        max: Math.max(realTimeData.performanceMetrics.bestTestScore || 640, 640), 
        target: 680 // More realistic target given improvement trajectory
      },
      currentStudyHours: { 
        current: realTimeData.performanceMetrics.avgDailyQuestions > 500 ? 10 : 8, 
        upcoming: 14 
      },
      questionSolvingCapacity: { 
        current: realTimeData.performanceMetrics.avgDailyQuestions || 400, 
        upcoming: 1000 
      },
      questionSolvingSpeed: { min: 60, max: 120 },
      sleepHours: realTimeData.performanceMetrics.avgEnergy > 7 ? 7 : 5.5,
      sleepQuality: Math.min(realTimeData.performanceMetrics.avgEnergy, 8),
      menstrualCycle: {
        length: 5.5,
        heavyFlowDays: [2],
        painDays: [2, 3],
        lowEnergyDays: [2, 3]
      },
      stressTriggers: ['family_pressure', 'target_completion', 'time_pressure', 'multiple_attempts'],
      familyPressure: realTimeData.performanceMetrics.avgStress > 7 ? 'High' : 'Medium',
      bestPerformingSlots: ['morning', 'evening'],
      problematicSlots: ['afternoon'],
      subjectPreference: ['Biology', 'Chemistry', 'Physics'],
      weaknessType: realTimeData.mistakeAnalysis.mostFrequentMistake || 'pattern_confusion',
      errorTypes: ['silly_mistakes', 'overthinking', 'panic_response'],
      revisionFrequency: realTimeData.performanceMetrics.totalTimeWasted > 300 ? 'below_average' : 'average',
      dietType: 'vegetarian_with_junk',
      fitnessLevel: 'good'
    }

    // Generate prediction with real-time data
    const prediction = await RankPredictionEngine.generatePrediction(Profile, realTimeData)

    return NextResponse.json({
      success: true,
      data: {
        prediction,
        realTimeInsights: {
          dataQuality: realTimeData.performanceMetrics.avgTestScore > 0 ? 'High' : 'Medium',
          mistakePatterns: realTimeData.mistakeAnalysis.totalPatterns,
          improvementTrend: realTimeData.trendAnalysis.improvementTrend,
          consistencyScore: realTimeData.trendAnalysis.consistencyScore,
          riskFactors: realTimeData.trendAnalysis.riskFactors
        }
      }
    })

  } catch (error) {
    console.error('Error generating rank prediction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}