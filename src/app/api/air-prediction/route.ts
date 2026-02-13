import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AIRPredictionEngine } from '@/lib/air-prediction-engine'
import { ComprehensiveDataFetcher } from '@/lib/comprehensive-data-fetcher'
import { generateComprehensiveAIInsights } from '@/lib/groq-air-insights'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Fetch comprehensive user data with fallback
    let comprehensiveData
    try {
      comprehensiveData = await ComprehensiveDataFetcher.fetchAllUserData(session.user.email)
    } catch (dataError) {
      console.warn('Comprehensive data fetch failed, using fallback:', dataError)
      comprehensiveData = {
        totalQuestionsLifetime: 0,
        consistencyScore: 2,
        averageTestScore: 0,
        studyStreak: 0,
        chaptersCompleted: 0,
        totalChapters: 0,
        weakAreas: [],
        strongAreas: [],
        testPerformances: []
      }
    }
    
    // Generate AIR prediction with fallback
    let prediction
    try {
      prediction = await AIRPredictionEngine.generatePrediction(session.user.email)
    } catch (predictionError) {
      console.warn('AIR prediction engine failed, using fallback:', predictionError)
      prediction = {
        predictedAIR: 950000,
        confidence: 0.02,
        factors: { progressScore: 2, testTrend: 2, consistency: 2, biologicalFactor: 50, externalFactor: 50 },
        recommendations: ['🚨 START NOW: Begin tracking your progress', '📚 URGENT: Take mock tests', '⚡ CRITICAL: Set daily goals'],
        riskLevel: 'high',
        comprehensiveData: { totalQuestionsLifetime: 0, consistencyScore: 2, averageTestScore: 0, studyStreak: 0, chaptersCompleted: 0, totalChapters: 0 }
      }
    }
    
    // Remove AI insights from automatic generation

    // Save prediction to database (optional - don't fail if DB unavailable)
    try {
      await prisma.aIRPrediction.create({
        data: {
          userId: session.user.email,
          predictedAIR: prediction.predictedAIR,
          confidenceScore: prediction.confidence,
          currentProgress: prediction.factors.progressScore,
          requiredProgress: 90,
          timeRemaining: Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          keyFactors: prediction.factors,
          recommendations: prediction.recommendations,
          riskAssessment: prediction.riskLevel
        }
      })
    } catch (dbError) {
      console.warn('Failed to save prediction to database:', dbError)
      // Continue without failing the API
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...prediction,
        comprehensiveData
      }
    })
  } catch (error) {
    console.error('AIR prediction error:', error)
    
    // Return fallback prediction if main logic fails
    return NextResponse.json({ 
      success: true, 
      data: {
        predictedAIR: 950000,
        confidence: 0.02,
        factors: { 
          progressScore: 2, 
          testTrend: 2, 
          consistency: 2, 
          biologicalFactor: 50, 
          externalFactor: 50 
        },
        recommendations: [
          '🚨 START NOW: Begin chapter completion tracking',
          '📚 URGENT: Take your first mock test', 
          '⚡ CRITICAL: Set daily 300+ question goals',
          '💪 REALITY: You need massive improvement for medical college'
        ],
        riskLevel: 'high',
        comprehensiveData: {
          totalQuestionsLifetime: 0,
          consistencyScore: 2,
          averageTestScore: 0,
          studyStreak: 0,
          chaptersCompleted: 0,
          totalChapters: 0
        }
      }
    })
  }
}