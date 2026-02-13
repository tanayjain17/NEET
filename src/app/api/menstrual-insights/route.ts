import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateMenstrualInsights } from '@/lib/groq-menstrual-insights'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // For now, let's use a default user ID or skip auth
    const userId = 'default-user' // You can change this to actual user ID later

    // Get the most recent menstrual cycle data
    const recentCycle = await prisma.menstrualCycle.findFirst({
      where: { userId: userId },
      orderBy: { cycleStartDate: 'desc' }
    })

    if (!recentCycle) {
      // Return sample data if no cycle data exists
      const sampleInsights = {
        currentPhase: 'follicular',
        dayInCycle: 8,
        energyPrediction: 7,
        studyRecommendations: [
          'Great time for learning new concepts',
          'Tackle challenging topics and problem sets',
          'Engage in active recall and spaced repetition'
        ],
        symptomPredictions: ['Increased energy', 'Better mood'],
        optimalStudyTimes: ['8:00 AM - 11:00 AM', '2:00 PM - 5:00 PM']
      }

      return NextResponse.json({ success: true, data: sampleInsights })
    }

    // Calculate current cycle insights
    const cycleStartDate = new Date(recentCycle.cycleStartDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))
    const dayInCycle = (daysSinceStart % recentCycle.cycleLength) + 1

    // Determine current phase
    let currentPhase = 'follicular'
    if (dayInCycle <= recentCycle.periodLength) {
      currentPhase = 'menstrual'
    } else if (dayInCycle <= 7) {
      currentPhase = 'follicular'
    } else if (dayInCycle >= 12 && dayInCycle <= 16) {
      currentPhase = 'ovulation'
    } else if (dayInCycle > 16) {
      currentPhase = 'luteal'
    }

    // Generate phase-based insights
    const insights = {
      currentPhase,
      dayInCycle,
      energyPrediction: getEnergyPrediction(currentPhase, dayInCycle),
      studyRecommendations: getStudyRecommendations(currentPhase),
      symptomPredictions: getSymptomPredictions(currentPhase),
      optimalStudyTimes: getOptimalStudyTimes(currentPhase)
    }

    return NextResponse.json({ success: true, data: insights })
  } catch (error) {
    console.error('Menstrual insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const insightData = await request.json()

    // For now, return sample insights without AI generation
    const sampleInsights = {
      currentPhase: 'ovulation',
      dayInCycle: 14,
      energyPrediction: 9,
      studyRecommendations: [
        'Peak performance time - tackle hardest subjects',
        'Engage in group study and discussions',
        'Practice mock tests and time management'
      ],
      symptomPredictions: ['Peak energy', 'Enhanced focus'],
      optimalStudyTimes: ['7:00 AM - 12:00 PM', '1:00 PM - 6:00 PM']
    }

    return NextResponse.json({ success: true, data: sampleInsights })
  } catch (error) {
    console.error('Menstrual insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getEnergyPrediction(phase: string, dayInCycle: number): number {
  switch (phase) {
    case 'menstrual': return Math.max(3, 5 - Math.floor(dayInCycle / 2))
    case 'follicular': return Math.min(8, 5 + dayInCycle)
    case 'ovulation': return 9
    case 'luteal': return Math.max(4, 8 - Math.floor((dayInCycle - 16) / 3))
    default: return 6
  }
}

function getStudyRecommendations(phase: string): string[] {
  switch (phase) {
    case 'menstrual':
      return [
        'Focus on light review and consolidation',
        'Practice mindfulness and stress management',
        'Take frequent breaks and stay hydrated',
        'Avoid intensive problem-solving sessions'
      ]
    case 'follicular':
      return [
        'Great time for learning new concepts',
        'Tackle challenging topics and problem sets',
        'Engage in active recall and spaced repetition',
        'Plan and organize study schedules'
      ]
    case 'ovulation':
      return [
        'Peak performance time - tackle hardest subjects',
        'Engage in group study and discussions',
        'Practice mock tests and time management',
        'Focus on analytical and critical thinking'
      ]
    case 'luteal':
      return [
        'Excellent for detailed analysis and review',
        'Focus on precision and accuracy',
        'Practice writing and essay-based questions',
        'Consolidate and organize notes'
      ]
    default:
      return ['Maintain consistent study routine']
  }
}

function getSymptomPredictions(phase: string): string[] {
  switch (phase) {
    case 'menstrual':
      return ['Fatigue', 'Cramps', 'Lower energy']
    case 'follicular':
      return ['Increased energy', 'Better mood']
    case 'ovulation':
      return ['Peak energy', 'Enhanced focus']
    case 'luteal':
      return ['Mood changes', 'Food cravings', 'Breast tenderness']
    default:
      return []
  }
}

function getOptimalStudyTimes(phase: string): string[] {
  switch (phase) {
    case 'menstrual':
      return ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM']
    case 'follicular':
      return ['8:00 AM - 11:00 AM', '2:00 PM - 5:00 PM', '7:00 PM - 9:00 PM']
    case 'ovulation':
      return ['7:00 AM - 12:00 PM', '1:00 PM - 6:00 PM', '7:00 PM - 10:00 PM']
    case 'luteal':
      return ['9:00 AM - 12:00 PM', '3:00 PM - 6:00 PM']
    default:
      return ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM']
  }
}