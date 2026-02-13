import { groqClient, GroqError, RateLimitError } from './groq-client';
import { AIPrompts, StudyPatternData } from './ai-prompts';

// --- Integrated Clinical Types ---

export interface StudyInsights {
  overallAssessment: string;
  subjectAnalysis: {
    strengths: string[];
    weaknesses: string[];
    details: string;
  };
  studyPatterns: {
    consistency: 'high' | 'medium' | 'low';
    questionVolume: 'above_target' | 'on_target' | 'below_target';
    revisionQuality: 'excellent' | 'good' | 'needs_improvement';
    insights: string;
  };
  performanceTrends: {
    testTrend: 'improving' | 'stable' | 'declining';
    bioRhythmTrend: 'improving' | 'declining' | 'stable';
    correlation: string;
    clinicalRisk: 'low' | 'moderate' | 'high' | 'critical'; 
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeframe: string;
    expectedImpact: string;
  }>;
  professionalBriefing: string;
}

export interface OptimalSchedule {
  dailyProtocol: Array<{ 
    timeSlot: string;
    activity: string;
    subject: string;
    focus: 'theory' | 'practice' | 'revision' | 'assessment';
    duration: number;
    cognitiveLoad: 'high' | 'medium' | 'low'; 
  }>;
  weeklyFocus: Record<string, string>;
  priorityAdjustments: Array<{
    subject: string;
    reason: string;
    adjustment: string;
  }>;
  clinicalTips: string[];
}

export interface WeakAreaFocus {
  urgentActions: Array<{
    subject: string;
    chapter: string;
    diagnosis: 'low_completion' | 'poor_revision' | 'insufficient_practice';
    action: string;
    timeRequired: string;
    priority: number;
  }>;
  weeklyTargets: {
    lectureCompletion: number;
    questionsToSolve: number;
    chaptersToRevise: number;
  };
  recoveryProtocol: string;
}

// --- AI Insights Service ---

export class AIInsightsService {
  private static instance: AIInsightsService;
  private readonly EXAM_DATE = new Date('2026-05-03T14:00:00+05:30');

  private constructor() {}

  static getInstance(): AIInsightsService {
    if (!AIInsightsService.instance) {
      AIInsightsService.instance = new AIInsightsService();
    }
    return AIInsightsService.instance;
  }

  /**
   * Generates comprehensive study analytics using AI models.
   */
  async generateStudyInsights(data: StudyPatternData): Promise<StudyInsights> {
    try {
      const prompt = AIPrompts.generateStudyInsights(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 1500,
        temperature: 0.7,
      });

      try {
        return this.parseJSONResponse<StudyInsights>(response);
      } catch (parseError) {
        console.warn('AI Parsing Failure: Executing Fallback Protocol', parseError);
        return this.getFallbackInsights(data);
      }
    } catch (error) {
      this.handleServiceError(error, "Study Insights");
    }
  }

  /**
   * Creates a time-optimized daily protocol based on cognitive load and bio-rhythms.
   */
  async generateOptimalSchedule(data: StudyPatternData): Promise<OptimalSchedule> {
    try {
      const prompt = AIPrompts.generateOptimalSchedule(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 2000,
        temperature: 0.6,
      });

      try {
        return this.parseJSONResponse<OptimalSchedule>(response);
      } catch (parseError) {
        return this.getFallbackSchedule(data);
      }
    } catch (error) {
      this.handleServiceError(error, "Optimal Schedule");
    }
  }

  /**
   * Provides a concise professional briefing on current performance status.
   */
  async generatePerformanceBriefing(data: StudyPatternData): Promise<string> {
    try {
      const prompt = AIPrompts.generateMotivationalBoost(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 250,
        temperature: 0.8,
      });
      
      // Clinical Sanitization: Ensures output remains professional regardless of LLM variance
      return response.trim()
        .replace(/[💕❤️💖💗]/g, '✨')  // Replace heart emojis with sparkle
        .replace(/\s+/g, ' ')          // Clean up extra spaces
        .trim();
    } catch (error) {
      this.handleServiceError(error, "Performance Briefing");
    }
  }

  // --- Fallback Protocols (Professional Standards) ---

  private getFallbackInsights(data: StudyPatternData): StudyInsights {
    const avgCompletion = data.subjects.reduce((sum, s) => sum + s.completionPercentage, 0) / data.subjects.length;
    return {
      overallAssessment: `Preparation status: ${Math.round(avgCompletion)}% syllabus completion. Assessment window: ${data.timeToExam.days} days remaining. Current trajectory requires velocity calibration for optimal outcomes.`,
      subjectAnalysis: {
        strengths: data.subjects.filter(s => s.completionPercentage >= 75).map(s => s.name).slice(0, 2),
        weaknesses: data.subjects.filter(s => s.completionPercentage < 75).map(s => s.name).slice(0, 2),
        details: "Core competencies identified in primary modules. Strategic intervention recommended for secondary modules to align with AIIMS competitive benchmarks."
      },
      studyPatterns: {
        consistency: data.questionAnalytics.dailyAverage > 200 ? 'high' : 'medium',
        questionVolume: data.questionAnalytics.dailyAverage >= 250 ? 'on_target' : 'below_target',
        revisionQuality: avgCompletion > 70 ? 'good' : 'needs_improvement',
        insights: "Maintain high-frequency practice cycles to stabilize neural retention across high-complexity Physics and Chemistry chapters."
      },
      performanceTrends: {
        testTrend: 'stable',
        bioRhythmTrend: 'stable',
        correlation: "Bio-rhythm stability shows high correlation with practice consistency and error-margin reduction.",
        clinicalRisk: avgCompletion < 60 ? 'moderate' : 'low'
      },
      recommendations: [{
        priority: 'high',
        action: "Intensify conceptual practice in low-completion areas using active recall",
        timeframe: "14 days",
        expectedImpact: "Optimization of percentile trajectory"
      }],
      professionalBriefing: "Focus on the 188K question trajectory. Every verified data point builds your clinical foundation for AIIMS 2026. ✨"
    };
  }

  private getFallbackSchedule(data: StudyPatternData): OptimalSchedule {
    return {
      dailyProtocol: [
        { timeSlot: '06:00 - 08:30', activity: 'High-Complexity Practice', subject: 'Physics', focus: 'practice', duration: 150, cognitiveLoad: 'high' },
        { timeSlot: '09:00 - 11:30', activity: 'Conceptual Analysis', subject: 'Chemistry', focus: 'theory', duration: 150, cognitiveLoad: 'high' },
        { timeSlot: '13:00 - 15:30', activity: 'Knowledge Consolidation', subject: 'Biology', focus: 'revision', duration: 150, cognitiveLoad: 'medium' }
      ],
      weeklyFocus: { monday: 'Physics Mechanics', tuesday: 'Organic Chemistry', wednesday: 'Human Physiology' },
      priorityAdjustments: [{ subject: 'Critical Deficits', reason: 'Sub-threshold completion', adjustment: '90min targeted intervention' }],
      clinicalTips: [
        'Apply active recall protocols for reaction mechanisms.',
        'Prioritize high-weightage chapters during peak morning focus windows.',
        'Maintain 15-minute neural reset intervals between intensive study blocks.'
      ]
    };
  }

  // --- Internal Helpers ---

  private handleServiceError(error: any, context: string): never {
    if (error instanceof RateLimitError || error instanceof GroqError) throw error;
    throw new GroqError(`AI Analysis Interrupted [${context}]: ${error}`);
  }

  private parseJSONResponse<T>(response: string): T {
    try {
      let clean = response.replace(/```json\n?|```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1);
      return JSON.parse(clean);
    } catch (e) {
      throw new GroqError(`Data structure verification failed: ${e}`);
    }
  }

  static prepareStudyData(subjects: any[], tests: any[], questions: any, mood: any): StudyPatternData {
    const examDate = new Date('2026-05-03T14:00:00+05:30');
    const daysToExam = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 3600 * 24));

    return {
      subjects: subjects.map(s => ({
        name: s.name,
        completionPercentage: s.completionPercentage || 0,
        totalQuestions: s.totalQuestions || 0,
        chapters: s.chapters?.map((c: any) => ({
          name: c.name,
          lectureProgress: (c.lecturesCompleted?.filter(Boolean).length / c.lectureCount) * 100 || 0,
          dppProgress: (c.dppCompleted?.filter(Boolean).length / c.lectureCount) * 100 || 0,
          revisionScore: c.revisionScore || 1,
          questionsCompleted: (c.assignmentCompleted?.filter(Boolean).length || 0) + (c.kattarCompleted?.filter(Boolean).length || 0),
        })) || [],
      })),
      testPerformances: tests.map(t => ({ testType: t.testType, score: t.score, maxScore: 720, date: t.testDate.toISOString().split('T')[0] })),
      questionAnalytics: { dailyAverage: questions?.dailyCount || 0, weeklyTotal: questions?.weeklyCount || 0, monthlyTotal: questions?.monthlyCount || 0, lifetimeTotal: questions?.lifetimeCount || 0 },
      moodData: { averageMood: mood?.averageMood || 2, moodTrend: mood?.trend || 'stable', recentMoods: mood?.recentMoods || [] },
      timeToExam: { days: Math.max(0, daysToExam), weeks: Math.max(0, Math.ceil(daysToExam / 7)), months: Math.max(0, Math.ceil(daysToExam / 30)) },
    };
  }
}

export const aiInsightsService = AIInsightsService.getInstance();