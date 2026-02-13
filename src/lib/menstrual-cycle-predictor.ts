export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal'

export type CyclePrediction = {
  currentPhase: CyclePhase
  currentDay: number
  nextPeriodDate: Date
  ovulationDate: Date
  fertilityWindow: { start: Date; end: Date }
  cycleHealth: 'excellent' | 'good' | 'irregular' | 'concerning'
  pregnancyChance: 'very-high' | 'high' | 'moderate' | 'low' | 'very-low'
  studyImpact: {
    energyLevel: number
    focusLevel: number
    memoryRetention: number
    recommendations: string[]
  }
}

export type CycleCalendar = {
  date: Date
  phase: CyclePhase
  day: number
  energyLevel: number
  studyCapacity: number
  pregnancyChance: string
  notes: string
}

export class MenstrualCyclePredictor {
  static predictCurrentCycle(lastPeriodDate: Date, avgCycleLength: number = 28, avgPeriodLength: number = 5): CyclePrediction {
    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentDay = (daysSinceLastPeriod % avgCycleLength) + 1
    
    // Calculate key dates
    const nextPeriodDate = new Date(lastPeriodDate)
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength)
    
    const ovulationDate = new Date(nextPeriodDate)
    ovulationDate.setDate(ovulationDate.getDate() - 14) // 14 days before next period
    
    const fertilityStart = new Date(ovulationDate)
    fertilityStart.setDate(fertilityStart.getDate() - 5)
    const fertilityEnd = new Date(ovulationDate)
    fertilityEnd.setDate(fertilityEnd.getDate() + 1)
    
    // Determine current phase
    const currentPhase = this.determinePhase(currentDay, avgPeriodLength, avgCycleLength)
    
    // Calculate cycle health
    const cycleHealth = this.assessCycleHealth(avgCycleLength, avgPeriodLength)
    
    // Calculate pregnancy chance
    const pregnancyChance = this.calculatePregnancyChance(currentDay, avgCycleLength)
    
    // Calculate study impact
    const studyImpact = this.calculateStudyImpact(currentPhase, currentDay, avgCycleLength)
    
    return {
      currentPhase,
      currentDay,
      nextPeriodDate,
      ovulationDate,
      fertilityWindow: { start: fertilityStart, end: fertilityEnd },
      cycleHealth,
      pregnancyChance,
      studyImpact
    }
  }
  
  static generateCycleCalendar(lastPeriodDate: Date, avgCycleLength: number = 28, avgPeriodLength: number = 5, months: number = 3): CycleCalendar[] {
    const calendar: CycleCalendar[] = []
    const startDate = new Date(lastPeriodDate)
    const totalDays = months * 30
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      const daysSinceLastPeriod = Math.floor((currentDate.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
      const cycleDay = (daysSinceLastPeriod % avgCycleLength) + 1
      const phase = this.determinePhase(cycleDay, avgPeriodLength, avgCycleLength)
      
      calendar.push({
        date: currentDate,
        phase,
        day: cycleDay,
        energyLevel: this.getEnergyLevel(phase, cycleDay),
        studyCapacity: this.getStudyCapacity(phase, cycleDay),
        pregnancyChance: this.getPregnancyChanceText(cycleDay, avgCycleLength),
        notes: this.getPhaseNotes(phase, cycleDay)
      })
    }
    
    return calendar
  }
  
  private static determinePhase(cycleDay: number, periodLength: number, cycleLength: number): CyclePhase {
    if (cycleDay <= periodLength) return 'menstrual'
    if (cycleDay <= 13) return 'follicular'
    if (cycleDay <= 16) return 'ovulation'
    return 'luteal'
  }
  
  private static assessCycleHealth(cycleLength: number, periodLength: number): 'excellent' | 'good' | 'irregular' | 'concerning' {
    if (cycleLength >= 21 && cycleLength <= 35 && periodLength >= 3 && periodLength <= 7) {
      if (cycleLength >= 26 && cycleLength <= 30 && periodLength >= 4 && periodLength <= 6) {
        return 'excellent'
      }
      return 'good'
    }
    if (cycleLength < 21 || cycleLength > 35 || periodLength < 2 || periodLength > 8) {
      return 'concerning'
    }
    return 'irregular'
  }
  
  private static calculatePregnancyChance(cycleDay: number, cycleLength: number): 'very-high' | 'high' | 'moderate' | 'low' | 'very-low' {
    const ovulationDay = cycleLength - 14
    const distanceFromOvulation = Math.abs(cycleDay - ovulationDay)
    
    if (distanceFromOvulation === 0) return 'very-high'
    if (distanceFromOvulation <= 1) return 'high'
    if (distanceFromOvulation <= 3) return 'moderate'
    if (distanceFromOvulation <= 5) return 'low'
    return 'very-low'
  }
  
  private static calculateStudyImpact(phase: CyclePhase, cycleDay: number, cycleLength: number) {
    switch (phase) {
      case 'menstrual':
        return {
          energyLevel: 3,
          focusLevel: 4,
          memoryRetention: 5,
          recommendations: [
            'Light study sessions (2-3 hours max)',
            'Focus on revision and easy topics',
            'Take frequent breaks every 45 minutes',
            'Avoid new difficult concepts',
            'Stay hydrated and rest well'
          ]
        }
      case 'follicular':
        return {
          energyLevel: 8,
          focusLevel: 9,
          memoryRetention: 9,
          recommendations: [
            'Perfect time for learning new concepts',
            'Tackle difficult Physics and Chemistry',
            'Extended study sessions (4-6 hours)',
            'High-intensity problem solving',
            'Memorize formulas and concepts'
          ]
        }
      case 'ovulation':
        return {
          energyLevel: 10,
          focusLevel: 10,
          memoryRetention: 10,
          recommendations: [
            'PEAK PERFORMANCE TIME!',
            'Solve toughest NEET questions',
            'Take full-length mock tests',
            'Marathon study sessions possible',
            'Learn most challenging topics'
          ]
        }
      case 'luteal':
        return {
          energyLevel: 6,
          focusLevel: 7,
          memoryRetention: 7,
          recommendations: [
            'Focus on practice and revision',
            'Consolidate learned concepts',
            'Moderate study sessions (3-4 hours)',
            'Avoid starting new topics',
            'Practice previous year questions'
          ]
        }
    }
  }
  
  private static getEnergyLevel(phase: CyclePhase, cycleDay: number): number {
    switch (phase) {
      case 'menstrual': return Math.max(2, 5 - cycleDay)
      case 'follicular': return Math.min(9, 5 + cycleDay - 5)
      case 'ovulation': return 10
      case 'luteal': return Math.max(5, 9 - (cycleDay - 16))
      default: return 5
    }
  }
  
  private static getStudyCapacity(phase: CyclePhase, cycleDay: number): number {
    switch (phase) {
      case 'menstrual': return Math.max(3, 6 - cycleDay)
      case 'follicular': return Math.min(9, 6 + cycleDay - 5)
      case 'ovulation': return 10
      case 'luteal': return Math.max(6, 9 - (cycleDay - 16) * 0.5)
      default: return 6
    }
  }
  
  private static getPregnancyChanceText(cycleDay: number, cycleLength: number): string {
    const chance = this.calculatePregnancyChance(cycleDay, cycleLength)
    switch (chance) {
      case 'very-high': return 'Very High (90%+)'
      case 'high': return 'High (70-90%)'
      case 'moderate': return 'Moderate (40-70%)'
      case 'low': return 'Low (10-40%)'
      case 'very-low': return 'Very Low (<10%)'
    }
  }
  
  private static getPhaseNotes(phase: CyclePhase, cycleDay: number): string {
    switch (phase) {
      case 'menstrual': return `Day ${cycleDay} of period. Rest and light study.`
      case 'follicular': return `Day ${cycleDay}. High energy phase - perfect for learning!`
      case 'ovulation': return `Day ${cycleDay}. Peak performance time!`
      case 'luteal': return `Day ${cycleDay}. Good for practice and revision.`
    }
  }
}