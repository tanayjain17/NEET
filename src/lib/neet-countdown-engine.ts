/**
 * NEET 2026 Countdown & Strategic Planning Engine
 * Optimizes preparation timeline for May 5, 2026
 */

export interface PhaseMilestone {
  name: string
  target: string
  deadline: Date
  priority: 'standard' | 'high' | 'critical'
}

export interface PreparationPhase {
  name: string
  focus: string
  dailyTarget: string
  testFrequency: string
  scoreTarget: string
  keyActivities: string[]
}

export interface UrgencyAssessment {
  level: 'critical' | 'high' | 'moderate' | 'low'
  color: 'red' | 'orange' | 'yellow' | 'green'
  briefing: string
}

export interface BioRhythmPrediction {
  cycleDay: number
  phase: string
  energyProjection: number
  focusProjection: number
  clinicalRecommendations: string[]
  optimizationProtocol: BioRhythmProtocol
}

export interface BioRhythmProtocol {
  nutrition: string[]
  supplementation: string[]
  recommendedActivities: string[]
  studyOptimization: string[]
}

export class NEETStrategicEngine {
  private static readonly NEET_2026_DATE = new Date('2026-05-05T14:00:00') // May 5, 2026, 2 PM
  
  /**
   * Get comprehensive countdown analytics
   */
  static getStrategicAnalytics() {
    const now = new Date()
    const timeRemaining = this.NEET_2026_DATE.getTime() - now.getTime()
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    
    return {
      totalDays: days,
      totalWeeks: weeks,
      totalMonths: months,
      temporalBreakdown: { days, hours, minutes },
      strategicMilestones: this.calculateStrategicMilestones(days),
      urgencyAssessment: this.assessUrgency(days),
      currentPhase: this.determineCurrentPhase(days)
    }
  }

  /**
   * Calculate strategic milestones based on time remaining
   */
  private static calculateStrategicMilestones(daysRemaining: number): PhaseMilestone[] {
    const milestones: PhaseMilestone[] = []
    
    if (daysRemaining > 180) {
      milestones.push({
        name: 'Foundation Consolidation',
        target: 'Complete syllabus coverage + 600+ consistent scores',
        deadline: this.addDays(new Date(), daysRemaining - 180),
        priority: 'high'
      })
    }
    
    if (daysRemaining > 90) {
      milestones.push({
        name: 'Advanced Clinical Reasoning',
        target: '650+ scores + systematic error elimination',
        deadline: this.addDays(new Date(), daysRemaining - 90),
        priority: 'critical'
      })
    }
    
    if (daysRemaining > 30) {
      milestones.push({
        name: 'Peak Performance Protocol',
        target: '680+ scores + bio-rhythm optimization',
        deadline: this.addDays(new Date(), daysRemaining - 30),
        priority: 'critical'
      })
    }
    
    if (daysRemaining > 7) {
      milestones.push({
        name: 'Final Preparation Phase',
        target: '700+ scores + cognitive load management',
        deadline: this.addDays(new Date(), daysRemaining - 7),
        priority: 'critical'
      })
    }
    
    return milestones
  }

  /**
   * Determine current preparation phase
   */
  private static determineCurrentPhase(daysRemaining: number): PreparationPhase {
    if (daysRemaining > 180) {
      return {
        name: 'Foundation Building',
        focus: 'Comprehensive syllabus coverage + fundamental problem-solving',
        dailyTarget: '800-1000 questions',
        testFrequency: '2-3 assessments per week',
        scoreTarget: '550-600',
        keyActivities: [
          'Complete core curriculum lectures',
          'Systematic practice with diagnostic assessments',
          'Establish foundational knowledge architecture',
          'Develop consistent study protocols'
        ]
      }
    } else if (daysRemaining > 90) {
      return {
        name: 'Skill Enhancement',
        focus: 'Advanced problem-solving + velocity optimization',
        dailyTarget: '1000-1200 questions',
        testFrequency: '4-5 assessments per week',
        scoreTarget: '600-650',
        keyActivities: [
          'Targeted deficit elimination',
          'Speed and accuracy calibration',
          'Advanced clinical reasoning development',
          'Comprehensive performance analysis'
        ]
      }
    } else if (daysRemaining > 30) {
      return {
        name: 'Peak Performance',
        focus: 'Consistency protocols + bio-rhythm synchronization',
        dailyTarget: '1200+ questions',
        testFrequency: 'Daily full-length assessments',
        scoreTarget: '650-700',
        keyActivities: [
          'Afternoon practice synchronization (2-5 PM)',
          'Systematic error pattern elimination',
          'Bio-rhythm optimization protocols',
          'Cognitive load management'
        ]
      }
    } else if (daysRemaining > 7) {
      return {
        name: 'Final Preparation',
        focus: 'Knowledge consolidation + confidence calibration',
        dailyTarget: '800-1000 questions (quality prioritized over quantity)',
        testFrequency: 'Daily full-length assessments',
        scoreTarget: '700+',
        keyActivities: [
          'Strategic review of mastered topics',
          'Confidence reinforcement protocols',
          'Examination day simulation',
          'Support system optimization'
        ]
      }
    } else {
      return {
        name: 'Examination Week',
        focus: 'Cognitive recovery + light revision + mental preparation',
        dailyTarget: '200-400 questions (foundational concepts)',
        testFrequency: 'One assessment every 48 hours',
        scoreTarget: 'Maintain current proficiency',
        keyActivities: [
          'Light conceptual review only',
          'Stress regulation protocols',
          'Sleep architecture optimization',
          'Positive visualization techniques'
        ]
      }
    }
  }

  /**
   * Assess urgency level based on time remaining
   */
  private static assessUrgency(daysRemaining: number): UrgencyAssessment {
    if (daysRemaining < 30) {
      return { 
        level: 'critical', 
        color: 'red', 
        briefing: 'CRITICAL PHASE: Peak performance protocols required. Execute daily optimization.'
      }
    }
    if (daysRemaining < 90) {
      return { 
        level: 'high', 
        color: 'orange', 
        briefing: 'HIGH INTENSITY PHASE: Advanced skill development. Maintain velocity.'
      }
    }
    if (daysRemaining < 180) {
      return { 
        level: 'moderate', 
        color: 'yellow', 
        briefing: 'SKILL BUILDING PHASE: Systematic enhancement. Progress monitoring active.'
      }
    }
    return { 
      level: 'low', 
      color: 'green', 
      briefing: 'FOUNDATION PHASE: Structural knowledge building. Consistent execution advised.'
    }
  }

  /**
   * Predict bio-rhythm alignment for examination date
   */
  static predictBioRhythmAlignment(lastCycleStart: Date, cycleLength: number = 28): BioRhythmPrediction {
    const examDate = this.NEET_2026_DATE
    const daysSinceLastStart = Math.floor((examDate.getTime() - lastCycleStart.getTime()) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceLastStart % cycleLength) + 1
    
    let phase = ''
    let energyProjection = 5
    let focusProjection = 5
    let clinicalRecommendations: string[] = []
    let optimizationProtocol: BioRhythmProtocol
    
    if (cycleDay >= 1 && cycleDay <= 5) {
      phase = 'Menstrual'
      energyProjection = 3
      focusProjection = 4
      clinicalRecommendations = [
        'Examination coincides with menstrual phase. Implement comfort protocols.',
        'Practice with symptom management during assessments.',
        'Prepare necessary supplies in advance.',
        'Consider consulting healthcare provider for cycle management strategies.'
      ]
      optimizationProtocol = {
        nutrition: ['Iron-rich foods', 'Warm herbal infusions', 'Dark chocolate (limited)'],
        supplementation: ['Iron', 'Magnesium', 'Vitamin B6'],
        recommendedActivities: ['Gentle stretching', 'Restorative yoga', 'Warm hydrotherapy'],
        studyOptimization: ['Shorter focused sessions', 'Revision-focused practice', 'Comfort optimization']
      }
    } else if (cycleDay >= 6 && cycleDay <= 13) {
      phase = 'Follicular'
      energyProjection = 8
      focusProjection = 8
      clinicalRecommendations = [
        'Optimal examination timing detected. Peak cognitive performance expected.',
        'Current phase aligns with NEET schedule - maintain protocols.',
        'Leverage enhanced neural plasticity for complex problem-solving.',
        'Confidence calibration recommended.'
      ]
      optimizationProtocol = {
        nutrition: ['Protein-dense meals', 'Complex carbohydrates', 'Fresh produce'],
        supplementation: ['B-complex', 'Vitamin D', 'Omega-3 fatty acids'],
        recommendedActivities: ['Regular aerobic exercise', 'Intensive study sessions', 'Complex problem engagement'],
        studyOptimization: ['Tackle challenging topics', 'Extended study blocks', 'New concept acquisition']
      }
    } else if (cycleDay >= 14 && cycleDay <= 16) {
      phase = 'Ovulation'
      energyProjection = 7
      focusProjection = 6
      clinicalRecommendations = [
        'Good examination timing. Energy high with potential emotional fluctuations.',
        'Implement stress regulation techniques during preparation.',
        'Monitor affect stability during assessments.',
        'Prepare emotional regulation strategies.'
      ]
      optimizationProtocol = {
        nutrition: ['Balanced macronutrients', 'Antioxidant-rich foods', 'Optimal hydration'],
        supplementation: ['Vitamin E', 'Zinc', 'Probiotics'],
        recommendedActivities: ['Moderate physical activity', 'Collaborative study sessions', 'Peer discussion'],
        studyOptimization: ['Practice assessments', 'Group problem-solving', 'Confidence reinforcement']
      }
    } else {
      phase = 'Luteal'
      energyProjection = 4
      focusProjection = 5
      clinicalRecommendations = [
        'Moderate timing. Energy and focus may be reduced.',
        'Practice during this phase to build examination-day resilience.',
        'Optimize nutrition and sleep protocols.',
        'Consider natural cognitive support strategies.'
      ]
      optimizationProtocol = {
        nutrition: ['Complex carbohydrates', 'Calcium-rich foods', 'Reduced caffeine intake'],
        supplementation: ['Calcium', 'Magnesium', 'Evening primrose oil'],
        recommendedActivities: ['Low-impact exercise', 'Mindfulness practice', 'Relaxation techniques'],
        studyOptimization: ['Review-focused sessions', 'Avoid new complex topics', 'Stress management']
      }
    }
    
    return {
      cycleDay,
      phase,
      energyProjection,
      focusProjection,
      clinicalRecommendations,
      optimizationProtocol
    }
  }

  /**
   * Get daily strategic briefing
   */
  static getDailyStrategicBriefing(daysRemaining: number): string {
    const briefings = [
      `${daysRemaining} days remaining. Each question solved compounds clinical competence.`,
      `${daysRemaining} days of focused preparation correlate with significant percentile improvement.`,
      `${daysRemaining} days to optimize cognitive architecture for target institution admission.`,
      `${daysRemaining} days of consistent execution yields optimal performance metrics.`,
      `${daysRemaining} days remaining. Maintain protocol adherence for trajectory optimization.`
    ]
    
    return briefings[Math.floor(Math.random() * briefings.length)]
  }

  /**
   * Utility function: Add days to date
   */
  private static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}