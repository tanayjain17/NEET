/**
 * Aspirant's Mistake Analysis & Learning Engine
 * Real-time analysis of study patterns and mistakes for NEET 2026 success
 */

import { prisma } from './prisma'
import { MistakePattern } from '@prisma/client'

export interface ClinicalMistakeData {
  mistakeCategories: string[]
  specificMistakes: string[]
  improvementAreas: string[]
  timeWasted: number
  stressLevel: number
  energyLevel: number
  focusLevel: number
  subjectSpecificMistakes: {
    physics?: string[]
    chemistry?: string[]
    biology?: string[]
  }
  mistakeContext: {
    timeOfDay: string
    questionDifficulty: 'easy' | 'medium' | 'hard'
    topicArea: string
  }
}

export interface StudySessionMetrics {
  physicsQuestions?: number
  chemistryQuestions?: number
  botanyQuestions?: number
  zoologyQuestions?: number
  testScore?: number
  testType?: string
  sessionStartTime?: string
  sessionEndTime?: string
  isAfternoonSession?: boolean
  currentChapter?: string
  currentSubject?: string
}

export class ClinicalMistakeAnalyzer {
  /**
   * Analyze mistakes and generate AI insights
   */
  static async analyzeMistakes(
    userId: string,
    sessionType: 'daily_study' | 'test',
    studySessionMetrics: StudySessionMetrics,
    mistakeData: ClinicalMistakeData
  ) {
    // Save mistake log
    const mistakeLog = await this.saveMistakeLog(userId, sessionType, StudySessionMetrics, mistakeData)
    
    // Update mistake patterns with session context
    await this.updateMistakePatterns(userId, mistakeData, StudySessionMetrics)
    
    // Generate AI analysis
    const aiAnalysis = await this.generateAIAnalysis(userId, mistakeLog)
    
    // Update mistake log with AI analysis
    await prisma.studyMistakeLog.update({
      where: { id: mistakeLog.id },
      data: {
        aiAnalysis: aiAnalysis.insights,
        recommendations: aiAnalysis.recommendations,
        riskScore: aiAnalysis.riskScore
      }
    })

    return aiAnalysis
  }

  /**
   * Save mistake log to database
   */
  private static async saveMistakeLog(
    userId: string,
    sessionType: 'daily_study' | 'test',
    studySessionMetrics: StudySessionMetrics,
    mistakeData: ClinicalMistakeData
  ) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const data = {
      ...studySessionMetrics,
      mistakeCategories: mistakeData.mistakeCategories,
      specificMistakes: mistakeData.specificMistakes,
      improvementAreas: mistakeData.improvementAreas,
      timeWasted: mistakeData.timeWasted,
      stressLevel: mistakeData.stressLevel,
      energyLevel: mistakeData.energyLevel,
      focusLevel: mistakeData.focusLevel
    }

    // Try to create first, then update if it exists
    try {
      return await prisma.studyMistakeLog.create({
        data: {
          userId,
          date: today,
          sessionType,
          ...data
        }
      })
    } catch (error: any) {
      // Handle unique constraint violation - record already exists
      if (error.code === 'P2002') {
        // Find and update the existing record
        const existing = await prisma.studyMistakeLog.findFirst({
          where: { userId, date: today, sessionType }
        })
        if (existing) {
          return await prisma.studyMistakeLog.update({
            where: { id: existing.id },
            data: { ...data, updatedAt: new Date() }
          })
        }
      }
      throw error
    }
  }

  /**
   * Update mistake patterns with subject-specific tracking
   */
  private static async updateMistakePatterns(userId: string, mistakeData: ClinicalMistakeData, StudySessionMetrics: StudySessionMetrics) {
    // Process subject-specific mistakes
    const subjectMistakes = [
      { subject: 'Physics', mistakes: mistakeData.subjectSpecificMistakes.physics || [] },
      { subject: 'Chemistry', mistakes: mistakeData.subjectSpecificMistakes.chemistry || [] },
      { subject: 'Biology', mistakes: mistakeData.subjectSpecificMistakes.biology || [] }
    ]

    for (const { subject, mistakes } of subjectMistakes) {
      if (mistakes.length === 0) continue

      for (const mistake of mistakes) {
        const topic = mistakeData.mistakeContext.topicArea || 'General'
        
        // Try to create first, then update if it exists
        try {
          await prisma.mistakePattern.create({
            data: {
              userId,
              mistakeType: mistake,
              subject,
              topic,
              frequency: 1,
              severity: this.calculateSeverity(mistake, mistakeData.stressLevel),
              lastOccurrence: new Date(),
              triggerFactors: this.analyzeTriggerFactors(mistakeData),
              solutions: this.generateNEETSpecificSolutions(mistake, subject)
            }
          })
        } catch (error: any) {
          // Handle unique constraint violation - pattern already exists
          if (error.code === 'P2002') {
            const existing = await prisma.mistakePattern.findFirst({
              where: { userId, mistakeType: mistake, subject, topic }
            })
            if (existing) {
              await prisma.mistakePattern.update({
                where: { id: existing.id },
                data: {
                  frequency: { increment: 1 },
                  lastOccurrence: new Date(),
                  triggerFactors: this.analyzeTriggerFactors(mistakeData),
                  solutions: this.generateNEETSpecificSolutions(mistake, subject)
                }
              })
            }
          } else {
            throw error
          }
        }
      }
    }
  }

  /**
   * Generate comprehensive AI analysis
   */
  private static async generateAIAnalysis(userId: string, mistakeLog: any) {
    // Get historical data
    const recentLogs = await prisma.studyMistakeLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    })

    const mistakePatterns = await prisma.mistakePattern.findMany({
      where: { userId },
      orderBy: { frequency: 'desc' }
    })

    // Analyze patterns
    const insights = this.generateInsights(mistakeLog, recentLogs, mistakePatterns)
    const recommendations = this.generateRecommendations(mistakeLog, mistakePatterns)
    const riskScore = this.calculateRiskScore(mistakeLog, mistakePatterns)

    return { insights, recommendations, riskScore }
  }

  /**
   * Generate AI insights based on mistake patterns
   */
  interface MistakeLog {
  id: string
  stressLevel: number
  energyLevel: number
  focusLevel: number
  timeWasted: number
  mistakeCategories: string[]
  // ... other fields
}

private static generateInsights(
  currentLog: MistakeLog, 
  recentLogs: MistakeLog[], 
  patterns: MistakePattern[]
) {
    const insights: any[] = []

    // Performance trend analysis
    const avgStress = recentLogs.reduce((sum, log) => sum + log.stressLevel, 0) / recentLogs.length
    const avgEnergy = recentLogs.reduce((sum, log) => sum + log.energyLevel, 0) / recentLogs.length
    const avgFocus = recentLogs.reduce((sum, log) => sum + log.focusLevel, 0) / recentLogs.length

    if (currentLog.stressLevel > avgStress + 2) {
      insights.push({
        type: 'stress_alert',
        message: `🚨 Your stress level (${currentLog.stressLevel}/10) is significantly higher than your average (${avgStress.toFixed(1)}/10). This is affecting your performance.`,
        severity: 'high',
        action: 'Implement stress management techniques immediately'
      })
    }

    if (currentLog.energyLevel < avgEnergy - 2) {
      insights.push({
        type: 'energy_alert',
        message: `⚡ Your energy level (${currentLog.energyLevel}/10) is much lower than usual (${avgEnergy.toFixed(1)}/10). Consider sleep and nutrition optimization.`,
        severity: 'medium',
        action: 'Focus on sleep quality and nutrition'
      })
    }

    // Mistake pattern analysis
    const repeatedMistakes = patterns.filter(p => p.frequency >= 3)
    if (repeatedMistakes.length > 0) {
      insights.push({
        type: 'pattern_alert',
        message: `🔄 You're repeating ${repeatedMistakes.length} types of mistakes. This is costing you valuable marks.`,
        severity: 'high',
        action: 'Focus on breaking these repetitive patterns',
        details: repeatedMistakes.map(p => `${p.mistakeType} in ${p.subject} (${p.frequency} times)`)
      })
    }

    // Time wastage analysis
    const totalTimeWasted = recentLogs.reduce((sum, log) => sum + (log.timeWasted || 0), 0)
    if (totalTimeWasted > 300) { // More than 5 hours in last 30 days
      insights.push({
        type: 'efficiency_alert',
        message: `⏰ You've wasted ${totalTimeWasted} minutes in the last 30 days. This equals ${Math.round(totalTimeWasted/60)} hours of lost study time.`,
        severity: 'medium',
        action: 'Implement better time management strategies'
      })
    }

    return insights
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(currentLog: any, patterns: any[]) {
    const recommendations: any[] = []

    // Immediate actions based on current session
    if (currentLog.mistakeCategories.includes('silly_mistakes')) {
      recommendations.push({
        type: 'immediate',
        title: 'Eliminate Silly Mistakes (Cost you 20-30 marks!)',
        actions: [
          '🎯 Create a "Silly Mistake Checklist" - use it for every question',
          '⏰ Slow down by 10% - accuracy improves more than speed decreases',
          '✅ Circle key words in questions: "NOT", "EXCEPT", "ALWAYS"',
          '🔢 For calculations: estimate answer first, then solve precisely'
        ],
        priority: 'critical'
      })
    }
    
    if (currentLog.mistakeCategories.includes('conceptual_gaps')) {
      recommendations.push({
        type: 'immediate',
        title: 'Bridge Conceptual Gaps',
        actions: [
          '📚 Identify exact topics causing confusion - be specific',
          '🎯 Solve 20 basic questions before attempting moderate ones',
          '🔗 Connect new concepts to what you already know well',
          '📝 Explain concepts in simple words - if you can\'t, you don\'t know it'
        ],
        priority: 'high'
      })
    }

    if (currentLog.mistakeCategories.includes('overthinking')) {
      recommendations.push({
        type: 'immediate',
        title: 'Stop Overthinking (Reduces accuracy by 15%)',
        actions: [
          '⏱️ Strict 90-second rule per question - set timer during practice',
          '🎯 First instinct is correct 68% of the time - trust your preparation',
          '✂️ Eliminate 2 wrong options first, then choose between remaining'
        ],
        priority: 'high'
      })
    }

    return recommendations
  }

  /**
   * Generate NEET-specific solutions for mistakes
   */
  private static generateNEETSpecificSolutions(mistake: string, subject: string): string[] {
    const solutions: Record<string, string[]> = {
      'formula_error': [
        'Create formula flashcards with derivations',
        'Practice 10 formula-based questions daily',
        'Write formulas before solving each question'
      ],
      'unit_conversion': [
        'Always write units in every step',
        'Create unit conversion cheat sheet',
        'Practice dimensional analysis daily'
      ],
      'diagram_misinterpretation': [
        'Draw your own diagram for each question',
        'Label all parts clearly',
        'Practice diagram-based questions separately'
      ],
      'calculation_error': [
        'Use calculator for complex calculations',
        'Double-check arithmetic in last 30 seconds',
        'Round numbers appropriately during calculation'
      ],
      'question_misreading': [
        'Underline key words: NOT, EXCEPT, ALWAYS',
        'Read question twice before solving',
        'Circle the actual question being asked'
      ]
    }

    return solutions[mistake] || ['Review concept thoroughly', 'Practice more questions', 'Seek help from teacher']
  }

  /**
   * Analyze trigger factors for mistakes
   */
  private static analyzeTriggerFactors(mistakeData: ClinicalMistakeData): string[] {
    const factors: string[] = []
    
    if (mistakeData.stressLevel > 7) factors.push('high_stress')
    if (mistakeData.energyLevel < 4) factors.push('low_energy')
    if (mistakeData.focusLevel < 5) factors.push('poor_focus')
    if (mistakeData.timeWasted > 30) factors.push('time_pressure')
    if (mistakeData.mistakeContext.timeOfDay === 'afternoon') factors.push('afternoon_fatigue')
    if (mistakeData.mistakeContext.questionDifficulty === 'hard') factors.push('high_difficulty')
    
    return factors
  }

  /**
   * Calculate mistake severity
   */
  private static calculateSeverity(mistake: string, stressLevel: number): string {
    const criticalMistakes = ['formula_error', 'unit_conversion', 'question_misreading']
    const moderateMistakes = ['calculation_error', 'diagram_misinterpretation']
    
    if (criticalMistakes.includes(mistake)) return 'high'
    if (moderateMistakes.includes(mistake)) return 'medium'
    if (stressLevel > 8) return 'high'
    return 'low'
  }

  /**
   * Calculate risk score for mistake repetition
   */
  private static calculateRiskScore(mistakeLog: any, patterns: any[]): number {
    let riskScore = 0
    
    // High frequency patterns increase risk
    const highFrequencyPatterns = patterns.filter(p => p.frequency >= 5)
    riskScore += highFrequencyPatterns.length * 0.2
    
    // Recent mistakes increase risk
    const recentPatterns = patterns.filter(p => {
      const daysSince = (Date.now() - new Date(p.lastOccurrence).getTime()) / (1000 * 60 * 60 * 24)
      return daysSince <= 7
    })
    riskScore += recentPatterns.length * 0.15
    
    // Stress and energy levels affect risk
    if (mistakeLog.stressLevel > 7) riskScore += 0.3
    if (mistakeLog.energyLevel < 4) riskScore += 0.25
    
    return Math.min(riskScore, 1.0)
  }

  /**
   * Get comprehensive data for rank prediction
   */
  static async getDataForRankPrediction(userId: string) {
    const [recentLogs, mistakePatterns, dailyGoals, testPerformances] = await Promise.all([
      prisma.studyMistakeLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      }),
      prisma.mistakePattern.findMany({
        where: { userId, isResolved: false },
        orderBy: { frequency: 'desc' }
      }),
      prisma.dailyGoal.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      }),
      prisma.testPerformance.findMany({
        where: { userId },
        orderBy: { testDate: 'desc' },
        take: 10
      })
    ])

    // Calculate performance metrics
    const avgStress = recentLogs.reduce((sum: number, log: any) => sum + log.stressLevel, 0) / recentLogs.length || 5
    const avgEnergy = recentLogs.reduce((sum: number, log: any) => sum + log.energyLevel, 0) / recentLogs.length || 5
    const avgFocus = recentLogs.reduce((sum: number, log: any) => sum + log.focusLevel, 0) / recentLogs.length || 5
    
    const totalTimeWasted = recentLogs.reduce((sum, log) => sum + (log.timeWasted || 0), 0)
    const avgDailyQuestions = dailyGoals.reduce((sum: number, goal: any) => sum + (goal.totalQuestions || 0), 0) / dailyGoals.length || 0
    
    const recentTestScores = testPerformances.slice(0, 5).map(t => t.score)
    const avgTestScore = recentTestScores.reduce((sum: number, score: number) => sum + score, 0) / recentTestScores.length || 0
    const bestTestScore = Math.max(...recentTestScores, 0)
    const worstTestScore = Math.min(...recentTestScores, 720)
    
    const criticalMistakes = mistakePatterns.filter(p => p.frequency >= 5).length
    const moderateMistakes = mistakePatterns.filter(p => p.frequency >= 3 && p.frequency < 5).length
    
    return {
      performanceMetrics: {
        avgStress,
        avgEnergy,
        avgFocus,
        totalTimeWasted,
        avgDailyQuestions,
        avgTestScore,
        bestTestScore,
        worstTestScore
      },
      mistakeAnalysis: {
        criticalMistakes,
        moderateMistakes,
        totalPatterns: mistakePatterns.length,
        mostFrequentMistake: mistakePatterns[0]?.mistakeType || 'none'
      },
      trendAnalysis: {
        improvementTrend: this.calculateImprovementTrend(recentLogs, testPerformances),
        consistencyScore: this.calculateConsistencyScore(recentLogs),
        riskFactors: this.identifyRiskFactors(recentLogs, mistakePatterns)
      }
    }
  }

  private static calculateImprovementTrend(logs: any[], tests: any[]): number {
    if (tests.length < 2) return 0
    
    const recent = tests.slice(0, 3).reduce((sum: number, t: any) => sum + t.score, 0) / 3
    const older = tests.slice(3, 6).reduce((sum: number, t: any) => sum + t.score, 0) / 3 || recent
    
    return ((recent - older) / older) * 100
  }

  private static calculateConsistencyScore(logs: any[]): number {
    if (logs.length === 0) return 50
    
    const stressVariance = this.calculateVariance(logs.map(l => l.stressLevel))
    const energyVariance = this.calculateVariance(logs.map(l => l.energyLevel))
    const focusVariance = this.calculateVariance(logs.map(l => l.focusLevel))
    
    const avgVariance = (stressVariance + energyVariance + focusVariance) / 3
    return Math.max(0, 100 - (avgVariance * 10))
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum: number, diff: number) => sum + diff, 0) / values.length
  }

  private static identifyRiskFactors(logs: any[], patterns: any[]): string[] {
    const risks: string[] = []
    
    const avgStress = logs.reduce((sum: number, log: any) => sum + log.stressLevel, 0) / logs.length
    if (avgStress > 7) risks.push('high_chronic_stress')
    
    const avgEnergy = logs.reduce((sum: number, log: any) => sum + log.energyLevel, 0) / logs.length
    if (avgEnergy < 4) risks.push('chronic_low_energy')
    
    const criticalPatterns = patterns.filter(p => p.frequency >= 5)
    if (criticalPatterns.length > 0) risks.push('repetitive_critical_mistakes')
    
    const totalTimeWasted = logs.reduce((sum: number, log) => sum + (log.timeWasted || 0), 0)
    if (totalTimeWasted > 600) risks.push('significant_time_wastage')
    
    return risks
  }

  /**
   * Get recurring mistakes for AI insights display
   */
  static async getRecurringMistakes(userId: string) {
    return await prisma.mistakePattern.findMany({
      where: { 
        userId,
        frequency: { gte: 2 },
        isResolved: false
      },
      orderBy: { frequency: 'desc' },
      take: 10
    })
  }

  /**
   * Mark mistake as resolved
   */
  static async resolveMistake(userId: string, mistakeId: string) {
    return await prisma.mistakePattern.update({
      where: { id: mistakeId },
      data: {
        isResolved: true,
        resolutionDate: new Date()
      }
    })
  }
}

/**
 * Repetitive Mistake Solutions for the Aspirant
 */
export class ClinicalMistakeIntervention {
  /**
   * Get escalated solutions when mistakes are repeated
   */
  static getRepetitiveSolutions(mistakeType: string, frequency: number, subject: string) {
    if (frequency >= 5) {
      return {
        level: 'EMERGENCY',
        title: `🚨 CRITICAL: "${mistakeType}" repeated ${frequency} times!`,
        estimatedMarksLost: frequency * 8,
        timeToFix: `${Math.ceil(frequency/2)} weeks with intensive help`,
        actions: [
          `⛔ STOP studying new topics until this is fixed - it's costing you 40+ marks`,
          `📚 Dedicate 2 hours daily ONLY to ${mistakeType} in ${subject}`,
          `👨‍🏫 Get teacher/tutor help immediately - you need external intervention`,
          `🔄 Practice 50 questions of this exact type before moving forward`,
          `📝 Write "I will not make ${mistakeType} mistakes" 20 times daily`,
          `⏰ Set phone reminder every 2 hours: "Check for ${mistakeType}"`
        ]
      }
    } else if (frequency >= 3) {
      return {
        level: 'URGENT',
        title: `⚠️ URGENT: "${mistakeType}" pattern forming (${frequency} times)`,
        estimatedMarksLost: frequency * 6,
        timeToFix: `${frequency} weeks with focused effort`,
        actions: [
          `🎯 This is becoming a habit - break it NOW before it costs you admission`,
          `📖 Study ONLY the theory behind ${mistakeType} for 1 hour daily`,
          `🔍 Analyze each occurrence: What time? Stress level? Energy? Find the trigger`,
          `✍️ Create a personal "${mistakeType} Prevention Checklist"`,
          `📱 Use habit-breaking app like "Streaks" to track mistake-free days`,
          `🤝 Find a study buddy to quiz you specifically on this weakness`
        ]
      }
    }
    
    return {
      level: 'MODERATE',
      title: `🔄 Pattern Alert: "${mistakeType}" repeated ${frequency} times`,
      estimatedMarksLost: frequency * 4,
      timeToFix: `${frequency * 3} days with attention`,
      actions: [
        `📝 Document WHY each ${mistakeType} mistake happened`,
        `🔄 Practice 20 similar questions immediately after each mistake`,
        `🎯 Focus 30 min daily on ${mistakeType} prevention techniques`,
        `📊 Track weekly improvement - are you getting better?`
      ]
    }
  }

  /**
   * Check if Aspirant needs emergency intervention
   */
  static async assessCriticalPatterns(userId: string) {
    const criticalPatterns = await prisma.mistakePattern.findMany({
      where: {
        userId,
        frequency: { gte: 5 },
        isResolved: false
      },
      orderBy: { frequency: 'desc' }
    })

    if (criticalPatterns.length > 0) {
      const worst = criticalPatterns[0]
      return {
        needsIntervention: true,
        level: 'EMERGENCY',
        message: `🚨 CRITICAL: "${worst.mistakeType}" repeated ${worst.frequency} times! Estimated ${worst.frequency * 8} marks lost!`,
        intervention: this.getRepetitiveSolutions(worst.mistakeType, worst.frequency, worst.subject)
      }
    }
    
    return { needsIntervention: false }
  }
}
/**
 * Performance Prediction & Early Warning System
 */
export class ClinicalPerformancePredictor {
  /**
   * Predict NEET performance trajectory
   */
  static async predictPerformance(userId: string) {
    const data = await ClinicalMistakeAnalyzer.getDataForRankPrediction(userId)
    
    const riskScore = this.calculateRiskScore(data)
    const projectedScore = this.projectNEETScore(data)
    const warnings = this.generateEarlyWarnings(data)
    
    return {
      currentTrajectory: projectedScore > 600 ? 'excellent' : projectedScore > 500 ? 'good' : 'needs_improvement',
      projectedNEETScore: projectedScore,
      confidenceLevel: this.calculateConfidence(data),
      riskFactors: warnings,
      interventionNeeded: riskScore > 0.7,
      timeToImprove: this.calculateTimeToImprove(data),
      nextMilestone: this.getNextMilestone(projectedScore)
    }
  }

  private static calculateRiskScore(data: any): number {
    let risk = 0
    risk += data.mistakeAnalysis.criticalMistakes * 0.3
    risk += data.performanceMetrics.avgStress > 7 ? 0.2 : 0
    risk += data.performanceMetrics.avgEnergy < 4 ? 0.2 : 0
    risk += data.trendAnalysis.improvementTrend < -5 ? 0.3 : 0
    return Math.min(risk, 1.0)
  }

  private static projectNEETScore(data: any): number {
    const baseScore = data.performanceMetrics.avgTestScore || 400
    const trendAdjustment = (data.trendAnalysis.improvementTrend / 100) * baseScore
    const mistakePenalty = data.mistakeAnalysis.criticalMistakes * 15
    const stressPenalty = data.performanceMetrics.avgStress > 7 ? 30 : 0
    
    return Math.max(200, Math.min(720, baseScore + trendAdjustment - mistakePenalty - stressPenalty))
  }

  private static generateEarlyWarnings(data: any): string[] {
    const warnings: string[] = []
    
    if (data.trendAnalysis.improvementTrend < -10) {
      warnings.push('🚨 Performance declining rapidly - immediate intervention needed')
    }
    if (data.mistakeAnalysis.criticalMistakes > 2) {
      warnings.push('⚠️ Multiple critical mistake patterns detected')
    }
    if (data.performanceMetrics.avgStress > 8) {
      warnings.push('😰 Chronic high stress affecting performance')
    }
    if (data.performanceMetrics.totalTimeWasted > 1000) {
      warnings.push('⏰ Significant time wastage pattern detected')
    }
    
    return warnings
  }

  private static calculateConfidence(data: any): number {
    const dataPoints = data.performanceMetrics.avgTestScore > 0 ? 1 : 0
    const consistency = data.trendAnalysis.consistencyScore / 100
    const recency = Math.min(1, data.performanceMetrics.avgDailyQuestions / 200)
    
    return Math.round((dataPoints + consistency + recency) / 3 * 100)
  }

  private static calculateTimeToImprove(data: any): string {
    const currentScore = data.performanceMetrics.avgTestScore || 400
    const targetScore = 600
    const gap = targetScore - currentScore
    const improvementRate = Math.max(1, data.trendAnalysis.improvementTrend)
    
    const weeksNeeded = Math.ceil(gap / (improvementRate * 5))
    return weeksNeeded > 52 ? 'More than 1 year' : `${weeksNeeded} weeks`
  }

  private static getNextMilestone(projectedScore: number): string {
    if (projectedScore < 400) return 'Reach 400+ (Basic competency)'
    if (projectedScore < 500) return 'Reach 500+ (Decent performance)'
    if (projectedScore < 600) return 'Reach 600+ (Good rank potential)'
    if (projectedScore < 650) return 'Reach 650+ (Excellent rank)'
    return 'Maintain 650+ (Top rank guaranteed)'
  }
}

/**
 * Psychological & Emotional Support System
 */
export class WellnessSupportSystem {
  /**
   * Generate motivational and emotional support
   */
  static generateSupport(userId: string, currentMood: number, stressLevel: number, recentPerformance: any) {
    const support = {
      motivationalMessage: this.getMotivationalMessage(currentMood, recentPerformance),
      stressManagement: this.getStressManagement(stressLevel),
      confidenceBuilding: this.getConfidenceBuilding(recentPerformance),
      familyPressureHelp: this.getFamilyPressureHelp(stressLevel),
      dailyAffirmation: this.getDailyAffirmation(),
      emergencySupport: stressLevel > 8 ? this.getEmergencySupport() : null
    }
    
    return support
  }

  private static getMotivationalMessage(mood: number, performance: any): string {
    if (mood <= 3) {
      return "💪 Every successful medical professional began exactly where you are now. Take it one question at a time."
    } else if (mood <= 6) {
      return "🌟 You're making progress! Every mistake is teaching you something. Keep pushing forward - Medical Professional is waiting!"
    } else {
      return "🔥 Exceptional performance detected - maintain this trajectory! This positive energy will carry you to NEET success. Keep this momentum going!"
    }
  }

  private static getStressManagement(stressLevel: number): string[] {
    if (stressLevel > 8) {
      return [
        '🫁 IMMEDIATE: Activate 4-7-8 breathing protocol',
        '🚶 Initiate 10-minute ambulatory reset',
        '💧 Hydration protocol: 250ml water',
        '📞 Activate support network contact',
        '🛁 Take a warm shower to reset your nervous system'
      ]
    } else if (stressLevel > 6) {
      return [
        '🧘 5-minute meditation using Headspace app',
        '🎵 Listen to your favorite calming music',
        '📝 Write down 3 things you\'re grateful for',
        '🌱 Do some light stretching or yoga',
        '☕ Make yourself a warm, comforting drink'
      ]
    }
    
    return [
      '😊 You\'re managing stress well! Keep it up',
      '🎯 Channel this calm energy into focused study',
      '💪 Your stress management skills are improving'
    ]
  }

  private static getConfidenceBuilding(performance: any): string[] {
    return [
      `🏆 You've solved ${performance.totalQuestions || 0} questions - that's dedication!`,
      `📈 Your best test score is ${performance.bestScore || 0}/720 - you CAN do this!`,
      `💪 Every day you study, you're closer to becoming Medical Professional`,
      `🌟 You're in the top 10% of students who track their progress`,
      `🎯 Your systematic approach will pay off in NEET 2026`
    ]
  }

  private static getFamilyPressureHelp(stressLevel: number): string[] {
    if (stressLevel > 7) {
      return [
        '💬 "I need support, not pressure" - practice saying this to family',
        '📋 Show family your progress data - they\'ll see you\'re working hard',
        '🤝 Ask family to celebrate small wins with you',
        '⏰ Set boundaries: "Study time is sacred, please respect it"',
        '💕 Remember: They want your success, they just don\'t know how to help'
      ]
    }
    
    return [
      '👨‍👩‍👧 Your family believes in you - use their support positively',
      '📊 Share your achievements with them regularly',
      '🎯 Convert their expectations into motivation'
    ]
  }

  private static getDailyAffirmation(): string {
    const affirmations = [
      "I am becoming Medical Professional, one question at a time",
      "My mistakes are stepping stones to success",
      "I have the intelligence and determination to crack NEET",
      "Every day, I'm getting stronger and smarter",
      "I trust my preparation and my abilities",
      "I am worthy of my dreams and will achieve them",
      "My hard work today creates my success tomorrow"
    ]
    
    return affirmations[Math.floor(Math.random() * affirmations.length)]
  }

  private static getEmergencySupport(): any {
    return {
      immediate: [
        '🚨 STOP studying right now - you need a break',
        '🫁 Focus only on breathing for the next 5 minutes',
        '💧 Drink water and sit in a comfortable position',
        '📞 Consider calling a friend or family member'
      ],
      professional: [
        '🏥 If this feeling persists, consider talking to a counselor',
        '📱 Use mental health apps like Calm or Headspace',
        '👨‍⚕️ Remember: Taking care of mental health is part of becoming a doctor'
      ]
    }
  }
}

/**
 * Strategic Study Planning Engine
 */
export class StrategicStudyPlanner {
  /**
   * Generate adaptive study plan based on mistake patterns
   */
  static async generateAdaptivePlan(userId: string) {
    const data = await ClinicalMistakeAnalyzer.getDataForRankPrediction(userId)
    const mistakes = await ClinicalMistakeAnalyzer.getRecurringMistakes(userId)
    
    return {
      dailySchedule: this.createDailySchedule(data, mistakes),
      weeklyFocus: this.getWeeklyFocus(mistakes),
      topicPriority: this.prioritizeTopics(mistakes),
      examStrategy: this.getExamStrategy(data),
      adaptiveAdjustments: this.getAdaptiveAdjustments(data)
    }
  }

  private static createDailySchedule(data: any, mistakes: any[]): any {
    const peakHours = data.performanceMetrics.avgEnergy > 7 ? 'morning' : 'evening'
    const weakestSubject = this.getWeakestSubject(mistakes)
    
    return {
      peakHours: `${peakHours} (${peakHours === 'morning' ? '6-9 AM' : '7-10 PM'})`,
      schedule: {
        '6:00-7:00': peakHours === 'morning' ? `${weakestSubject} (hardest topics)` : 'Light revision',
        '7:00-8:00': peakHours === 'morning' ? 'Physics problem solving' : 'Biology memorization',
        '8:00-9:00': 'Breakfast + light reading',
        '9:00-12:00': 'Chemistry + Biology theory',
        '12:00-1:00': 'Lunch break',
        '1:00-4:00': 'Physics + Mathematics',
        '4:00-5:00': 'Break + physical activity',
        '5:00-7:00': 'Practice tests + weak areas',
        '7:00-8:00 PM': 'Dinner',
        '8:00-10:00': peakHours === 'evening' ? `${weakestSubject} (hardest topics)` : 'Light revision',
        '10:00-11:00': 'Mistake analysis + planning next day'
      }
    }
  }

  private static getWeeklyFocus(mistakes: any[]): any {
    const criticalMistakes = mistakes.filter(m => m.frequency >= 5)
    const urgentMistakes = mistakes.filter(m => m.frequency >= 3 && m.frequency < 5)
    
    return {
      Monday: 'Fresh start - tackle hardest concepts',
      Tuesday: criticalMistakes.length > 0 ? `Critical mistake focus: ${criticalMistakes[0]?.mistakeType}` : 'Physics intensive',
      Wednesday: 'Chemistry + Biology balance',
      Thursday: urgentMistakes.length > 0 ? `Urgent pattern: ${urgentMistakes[0]?.mistakeType}` : 'Problem solving',
      Friday: 'Full-length practice test',
      Saturday: 'Mistake analysis + weak area practice',
      Sunday: 'Light revision + planning next week'
    }
  }

  private static prioritizeTopics(mistakes: any[]): string[] {
    const priorities: string[] = []
    
    // Add critical mistake topics first
    mistakes.filter(m => m.frequency >= 5).forEach(m => {
      priorities.push(`🚨 CRITICAL: ${m.mistakeType} in ${m.subject}`)
    })
    
    // Add urgent topics
    mistakes.filter(m => m.frequency >= 3 && m.frequency < 5).forEach(m => {
      priorities.push(`⚠️ URGENT: ${m.mistakeType} in ${m.subject}`)
    })
    
    // Add general weak areas
    priorities.push('📚 Complete syllabus gaps')
    priorities.push('🔄 Regular revision cycles')
    priorities.push('📝 Practice test analysis')
    
    return priorities.slice(0, 8) // Top 8 priorities
  }

  private static getExamStrategy(data: any): any {
    const avgScore = data.performanceMetrics.avgTestScore || 400
    
    if (avgScore < 400) {
      return {
        approach: 'Foundation Building',
        strategy: [
          '🎯 Focus on easy and moderate questions only',
          '⏰ Spend 2 minutes max per question',
          '✅ Attempt 120-140 questions confidently',
          '🚫 Skip very difficult questions immediately',
          '📊 Target 60-65% accuracy'
        ]
      }
    } else if (avgScore < 600) {
      return {
        approach: 'Balanced Attack',
        strategy: [
          '🎯 Attempt easy + moderate + some difficult questions',
          '⏰ Time management: 90 seconds per question average',
          '✅ Target 150-160 questions',
          '🔄 Review flagged questions in last 15 minutes',
          '📊 Target 70-75% accuracy'
        ]
      }
    } else {
      return {
        approach: 'Aggressive Excellence',
        strategy: [
          '🎯 Attempt all questions you can solve',
          '⏰ Quick decision making: 60-90 seconds per question',
          '✅ Target 170+ questions',
          '🏆 Aim for 80%+ accuracy',
          '⚡ Trust your preparation and instincts'
        ]
      }
    }
  }

  private static getAdaptiveAdjustments(data: any): string[] {
    const adjustments: string[] = []
    
    if (data.performanceMetrics.avgStress > 7) {
      adjustments.push('🧘 Add 20 minutes daily meditation')
      adjustments.push('😴 Ensure 8 hours sleep - reduce study if needed')
    }
    
    if (data.performanceMetrics.avgEnergy < 5) {
      adjustments.push('🍎 Optimize nutrition - add protein-rich breakfast')
      adjustments.push('🏃 Add 30 minutes physical activity')
    }
    
    if (data.trendAnalysis.improvementTrend < 0) {
      adjustments.push('📚 Reduce new topics, focus on revision')
      adjustments.push('🎯 Increase practice test frequency')
    }
    
    return adjustments
  }

  private static getWeakestSubject(mistakes: any[]): string {
    const subjectCounts = mistakes.reduce((acc: Record<string, number>, mistake: any) => {
      acc[mistake.subject] = (acc[mistake.subject] || 0) + mistake.frequency
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(subjectCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Physics'
  }
}

/**
 * Real-time Coaching System
 */
export class AdaptiveCoachingSystem {
  /**
   * Provide live coaching during study sessions
   */
  static getLiveCoaching(currentActivity: string, timeSpent: number, mistakesMade: number, energyLevel: number) {
    return {
      encouragement: this.getEncouragement(timeSpent, mistakesMade),
      breakRecommendation: this.getBreakRecommendation(timeSpent, energyLevel),
      focusBooster: this.getFocusBooster(mistakesMade, energyLevel),
      nextAction: this.getNextAction(currentActivity, timeSpent),
      motivationalPush: this.getMotivationalPush(timeSpent)
    }
  }

  private static getEncouragement(timeSpent: number, mistakes: number): string {
    if (mistakes === 0 && timeSpent > 30) {
      return "🔥 Perfect streak! You're in the zone !"
    } else if (mistakes <= 2 && timeSpent > 60) {
      return "💪 Great focus! You're building strong foundations!"
    } else if (mistakes > 5) {
      return "🎯 Slow down a bit - accuracy over speed always wins!"
    }
    return "📚 Keep going, you're making progress!"
  }

  private static getBreakRecommendation(timeSpent: number, energy: number): string | null {
    if (timeSpent > 90 && energy < 5) {
      return "⏰ Time for a 10-minute break! Your brain needs to recharge."
    } else if (timeSpent > 120) {
      return "🚶 Take a 15-minute walk - you've earned it!"
    }
    return null
  }

  private static getFocusBooster(mistakes: number, energy: number): string[] {
    const boosters: string[] = []
    
    if (mistakes > 3) {
      boosters.push("🧘 Take 3 deep breaths before the next question")
      boosters.push("👀 Read the question twice before answering")
    }
    
    if (energy < 4) {
      boosters.push("💧 Drink some water")
      boosters.push("🌱 Do 5 quick stretches")
    }
    
    return boosters
  }

  private static getNextAction(activity: string, timeSpent: number): string {
    if (activity === 'theory' && timeSpent > 45) {
      return "🔄 Switch to practice questions to reinforce learning"
    } else if (activity === 'practice' && timeSpent > 60) {
      return "📖 Review theory for topics you're struggling with"
    } else if (timeSpent > 90) {
      return "📊 Take a quick self-assessment of what you've learned"
    }
    return "📚 Continue with current activity - you're doing great!"
  }

  private static getMotivationalPush(timeSpent: number): string {
    const pushes = [
      "🏆 Every minute of focused study builds clinical excellence.",
      "💪 Future patients will benefit from your dedication today.",
      "🌟 You're building the knowledge that will save lives!",
      "🎯 This effort today will pay off in NEET 2026!",
      "💫 Your preparation today shapes tomorrow's medical excellence."
    ]
    
    return pushes[Math.floor(Math.random() * pushes.length)]
  }
}

/**
 * Success Pattern Recognition Engine
 */
export class PerformancePatternAnalyzer {
  /**
   * Identify and replicate successful patterns
   */
  static async analyzeSuccessPatterns(userId: string) {
    const data = await ClinicalMistakeAnalyzer.getDataForRankPrediction(userId)
    
    return {
      optimalConditions: this.identifyOptimalConditions(data),
      successTriggers: this.findSuccessTriggers(data),
      peakPerformanceFactors: this.analyzePeakPerformance(data),
      replicationStrategy: this.createReplicationStrategy(data),
      successMetrics: this.defineSuccessMetrics(data)
    }
  }

  private static identifyOptimalConditions(data: any): any {
    return {
      bestTimeToStudy: data.performanceMetrics.avgEnergy > 7 ? 'Morning (6-9 AM)' : 'Evening (7-10 PM)',
      optimalStressLevel: '4-6 (Alert but not anxious)',
      idealEnergyLevel: '7-9 (High energy, focused)',
      perfectEnvironment: 'Quiet room, 68-72°F, good lighting',
      bestStudyDuration: '90-120 minutes with 15-minute breaks'
    }
  }

  private static findSuccessTriggers(data: any): string[] {
    return [
      '🌅 Starting study sessions with 5 minutes of planning',
      '🎯 Setting specific goals for each session',
      '📱 Keeping phone in another room',
      '💧 Having water and healthy snacks ready',
      '🎵 Playing focus music or white noise',
      '📝 Ending sessions with quick review notes'
    ]
  }

  private static analyzePeakPerformance(data: any): any {
    const bestScore = data.performanceMetrics.bestTestScore || 0
    
    return {
      whenYouPerformBest: [
        `🏆 Your best score was ${bestScore}/720`,
        '⏰ Peak performance usually in first 2 hours of study',
        '🧘 Low stress (4-6) + High energy (7-9) = Best results',
        '📚 Balanced study (not cramming) leads to better scores'
      ],
      factorsForSuccess: [
        'Consistent daily practice over intensive cramming',
        'Regular breaks prevent mental fatigue',
        'Mistake analysis immediately after practice',
        'Adequate sleep (7-8 hours) before important tests'
      ]
    }
  }

  private static createReplicationStrategy(data: any): string[] {
    return [
      '📅 Schedule study sessions during your peak energy hours',
      '🎯 Replicate the conditions of your best performance days',
      '📊 Track daily: energy, stress, focus, and performance',
      '🔄 Repeat successful study routines consistently',
      '💪 Build on your strengths while fixing weaknesses',
      '🏆 Celebrate small wins to maintain motivation'
    ]
  }

  private static defineSuccessMetrics(data: any): any {
    return {
      daily: {
        questionsAttempted: 'Target: 100-150 questions',
        accuracy: 'Target: 75%+ accuracy',
        timePerQuestion: 'Target: 90 seconds average',
        mistakeAnalysis: 'Complete within 30 minutes of study'
      },
      weekly: {
        practiceTests: 'Target: 2-3 full-length tests',
        weakAreaFocus: 'Target: 5 hours on identified weak areas',
        revisionCycles: 'Target: Complete 1 full syllabus review'
      },
      monthly: {
        scoreImprovement: 'Target: 20-30 point increase',
        mistakeReduction: 'Target: 50% reduction in repeated mistakes',
        consistencyScore: 'Target: 80%+ consistency in performance'
      }
    }
  }
}
/**
 * 1. Biological Rhythm Optimizer for the Aspirant
 */
export class BioRhythmPerformanceEngine {
  /**
   * Analyze bio-rhythm impact on performance
   */
  static analyzeBioRhythmImpact(userId: string, cycleDay: number, performance: any) {
    const phase = this.getCyclePhase(cycleDay)  // ✅ Use existing method
    const expectedImpact = this.getPhaseImpact(phase)  // ✅ Use existing method
    
    return {
      currentPhase: phase,
      expectedPerformance: expectedImpact.performance,
      energyPrediction: expectedImpact.energy,
      stressPrediction: expectedImpact.stress,
      studyRecommendations: this.getPhaseRecommendations(phase) ,
      nextPhaseAlert: this.getNextPhaseAlert(cycleDay),
      optimizationTips: this.getOptimizationTips(phase)
    }
  }

  private static getCyclePhase(day: number): string {
    if (day >= 1 && day <= 5) return 'menstrual' 
    if (day >= 6 && day <= 13) return 'follicular'
    if (day >= 14 && day <= 16) return 'ovulation'
    if (day >= 17 && day <= 28) return 'luteal'
    return 'unknown'
  }

  private static getPhaseImpact(phase: string) {
    const impacts = {
      menstrual: {
        performance: 'reduced',
        energy: 'low',
        stress: 'high',
        focus: 'poor',
        memory: 'reduced'
      },
      follicular: {
        performance: 'excellent',
        energy: 'high',
        stress: 'low',
        focus: 'sharp',
        memory: 'peak'
      },
      ovulation: {
        performance: 'good',
        energy: 'moderate',
        stress: 'moderate',
        focus: 'good',
        memory: 'good'
      },
      luteal: {
        performance: 'declining',
        energy: 'decreasing',
        stress: 'increasing',
        focus: 'variable',
        memory: 'declining'
      }
    }
    return impacts[phase as keyof typeof impacts] || impacts.follicular
  }

  private static getPhaseRecommendations(phase: string): string[] {
    const recommendations = {
      menstrual: [
        '🩸 Reduce study intensity by 30% - focus on light revision',
        '🛁 Take warm baths to reduce cramps and improve focus',
        '🍫 Allow healthy comfort foods - dark chocolate boosts mood',
        '😴 Sleep 8-9 hours - the body needs extra rest',
        '🚶 Light exercise only - gentle walks help with cramps'
      ],
      follicular: [
        '🚀 PEAK PERFORMANCE TIME - tackle hardest concepts now!',
        '📚 Learn new topics - your brain is most receptive',
        '🎯 Schedule important tests during this phase',
        '💪 Increase study intensity - you can handle more',
        '🧠 Focus on problem-solving and complex topics'
      ],
      ovulation: [
        '⚖️ Balanced approach - mix theory and practice',
        '🤝 Great time for group study and discussions',
        '📝 Good for practice tests and assessments',
        '🎨 Creative problem-solving works well now',
        '💭 Trust your intuition on difficult questions'
      ],
      luteal: [
        '📋 Focus on revision and consolidation',
        '🍎 Maintain stable blood sugar - eat regularly',
        '😌 Practice stress management techniques',
        '📊 Review and organize notes rather than learning new',
        '⏰ Shorter study sessions with more breaks'
      ]
    }
    return recommendations[phase as keyof typeof recommendations] || recommendations.follicular
  }

  private static getNextPhaseAlert(currentDay: number): string {
    if (currentDay >= 25) return '🩸 menstrual cycle phase starting in 3-4 days - prepare for lower energy'
    if (currentDay >= 3 && currentDay <= 5) return '🚀 Follicular phase starting soon - get ready for peak performance!'
    if (currentDay >= 12) return '⚖️ Ovulation phase approaching - good time for balanced study'
    if (currentDay >= 15) return '📋 Luteal phase starting - focus on revision and consolidation'
    return '📅 Track your cycle for better performance predictions'
  }

  private static getOptimizationTips(phase: string): string[] {
    const tips = {
      menstrual: [
        '🌡️ Keep room warmer - cold affects concentration during menstrual phase',
        '💊 Take iron supplements if approved by doctor',
        '🧘 Use period-tracking apps for better planning'
      ],
      follicular: [
        '📅 Schedule all important exams during this phase',
        '🎯 Set ambitious daily goals - you can achieve more',
        '🧠 Learn the most difficult concepts now'
      ],
      ovulation: [
        '🤝 Collaborate with study groups - social energy is high',
        '💡 Trust your first instincts on multiple choice questions',
        '🎨 Use creative study methods like mind maps'
      ],
      luteal: [
        '🍎 Eat protein-rich snacks to stabilize mood',
        '😴 Prioritize sleep - mood swings affect learning',
        '📝 Focus on organizing and reviewing rather than new learning'
      ]
    }
    return tips[phase as keyof typeof tips] || []
  }

  /**
   * Circadian rhythm optimization
   */
  static getCircadianOptimization(userId: string, sleepPattern: any, performanceData: any) {
    return {
      optimalStudyTimes: this.getOptimalStudyTimes(performanceData),
      sleepOptimization: this.getSleepOptimization(sleepPattern),
      energyPeakPrediction: this.predictEnergyPeaks(performanceData),
      lightExposureAdvice: this.getLightExposureAdvice(),
      mealTimingAdvice: this.getMealTimingAdvice()
    }
  }

  private static getOptimalStudyTimes(data: any): any {
    return {
      peakFocus: '6:00-9:00 AM (Cortisol peak - best for difficult concepts)',
      goodFocus: '10:00 AM-12:00 PM (Sustained attention)',
      moderateFocus: '2:00-4:00 PM (Post-lunch dip recovery)',
      lightStudy: '7:00-9:00 PM (Review and light practice)',
      avoidTimes: '12:00-2:00 PM (Natural energy dip), 10:00 PM+ (Melatonin rising)'
    }
  }

  private static getSleepOptimization(pattern: any): string[] {
    return [
      '😴 Sleep 10:30 PM - 6:30 AM for optimal NEET performance',
      '📱 No screens 1 hour before bed - blue light disrupts melatonin',
      '🌡️ Keep bedroom at 65-68°F for deep sleep',
      '☕ No caffeine after 2 PM - affects sleep quality',
      '📚 Review notes 10 minutes before sleep - improves retention by 60%'
    ]
  }

  private static predictEnergyPeaks(data: any): any {
    return {
      morningPeak: '7:00-9:00 AM (Natural cortisol surge)',
      afternoonPeak: '3:00-5:00 PM (Secondary energy wave)',
      eveningDecline: '8:00 PM onwards (Prepare for rest)',
      weeklyPattern: 'Monday-Wednesday (High), Thursday-Friday (Moderate), Weekend (Recovery)'
    }
  }

  private static getLightExposureAdvice(): string[] {
    return [
      '☀️ Get 15-30 minutes sunlight within 1 hour of waking',
      '💡 Use bright lights (10,000 lux) during morning study',
      '🌅 Study near windows during daytime when possible',
      '🌙 Dim lights 2 hours before bedtime',
      '🔆 Use blue light blocking glasses after sunset'
    ]
  }

  private static getMealTimingAdvice(): string[] {
    return [
      '🥣 Eat protein-rich breakfast within 1 hour of waking',
      '🍎 Small snack every 3-4 hours to maintain blood sugar',
      '🥗 Light lunch to avoid afternoon energy crash',
      '🚫 No heavy meals 3 hours before sleep',
      '💧 Drink water every 30 minutes during study'
    ]
  }
}

/**
 * 2. Competitive Intelligence Engine
 */
export class CompetitiveIntelligenceEngine {
  /**
   * Analyze competitive position
   */
  static analyzeCompetitivePosition(userId: string, currentScore: number, targetRank: number) {
    return {
      currentPercentile: this.calculatePercentile(currentScore),
      competitionAnalysis: this.getCompetitionAnalysis(currentScore),
      rankProbability: this.calculateRankProbability(currentScore, targetRank),
      gapAnalysis: this.getGapAnalysis(currentScore, targetRank),
      strategicAdvice: this.getStrategicAdvice(currentScore, targetRank),
      benchmarkComparison: this.getBenchmarkComparison(currentScore)
    }
  }

  private static calculatePercentile(score: number): number {
    // Based on NEET 2023 data approximation
    if (score >= 700) return 99.9
    if (score >= 650) return 99.5
    if (score >= 600) return 98.5
    if (score >= 550) return 95.0
    if (score >= 500) return 85.0
    if (score >= 450) return 70.0
    if (score >= 400) return 50.0
    if (score >= 350) return 30.0
    return 15.0
  }

  private static getCompetitionAnalysis(score: number): any {
    return {
      totalCandidates: '18+ lakh students appearing for NEET 2026',
      yourPosition: `Top ${this.calculatePercentile(score)}% (Approx rank: ${this.estimateRank(score)})`,
      medicalSeats: '1.08 lakh total seats (Government + Private)',
      competitionIntensity: score > 600 ? 'Extremely High' : score > 500 ? 'Very High' : 'High',
      improvementNeeded: this.getImprovementNeeded(score),
      timeRemaining: this.getTimeRemaining()
    }
  }

  private static estimateRank(score: number): string {
    const percentile = this.calculatePercentile(score)
    const totalCandidates = 1800000 // 18 lakh
    const estimatedRank = Math.round(totalCandidates * (100 - percentile) / 100)
    return estimatedRank.toLocaleString()
  }

  private static calculateRankProbability(currentScore: number, targetRank: number): any {
    const requiredScore = this.getScoreForRank(targetRank)
    const gap = requiredScore - currentScore
    
    return {
      requiredScore,
      currentGap: gap,
      probability: gap <= 0 ? 95 : gap <= 50 ? 80 : gap <= 100 ? 60 : gap <= 150 ? 40 : 20,
      timeNeeded: this.calculateTimeNeeded(gap),
      feasibility: gap <= 50 ? 'Highly Achievable' : gap <= 100 ? 'Achievable' : gap <= 150 ? 'Challenging' : 'Very Challenging'
    }
  }

  private static getScoreForRank(rank: number): number {
    // Approximate scores for different ranks based on historical data
    if (rank <= 1000) return 680
    if (rank <= 5000) return 650
    if (rank <= 10000) return 620
    if (rank <= 20000) return 590
    if (rank <= 50000) return 550
    if (rank <= 100000) return 500
    return 450
  }

  private static getGapAnalysis(currentScore: number, targetRank: number): any {
    const requiredScore = this.getScoreForRank(targetRank)
    const gap = requiredScore - currentScore
    
    return {
      scoreGap: gap,
      subjectWiseGap: {
        Physics: Math.ceil(gap * 0.33),
        Chemistry: Math.ceil(gap * 0.33),
        Biology: Math.ceil(gap * 0.34)
      },
      questionsToImprove: Math.ceil(gap / 4), // Assuming 4 marks per question
      dailyImprovementNeeded: Math.ceil(gap / 180), // 6 months = 180 days
      weeklyMilestones: this.getWeeklyMilestones(gap)
    }
  }

  private static getStrategicAdvice(currentScore: number, targetRank: number): string[] {
    const gap = this.getScoreForRank(targetRank) - currentScore
    
    if (gap <= 0) {
      return [
        '🏆 You\'re already at target level - maintain consistency',
        '🎯 Focus on avoiding silly mistakes',
        '📈 Aim for even higher ranks now',
        '🔄 Perfect your exam strategy'
      ]
    } else if (gap <= 50) {
      return [
        '🎯 Focus on eliminating silly mistakes - they\'re costing you ranks',
        '⏰ Improve time management - attempt more questions',
        '📚 Strengthen 2-3 weak topics per subject',
        '🔄 Take 3 full-length tests weekly'
      ]
    } else if (gap <= 100) {
      return [
        '📚 Intensive revision of NCERT - 70% questions come from here',
        '🎯 Focus on moderate difficulty questions first',
        '⚡ Speed up problem-solving in Physics and Chemistry',
        '🧠 Memorize Biology facts systematically'
      ]
    } else {
      return [
        '🏗️ Build strong foundation - focus on basics first',
        '📖 Complete NCERT thoroughly before advanced books',
        '🎯 Target 60-70% accuracy rather than attempting all questions',
        '👨🏫 Consider getting expert guidance for weak subjects'
      ]
    }
  }

  private static getBenchmarkComparison(score: number): any {
    return {
      topperBenchmark: {
        score: '720 (Perfect Score)',
        gap: 720 - score,
        message: 'Top 100 ranks typically score 700+'
      },
      governmentSeatBenchmark: {
        score: '600+ (General Category)',
        gap: Math.max(0, 600 - score),
        message: 'Government medical college cutoff'
      },
      privateSeatBenchmark: {
        score: '500+ (General Category)',
        gap: Math.max(0, 500 - score),
        message: 'Private medical college cutoff'
      },
      averageBenchmark: {
        score: '350 (NEET Average)',
        gap: score - 350,
        message: score > 350 ? 'Above average performance' : 'Below average - needs improvement'
      }
    }
  }

  private static getImprovementNeeded(score: number): string {
    if (score >= 650) return 'Fine-tuning required'
    if (score >= 600) return 'Minor improvements needed'
    if (score >= 550) return 'Moderate improvement required'
    if (score >= 500) return 'Significant improvement needed'
    return 'Major improvement required'
  }

  private static getTimeRemaining(): string {
    const neetDate = new Date('2026-05-03') // Approximate NEET 2026 date
    const today = new Date()
    const diffTime = neetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    return `${months} months, ${diffDays % 30} days remaining`
  }

  private static calculateTimeNeeded(gap: number): string {
    const weeksNeeded = Math.ceil(gap / 10) // Assuming 10 marks improvement per week
    return weeksNeeded > 24 ? 'More than 6 months' : `${weeksNeeded} weeks`
  }

  private static getWeeklyMilestones(gap: number): string[] {
    const weeklyImprovement = Math.ceil(gap / 24) // 6 months = 24 weeks
    return [
      `Week 1-4: Improve by ${weeklyImprovement * 4} marks`,
      `Week 5-8: Improve by ${weeklyImprovement * 4} marks`,
      `Week 9-12: Improve by ${weeklyImprovement * 4} marks`,
      `Week 13-16: Improve by ${weeklyImprovement * 4} marks`,
      `Week 17-20: Improve by ${weeklyImprovement * 4} marks`,
      `Week 21-24: Final ${gap - (weeklyImprovement * 20)} marks improvement`
    ]
  }
}

/**
 * 3. Adaptive Learning Algorithm
 */
export class AdaptiveLearningEngine {
  /**
   * Generate personalized questions based on performance
   */
  static generateAdaptiveQuestions(userId: string, subject: string, topic: string, difficulty: string, mistakePatterns: any[]) {
    return {
      questionSet: this.createQuestionSet(subject, topic, difficulty, mistakePatterns),
      difficultyAdjustment: this.calculateDifficultyAdjustment(mistakePatterns),
      learningPath: this.generateLearningPath(subject, mistakePatterns),
      memoryOptimization: this.getMemoryOptimization(topic, mistakePatterns),
      personalizedHints: this.generatePersonalizedHints(mistakePatterns)
    }
  }

  private static createQuestionSet(subject: string, topic: string, difficulty: string, patterns: any[]): any {
    const questionTypes = this.getQuestionTypes(subject, patterns)
    
    return {
      conceptualQuestions: this.generateConceptualQuestions(subject, topic, patterns),
      applicationQuestions: this.generateApplicationQuestions(subject, topic, patterns),
      numericalQuestions: subject === 'Physics' ? this.generateNumericalQuestions(topic, patterns) : [],
      memoryQuestions: subject === 'Biology' ? this.generateMemoryQuestions(topic, patterns) : [],
      adaptiveHints: this.generateAdaptiveHints(patterns),
      difficultyProgression: this.getDifficultyProgression(difficulty, patterns)
    }
  }

  private static getQuestionTypes(subject: string, patterns: any[]): string[] {
    const commonMistakes = patterns.map(p => p.mistakeType)
    
    if (commonMistakes.includes('conceptual_gaps')) {
      return ['basic_concepts', 'fundamental_principles', 'theory_application']
    } else if (commonMistakes.includes('calculation_errors')) {
      return ['step_by_step_numerical', 'formula_application', 'unit_conversion']
    } else if (commonMistakes.includes('memory_lapse')) {
      return ['fact_recall', 'definition_based', 'classification']
    }
    
    return ['mixed_difficulty', 'comprehensive_application']
  }

  private static generateConceptualQuestions(subject: string, topic: string, patterns: any[]): any[] {
    // This would integrate with a question bank API or database
    const questionTemplates = {
      Physics: [
        {
          type: 'concept_clarity',
          template: `Which principle explains ${topic}?`,
          focus: 'fundamental_understanding',
          adaptedFor: patterns.filter(p => p.mistakeType === 'conceptual_gaps')
        }
      ],
      Chemistry: [
        {
          type: 'mechanism_understanding',
          template: `Explain the mechanism of ${topic}`,
          focus: 'process_understanding',
          adaptedFor: patterns.filter(p => p.mistakeType === 'conceptual_gaps')
        }
      ],
      Biology: [
        {
          type: 'function_structure',
          template: `How does structure relate to function in ${topic}?`,
          focus: 'relationship_understanding',
          adaptedFor: patterns.filter(p => p.mistakeType === 'conceptual_gaps')
        }
      ]
    }
    
    return questionTemplates[subject as keyof typeof questionTemplates] || []
  }

  private static generateApplicationQuestions(subject: string, topic: string, patterns: any[]): any[] {
    return [
      {
        type: 'real_world_application',
        difficulty: 'moderate',
        focusArea: patterns.length > 0 ? patterns[0].mistakeType : 'general',
        adaptiveElements: this.getAdaptiveElements(patterns)
      }
    ]
  }

  private static generateNumericalQuestions(topic: string, patterns: any[]): any[] {
    const hasCalculationErrors = patterns.some(p => p.mistakeType === 'calculation_errors')
    
    return [
      {
        type: 'step_by_step_numerical',
        includeUnitConversion: true,
        showIntermediateSteps: hasCalculationErrors,
        focusOnAccuracy: hasCalculationErrors,
        timeLimit: hasCalculationErrors ? 'extended' : 'normal'
      }
    ]
  }

  private static generateMemoryQuestions(topic: string, patterns: any[]): any[] {
    const hasMemoryIssues = patterns.some(p => p.mistakeType === 'memory_lapse')
    
    return [
      {
        type: 'spaced_repetition',
        repetitionInterval: hasMemoryIssues ? 'frequent' : 'normal',
        mnemonicHints: hasMemoryIssues,
        visualAids: true,
        associationTechniques: hasMemoryIssues
      }
    ]
  }

  private static calculateDifficultyAdjustment(patterns: any[]): any {
    const criticalMistakes = patterns.filter(p => p.frequency >= 5).length
    const moderateMistakes = patterns.filter(p => p.frequency >= 3 && p.frequency < 5).length
    
    if (criticalMistakes > 0) {
      return {
        adjustment: 'decrease',
        level: 'basic',
        reason: 'Critical mistake patterns detected - focusing on fundamentals',
        duration: '2-3 weeks'
      }
    } else if (moderateMistakes > 2) {
      return {
        adjustment: 'maintain',
        level: 'current',
        reason: 'Consolidating current level before advancing',
        duration: '1-2 weeks'
      }
    } else {
      return {
        adjustment: 'increase',
        level: 'advanced',
        reason: 'Good performance - ready for challenging questions',
        duration: 'ongoing'
      }
    }
  }

  private static generateLearningPath(subject: string, patterns: any[]): any {
    const weakAreas = patterns.map(p => p.mistakeType)
    
    return {
      currentFocus: this.getCurrentFocus(weakAreas),
      nextSteps: this.getNextSteps(subject, weakAreas),
      milestones: this.getLearningMilestones(subject, patterns),
      estimatedCompletion: this.getEstimatedCompletion(patterns),
      adaptiveAdjustments: this.getAdaptiveAdjustments(patterns)
    }
  }

  private static getCurrentFocus(weakAreas: string[]): string {
    if (weakAreas.includes('conceptual_gaps')) return 'Building fundamental understanding'
    if (weakAreas.includes('calculation_errors')) return 'Improving computational accuracy'
    if (weakAreas.includes('memory_lapse')) return 'Strengthening factual recall'
    if (weakAreas.includes('overthinking')) return 'Developing quick decision-making'
    return 'Comprehensive skill development'
  }

  private static getNextSteps(subject: string, weakAreas: string[]): string[] {
    const steps: string[] = []
    
    if (weakAreas.includes('conceptual_gaps')) {
      steps.push(`Master ${subject} fundamentals through NCERT`)
      steps.push('Practice basic conceptual questions')
      steps.push('Create concept maps and flowcharts')
    }
    
    if (weakAreas.includes('calculation_errors')) {
      steps.push('Practice step-by-step problem solving')
      steps.push('Focus on unit conversions and significant figures')
      steps.push('Develop systematic calculation methods')
    }
    
    return steps.length > 0 ? steps : ['Continue comprehensive practice', 'Focus on speed and accuracy', 'Attempt advanced level questions']
  }

  private static getLearningMilestones(subject: string, patterns: any[]): any[] {
    return [
      {
        milestone: 'Foundation Complete',
        criteria: 'Zero conceptual gap mistakes for 1 week',
        timeframe: '2-4 weeks',
        currentProgress: this.calculateProgress(patterns, 'conceptual_gaps')
      },
      {
        milestone: 'Accuracy Achieved',
        criteria: 'Less than 2 silly mistakes per test',
        timeframe: '3-5 weeks',
        currentProgress: this.calculateProgress(patterns, 'silly_mistakes')
      },
      {
        milestone: 'Speed Optimized',
        criteria: 'Complete tests within time limit',
        timeframe: '4-6 weeks',
        currentProgress: this.calculateProgress(patterns, 'time_management')
      }
    ]
  }

  private static calculateProgress(patterns: any[], mistakeType: string): number {
    const pattern = patterns.find(p => p.mistakeType === mistakeType)
    if (!pattern) return 100 // No mistakes of this type
    
    // Progress inversely related to frequency
    return Math.max(0, 100 - (pattern.frequency * 10))
  }

  private static getEstimatedCompletion(patterns: any[]): string {
    const totalMistakes = patterns.reduce((sum: number, p: any) => sum + p.frequency, 0)
    
    if (totalMistakes <= 5) return '2-3 weeks'
    if (totalMistakes <= 15) return '1-2 months'
    if (totalMistakes <= 30) return '2-3 months'
    return '3-4 months'
  }

  private static getAdaptiveAdjustments(patterns: any[]): string[] {
    const adjustments: string[] = []
    
    patterns.forEach(pattern => {
      if (pattern.frequency >= 5) {
        adjustments.push(`Emergency focus on ${pattern.mistakeType} - daily dedicated practice`)
      } else if (pattern.frequency >= 3) {
        adjustments.push(`Increased attention to ${pattern.mistakeType} - 3x weekly practice`)
      }
    })
    
    return adjustments
  }

  private static getMemoryOptimization(topic: string, patterns: any[]): any {
    const hasMemoryIssues = patterns.some(p => p.mistakeType === 'memory_lapse')
    
    return {
      spacedRepetition: {
        enabled: hasMemoryIssues,
        intervals: hasMemoryIssues ? [1, 3, 7, 14, 30] : [7, 14, 30], // days
        priority: hasMemoryIssues ? 'high' : 'normal'
      },
      mnemonicTechniques: {
        acronyms: this.generateAcronyms(topic),
        visualAssociations: this.generateVisualAssociations(topic),
        storyMethod: this.generateStoryMethod(topic)
      },
      activeRecall: {
        flashcards: true,
        selfTesting: true,
        teachingSimulation: true
      }
    }
  }

  private static generatePersonalizedHints(patterns: any[]): string[] {
    const hints: string[] = []
    
    patterns.forEach(pattern => {
      switch (pattern.mistakeType) {
        case 'silly_mistakes':
          hints.push('🎯 Slow down and read each option carefully')
          hints.push('✅ Double-check units and signs in calculations')
          break
        case 'conceptual_gaps':
          hints.push('📚 Review the fundamental principle first')
          hints.push('🔗 Connect this concept to what you already know')
          break
        case 'overthinking':
          hints.push('⏰ Trust your first instinct - it\'s usually correct')
          hints.push('✂️ Eliminate obviously wrong options quickly')
          break
        case 'calculation_errors':
          hints.push('📝 Write down each step clearly')
          hints.push('🔢 Estimate the answer before calculating')
          break
      }
    })
    
    return hints
  }

  private static getAdaptiveElements(patterns: any[]): any {
    return {
      hintSystem: patterns.length > 0 ? 'enhanced' : 'standard',
      timeAllocation: patterns.some(p => p.mistakeType === 'overthinking') ? 'extended' : 'normal',
      feedbackDetail: patterns.length > 2 ? 'comprehensive' : 'standard',
      difficultyProgression: patterns.length > 0 ? 'gradual' : 'standard'
    }
  }

  private static getDifficultyProgression(currentDifficulty: string, patterns: any[]): any {
    const criticalIssues = patterns.filter(p => p.frequency >= 5).length
    
    return {
      current: currentDifficulty,
      next: criticalIssues > 0 ? 'maintain_basic' : 'gradual_increase',
      progression: criticalIssues > 0 ? 'focus_on_fundamentals' : 'standard_advancement',
      timeframe: criticalIssues > 0 ? 'extended' : 'normal'
    }
  }

  private static generateAdaptiveHints(patterns: any[]): string[] {
    return patterns.map(pattern => 
      `For ${pattern.mistakeType}: ${this.getSpecificHint(pattern.mistakeType)}`
    )
  }

  private static getSpecificHint(mistakeType: string): string {
    const hints = {
      silly_mistakes: 'Take 3 seconds to verify your answer before moving on',
      conceptual_gaps: 'Ask yourself: What is the underlying principle here?',
      overthinking: 'If you know it in 30 seconds, go with that answer',
      calculation_errors: 'Check if your answer makes physical sense',
      memory_lapse: 'Use the first letter of each word to create an acronym',
      time_management: 'Skip and return - don\'t get stuck on one question',
      panic_response: 'Take a deep breath and start with what you know',
      pattern_confusion: 'Look for the key distinguishing feature'
    }
    
    return hints[mistakeType as keyof typeof hints] || 'Focus on accuracy over speed'
  }

  private static generateAcronyms(topic: string): string[] {
    // This would be topic-specific
    return [`Remember ${topic} using: [Custom acronym based on topic]`]
  }

  private static generateVisualAssociations(topic: string): string[] {
    return [`Visualize ${topic} as: [Custom visual metaphor]`]
  }

  private static generateStoryMethod(topic: string): string {
    return `Create a story connecting the key points of ${topic}...`
  }
}

/**
 * 4. Medical College Pathway Planner
 */
export class MedicalCollegePathwayPlanner {
  /**
   * Recommend colleges based on projected performance
   */
  static recommendColleges(userId: string, projectedScore: number, category: string, statePreference: string) {
    return {
      dreamColleges: this.getDreamColleges(projectedScore, category),
      realisticOptions: this.getRealisticOptions(projectedScore, category, statePreference),
      safetyOptions: this.getSafetyOptions(projectedScore, category, statePreference),
      alternativePathways: this.getAlternativePathways(projectedScore),
      financialPlanning: this.getFinancialPlanning(projectedScore, category),
      improvementTargets: this.getImprovementTargets(projectedScore)
    }
  }

  private static getDreamColleges(score: number, category: string): any[] {
    const dreamColleges = [
      { name: 'AIIMS Delhi', cutoff: 720, fees: 'Minimal', location: 'Delhi' },
      { name: 'AIIMS Mumbai', cutoff: 715, fees: 'Minimal', location: 'Mumbai' },
      { name: 'JIPMER Puducherry', cutoff: 710, fees: 'Minimal', location: 'Puducherry' },
      { name: 'MAMC Delhi', cutoff: 705, fees: 'Minimal', location: 'Delhi' },
      { name: 'Grant Medical College', cutoff: 700, fees: 'Minimal', location: 'Mumbai' }
    ]
    
    return dreamColleges.filter(college => score >= college.cutoff - 20).map(college => ({
      ...college,
      probability: score >= college.cutoff ? 95 : score >= college.cutoff - 10 ? 70 : 40,
      gapToFill: Math.max(0, college.cutoff - score),
      recommendation: score >= college.cutoff ? 'Highly likely' : 'Stretch goal - achievable with improvement'
    }))
  }

  private static getRealisticOptions(score: number, category: string, state: string): any[] {
    const realisticRange = [score - 30, score + 10]
    
    const colleges = [
      { name: 'State Medical College', cutoff: 580, fees: '50,000/year', location: state },
      { name: 'Regional Medical College', cutoff: 560, fees: '75,000/year', location: state },
      { name: 'District Medical College', cutoff: 540, fees: '60,000/year', location: state },
      { name: 'Private Medical College (Good)', cutoff: 520, fees: '15,00,000/year', location: state },
      { name: 'Deemed University', cutoff: 500, fees: '20,00,000/year', location: 'Various' }
    ]
    
    return colleges.filter(college => 
      college.cutoff >= realisticRange[0] && college.cutoff <= realisticRange[1]
    ).map(college => ({
      ...college,
      probability: 85,
      recommendation: 'Good fit for your current performance'
    }))
  }

  private static getSafetyOptions(score: number, category: string, state: string): any[] {
    const safetyRange = [score - 50, score - 10]
    
    const colleges = [
      { name: 'Private Medical College (Average)', cutoff: 480, fees: '12,00,000/year', location: state },
      { name: 'Rural Medical College', cutoff: 460, fees: '8,00,000/year', location: state },
      { name: 'New Medical College', cutoff: 440, fees: '10,00,000/year', location: state },
      { name: 'Management Quota (Private)', cutoff: 400, fees: '25,00,000/year', location: 'Various' }
    ]
    
    return colleges.filter(college => 
      college.cutoff >= safetyRange[0] && college.cutoff <= safetyRange[1]
    ).map(college => ({
      ...college,
      probability: 95,
      recommendation: 'Safe backup option'
    }))
  }

  private static getAlternativePathways(score: number): any[] {
    const alternatives: any[] = []
    
    if (score < 500) {
      alternatives.push({
        pathway: 'BDS (Dental)',
        cutoff: score - 50,
        duration: '5 years',
        prospects: 'Good career prospects in dental care',
        recommendation: 'Excellent alternative to MBBS'
      })
      
      alternatives.push({
        pathway: 'BAMS (Ayurveda)',
        cutoff: score - 80,
        duration: '5.5 years',
        prospects: 'Growing field with government support',
        recommendation: 'Traditional medicine with modern applications'
      })
      
      alternatives.push({
        pathway: 'BHMS (Homeopathy)',
        cutoff: score - 100,
        duration: '5.5 years',
        prospects: 'Alternative medicine practice',
        recommendation: 'Lower competition, decent prospects'
      })
      
      alternatives.push({
        pathway: 'B.Sc Nursing',
        cutoff: score - 120,
        duration: '4 years',
        prospects: 'High demand globally',
        recommendation: 'Excellent job security and growth'
      })
    }
    
    return alternatives
  }

  private static getFinancialPlanning(score: number, category: string): any {
    return {
      governmentCollegeCost: {
        totalFees: '2,50,000 (5 years)',
        hostelFees: '1,50,000 (5 years)',
        miscellaneous: '1,00,000',
        totalCost: '5,00,000',
        loanOptions: 'Education loan up to 10 lakhs without collateral'
      },
      privateCollegeCost: {
        totalFees: score > 550 ? '50,00,000' : '75,00,000',
        hostelFees: '5,00,000 (5 years)',
        miscellaneous: '2,00,000',
        totalCost: score > 550 ? '57,00,000' : '82,00,000',
        loanOptions: 'Education loan with collateral required'
      },
      scholarships: this.getScholarshipOptions(score, category),
      costOptimization: this.getCostOptimizationTips(score)
    }
  }

  private static getScholarshipOptions(score: number, category: string): string[] {
    const scholarships: string[] = []
    
    if (score > 600) {
      scholarships.push('Merit-based scholarships (50,000-2,00,000/year)')
      scholarships.push('State government merit scholarships')
    }
    
    if (category !== 'General') {
      scholarships.push('Category-based scholarships and fee waivers')
      scholarships.push('Post-matric scholarships')
    }
    
    scholarships.push('Need-based scholarships for economically weaker sections')
    scholarships.push('Private foundation scholarships')
    
    return scholarships
  }

  private static getCostOptimizationTips(score: number): string[] {
    return [
      '🎯 Target government colleges - 90% cost reduction',
      '🏠 Choose colleges in your home state - lower fees and living costs',
      '📚 Apply for maximum scholarships - can cover 50-100% fees',
      '💰 Consider education loans - tax benefits available',
      '🏥 Look for colleges with good hospital attachments - better practical training',
      '📍 Rural postings after MBBS can help with loan repayment'
    ]
  }

  private static getImprovementTargets(score: number): any {
    const targets: any[] = []
    
    if (score < 500) {
      targets.push({
        target: 'Reach 500+',
        benefit: 'Access to private medical colleges',
        timeNeeded: '3-4 months intensive preparation',
        strategy: 'Focus on NCERT and basic concepts'
      })
    }
    
    if (score < 550) {
      targets.push({
        target: 'Reach 550+',
        benefit: 'State quota government colleges possible',
        timeNeeded: '2-3 months focused preparation',
        strategy: 'Strengthen weak subjects, improve accuracy'
      })
    }
    
    if (score < 600) {
      targets.push({
        target: 'Reach 600+',
        benefit: 'Good government medical colleges',
        timeNeeded: '1-2 months intensive preparation',
        strategy: 'Perfect exam strategy, eliminate silly mistakes'
      })
    }
    
    targets.push({
      target: 'Reach 650+',
      benefit: 'Top government medical colleges',
      timeNeeded: 'Consistent high performance',
      strategy: 'Advanced problem solving, speed optimization'
    })
    
    return targets
  }

  /**
   * Get cutoff trends and predictions
   */
  static getCutoffAnalysis(collegeName: string, category: string) {
    return {
      historicalTrends: this.getHistoricalTrends(collegeName),
      predictionFor2026: this.predict2026Cutoff(collegeName, category),
      factorsAffectingCutoff: this.getCutoffFactors(),
      preparationStrategy: this.getPreparationStrategy(collegeName)
    }
  }

  private static getHistoricalTrends(college: string): any {
    // This would fetch real data from database
    return {
      2023: 650,
      2022: 645,
      2021: 640,
      2020: 635,
      trend: 'Increasing by 2-5 marks annually',
      volatility: 'Low - consistent upward trend'
    }
  }

  private static predict2026Cutoff(college: string, category: string): any {
    return {
      predictedCutoff: 655,
      confidenceLevel: 85,
      range: '650-660',
      factors: [
        'Increasing competition',
        'More medical seats added',
        'Improved coaching quality',
        'Better student preparation'
      ]
    }
  }

  private static getCutoffFactors(): string[] {
    return [
      '📈 Number of applicants (Higher applicants = Higher cutoff)',
      '🏥 Number of seats available (More seats = Lower cutoff)',
      '📚 Difficulty of NEET paper (Harder paper = Lower cutoff)',
      '🎯 Performance of top students (Better performance = Higher cutoff)',
      '📍 State quota vs All India quota',
      '🏷️ Category reservations and their utilization'
    ]
  }

  private static getPreparationStrategy(college: string): string[] {
    return [
      '🎯 Target 20-30 marks above predicted cutoff for safety',
      '📚 Focus on consistency rather than peak performance',
      '🔄 Take regular mock tests to gauge preparation level',
      '📊 Track your percentile improvement monthly',
      '⚡ Develop speed and accuracy simultaneously',
      '🧘 Maintain mental health and stress levels'
    ]
  }
}