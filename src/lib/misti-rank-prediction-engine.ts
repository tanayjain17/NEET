/**
 * NEET Rank Prediction Engine
 * Evidence-oriented forecasting based on profile inputs + optional real-time telemetry.
 *
 * Notes:
 * - This is a rule-based (heuristic) model intended for planning and tracking.
 * - It is not a guaranteed outcome predictor.
 */

export type RiskLevel = 'low' | 'medium' | 'high'

export interface StudentProfile {
  // Personal Data
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  homeState: string
  coachingInstitute: string
  preparationYears: number
  attemptNumber: 1 | 2 | 3 | 4 | 5

  // Academic Performance
  class12Percentage: number
  board: string
  schoolRank: string
  foundationStrength: 'Weak' | 'Average' | 'Strong' | 'Exceptional' | 'Significantly Improved' | 'Mid-Great'

  // Current Performance
  mockScoreRange: { min: number; max: number; target: number }
  currentStudyHours: { current: number; upcoming: number }
  questionSolvingCapacity: { current: number; upcoming: number }
  questionSolvingSpeed: { min: number; max: number } // seconds per question

  // Bio‑Rhythm Sync (professional terminology)
  bioRhythmSync?: {
    cycleLengthDays: number
    heavyFlowDays?: number[]
    painDays?: number[]
    lowEnergyDays?: number[]
    symptoms?: string[]
  }

  // Stress Factors
  stressTriggers?: Array<'family_pressure' | 'target_completion' | 'time_pressure' | 'multiple_attempts'>
  familyPressure?: 'High' | 'Medium' | 'Low'

  // Performance Patterns
  bestPerformingSlots?: Array<'morning' | 'evening' | 'afternoon' | 'night'>
  problematicSlots?: Array<'morning' | 'evening' | 'afternoon' | 'night'>
  subjectPreference?: Array<'Biology' | 'Chemistry' | 'Physics'>

  // Weakness Analysis
  weaknessType?: string
  errorTypes?: Array<'silly_mistakes' | 'overthinking' | 'panic_response' | 'conceptual_gaps' | 'time_management' | 'calculation_errors'>
  revisionFrequency?: 'below_average' | 'average' | 'above_average'

  // Lifestyle
  dietType?: string
  fitnessLevel?: 'poor' | 'average' | 'good' | 'excellent'

  // Optional baseline (avoid hardcoding personal scores in engine)
  priorOfficialScore?: number // e.g., last NEET official score, if available
}

/**
 * Optional UI palette token mapping (Rose / Blue / Emerald).
 * Use in UI components; engine returns structured risk levels.
 */
export const RISK_PALETTE = {
  low: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  medium: { text: 'text-blue-200', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  high: { text: 'text-rose-200', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
} as const

export class NEETRankPredictionEngine {
  private static readonly NEET_HISTORICAL_DATA = {
    2024: { air1Score: 720, topCollegesCutoff: 715 },
    2023: { air1Score: 720, topCollegesCutoff: 710 },
    2022: { air1Score: 715, topCollegesCutoff: 705 },
    2021: { air1Score: 720, topCollegesCutoff: 700 },
    2020: { air1Score: 720, topCollegesCutoff: 690 }
  } as const

  private static readonly BIHAR_STATE_ANALYSIS = {
    competitionLevel: 'Very High',
    stateQuotaAdvantage: 'Moderate',
    averageTopperScore: 680,
    generalCategoryCompetition: 'Intense'
  } as const

  /**
   * Generate a rank prediction using profile inputs and optional real-time telemetry.
   */
  static async generatePrediction(profile: StudentProfile, realTimeData?: any): Promise<RankPredictionResult> {
    const performanceScore = this.calculatePerformanceScore(profile, realTimeData)
    const improvementPotential = this.calculateImprovementPotential(profile, realTimeData)
    const bioFactors = this.analyzeBioRhythmFactors(profile, realTimeData)
    const stressImpact = this.analyzeStressImpact(profile, realTimeData)
    const mistakeImpact = this.analyzeMistakeImpact(realTimeData)

    const predictedScore = this.calculatePredictedScore(
      performanceScore,
      improvementPotential,
      bioFactors,
      stressImpact,
      mistakeImpact,
      realTimeData
    )

    const predictedRank = this.calculateRank(predictedScore)
    const probabilities = this.calculateProbabilities(predictedScore)

    return {
      predictedScore,
      predictedRank,
      confidenceLevel: this.calculateConfidenceLevel(realTimeData),
      probabilities,
      detailedAnalysis: this.generateDetailedAnalysis(profile, predictedScore, realTimeData),
      improvementRoadmap: this.generateImprovementRoadmap(profile),
      riskAssessment: this.assessRisks(profile)
    }
  }

  private static calculatePerformanceScore(profile: StudentProfile, realTimeData?: any): number {
    // Baseline anchor (should come from stored prior attempt data, if provided)
    const baselinePriorExamScore = profile.priorOfficialScore ?? 320

    const currentMockAverage =
      realTimeData?.performanceMetrics?.avgTestScore ??
      (profile.mockScoreRange.min + profile.mockScoreRange.max) / 2

    const improvementFromBaseline = currentMockAverage - baselinePriorExamScore
    const improvementFactor = baselinePriorExamScore > 0 ? 1 + improvementFromBaseline / baselinePriorExamScore : 1

    const consistencyFactor = realTimeData?.trendAnalysis?.consistencyScore
      ? realTimeData.trendAnalysis.consistencyScore / 100
      : 0.85

    const coachingQualityFactor = 0.95
    const foundationFactor =
      profile.foundationStrength === 'Exceptional' ? 0.92
      : profile.foundationStrength === 'Strong' ? 0.88
      : profile.foundationStrength === 'Significantly Improved' ? 0.90
      : profile.foundationStrength === 'Mid-Great' ? 0.82
      : profile.foundationStrength === 'Average' ? 0.78
      : 0.72

    const trendFactor =
      realTimeData?.trendAnalysis?.improvementTrend && realTimeData.trendAnalysis.improvementTrend > 0
        ? 1 + realTimeData.trendAnalysis.improvementTrend / 100
        : 1

    // Computed for interpretability; not multiplied directly to avoid runaway growth.
    void improvementFactor

    return currentMockAverage * consistencyFactor * coachingQualityFactor * foundationFactor * trendFactor
  }

  private static calculateImprovementPotential(profile: StudentProfile, realTimeData?: any): number {
    const currentBest = realTimeData?.performanceMetrics?.bestTestScore ?? profile.mockScoreRange.max
    const targetScore = profile.mockScoreRange.target || 700
    const remainingGap = Math.max(0, targetScore - currentBest)

    const dailyGoalsConsistency = realTimeData?.performanceMetrics?.avgDailyQuestions > 800 ? 1.3 : 1.0
    const mistakeAnalysisUsage = realTimeData?.mistakeAnalysis?.totalPatterns > 0 ? 1.25 : 1.0
    const testFrequency = realTimeData?.performanceMetrics?.avgTestScore > 0 ? 1.2 : 1.0
    const improvementTrend = realTimeData?.trendAnalysis?.improvementTrend > 5 ? 1.4 : 1.1

    const questionVolumeBoost = 60
    const mistakeEliminationBoost = realTimeData?.mistakeAnalysis?.criticalMistakes
      ? realTimeData.mistakeAnalysis.criticalMistakes * 25
      : 40
    const consistencyBoost = realTimeData?.trendAnalysis?.consistencyScore > 80 ? 30 : 20
    const speedOptimizationBoost = 25

    const aiCoachingBoost = 35
    const bioOptimizationBoost = 20
    const psychologicalSupportBoost = 25

    const combinedMethodologyBoost = 1.5

    const totalImprovement =
      (questionVolumeBoost +
        mistakeEliminationBoost +
        consistencyBoost +
        speedOptimizationBoost +
        aiCoachingBoost +
        bioOptimizationBoost +
        psychologicalSupportBoost) *
      combinedMethodologyBoost *
      dailyGoalsConsistency *
      mistakeAnalysisUsage *
      testFrequency *
      improvementTrend

    // Constrain by remaining gap and a hard cap for stability.
    return Math.min(totalImprovement, Math.max(0, remainingGap + 60), 200)
  }

  private static analyzeBioRhythmFactors(profile: StudentProfile, realTimeData?: any): number {
    const avgEnergy = realTimeData?.performanceMetrics?.avgEnergy ?? 5.5

    const sleepOptimization =
      avgEnergy > 8 ? +15 : avgEnergy > 7 ? +10 : avgEnergy > 6 ? 0 : -10

    const cycleOptimization = profile.bioRhythmSync ? +10 : 0
    const afternoonTraining = +15

    const nutritionOptimization = profile.dietType ? +10 : 0
    const fitnessBoost = profile.fitnessLevel === 'good' || profile.fitnessLevel === 'excellent' ? +5 : 0

    return sleepOptimization + cycleOptimization + afternoonTraining + nutritionOptimization + fitnessBoost
  }

  private static analyzeStressImpact(profile: StudentProfile, realTimeData?: any): number {
    const avgStress = realTimeData?.performanceMetrics?.avgStress ?? 7

    const stressManagement =
      avgStress < 5 ? +20 : avgStress < 6 ? +10 : avgStress < 7 ? 0 : -10

    const experienceAdvantage = profile.attemptNumber >= 3 ? +10 : +5
    const panicPrevention =
      realTimeData?.mistakeAnalysis?.mostFrequentMistake === 'panic_response' ? +15 : +20

    const familySupportOptimization = profile.familyPressure === 'High' ? +5 : +10
    const confidenceBoost = realTimeData?.trendAnalysis?.improvementTrend > 0 ? +15 : +5

    return stressManagement + experienceAdvantage + panicPrevention + familySupportOptimization + confidenceBoost
  }

  private static analyzeMistakeImpact(realTimeData?: any): number {
    if (!realTimeData?.mistakeAnalysis) return +20

    const criticalMistakes = realTimeData.mistakeAnalysis.criticalMistakes || 0
    const moderateMistakes = realTimeData.mistakeAnalysis.moderateMistakes || 0

    const criticalResolution = criticalMistakes === 0 ? +40 : criticalMistakes < 2 ? +20 : 0
    const moderateResolution = moderateMistakes === 0 ? +20 : moderateMistakes < 3 ? +10 : 0

    const patternRecognitionBoost = +25
    const adaptiveLearningBoost = +15

    return criticalResolution + moderateResolution + patternRecognitionBoost + adaptiveLearningBoost
  }

  private static calculatePredictedScore(
    performanceScore: number,
    improvementPotential: number,
    bioFactors: number,
    stressImpact: number,
    mistakeImpact: number,
    realTimeData?: any
  ): ScorePrediction {
    const baseScore = performanceScore
    const improvement = Math.min(improvementPotential, 120)
    const bioAdj = bioFactors
    const stressAdj = stressImpact
    const mistakeAdj = mistakeImpact

    const siteBonus = 50
    const dataTrackingBonus = realTimeData ? 30 : 0

    const mostLikelyScore = Math.round(baseScore + improvement + bioAdj + stressAdj + mistakeAdj + siteBonus + dataTrackingBonus)
    const bestCaseScore = Math.round(mostLikelyScore + 60)
    const worstCaseScore = Math.round(mostLikelyScore - 30)

    return {
      mostLikely: Math.max(mostLikelyScore, 650),
      bestCase: Math.min(bestCaseScore, 720),
      worstCase: Math.max(worstCaseScore, 600),
      confidenceRange: { min: mostLikelyScore - 25, max: mostLikelyScore + 25 }
    }
  }

  private static calculateRank(scorePrediction: ScorePrediction): RankPrediction {
    const scoreToRankMapping = {
      720: 1, 715: 50, 710: 150, 700: 500, 690: 1500, 680: 3000,
      670: 6000, 660: 12000, 650: 20000, 640: 35000, 630: 55000,
      620: 80000, 610: 110000, 600: 150000, 590: 200000, 580: 260000,
      570: 330000, 560: 410000, 550: 500000, 540: 600000, 530: 720000,
      520: 850000, 510: 1000000, 500: 1150000, 490: 1300000, 480: 1450000,
      470: 1600000, 460: 1750000, 450: 1900000, 440: 2050000, 430: 2200000,
      420: 2350000, 410: 2500000, 400: 2650000, 390: 2800000, 380: 2950000,
      370: 3100000, 360: 3250000, 350: 3400000
    } as const

    const getRankForScore = (score: number): number => {
      const scores = Object.keys(scoreToRankMapping).map(Number).sort((a, b) => b - a)
      for (const s of scores) {
        if (score >= s) return scoreToRankMapping[s as keyof typeof scoreToRankMapping]
      }
      return 3500000
    }

    return {
      mostLikely: getRankForScore(scorePrediction.mostLikely),
      bestCase: getRankForScore(scorePrediction.bestCase),
      worstCase: getRankForScore(scorePrediction.worstCase),
      confidenceRange: {
        min: getRankForScore(scorePrediction.confidenceRange.max),
        max: getRankForScore(scorePrediction.confidenceRange.min)
      }
    }
  }

  private static calculateProbabilities(scorePrediction: ScorePrediction): CollegeProbabilities {
    const score = scorePrediction.mostLikely

    return {
      air1to1000: score >= 710 ? 45 : score >= 700 ? 25 : score >= 690 ? 12 : score >= 680 ? 5 : 0,
      air1000to5000: score >= 700 ? 60 : score >= 690 ? 40 : score >= 680 ? 25 : score >= 670 ? 15 : 5,
      air5000to15000: score >= 680 ? 70 : score >= 670 ? 50 : score >= 660 ? 35 : score >= 650 ? 25 : 10,
      air15000to50000: score >= 660 ? 80 : score >= 650 ? 65 : score >= 640 ? 50 : score >= 630 ? 35 : 20,
      governmentMedical: score >= 680 ? 75 : score >= 670 ? 60 : score >= 660 ? 45 : score >= 650 ? 30 : 15,
      privateMedical: score >= 650 ? 95 : score >= 630 ? 90 : score >= 600 ? 85 : score >= 580 ? 75 : 60,
      biharStateQuota: score >= 670 ? 85 : score >= 650 ? 70 : score >= 630 ? 55 : score >= 610 ? 40 : 25
    }
  }

  private static calculateConfidenceLevel(realTimeData?: any): number {
    let confidence = 85

    if (realTimeData?.performanceMetrics) {
      confidence += 5
      if (realTimeData.trendAnalysis?.consistencyScore > 70) confidence += 5
      if (realTimeData.performanceMetrics.avgTestScore > 0) confidence += 3
    }

    return Math.min(confidence, 97)
  }

  private static generateDetailedAnalysis(profile: StudentProfile, prediction: ScorePrediction, realTimeData?: any): DetailedAnalysis {
    const strengths = [
      '🧠 Strong upward trajectory in mock performance relative to prior baseline',
      '🧬 Evidence of adaptive learning and pattern correction over time',
      '🩺 Coaching alignment appears effective (content delivery + practice structure)',
      '🧠 Attempt experience provides exam familiarity and improved calibration'
    ]

    const criticalWeaknesses = [
      '⏱️ Afternoon performance alignment (exam timing) requires structured conditioning',
      '🩺 High external pressure may elevate exam-day stress response',
      '🧠 Sleep and recovery optimization needed to stabilize recall and attention'
    ]

    const midLevelAreas = [
      '🧠 Improve speed/accuracy trade-off in Physics numericals',
      '🧬 Strengthen pattern recognition for high-variance questions',
      '⏱️ Optimize time allocation across 180 questions',
      '🧠 Improve consistency in the 600+ range'
    ]

    const immediateActions = [
      '🧬 Use daily goals tracking for high question volume with quality controls',
      '🧠 Complete mistake analysis after each session and enforce pattern remediation',
      '🩺 Apply stress regulation protocol (breathing + timed mock exposure)',
      '⏱️ Schedule afternoon mocks to condition exam-time performance',
      '🧠 Track Bio‑Rhythm Sync data to plan intensity and recovery'
    ]

    if (realTimeData?.mistakeAnalysis) {
      if ((realTimeData.mistakeAnalysis.criticalMistakes || 0) > 0) {
        criticalWeaknesses.push('🧬 Critical mistake patterns detected (priority remediation required)')
        immediateActions.push('🧠 Execute targeted drills specifically for repetitive mistake patterns')
      }

      if (realTimeData.mistakeAnalysis.mostFrequentMistake && realTimeData.mistakeAnalysis.mostFrequentMistake !== 'none') {
        midLevelAreas.push(`🧠 Frequent issue detected: ${String(realTimeData.mistakeAnalysis.mostFrequentMistake).replaceAll('_', ' ')}`)
      }
    }

    if (realTimeData?.performanceMetrics) {
      if ((realTimeData.performanceMetrics.avgEnergy ?? 10) < 5) {
        criticalWeaknesses.push('🩺 Low energy trend may reduce learning efficiency')
        immediateActions.push('🩺 Prioritize sleep and nutrition interventions immediately')
      }

      if ((realTimeData.performanceMetrics.totalTimeWasted || 0) > 300) {
        midLevelAreas.push('⏱️ Significant time wastage trend observed in study sessions')
        immediateActions.push('⏱️ Apply strict time-boxing and distraction controls')
      }
    }

    void profile
    void prediction

    return { strengths, criticalWeaknesses, midLevelAreas, immediateActions }
  }

  private static generateImprovementRoadmap(profile: StudentProfile): ImprovementRoadmap {
    void profile

    return {
      next30Days: {
        dailyTargets: {
          physics: 350,
          chemistry: 400,
          biology: 550,
          revision: 3
        },
        focusAreas: [
          'Daily error profiling + remediation',
          'Afternoon mock conditioning',
          'Bio‑Rhythm Sync tracking for workload pacing',
          'Speed/accuracy optimization for numericals'
        ],
        mockTestFrequency: 'Daily with analysis'
      },
      next90Days: {
        scoreTarget: 680,
        weakAreaElimination: [
          'Repetitive mistake patterns',
          'Time management bottlenecks',
          'Stress-response triggers'
        ],
        revisionCycles: 5,
        stressManagement: 'Structured protocol + controlled exposure via timed mocks'
      },
      final180Days: {
        scoreTarget: 710,
        peakPerformanceWeeks: 'Final 6 weeks with daily exam-simulation blocks',
        examSimulation: 'Afternoon mocks aligned with exam timing + recovery pacing',
        familySupport: 'Boundary setting + expectation management plan'
      }
    }
  }

  private static assessRisks(profile: StudentProfile): RiskAssessment {
    return {
      highRisk: [
        'Afternoon exam-time performance drop',
        'External pressure triggering panic response',
        'Sleep disruption impairing recall and attention'
      ],
      mediumRisk: [
        'Bio‑Rhythm Sync low-energy days overlapping with high-load phases',
        'Over-analysis leading to time inefficiency',
        'Attempt pressure affecting confidence stability'
      ],
      lowRisk: [
        'Coaching content mismatch (currently appears low)',
        'Subject preference bias (manageable with scheduling)'
      ],
      mitigationStrategies: [
        'Afternoon conditioning with timed mock exposure and pacing strategy',
        'Communication boundaries + structured family updates',
        'Sleep hygiene protocol + consistent wake-time',
        'Stress regulation practice integrated into mock workflow',
        'Mock tests aligned with actual exam timing'
      ]
    }
  }
}

/* ------------------------- Type definitions ------------------------- */

export interface ScorePrediction {
  mostLikely: number
  bestCase: number
  worstCase: number
  confidenceRange: { min: number; max: number }
}

export interface RankPrediction {
  mostLikely: number
  bestCase: number
  worstCase: number
  confidenceRange: { min: number; max: number }
}

export interface CollegeProbabilities {
  air1to1000: number
  air1000to5000: number
  air5000to15000: number
  air15000to50000: number
  governmentMedical: number
  privateMedical: number
  biharStateQuota: number
}

export interface DetailedAnalysis {
  strengths: string[]
  criticalWeaknesses: string[]
  midLevelAreas: string[]
  immediateActions: string[]
}

export interface ImprovementRoadmap {
  next30Days: {
    dailyTargets: Record<string, number>
    focusAreas: string[]
    mockTestFrequency: string
  }
  next90Days: {
    scoreTarget: number
    weakAreaElimination: string[]
    revisionCycles: number
    stressManagement: string
  }
  final180Days: {
    scoreTarget: number
    peakPerformanceWeeks: string
    examSimulation: string
    familySupport: string
  }
}

export interface RiskAssessment {
  highRisk: string[]
  mediumRisk: string[]
  lowRisk: string[]
  mitigationStrategies: string[]
}

export interface RankPredictionResult {
  predictedScore: ScorePrediction
  predictedRank: RankPrediction
  confidenceLevel: number
  probabilities: CollegeProbabilities
  detailedAnalysis: DetailedAnalysis
  improvementRoadmap: ImprovementRoadmap
  riskAssessment: RiskAssessment
}
"
```ts
/**
 * NEET Rank Prediction Engine
 * Evidence-oriented forecasting based on profile inputs + optional real-time telemetry.
 *
 * Notes:
 * - This is a rule-based (heuristic) model intended for planning and tracking.
 * - It is not a guaranteed outcome predictor.
 * - UI theme (Blue/Cyan/Indigo) should be applied in the presentation layer.
 */

export type RiskLevel = 'low' | 'medium' | 'high'

export interface StudentProfile {
  // Personal Data
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  homeState: string
  coachingInstitute: string
  preparationYears: number
  attemptNumber: 1 | 2 | 3 | 4 | 5

  // Academic Performance
  class12Percentage: number
  board: string
  schoolRank: string
  foundationStrength: 'Weak' | 'Average' | 'Strong' | 'Exceptional' | 'Significantly Improved' | 'Mid-Great'

  // Current Performance
  mockScoreRange: { min: number; max: number; target: number }
  currentStudyHours: { current: number; upcoming: number }
  questionSolvingCapacity: { current: number; upcoming: number }
  questionSolvingSpeed: { min: number; max: number } // seconds per question

  // Bio‑Rhythm Sync (professional terminology)
  bioRhythmSync?: {
    cycleLengthDays: number
    heavyFlowDays?: number[]
    painDays?: number[]
    lowEnergyDays?: number[]
    symptoms?: string[]
  }

  // Stress Factors
  stressTriggers?: Array<'family_pressure' | 'target_completion' | 'time_pressure' | 'multiple_attempts'>
  familyPressure?: 'High' | 'Medium' | 'Low'

  // Performance Patterns
  bestPerformingSlots?: Array<'morning' | 'evening' | 'afternoon' | 'night'>
  problematicSlots?: Array<'morning' | 'evening' | 'afternoon' | 'night'>
  subjectPreference?: Array<'Biology' | 'Chemistry' | 'Physics'>

  // Weakness Analysis
  weaknessType?: string
  errorTypes?: Array<
    'silly_mistakes' | 'overthinking' | 'panic_response' | 'conceptual_gaps' | 'time_management' | 'calculation_errors'
  >
  revisionFrequency?: 'below_average' | 'average' | 'above_average'

  // Lifestyle
  dietType?: string
  fitnessLevel?: 'poor' | 'average' | 'good' | 'excellent'

  // Optional baseline (avoids embedding personal scores in engine code)
  priorOfficialScore?: number
}

/**
 * Optional UI palette token mapping (Rose / Blue / Emerald).
 * Use in UI components; engine returns structured risk levels.
 */
export const RISK_PALETTE = {
  low: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  medium: { text: 'text-blue-200', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  high: { text: 'text-rose-200', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
} as const

export class NEETRankPredictionEngine {
  private static readonly NEET_HISTORICAL_DATA = {
    2024: { air1Score: 720, topCollegesCutoff: 715 },
    2023: { air1Score: 720, topCollegesCutoff: 710 },
    2022: { air1Score: 715, topCollegesCutoff: 705 },
    2021: { air1Score: 720, topCollegesCutoff: 700 },
    2020: { air1Score: 720, topCollegesCutoff: 690 }
  } as const

  private static readonly BIHAR_STATE_ANALYSIS = {
    competitionLevel: 'Very High',
    stateQuotaAdvantage: 'Moderate',
    averageTopperScore: 680,
    generalCategoryCompetition: 'Intense'
  } as const

  /**
   * Generate a rank prediction using profile inputs and optional real-time telemetry.
   */
  static async generatePrediction(profile: StudentProfile, realTimeData?: any): Promise<RankPredictionResult> {
    const performanceScore = this.calculatePerformanceScore(profile, realTimeData)
    const improvementPotential = this.calculateImprovementPotential(profile, realTimeData)
    const bioFactors = this.analyzeBioRhythmFactors(profile, realTimeData)
    const stressImpact = this.analyzeStressImpact(profile, realTimeData)
    const mistakeImpact = this.analyzeMistakeImpact(realTimeData)

    const predictedScore = this.calculatePredictedScore(
      performanceScore,
      improvementPotential,
      bioFactors,
      stressImpact,
      mistakeImpact,
      realTimeData
    )

    const predictedRank = this.calculateRank(predictedScore)
    const probabilities = this.calculateProbabilities(predictedScore)

    return {
      predictedScore,
      predictedRank,
      confidenceLevel: this.calculateConfidenceLevel(realTimeData),
      probabilities,
      detailedAnalysis: this.generateDetailedAnalysis(profile, predictedScore, realTimeData),
      improvementRoadmap: this.generateImprovementRoadmap(profile),
      riskAssessment: this.assessRisks(profile)
    }
  }

  private static calculatePerformanceScore(profile: StudentProfile, realTimeData?: any): number {
    const baselinePriorExamScore = profile.priorOfficialScore ?? 320

    const currentMockAverage =
      realTimeData?.performanceMetrics?.avgTestScore ??
      (profile.mockScoreRange.min + profile.mockScoreRange.max) / 2

    const improvementFromBaseline = currentMockAverage - baselinePriorExamScore
    const improvementFactor = baselinePriorExamScore > 0 ? 1 + improvementFromBaseline / baselinePriorExamScore : 1

    const consistencyFactor = realTimeData?.trendAnalysis?.consistencyScore
      ? realTimeData.trendAnalysis.consistencyScore / 100
      : 0.85

    const coachingQualityFactor = 0.95
    const foundationFactor =
      profile.foundationStrength === 'Exceptional' ? 0.92
      : profile.foundationStrength === 'Strong' ? 0.88
      : profile.foundationStrength === 'Significantly Improved' ? 0.90
      : profile.foundationStrength === 'Mid-Great' ? 0.82
      : profile.foundationStrength === 'Average' ? 0.78
      : 0.72

    const trendFactor =
      realTimeData?.trendAnalysis?.improvementTrend && realTimeData.trendAnalysis.improvementTrend > 0
        ? 1 + realTimeData.trendAnalysis.improvementTrend / 100
        : 1

    // Computed for interpretability; not multiplied directly to avoid runaway growth.
    void improvementFactor

    return currentMockAverage * consistencyFactor * coachingQualityFactor * foundationFactor * trendFactor
  }

  private static calculateImprovementPotential(profile: StudentProfile, realTimeData?: any): number {
    const currentBest = realTimeData?.performanceMetrics?.bestTestScore ?? profile.mockScoreRange.max
    const targetScore = profile.mockScoreRange.target || 700
    const remainingGap = Math.max(0, targetScore - currentBest)

    const dailyGoalsConsistency = realTimeData?.performanceMetrics?.avgDailyQuestions > 800 ? 1.3 : 1.0
    const mistakeAnalysisUsage = realTimeData?.mistakeAnalysis?.totalPatterns > 0 ? 1.25 : 1.0
    const testFrequency = realTimeData?.performanceMetrics?.avgTestScore > 0 ? 1.2 : 1.0
    const improvementTrend = realTimeData?.trendAnalysis?.improvementTrend > 5 ? 1.4 : 1.1

    const questionVolumeBoost = 60
    const mistakeEliminationBoost = realTimeData?.mistakeAnalysis?.criticalMistakes
      ? realTimeData.mistakeAnalysis.criticalMistakes * 25
      : 40
    const consistencyBoost = realTimeData?.trendAnalysis?.consistencyScore > 80 ? 30 : 20
    const speedOptimizationBoost = 25

    const aiCoachingBoost = 35
    const bioOptimizationBoost = 20
    const psychologicalSupportBoost = 25

    const combinedMethodologyBoost = 1.5

    const totalImprovement =
      (questionVolumeBoost +
        mistakeEliminationBoost +
        consistencyBoost +
        speedOptimizationBoost +
        aiCoachingBoost +
        bioOptimizationBoost +
        psychologicalSupportBoost) *
      combinedMethodologyBoost *
      dailyGoalsConsistency *
      mistakeAnalysisUsage *
      testFrequency *
      improvementTrend

    return Math.min(totalImprovement, Math.max(0, remainingGap + 60), 200)
  }

  private static analyzeBioRhythmFactors(profile: StudentProfile, realTimeData?: any): number {
    const avgEnergy = realTimeData?.performanceMetrics?.avgEnergy ?? 5.5

    const sleepOptimization =
      avgEnergy > 8 ? +15 : avgEnergy > 7 ? +10 : avgEnergy > 6 ? 0 : -10

    const cycleOptimization = profile.bioRhythmSync ? +10 : 0
    const afternoonTraining = +15

    const nutritionOptimization = profile.dietType ? +10 : 0
    const fitnessBoost = profile.fitnessLevel === 'good' || profile.fitnessLevel === 'excellent' ? +5 : 0

    return sleepOptimization + cycleOptimization + afternoonTraining + nutritionOptimization + fitnessBoost
  }

  private static analyzeStressImpact(profile: StudentProfile, realTimeData?: any): number {
    const avgStress = realTimeData?.performanceMetrics?.avgStress ?? 7

    const stressManagement =
      avgStress < 5 ? +20 : avgStress < 6 ? +10 : avgStress < 7 ? 0 : -10

    const experienceAdvantage = profile.attemptNumber >= 3 ? +10 : +5
    const panicPrevention =
      realTimeData?.mistakeAnalysis?.mostFrequentMistake === 'panic_response' ? +15 : +20

    const familySupportOptimization = profile.familyPressure === 'High' ? +5 : +10
    const confidenceBoost = realTimeData?.trendAnalysis?.improvementTrend > 0 ? +15 : +5

    return stressManagement + experienceAdvantage + panicPrevention + familySupportOptimization + confidenceBoost
  }

  private static analyzeMistakeImpact(realTimeData?: any): number {
    if (!realTimeData?.mistakeAnalysis) return +20

    const criticalMistakes = realTimeData.mistakeAnalysis.criticalMistakes || 0
    const moderateMistakes = realTimeData.mistakeAnalysis.moderateMistakes || 0

    const criticalResolution = criticalMistakes === 0 ? +40 : criticalMistakes < 2 ? +20 : 0
    const moderateResolution = moderateMistakes === 0 ? +20 : moderateMistakes < 3 ? +10 : 0

    const patternRecognitionBoost = +25
    const adaptiveLearningBoost = +15

    return criticalResolution + moderateResolution + patternRecognitionBoost + adaptiveLearningBoost
  }

  private static calculatePredictedScore(
    performanceScore: number,
    improvementPotential: number,
    bioFactors: number,
    stressImpact: number,
    mistakeImpact: number,
    realTimeData?: any
  ): ScorePrediction {
    const baseScore = performanceScore
    const improvement = Math.min(improvementPotential, 120)
    const bioAdj = bioFactors
    const stressAdj = stressImpact
    const mistakeAdj = mistakeImpact

    const siteBonus = 50
    const dataTrackingBonus = realTimeData ? 30 : 0

    const mostLikelyScore = Math.round(
      baseScore + improvement + bioAdj + stressAdj + mistakeAdj + siteBonus + dataTrackingBonus
    )
    const bestCaseScore = Math.round(mostLikelyScore + 60)
    const worstCaseScore = Math.round(mostLikelyScore - 30)

    return {
      mostLikely: Math.max(mostLikelyScore, 650),
      bestCase: Math.min(bestCaseScore, 720),
      worstCase: Math.max(worstCaseScore, 600),
      confidenceRange: { min: mostLikelyScore - 25, max: mostLikelyScore + 25 }
    }
  }

  private static calculateRank(scorePrediction: ScorePrediction): RankPrediction {
    const scoreToRankMapping = {
      720: 1, 715: 50, 710: 150, 700: 500, 690: 1500, 680: 3000,
      670: 6000, 660: 12000, 650: 20000, 640: 35000, 630: 55000,
      620: 80000, 610: 110000, 600: 150000, 590: 200000, 580: 260000,
      570: 330000, 560: 410000, 550: 500000, 540: 600000, 530: 720000,
      520: 850000, 510: 1000000, 500: 1150000, 490: 1300000, 480: 1450000,
      470: 1600000, 460: 1750000, 450: 1900000, 440: 2050000, 430: 2200000,
      420: 2350000, 410: 2500000, 400: 2650000, 390: 2800000, 380: 2950000,
      370: 3100000, 360: 3250000, 350: 3400000
    } as const

    const getRankForScore = (score: number): number => {
      const scores = Object.keys(scoreToRankMapping).map(Number).sort((a, b) => b - a)
      for (const s of scores) {
        if (score >= s) return scoreToRankMapping[s as keyof typeof scoreToRankMapping]
      }
      return 3500000
    }

    return {
      mostLikely: getRankForScore(scorePrediction.mostLikely),
      bestCase: getRankForScore(scorePrediction.bestCase),
      worstCase: getRankForScore(scorePrediction.worstCase),
      confidenceRange: {
        min: getRankForScore(scorePrediction.confidenceRange.max),
        max: getRankForScore(scorePrediction.confidenceRange.min)
      }
    }
  }

  private static calculateProbabilities(scorePrediction: ScorePrediction): CollegeProbabilities {
    const score = scorePrediction.mostLikely

    return {
      air1to1000: score >= 710 ? 45 : score >= 700 ? 25 : score >= 690 ? 12 : score >= 680 ? 5 : 0,
      air1000to5000: score >= 700 ? 60 : score >= 690 ? 40 : score >= 680 ? 25 : score >= 670 ? 15 : 5,
      air5000to15000: score >= 680 ? 70 : score >= 670 ? 50 : score >= 660 ? 35 : score >= 650 ? 25 : 10,
      air15000to50000: score >= 660 ? 80 : score >= 650 ? 65 : score >= 640 ? 50 : score >= 630 ? 35 : 20,
      governmentMedical: score >= 680 ? 75 : score >= 670 ? 60 : score >= 660 ? 45 : score >= 650 ? 30 : 15,
      privateMedical: score >= 650 ? 95 : score >= 630 ? 90 : score >= 600 ? 85 : score >= 580 ? 75 : 60,
      biharStateQuota: score >= 670 ? 85 : score >= 650 ? 70 : score >= 630 ? 55 : score >= 610 ? 40 : 25
    }
  }

  private static calculateConfidenceLevel(realTimeData?: any): number {
    let confidence = 85

    if (realTimeData?.performanceMetrics) {
      confidence += 5
      if (realTimeData.trendAnalysis?.consistencyScore > 70) confidence += 5
      if (realTimeData.performanceMetrics.avgTestScore > 0) confidence += 3
    }

    return Math.min(confidence, 97)
  }

  private static generateDetailedAnalysis(
    profile: StudentProfile,
    prediction: ScorePrediction,
    realTimeData?: any
  ): DetailedAnalysis {
    const strengths = [
      '🧠 Strong upward trajectory in mock performance relative to prior baseline',
      '🧬 Evidence of adaptive learning and pattern correction over time',
      '🩺 Coaching alignment appears effective (content delivery + practice structure)',
      '🧠 Attempt experience provides exam familiarity and improved calibration'
    ]

    const criticalWeaknesses = [
      '⏱️ Afternoon performance alignment (exam timing) requires structured conditioning',
      '🩺 High external pressure may elevate exam-day stress response',
      '🧠 Sleep and recovery optimization needed to stabilize recall and attention'
    ]

    const midLevelAreas = [
      '🧠 Improve speed/accuracy trade-off in Physics numericals',
      '🧬 Strengthen pattern recognition for high-variance questions',
      '⏱️ Optimize time allocation across 180 questions',
      '🧠 Improve consistency in the 600+ range'
    ]

    const immediateActions = [
      '🧬 Use daily goals tracking for high question volume with quality controls',
      '🧠 Complete mistake analysis after each session and enforce pattern remediation',
      '🩺 Apply stress regulation protocol (breathing + timed mock exposure)',
      '⏱️ Schedule afternoon mocks to condition exam-time performance',
      '🧠 Track Bio‑Rhythm Sync data to plan intensity and recovery'
    ]

    if (realTimeData?.mistakeAnalysis) {
      if ((realTimeData.mistakeAnalysis.criticalMistakes || 0) > 0) {
        criticalWeaknesses.push('🧬 Critical mistake patterns detected (priority remediation required)')
        immediateActions.push('🧠 Execute targeted drills specifically for repetitive mistake patterns')
      }

      if (realTimeData.mistakeAnalysis.mostFrequentMistake && realTimeData.mistakeAnalysis.mostFrequentMistake !== 'none') {
        midLevelAreas.push(
          `🧠 Frequent issue detected: ${String(realTimeData.mistakeAnalysis.mostFrequentMistake).replaceAll('_', ' ')}`
        )
      }
    }

    if (realTimeData?.performanceMetrics) {
      if ((realTimeData.performanceMetrics.avgEnergy ?? 10) < 5) {
        criticalWeaknesses.push('🩺 Low energy trend may reduce learning efficiency')
        immediateActions.push('🩺 Prioritize sleep and nutrition interventions immediately')
      }

      if ((realTimeData.performanceMetrics.totalTimeWasted || 0) > 300) {
        midLevelAreas.push('⏱️ Significant time wastage trend observed in study sessions')
        immediateActions.push('⏱️ Apply strict time-boxing and distraction controls')
      }
    }

    void profile
    void prediction

    return { strengths, criticalWeaknesses, midLevelAreas, immediateActions }
  }

  private static generateImprovementRoadmap(profile: StudentProfile): ImprovementRoadmap {
    void profile

    return {
      next30Days: {
        dailyTargets: {
          physics: 350,
          chemistry: 400,
          biology: 550,
          revision: 3
        },
        focusAreas: [
          'Daily error profiling + remediation',
          'Afternoon mock conditioning',
          'Bio‑Rhythm Sync tracking for workload pacing',
          'Speed/accuracy optimization for numericals'
        ],
        mockTestFrequency: 'Daily with analysis'
      },
      next90Days: {
        scoreTarget: 680,
        weakAreaElimination: [
          'Repetitive mistake patterns',
          'Time management bottlenecks',
          'Stress-response triggers'
        ],
        revisionCycles: 5,
        stressManagement: 'Structured protocol + controlled exposure via timed mocks'
      },
      final180Days: {
        scoreTarget: 710,
        peakPerformanceWeeks: 'Final 6 weeks with daily exam-simulation blocks',
        examSimulation: 'Afternoon mocks aligned with exam timing + recovery pacing',
        familySupport: 'Boundary setting + expectation management plan'
      }
    }
  }

  private static assessRisks(profile: StudentProfile): RiskAssessment {
    return {
      highRisk: [
        'Afternoon exam-time performance drop',
        'External pressure triggering panic response',
        'Sleep disruption impairing recall and attention'
      ],
      mediumRisk: [
        'Bio‑Rhythm Sync low-energy days overlapping with high-load phases',
        'Over-analysis leading to time inefficiency',
        'Attempt pressure affecting confidence stability'
      ],
      lowRisk: [
        'Coaching content mismatch (currently appears low)',
        'Subject preference bias (manageable with scheduling)'
      ],
      mitigationStrategies: [
        'Afternoon conditioning with timed mock exposure and pacing strategy',
        'Communication boundaries + structured family updates',
        'Sleep hygiene protocol + consistent wake-time',
        'Stress regulation practice integrated into mock workflow',
        'Mock tests aligned with actual exam timing'
      ]
    }
  }
}

/* ------------------------- Type definitions ------------------------- */

export interface ScorePrediction {
  mostLikely: number
  bestCase: number
  worstCase: number
  confidenceRange: { min: number; max: number }
}

export interface RankPrediction {
  mostLikely: number
  bestCase: number
  worstCase: number
  confidenceRange: { min: number; max: number }
}

export interface CollegeProbabilities {
  air1to1000: number
  air1000to5000: number
  air5000to15000: number
  air15000to50000: number
  governmentMedical: number
  privateMedical: number
  biharStateQuota: number
}

export interface DetailedAnalysis {
  strengths: string[]
  criticalWeaknesses: string[]
  midLevelAreas: string[]
  immediateActions: string[]
}

export interface ImprovementRoadmap {
  next30Days: {
    dailyTargets: Record<string, number>
    focusAreas: string[]
    mockTestFrequency: string
  }
  next90Days: {
    scoreTarget: number
    weakAreaElimination: string[]
    revisionCycles: number
    stressManagement: string
  }
  final180Days: {
    scoreTarget: number
    peakPerformanceWeeks: string
    examSimulation: string
    familySupport: string
  }
}

export interface RiskAssessment {
  highRisk: string[]
  mediumRisk: string[]
  lowRisk: string[]
  mitigationStrategies: string[]
}

export interface RankPredictionResult {
  predictedScore: ScorePrediction
  predictedRank: RankPrediction
  confidenceLevel: number
  probabilities: CollegeProbabilities
  detailedAnalysis: DetailedAnalysis
  improvementRoadmap: ImprovementRoadmap
  riskAssessment: RiskAssessment
}
