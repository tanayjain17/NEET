/**
 * Afternoon Performance Training Engine
 * Optimizes performance for NEET exam timing (2-5 PM)
 */

import { prisma } from './prisma'

export interface AfternoonSession {
  userId: string
  date: Date
  startTime: string // "14:00" format
  endTime: string
  subject: string
  questionsAttempted: number
  questionsCorrect: number
  energyLevel: number
  focusLevel: number
  stressLevel: number
  caffeineIntake?: string
  mealTiming?: string
}

export class AfternoonPerformanceEngine {
  private static readonly NEET_EXAM_TIME = { start: 14, end: 17 } // 2-5 PM

  /**
   * Track afternoon performance session
   */
  static async trackAfternoonSession(sessionData: AfternoonSession) {
    const session = await prisma.studySession.create({
      data: {
        userId: sessionData.userId,
        subject: sessionData.subject,
        startTime: new Date(`${sessionData.date.toISOString().split('T')[0]}T${sessionData.startTime}:00`),
        endTime: new Date(`${sessionData.date.toISOString().split('T')[0]}T${sessionData.endTime}:00`),
        duration: this.calculateDuration(sessionData.startTime, sessionData.endTime),
        focusScore: sessionData.focusLevel,
        productivity: Math.round((sessionData.questionsCorrect / sessionData.questionsAttempted) * 10),
        questionsAttempted: sessionData.questionsAttempted,
        questionsCorrect: sessionData.questionsCorrect,
        notes: JSON.stringify({
          energyLevel: sessionData.energyLevel,
          stressLevel: sessionData.stressLevel,
          caffeineIntake: sessionData.caffeineIntake,
          mealTiming: sessionData.mealTiming,
          isAfternoonTraining: true
        })
      }
    })

    // Generate performance insights
    const insights = await this.generateAfternoonInsights(sessionData.userId)
    
    return { session, insights }
  }

  /**
   * Generate afternoon performance insights
   */
  private static async generateAfternoonInsights(userId: string) {
    const afternoonSessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { startTime: 'desc' }
    })

    const afternoonOnly = afternoonSessions.filter(session => {
      const hour = session.startTime.getHours()
      return hour >= 14 && hour <= 17
    })

    const morningOnly = afternoonSessions.filter(session => {
      const hour = session.startTime.getHours()
      return hour >= 6 && hour <= 11
    })

    if (afternoonOnly.length === 0) {
      return {
        message: '🚨 No afternoon practice detected! NEET is 2-5 PM - start training immediately!',
        recommendations: [
          'Schedule daily 2-5 PM practice sessions',
          'Track energy levels during afternoon hours',
          'Optimize meal timing for sustained energy'
        ]
      }
    }

    const afternoonAvg = {
      accuracy: afternoonOnly.reduce((sum, s) => sum + (s.questionsCorrect / s.questionsAttempted), 0) / afternoonOnly.length,
      focus: afternoonOnly.reduce((sum, s) => sum + s.focusScore, 0) / afternoonOnly.length,
      productivity: afternoonOnly.reduce((sum, s) => sum + s.productivity, 0) / afternoonOnly.length
    }

    const morningAvg = morningOnly.length > 0 ? {
      accuracy: morningOnly.reduce((sum, s) => sum + (s.questionsCorrect / s.questionsAttempted), 0) / morningOnly.length,
      focus: morningOnly.reduce((sum, s) => sum + s.focusScore, 0) / morningOnly.length,
      productivity: morningOnly.reduce((sum, s) => sum + s.productivity, 0) / morningOnly.length
    } : null

    const insights = []

    // Performance comparison
    if (morningAvg) {
      const accuracyDrop = ((morningAvg.accuracy - afternoonAvg.accuracy) / morningAvg.accuracy) * 100
      const focusDrop = ((morningAvg.focus - afternoonAvg.focus) / morningAvg.focus) * 100

      if (accuracyDrop > 10) {
        insights.push({
          type: 'critical',
          message: `🚨 Afternoon accuracy drops by ${accuracyDrop.toFixed(1)}% vs morning! This could cost 30-50 marks in NEET!`,
          action: 'Implement circadian rhythm optimization immediately'
        })
      }

      if (focusDrop > 15) {
        insights.push({
          type: 'high',
          message: `⚡ Focus drops by ${focusDrop.toFixed(1)}% in afternoon. Optimize energy management.`,
          action: 'Adjust meal timing and caffeine intake'
        })
      }
    }

    // Trend analysis
    const recentSessions = afternoonOnly.slice(0, 7)
    const olderSessions = afternoonOnly.slice(7, 14)
    
    if (recentSessions.length > 0 && olderSessions.length > 0) {
      const recentAvg = recentSessions.reduce((sum, s) => sum + (s.questionsCorrect / s.questionsAttempted), 0) / recentSessions.length
      const olderAvg = olderSessions.reduce((sum, s) => sum + (s.questionsCorrect / s.questionsAttempted), 0) / olderSessions.length
      
      const improvement = ((recentAvg - olderAvg) / olderAvg) * 100
      
      if (improvement > 5) {
        insights.push({
          type: 'positive',
          message: `📈 Afternoon performance improving by ${improvement.toFixed(1)}%! Keep the momentum!`,
          action: 'Continue current optimization strategies'
        })
      } else if (improvement < -5) {
        insights.push({
          type: 'warning',
          message: `📉 Afternoon performance declining by ${Math.abs(improvement).toFixed(1)}%. Need intervention.`,
          action: 'Review and adjust afternoon training protocol'
        })
      }
    }

    return {
      afternoonStats: afternoonAvg,
      morningStats: morningAvg,
      insights,
      recommendations: this.generateAfternoonRecommendations(afternoonAvg, morningAvg)
    }
  }

  /**
   * Generate afternoon optimization recommendations
   */
  private static generateAfternoonRecommendations(afternoonAvg: any, morningAvg: any) {
    const recommendations = []

    if (!morningAvg || afternoonAvg.accuracy < morningAvg.accuracy * 0.9) {
      recommendations.push({
        category: 'Energy Management',
        actions: [
          '🍽️ Light lunch by 12:30 PM (avoid heavy meals)',
          '☕ Strategic caffeine: 1 cup at 1:30 PM',
          '💧 Hydrate well: 500ml water by 2 PM',
          '🚶 5-minute walk before starting study'
        ]
      })
    }

    if (afternoonAvg.focus < 7) {
      recommendations.push({
        category: 'Focus Enhancement',
        actions: [
          '🎵 Use focus music or white noise',
          '🌡️ Optimize room temperature (22-24°C)',
          '💡 Ensure bright lighting (natural preferred)',
          '📱 Phone in airplane mode during sessions'
        ]
      })
    }

    recommendations.push({
      category: 'Circadian Optimization',
      actions: [
        '⏰ Consistent 2-5 PM practice daily',
        '😴 Power nap (10-15 min) at 1 PM if needed',
        '🧘 2-minute breathing exercise before starting',
        '🎯 Start with easier questions to build momentum'
      ]
    })

    return recommendations
  }

  /**
   * Calculate session duration in minutes
   */
  private static calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    return endMinutes - startMinutes
  }

  /**
   * Get afternoon performance optimization plan
   */
  static async getOptimizationPlan(userId: string) {
    const insights = await this.generateAfternoonInsights(userId)
    
    return {
      currentStatus: insights,
      weeklyPlan: this.generateWeeklyPlan(),
      dailyProtocol: this.getDailyProtocol(),
      emergencyBoosts: this.getEmergencyBoosts()
    }
  }

  /**
   * Generate weekly afternoon training plan
   */
  private static generateWeeklyPlan() {
    return {
      week1: {
        focus: 'Baseline establishment',
        dailyTarget: '1 hour afternoon practice',
        subjects: ['Physics - easier topics', 'Chemistry - familiar chapters']
      },
      week2: {
        focus: 'Energy optimization',
        dailyTarget: '1.5 hours afternoon practice',
        subjects: ['All subjects - mixed difficulty']
      },
      week3: {
        focus: 'Full simulation',
        dailyTarget: '3 hours (full NEET duration)',
        subjects: ['Complete mock tests 2-5 PM']
      },
      week4: {
        focus: 'Peak performance',
        dailyTarget: '3 hours + analysis',
        subjects: ['Hardest topics during afternoon']
      }
    }
  }

  /**
   * Get daily afternoon protocol
   */
  private static getDailyProtocol() {
    return {
      '12:00': 'Light, protein-rich lunch',
      '12:30': 'Finish eating, start digestion',
      '13:00': 'Hydrate (500ml water)',
      '13:30': 'Strategic caffeine intake',
      '13:45': '5-minute energizing walk',
      '13:55': 'Setup study space, breathing exercise',
      '14:00': 'START - Begin with easier questions',
      '15:30': '2-minute stretch break',
      '17:00': 'END - Immediate performance logging'
    }
  }

  /**
   * Get emergency energy boost strategies
   */
  private static getEmergencyBoosts() {
    return [
      {
        situation: 'Extreme fatigue',
        solution: '10 jumping jacks + cold water on face + 2-minute breathing'
      },
      {
        situation: 'Mental fog',
        solution: 'Peppermint oil smell + bright light + protein snack'
      },
      {
        situation: 'Stress spike',
        solution: '4-7-8 breathing + positive affirmation + easier question'
      },
      {
        situation: 'Focus drift',
        solution: 'Change position + 30-second meditation + timer reset'
      }
    ]
  }
}