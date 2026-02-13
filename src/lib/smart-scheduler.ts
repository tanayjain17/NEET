import { groqClient } from './groq-client';
import { prisma } from './prisma';

export interface SmartScheduleData {
  currentDate: Date;
  menstrualCyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  energyLevel: number; // 1-10
  studyCapacity: number; // 1-10
  upcomingFestivals: Array<{
    name: string;
    date: Date;
    impact: 'high' | 'medium' | 'low';
  }>;
  bscExams: Array<{
    subject: string;
    date: Date;
    priority: 'high' | 'medium' | 'low';
  }>;
  subjectProgress: Array<{
    name: string;
    completion: number;
    urgency: number; // 1-10
  }>;
  recentPerformance: {
    testScores: number[];
    questionsSolved: number;
    consistency: number;
  };
}

export interface SmartSchedule {
  dailySchedule: Array<{
    timeSlot: string;
    subject: string;
    activity: string;
    duration: number;
    intensity: 'high' | 'medium' | 'low';
    reasoning: string;
  }>;
  weeklyPlan: {
    [key: string]: {
      focus: string;
      adjustments: string[];
    };
  };
  biologicalOptimizations: string[];
  festivalAdjustments: string[];
  bscIntegration: string[];
  emergencyPlan: string;
}

export class SmartScheduler {
  private static instance: SmartScheduler;

  private constructor() {}

  static getInstance(): SmartScheduler {
    if (!SmartScheduler.instance) {
      SmartScheduler.instance = new SmartScheduler();
    }
    return SmartScheduler.instance;
  }

  async generateSmartSchedule(userId: string): Promise<SmartSchedule> {
    try {
      const data = await this.gatherScheduleData(userId);
      const prompt = this.buildSchedulePrompt(data);
      
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 2500,
        temperature: 0.4,
      });

      return this.parseScheduleResponse(response, data);
    } catch (error) {
      console.error('Smart schedule generation error:', error);
      return this.getFallbackSchedule(userId);
    }
  }

  private async gatherScheduleData(userId: string): Promise<SmartScheduleData> {
    const currentDate = new Date();
    
    const [subjects, testPerformances, questionAnalytics, latestCycle, festivals, bscExams] = await Promise.all([
      prisma.subject.findMany({ include: { chapters: true } }),
      prisma.testPerformance.findMany({ where: { userId }, orderBy: { testDate: 'desc' }, take: 5 }),
      prisma.questionAnalytics.findFirst({ orderBy: { date: 'desc' } }),
      prisma.menstrualCycle.findFirst({ where: { userId }, orderBy: { cycleStartDate: 'desc' } }),
      prisma.indianFestival.findMany({
        where: {
          date: {
            gte: currentDate,
            lte: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
          }
        }
      }),
      prisma.bSCSchedule.findMany({
        where: {
          userId,
          examDate: {
            gte: currentDate,
            lte: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000) // Next 60 days
          }
        }
      })
    ]);

    // Calculate menstrual cycle phase
    const menstrualCyclePhase = this.calculateCyclePhase(latestCycle, currentDate);
    
    // Get energy and study capacity based on cycle phase
    const { energyLevel, studyCapacity } = this.getBiologicalMetrics(menstrualCyclePhase, latestCycle);

    return {
      currentDate,
      menstrualCyclePhase,
      energyLevel,
      studyCapacity,
      upcomingFestivals: festivals.map(f => ({
        name: f.name,
        date: f.date,
        impact: f.impact as 'high' | 'medium' | 'low'
      })),
      bscExams: bscExams.map(e => ({
        subject: e.subject,
        date: e.examDate,
        priority: e.priority as 'high' | 'medium' | 'low'
      })),
      subjectProgress: subjects.map(s => ({
        name: s.name,
        completion: s.completionPercentage,
        urgency: this.calculateUrgency(s.completionPercentage, s.name)
      })),
      recentPerformance: {
        testScores: testPerformances.map(t => t.score),
        questionsSolved: questionAnalytics?.dailyCount || 0,
        consistency: this.calculateConsistency(testPerformances)
      }
    };
  }

  private calculateCyclePhase(cycle: any, currentDate: Date): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' {
    if (!cycle) return 'follicular'; // Default assumption
    
    const cycleStart = new Date(cycle.cycleStartDate);
    const daysSinceStart = Math.floor((currentDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceStart % cycle.cycleLength) + 1;
    
    if (cycleDay <= cycle.periodLength) return 'menstrual';
    if (cycleDay <= 13) return 'follicular';
    if (cycleDay <= 16) return 'ovulation';
    return 'luteal';
  }

  private getBiologicalMetrics(phase: string, cycle: any): { energyLevel: number; studyCapacity: number } {
    if (!cycle) return { energyLevel: 7, studyCapacity: 7 };
    
    // Use recorded data if available, otherwise use phase-based defaults
    const baseEnergy = cycle.energyLevel || 7;
    const baseCapacity = cycle.studyCapacity || 7;
    
    // Adjust based on cycle phase
    switch (phase) {
      case 'menstrual':
        return { energyLevel: Math.max(1, baseEnergy - 2), studyCapacity: Math.max(1, baseCapacity - 2) };
      case 'follicular':
        return { energyLevel: Math.min(10, baseEnergy + 1), studyCapacity: Math.min(10, baseCapacity + 1) };
      case 'ovulation':
        return { energyLevel: Math.min(10, baseEnergy + 2), studyCapacity: Math.min(10, baseCapacity + 2) };
      case 'luteal':
        return { energyLevel: Math.max(1, baseEnergy - 1), studyCapacity: Math.max(1, baseCapacity - 1) };
      default:
        return { energyLevel: baseEnergy, studyCapacity: baseCapacity };
    }
  }

  private calculateUrgency(completion: number, subject: string): number {
    // Higher urgency for lower completion
    const baseUrgency = Math.max(1, 10 - (completion / 10));
    
    // Adjust based on subject importance for NEET
    const subjectWeights = {
      'Physics': 1.2,
      'Chemistry': 1.1,
      'Botany': 1.0,
      'Zoology': 1.0
    };
    
    const weight = subjectWeights[subject as keyof typeof subjectWeights] || 1.0;
    return Math.min(10, baseUrgency * weight);
  }

  private calculateConsistency(testPerformances: any[]): number {
    if (testPerformances.length < 2) return 5;
    
    const scores = testPerformances.map(t => t.score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(1, Math.min(10, 10 - (standardDeviation / 50)));
  }

  private buildSchedulePrompt(data: SmartScheduleData): string {
    return `
You are an expert NEET preparation advisor with deep knowledge of female biology, Indian culture, and academic scheduling. Create an optimal study schedule considering all biological and cultural factors.

CURRENT CONTEXT:
- Date: ${data.currentDate.toDateString()}
- Menstrual Cycle Phase: ${data.menstrualCyclePhase}
- Energy Level: ${data.energyLevel}/10
- Study Capacity: ${data.studyCapacity}/10

UPCOMING EVENTS:
Festivals: ${data.upcomingFestivals.map(f => `${f.name} (${f.date.toDateString()}) - ${f.impact} impact`).join(', ')}
BSc Exams: ${data.bscExams.map(e => `${e.subject} (${e.date.toDateString()}) - ${e.priority} priority`).join(', ')}

SUBJECT STATUS:
${data.subjectProgress.map(s => `${s.name}: ${s.completion.toFixed(1)}% complete, urgency: ${s.urgency}/10`).join('\n')}

RECENT PERFORMANCE:
- Test Scores: ${data.recentPerformance.testScores.join(', ')} (out of 720)
- Daily Questions: ${data.recentPerformance.questionsSolved}
- Consistency: ${data.recentPerformance.consistency.toFixed(1)}/10

TARGET: AIR under 50 in NEET UG 2026

Create a JSON response with:
{
  "dailySchedule": [
    {
      "timeSlot": "06:00-08:00",
      "subject": "Physics",
      "activity": "Theory/Practice/Revision",
      "duration": 120,
      "intensity": "high|medium|low",
      "reasoning": "Why this subject at this time"
    }
  ],
  "weeklyPlan": {
    "monday": {"focus": "Subject focus", "adjustments": ["adjustment1"]},
    "tuesday": {"focus": "Subject focus", "adjustments": ["adjustment1"]}
  },
  "biologicalOptimizations": ["optimization1", "optimization2"],
  "festivalAdjustments": ["adjustment1", "adjustment2"],
  "bscIntegration": ["integration1", "integration2"],
  "emergencyPlan": "Plan for low energy days"
}

IMPORTANT CONSIDERATIONS:
1. During menstrual phase: Lighter study load, more revision, frequent breaks
2. During follicular/ovulation: Maximum intensity, new concepts, difficult topics
3. During luteal phase: Moderate intensity, practice problems, consolidation
4. Festival days: Reduced study hours, family time, light revision
5. BSc exam periods: Balanced preparation, time management
6. Energy-based scheduling: High energy = difficult subjects, Low energy = revision
7. Circadian rhythms: Morning for theory, evening for practice
8. Weekly patterns: Intensive weekdays, comprehensive revision weekends
`;
  }

  private parseScheduleResponse(response: string, data: SmartScheduleData): SmartSchedule {
    try {
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return {
        dailySchedule: Array.isArray(parsed.dailySchedule) ? parsed.dailySchedule : this.getDefaultDailySchedule(data),
        weeklyPlan: parsed.weeklyPlan || this.getDefaultWeeklyPlan(),
        biologicalOptimizations: Array.isArray(parsed.biologicalOptimizations) ? parsed.biologicalOptimizations : [],
        festivalAdjustments: Array.isArray(parsed.festivalAdjustments) ? parsed.festivalAdjustments : [],
        bscIntegration: Array.isArray(parsed.bscIntegration) ? parsed.bscIntegration : [],
        emergencyPlan: parsed.emergencyPlan || 'Focus on revision and light practice during low energy periods'
      };
    } catch (error) {
      console.error('Failed to parse smart schedule:', error);
      return this.getFallbackSchedule('');
    }
  }

  private getDefaultDailySchedule(data: SmartScheduleData) {
    const intensity: 'high' | 'medium' | 'low' = data.energyLevel >= 7 ? 'high' : data.energyLevel >= 4 ? 'medium' : 'low';
    
    return [
      { timeSlot: '06:00-08:00', subject: 'Physics', activity: 'Theory', duration: 120, intensity, reasoning: 'Morning focus for complex concepts' },
      { timeSlot: '08:30-10:30', subject: 'Chemistry', activity: 'Practice', duration: 120, intensity, reasoning: 'Post-breakfast energy for problem solving' },
      { timeSlot: '11:00-13:00', subject: 'Biology', activity: 'Theory', duration: 120, intensity, reasoning: 'Mid-morning concentration for memorization' },
      { timeSlot: '14:00-16:00', subject: 'Physics', activity: 'Practice', duration: 120, intensity, reasoning: 'Afternoon practice session' },
      { timeSlot: '16:30-18:30', subject: 'Chemistry', activity: 'Revision', duration: 120, intensity, reasoning: 'Evening revision for retention' },
      { timeSlot: '19:00-21:00', subject: 'Biology', activity: 'Practice', duration: 120, intensity, reasoning: 'Evening practice with good lighting' }
    ];
  }

  private getDefaultWeeklyPlan() {
    return {
      monday: { focus: 'Physics intensive', adjustments: ['Extra problem solving'] },
      tuesday: { focus: 'Chemistry intensive', adjustments: ['Organic chemistry focus'] },
      wednesday: { focus: 'Biology intensive', adjustments: ['Diagram practice'] },
      thursday: { focus: 'Mixed practice', adjustments: ['Previous year questions'] },
      friday: { focus: 'Weak areas', adjustments: ['Targeted improvement'] },
      saturday: { focus: 'Mock tests', adjustments: ['Full syllabus test'] },
      sunday: { focus: 'Revision & rest', adjustments: ['Light study, family time'] }
    };
  }

  private getFallbackSchedule(userId: string): SmartSchedule {
    return {
      dailySchedule: this.getDefaultDailySchedule({ energyLevel: 7 } as SmartScheduleData),
      weeklyPlan: this.getDefaultWeeklyPlan(),
      biologicalOptimizations: [
        'Schedule intensive study during high energy phases',
        'Take regular breaks during menstrual phase',
        'Maintain consistent sleep schedule',
        'Stay hydrated and eat nutritious meals'
      ],
      festivalAdjustments: [
        'Reduce study hours during major festivals',
        'Plan light revision during celebration days',
        'Resume normal schedule post-festival'
      ],
      bscIntegration: [
        'Allocate specific hours for BSc preparation',
        'Balance NEET and BSc study time',
        'Use BSc concepts to reinforce NEET topics where applicable'
      ],
      emergencyPlan: 'During low energy periods, focus on revision, light reading, and previous year question analysis. Avoid learning new concepts.'
    };
  }
}

export const smartScheduler = SmartScheduler.getInstance();