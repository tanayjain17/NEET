import { NextRequest, NextResponse } from 'next/server'
import { RealTimePerformanceAggregator } from '@/lib/real-time-performance-aggregator'
import { DynamicRankPredictor } from '@/lib/dynamic-rank-predictor'

export async function GET(request: NextRequest) {
  try {
    // Get aggregated performance data from entire project
    const performanceData = await RealTimePerformanceAggregator.aggregatePerformanceData()
    
    // Calculate dynamic rank prediction
    const rankPrediction = DynamicRankPredictor.calculatePredictedRank(performanceData)
    
    // Get performance insights
    const insights = DynamicRankPredictor.getPerformanceInsights(performanceData, rankPrediction)
    
    return NextResponse.json({
      success: true,
      data: {
        performanceData,
        rankPrediction,
        insights,
        competitiveData: {
          currentRank: rankPrediction.currentRank,
          targetRank: 50,
          gapAnalysis: {
            questionsGap: Math.max(0, 400 - performanceData.dailyQuestions),
            hoursGap: Math.max(0, 12 - performanceData.studyHours),
            accuracyGap: Math.max(0, 100 - performanceData.accuracy)
          },
          topperPatterns: {
            dailyQuestions: 400,
            studyHours: 12,
            accuracy: 100,
            revisionCycles: 3
          },
          Progress: {
            dailyQuestions: performanceData.dailyQuestions,
            studyHours: performanceData.studyHours,
            accuracy: performanceData.accuracy,
            revisionCycles: Math.round(performanceData.syllabusCompletion / 30)
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching competitive edge data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch competitive data' },
      { status: 500 }
    )
  }
}