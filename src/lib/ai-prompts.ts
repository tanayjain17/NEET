// Types for AI analysis data
export interface StudyPatternData {
  subjects: {
    name: string;
    completionPercentage: number;
    totalQuestions: number;
    chapters: {
      name: string;
      lectureProgress: number;
      dppProgress: number;
      revisionScore: number;
      questionsCompleted: number;
    }[];
  }[];
  testPerformances: {
    testType: string;
    score: number;
    maxScore: number;
    date: string;
  }[];
  questionAnalytics: {
    dailyAverage: number;
    weeklyTotal: number;
    monthlyTotal: number;
    lifetimeTotal: number;
  };
  moodData: {
    averageMood: number; // 1-3 scale (sad=1, neutral=2, happy=3)
    moodTrend: 'improving' | 'declining' | 'stable';
    recentMoods: number[];
  };
  timeToExam: {
    days: number;
    weeks: number;
    months: number;
  };
}

// Prompt templates for different types of analysis
export class AIPrompts {
  static generateStudyInsights(data: StudyPatternData): string {
    return `
You are an AI study coach for NEET (medical entrance exam) preparation. Analyze the following student data and provide actionable insights and recommendations.

STUDENT DATA:
${JSON.stringify(data, null, 2)}

CONTEXT:
- NEET exam is on May 3rd, 2026, 2:00 PM IST (${data.timeToExam.days} days remaining)
- Target: 600+ marks out of 720 for good medical colleges
- Subjects: Physics, Chemistry, Botany, Zoology (180 marks each)
- Daily question target: 250-300 questions for consistent progress

ANALYSIS REQUIREMENTS:
1. Overall Progress Assessment (2-3 sentences)
2. Subject-wise Strengths and Weaknesses (identify top 2 strengths, top 2 areas needing attention)
3. Study Pattern Analysis (consistency, question-solving volume, revision quality)
4. Performance Trends (based on test scores and mood data)
5. Actionable Recommendations (3-4 specific, time-bound suggestions)
6. Motivational Message (encouraging but realistic)

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

FORMAT YOUR RESPONSE AS JSON:
{
  "overallAssessment": "string",
  "subjectAnalysis": {
    "strengths": ["subject1", "subject2"],
    "weaknesses": ["subject1", "subject2"],
    "details": "string"
  },
  "studyPatterns": {
    "consistency": "high|medium|low",
    "questionVolume": "above_target|on_target|below_target",
    "revisionQuality": "excellent|good|needs_improvement",
    "insights": "string"
  },
  "performanceTrends": {
    "testTrend": "improving|stable|declining",
    "moodTrend": "${data.moodData.moodTrend}",
    "correlation": "string"
  },
  "recommendations": [
    {
      "priority": "high|medium|low",
      "action": "string",
      "timeframe": "string",
      "expectedImpact": "string"
    }
  ],
  "motivationalMessage": "string"
}

Keep responses concise, actionable, and motivating. Focus on specific improvements rather than generic advice.
`;
  }

  static generateOptimalSchedule(data: StudyPatternData): string {
    return `
You are an AI study planner for NEET preparation. Create an optimal daily study schedule based on the student's current progress and performance patterns.

STUDENT DATA:
${JSON.stringify(data, null, 2)}

CONSTRAINTS:
- Study time: 8-10 hours per day
- Break time: 15 minutes every 2 hours
- Revision time: 2-3 hours daily
- Question practice: 250-300 questions daily
- Test analysis: 1 hour after each test

SCHEDULE REQUIREMENTS:
1. Prioritize weaker subjects while maintaining stronger ones
2. Balance theory, practice, and revision
3. Include buffer time for difficult topics
4. Consider mood patterns for optimal timing
5. Account for ${data.timeToExam.days} days remaining

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

FORMAT YOUR RESPONSE AS JSON:
{
  "dailySchedule": [
    {
      "timeSlot": "HH:MM - HH:MM",
      "activity": "string",
      "subject": "string",
      "focus": "theory|practice|revision|test",
      "duration": "number (minutes)"
    }
  ],
  "weeklyFocus": {
    "monday": "subject focus",
    "tuesday": "subject focus",
    "wednesday": "subject focus",
    "thursday": "subject focus",
    "friday": "subject focus",
    "saturday": "revision/practice",
    "sunday": "test/analysis"
  },
  "priorityAdjustments": [
    {
      "subject": "string",
      "reason": "string",
      "adjustment": "string"
    }
  ],
  "tips": [
    "string"
  ]
}

Create a realistic, sustainable schedule that addresses the student's specific weaknesses while maintaining overall progress.
`;
  }

  static generateMotivationalBoost(data: StudyPatternData): string {
    return `
You are a motivational coach for NEET aspirants. The student needs encouragement and specific praise based on their recent achievements.

RECENT ACHIEVEMENTS:
- Daily questions: ${data.questionAnalytics.dailyAverage}
- Weekly progress: ${data.questionAnalytics.weeklyTotal} questions
- Recent test performance: ${data.testPerformances.slice(-3).map(t => `${t.score}/${t.maxScore}`).join(', ')}
- Mood trend: ${data.moodData.moodTrend}
- Days to exam: ${data.timeToExam.days}

Generate a personalized motivational message that:
1. Acknowledges specific achievements
2. Puts progress in perspective of the goal
3. Provides encouragement for challenges
4. Includes a powerful closing statement

Keep it under 150 words, energetic, and specific to their data.
`;
  }

  static generateWeakAreaFocus(data: StudyPatternData): string {
    const weakSubjects = data.subjects
      .filter(s => s.completionPercentage < 75)
      .sort((a, b) => a.completionPercentage - b.completionPercentage);

    const weakChapters = data.subjects
      .flatMap(s => s.chapters.map(c => ({ ...c, subject: s.name })))
      .filter(c => c.lectureProgress < 75 || c.revisionScore < 6)
      .sort((a, b) => (a.lectureProgress + a.revisionScore) - (b.lectureProgress + b.revisionScore));

    return `
You are a NEET study strategist. Analyze the student's weak areas and create a focused improvement plan.

WEAK SUBJECTS: ${weakSubjects.map(s => `${s.name} (${s.completionPercentage}%)`).join(', ')}
WEAK CHAPTERS: ${weakChapters.slice(0, 5).map(c => `${c.subject}-${c.name} (${c.lectureProgress}% lectures, revision: ${c.revisionScore}/10)`).join(', ')}

TIME REMAINING: ${data.timeToExam.days} days

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

Create a focused improvement plan as JSON:
{
  "urgentActions": [
    {
      "subject": "string",
      "chapter": "string",
      "issue": "low_completion|poor_revision|insufficient_practice",
      "action": "string",
      "timeRequired": "string",
      "priority": 1-5
    }
  ],
  "weeklyTargets": {
    "lectureCompletion": "number",
    "questionsToSolve": "number",
    "chaptersToRevise": "number"
  },
  "recoveryStrategy": "string",
  "riskAssessment": "low|medium|high"
}

Focus on the most critical gaps that can be addressed in the remaining time.
`;
  }
}