import { NextRequest, NextResponse } from 'next/server'
import { AfternoonPerformanceEngine } from '@/lib/afternoon-performance-engine'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate afternoon session data
    const validation = validateAfternoonSession(data)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Track the afternoon session
    const result = await AfternoonPerformanceEngine.trackAfternoonSession(validation.sanitizedData)
    
    return NextResponse.json({
      success: true,
      session: result.session,
      insights: result.insights,
      message: 'Afternoon session tracked successfully'
    })
    
  } catch (error) {
    console.error('Error tracking afternoon session:', error)
    return NextResponse.json(
      { error: 'Failed to track afternoon session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '1'
    
    // Get afternoon performance optimization plan
    const optimizationPlan = await AfternoonPerformanceEngine.getOptimizationPlan(userId)
    
    return NextResponse.json({
      success: true,
      data: optimizationPlan
    })
    
  } catch (error) {
    console.error('Error getting afternoon optimization plan:', error)
    return NextResponse.json(
      { error: 'Failed to get optimization plan' },
      { status: 500 }
    )
  }
}

function validateAfternoonSession(data: any) {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!data.userId) errors.push('User ID is required')
  if (!data.subject) errors.push('Subject is required')
  if (!data.startTime) errors.push('Start time is required')
  if (!data.endTime) errors.push('End time is required')
  
  // Numeric validations
  if (typeof data.questionsAttempted !== 'number' || data.questionsAttempted < 0) {
    errors.push('Questions attempted must be a positive number')
  }
  if (typeof data.questionsCorrect !== 'number' || data.questionsCorrect < 0) {
    errors.push('Questions correct must be a positive number')
  }
  if (data.questionsCorrect > data.questionsAttempted) {
    errors.push('Questions correct cannot exceed questions attempted')
  }
  
  // Level validations (1-10)
  const levels = ['energyLevel', 'focusLevel', 'stressLevel']
  levels.forEach(level => {
    if (typeof data[level] !== 'number' || data[level] < 1 || data[level] > 10) {
      errors.push(`${level} must be between 1-10`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedData: errors.length === 0 ? {
      ...data,
      date: new Date(data.date || new Date()),
      accuracy: data.questionsAttempted > 0 ? (data.questionsCorrect / data.questionsAttempted) * 100 : 0,
      duration: calculateDuration(data.startTime, data.endTime)
    } : undefined
  }
}

function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)) // minutes
}