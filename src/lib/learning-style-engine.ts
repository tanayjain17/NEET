import { prisma } from './prisma';

export interface LearningPattern {
  visualPreference: number; // 0-100
  auditoryPreference: number;
  kinestheticPreference: number;
  readingPreference: number;
  optimalSessionLength: number; // minutes
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  attentionSpan: number; // minutes
  breakFrequency: number; // minutes between breaks
}

export interface StudyRecommendation {
  technique: string;
  description: string;
  duration: number;
  effectiveness: number;
  personalizedReason: string;
}

export class LearningStyleEngine {
  static async analyzeLearningPattern(userId: string): Promise<LearningPattern> {
    const studySessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const pomodoroSessions = await prisma.pomodoroSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    // Get real daily goals data for analysis
    const dailyGoals = await prisma.dailyGoal.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    return {
      visualPreference: this.calculateVisualPreference(studySessions),
      auditoryPreference: this.calculateAuditoryPreference(studySessions),
      kinestheticPreference: this.calculateKinestheticPreference(studySessions),
      readingPreference: this.calculateReadingPreference(studySessions),
      optimalSessionLength: this.calculateOptimalSessionLength(studySessions, pomodoroSessions),
      bestTimeOfDay: this.calculateBestTimeOfDay(studySessions),
      attentionSpan: this.calculateAttentionSpan(pomodoroSessions),
      breakFrequency: this.calculateBreakFrequency(pomodoroSessions)
    };
  }

  static async getPersonalizedRecommendations(userId: string, subject: string, energyLevel: number): Promise<StudyRecommendation[]> {
    const pattern = await this.analyzeLearningPattern(userId);
    
    // Get real subject progress for personalized recommendations
    const subjectData = await prisma.subject.findFirst({
      where: { name: subject },
      include: { chapters: true }
    });
    
    const recommendations: StudyRecommendation[] = [];

    // Visual learner recommendations
    if (pattern.visualPreference > 60) {
      recommendations.push({
        technique: "Mind Mapping",
        description: "Create colorful mind maps for complex topics",
        duration: 30,
        effectiveness: pattern.visualPreference,
        personalizedReason: "Your brain processes visual information exceptionally well!"
      });

      recommendations.push({
        technique: "Diagram Drawing",
        description: "Draw and label biological processes or chemical reactions",
        duration: 25,
        effectiveness: pattern.visualPreference - 10,
        personalizedReason: "Visual representation helps you remember better"
      });
    }

    // Auditory learner recommendations
    if (pattern.auditoryPreference > 60) {
      recommendations.push({
        technique: "Self-Explanation",
        description: "Explain concepts aloud to yourself",
        duration: 20,
        effectiveness: pattern.auditoryPreference,
        personalizedReason: "You learn best when you hear information!"
      });

      recommendations.push({
        technique: "Audio Notes",
        description: "Record yourself explaining key concepts",
        duration: 15,
        effectiveness: pattern.auditoryPreference - 5,
        personalizedReason: "Your auditory processing is your strength"
      });
    }

    // Kinesthetic learner recommendations
    if (pattern.kinestheticPreference > 60) {
      recommendations.push({
        technique: "Active Practice",
        description: "Solve problems while walking or standing",
        duration: 35,
        effectiveness: pattern.kinestheticPreference,
        personalizedReason: "Movement enhances your learning!"
      });

      recommendations.push({
        technique: "Hands-on Models",
        description: "Use physical models for 3D molecular structures",
        duration: 40,
        effectiveness: pattern.kinestheticPreference - 5,
        personalizedReason: "You understand better through touch and movement"
      });
    }

    // Reading/Writing learner recommendations
    if (pattern.readingPreference > 60) {
      recommendations.push({
        technique: "Detailed Notes",
        description: "Write comprehensive notes with examples",
        duration: 45,
        effectiveness: pattern.readingPreference,
        personalizedReason: "Writing helps solidify your understanding!"
      });

      recommendations.push({
        technique: "Summary Creation",
        description: "Create chapter summaries in your own words",
        duration: 30,
        effectiveness: pattern.readingPreference - 10,
        personalizedReason: "Text-based learning is your forte"
      });
    }

    // Energy-based adjustments
    if (energyLevel < 5) {
      recommendations.forEach(rec => {
        rec.duration = Math.max(15, rec.duration - 10);
        rec.description += " (Shortened for low energy)";
      });
    }

    return recommendations.sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 3);
  }

  static async getOptimalStudySchedule(userId: string, availableHours: number): Promise<any> {
    const pattern = await this.analyzeLearningPattern(userId);
    
    const schedule = {
      sessionLength: pattern.optimalSessionLength,
      breakLength: Math.ceil(pattern.optimalSessionLength / 5),
      totalSessions: Math.floor((availableHours * 60) / (pattern.optimalSessionLength + pattern.breakFrequency)),
      bestStartTime: this.getOptimalStartTime(pattern.bestTimeOfDay),
      personalizedTips: this.getPersonalizedTips(pattern)
    };

    return schedule;
  }

  private static calculateVisualPreference(sessions: any[]): number {
    // Analyze session notes for visual keywords
    let visualScore = 50; // baseline
    
    sessions.forEach(session => {
      if (session.notes) {
        const visualKeywords = ['diagram', 'chart', 'visual', 'color', 'highlight', 'draw'];
        const matches = visualKeywords.filter(keyword => 
          session.notes.toLowerCase().includes(keyword)
        ).length;
        visualScore += matches * 5;
      }
      
      // Higher focus scores in visual subjects indicate visual preference
      if (['Physics', 'Chemistry'].includes(session.subject) && session.focusScore > 7) {
        visualScore += 2;
      }
    });

    return Math.min(100, visualScore);
  }

  private static calculateAuditoryPreference(sessions: any[]): number {
    let auditoryScore = 50;
    
    sessions.forEach(session => {
      if (session.notes) {
        const auditoryKeywords = ['explain', 'discuss', 'repeat', 'audio', 'listen', 'verbal'];
        const matches = auditoryKeywords.filter(keyword => 
          session.notes.toLowerCase().includes(keyword)
        ).length;
        auditoryScore += matches * 5;
      }
    });

    return Math.min(100, auditoryScore);
  }

  private static calculateKinestheticPreference(sessions: any[]): number {
    let kinestheticScore = 50;
    
    sessions.forEach(session => {
      if (session.notes) {
        const kinestheticKeywords = ['practice', 'hands-on', 'experiment', 'build', 'move', 'active'];
        const matches = kinestheticKeywords.filter(keyword => 
          session.notes.toLowerCase().includes(keyword)
        ).length;
        kinestheticScore += matches * 5;
      }
      
      // Shorter sessions with high productivity indicate kinesthetic preference
      if (session.duration < 60 && session.productivity > 7) {
        kinestheticScore += 3;
      }
    });

    return Math.min(100, kinestheticScore);
  }

  private static calculateReadingPreference(sessions: any[]): number {
    let readingScore = 50;
    
    sessions.forEach(session => {
      if (session.notes) {
        const readingKeywords = ['read', 'notes', 'text', 'write', 'summary', 'list'];
        const matches = readingKeywords.filter(keyword => 
          session.notes.toLowerCase().includes(keyword)
        ).length;
        readingScore += matches * 5;
      }
      
      // Longer sessions with good focus indicate reading preference
      if (session.duration > 90 && session.focusScore > 6) {
        readingScore += 2;
      }
    });

    return Math.min(100, readingScore);
  }

  private static calculateOptimalSessionLength(studySessions: any[], pomodoroSessions: any[]): number {
    if (pomodoroSessions.length > 0) {
      const completedSessions = pomodoroSessions.filter(s => s.completed);
      if (completedSessions.length > 0) {
        const avgDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length;
        return Math.round(avgDuration);
      }
    }

    if (studySessions.length > 0) {
      const avgDuration = studySessions.reduce((sum, s) => sum + s.duration, 0) / studySessions.length;
      return Math.round(Math.min(120, Math.max(25, avgDuration)));
    }

    return 45; // default
  }

  private static calculateBestTimeOfDay(sessions: any[]): 'morning' | 'afternoon' | 'evening' | 'night' {
    const timeScores = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      let timeOfDay: keyof typeof timeScores;
      
      if (hour >= 5 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
      else timeOfDay = 'night';
      
      timeScores[timeOfDay] += session.focusScore * session.productivity;
    });

    return Object.entries(timeScores).reduce((a, b) => timeScores[a[0] as keyof typeof timeScores] > timeScores[b[0] as keyof typeof timeScores] ? a : b)[0] as 'morning' | 'afternoon' | 'evening' | 'night';
  }

  private static calculateAttentionSpan(pomodoroSessions: any[]): number {
    if (pomodoroSessions.length === 0) return 25;
    
    const completedSessions = pomodoroSessions.filter(s => s.completed && !s.interrupted);
    if (completedSessions.length === 0) return 25;
    
    return Math.round(completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length);
  }

  private static calculateBreakFrequency(pomodoroSessions: any[]): number {
    if (pomodoroSessions.length === 0) return 5;
    
    return Math.round(pomodoroSessions.reduce((sum, s) => sum + s.breakDuration, 0) / pomodoroSessions.length);
  }

  private static getOptimalStartTime(bestTimeOfDay: string): string {
    const times = {
      morning: '06:00',
      afternoon: '14:00',
      evening: '18:00',
      night: '21:00'
    };
    return times[bestTimeOfDay as keyof typeof times] || '06:00';
  }

  private static getPersonalizedTips(pattern: LearningPattern): string[] {
    const tips: string[] = [];
    
    if (pattern.visualPreference > 60) {
      tips.push("🎨 Use colors and diagrams - your visual brain loves them!");
    }
    
    if (pattern.auditoryPreference > 60) {
      tips.push("🗣️ Explain concepts aloud - you learn through hearing!");
    }
    
    if (pattern.kinestheticPreference > 60) {
      tips.push("🚶‍♀️ Study while moving - your body helps your brain!");
    }
    
    if (pattern.readingPreference > 60) {
      tips.push("📝 Take detailed notes - writing reinforces your learning!");
    }
    
    tips.push(`⏰ Your optimal session length is ${pattern.optimalSessionLength} minutes`);
    tips.push(`🌟 You focus best during ${pattern.bestTimeOfDay} hours`);
    
    return tips;
  }
}