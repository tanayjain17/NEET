import { prisma } from './prisma';

export interface HealthMetrics {
  sleepQuality: number;
  stressLevel: number;
  energyLevel: number;
  nutritionScore: number;
  exerciseMinutes: number;
  hydrationLevel: number;
}

export interface HealthPrediction {
  tomorrowEnergyLevel: number;
  tomorrowFocusLevel: number;
  studyCapacityPrediction: number;
  healthRisks: string[];
  recommendations: string[];
  nutritionSuggestions: string[];
  exerciseRecommendations: string[];
}

export class HealthPredictionEngine {
  static async predictTomorrowPerformance(userId: string): Promise<HealthPrediction> {
    const recentHealth = await this.getRecentHealthData(userId);
    const sleepData = await this.getRecentSleepData(userId);
    const stressPatterns = await this.getStressPatterns(userId);
    
    const prediction = {
      tomorrowEnergyLevel: this.predictEnergyLevel(recentHealth, sleepData),
      tomorrowFocusLevel: this.predictFocusLevel(recentHealth, stressPatterns),
      studyCapacityPrediction: this.predictStudyCapacity(recentHealth, sleepData, stressPatterns),
      healthRisks: this.identifyHealthRisks(recentHealth, stressPatterns),
      recommendations: this.generateHealthRecommendations(recentHealth, sleepData),
      nutritionSuggestions: this.getNutritionSuggestions(recentHealth),
      exerciseRecommendations: this.getExerciseRecommendations(recentHealth)
    };

    return prediction;
  }

  static async trackNutritionImpact(userId: string, foodIntake: any, studyPerformance: any) {
    // Correlate nutrition with performance
    const correlation = {
      proteinImpact: this.calculateProteinImpact(foodIntake, studyPerformance),
      hydrationImpact: this.calculateHydrationImpact(foodIntake, studyPerformance),
      sugarCrashRisk: this.calculateSugarCrashRisk(foodIntake),
      optimalMealTiming: this.calculateOptimalMealTiming(studyPerformance)
    };

    return correlation;
  }

  static async detectStressEatingPatterns(userId: string): Promise<any> {
    const moodData = await prisma.moodEntry.findMany({
      where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      orderBy: { date: 'desc' }
    });

    const stressEatingPatterns = {
      highStressDays: moodData.filter(m => parseInt(m.mood) <= 3).length,
      eatingTriggers: this.identifyEatingTriggers(moodData),
      healthyAlternatives: this.getHealthyAlternatives(),
      emergencySnacks: this.getEmergencySnacks()
    };

    return stressEatingPatterns;
  }

  private static async getRecentHealthData(userId: string): Promise<HealthMetrics> {
    const recentMood = await prisma.moodEntry.findFirst({
      orderBy: { date: 'desc' }
    });

    const recentCycle = await prisma.menstrualCycle.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const recentSleep = await prisma.sleepData.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    const recentLogs = await prisma.studyMistakeLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 7
    });

    const avgStress = recentLogs.length > 0 
      ? recentLogs.reduce((sum, log) => sum + log.stressLevel, 0) / recentLogs.length
      : (recentMood ? this.moodToStress(parseInt(recentMood.mood)) : 5);

    return {
      sleepQuality: recentSleep?.quality || 7,
      stressLevel: avgStress,
      energyLevel: recentCycle?.energyLevel || 5,
      nutritionScore: 7,
      exerciseMinutes: 30,
      hydrationLevel: 6
    };
  }

  private static async getRecentSleepData(userId: string) {
    const sleepData = await prisma.sleepData.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    return sleepData || {
      duration: 7,
      quality: 7,
      bedTime: new Date(),
      wakeTime: new Date()
    };
  }

  private static async getStressPatterns(userId: string) {
    const recentLogs = await prisma.studyMistakeLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 7
    });

    const avgStress = recentLogs.length > 0 
      ? recentLogs.reduce((sum, log) => sum + log.stressLevel, 0) / recentLogs.length
      : 5;

    return {
      averageStress: avgStress,
      stressTrend: this.calculateStressTrend(recentLogs),
      stressTriggers: this.identifyStressTriggers(recentLogs)
    };
  }

  private static predictEnergyLevel(health: HealthMetrics, sleep: any): number {
    let energyPrediction = 5;
    
    // Sleep impact (40% weight)
    energyPrediction += (sleep.quality - 5) * 0.4;
    energyPrediction += (sleep.duration - 7) * 0.3;
    
    // Stress impact (30% weight)
    energyPrediction -= (health.stressLevel - 5) * 0.3;
    
    // Nutrition impact (20% weight)
    energyPrediction += (health.nutritionScore - 5) * 0.2;
    
    // Exercise impact (10% weight)
    energyPrediction += (health.exerciseMinutes > 20 ? 1 : -0.5) * 0.1;
    
    return Math.max(1, Math.min(10, Math.round(energyPrediction)));
  }

  private static predictFocusLevel(health: HealthMetrics, stress: any): number {
    let focusPrediction = 5;
    
    // Stress is the biggest factor for focus
    focusPrediction -= (stress.averageStress - 5) * 0.5;
    
    // Energy level affects focus
    focusPrediction += (health.energyLevel - 5) * 0.3;
    
    // Hydration affects focus
    focusPrediction += (health.hydrationLevel - 5) * 0.2;
    
    return Math.max(1, Math.min(10, Math.round(focusPrediction)));
  }

  private static predictStudyCapacity(health: HealthMetrics, sleep: any, stress: any): number {
    const energyLevel = this.predictEnergyLevel(health, sleep);
    const focusLevel = this.predictFocusLevel(health, stress);
    
    // Study capacity is combination of energy and focus
    const capacity = (energyLevel * 0.6 + focusLevel * 0.4);
    
    return Math.max(1, Math.min(10, Math.round(capacity)));
  }

  private static identifyHealthRisks(health: HealthMetrics, stress: any): string[] {
    const risks: string[] = [];
    
    if (stress.averageStress > 7) {
      risks.push("🚨 High chronic stress - risk of burnout");
    }
    
    if (health.sleepQuality < 6) {
      risks.push("😴 Poor sleep quality affecting cognitive function");
    }
    
    if (health.energyLevel < 4) {
      risks.push("⚡ Chronic low energy - may need medical check");
    }
    
    if (health.hydrationLevel < 5) {
      risks.push("💧 Dehydration affecting concentration");
    }
    
    if (health.exerciseMinutes < 15) {
      risks.push("🏃♀️ Lack of exercise reducing mental clarity");
    }
    
    return risks;
  }

  private static generateHealthRecommendations(health: HealthMetrics, sleep: any): string[] {
    const recommendations: string[] = [];
    
    if (sleep.duration < 7) {
      recommendations.push("🛏️ Aim for 7-8 hours of sleep for optimal cognitive function");
    }
    
    if (health.stressLevel > 6) {
      recommendations.push("🧘♀️ Practice 10 minutes of meditation before studying");
    }
    
    if (health.hydrationLevel < 7) {
      recommendations.push("💧 Drink water every hour during study sessions");
    }
    
    if (health.exerciseMinutes < 30) {
      recommendations.push("🚶♀️ Take a 15-minute walk between study sessions");
    }
    
    recommendations.push("🌅 Get 10 minutes of morning sunlight for better circadian rhythm");
    
    return recommendations;
  }

  private static getNutritionSuggestions(health: HealthMetrics): string[] {
    return [
      "🥜 Almonds and walnuts for brain power (omega-3)",
      "🫐 Blueberries for memory enhancement",
      "🥬 Green leafy vegetables for sustained energy",
      "🐟 Fish twice a week for cognitive function",
      "🍌 Banana before study for quick energy",
      "🥛 Avoid heavy meals 2 hours before studying",
      "☕ Limit caffeine to morning hours only",
      "🍯 Honey instead of sugar for sustained energy"
    ];
  }

  private static getExerciseRecommendations(health: HealthMetrics): string[] {
    return [
      "🧘♀️ 5-minute yoga stretches between study sessions",
      "🚶♀️ 20-minute evening walk for stress relief",
      "💪 10 push-ups every 2 hours to boost circulation",
      "🤸♀️ Neck and shoulder rolls every hour",
      "🏃♀️ 15-minute morning jog 3x per week",
      "🧘 Deep breathing exercises during breaks",
      "💃 Dance to favorite song for 5 minutes daily"
    ];
  }

  private static moodToStress(mood: number): number {
    // Convert mood (1-10) to stress level (1-10, inverted)
    return 11 - mood;
  }

  private static calculateStressTrend(logs: any[]): 'increasing' | 'decreasing' | 'stable' {
    if (logs.length < 3) return 'stable';
    
    const recent = logs.slice(0, 3).reduce((sum, log) => sum + log.stressLevel, 0) / 3;
    const older = logs.slice(3, 6).reduce((sum, log) => sum + log.stressLevel, 0) / 3;
    
    if (recent > older + 1) return 'increasing';
    if (recent < older - 1) return 'decreasing';
    return 'stable';
  }

  private static identifyStressTriggers(logs: any[]): string[] {
    const triggers: string[] = [];
    
    const highStressLogs = logs.filter(log => log.stressLevel > 7);
    
    if (highStressLogs.some(log => log.sessionType === 'test')) {
      triggers.push("Test anxiety");
    }
    
    if (highStressLogs.some(log => log.timeWasted > 60)) {
      triggers.push("Time management issues");
    }
    
    return triggers;
  }

  private static identifyEatingTriggers(moodData: any[]): string[] {
    const triggers: string[] = [];
    
    const lowMoodDays = moodData.filter(m => parseInt(m.mood) <= 4);
    
    if (lowMoodDays.length > 5) {
      triggers.push("Stress eating during low mood days");
      triggers.push("Emotional eating patterns detected");
    }
    
    return triggers;
  }

  private static getHealthyAlternatives(): string[] {
    return [
      "🥕 Carrot sticks with hummus instead of chips",
      "🍎 Apple slices with peanut butter for sweet cravings",
      "🥤 Herbal tea instead of sugary drinks",
      "🍇 Grapes for quick energy instead of candy",
      "🥨 Whole grain crackers instead of cookies"
    ];
  }

  private static getEmergencySnacks(): string[] {
    return [
      "🥜 Mixed nuts (portion controlled)",
      "🍌 Banana with a glass of milk",
      "🥛 Greek yogurt with berries",
      "🍯 Whole grain toast with honey",
      "🥤 Green smoothie with spinach and fruits"
    ];
  }

  private static calculateProteinImpact(food: any, performance: any): number {
    // Placeholder - would analyze protein intake vs performance
    return 0.7; // 70% positive correlation
  }

  private static calculateHydrationImpact(food: any, performance: any): number {
    // Placeholder - would analyze hydration vs performance
    return 0.8; // 80% positive correlation
  }

  private static calculateSugarCrashRisk(food: any): number {
    // Placeholder - would analyze sugar intake patterns
    return 0.3; // 30% risk
  }

  private static calculateOptimalMealTiming(performance: any): string[] {
    return [
      "🌅 Light breakfast 1 hour before morning study",
      "🥗 Balanced lunch with protein and complex carbs",
      "🍎 Healthy snack 2 hours before evening study",
      "🥛 Avoid heavy dinner if studying late"
    ];
  }
}