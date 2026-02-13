import { prisma } from './prisma'

export type SleepData = {
  id: string
  date: string
  bedTime: string
  sleepTime: string
  wakeTime: string
  duration: number
  quality: number
  remSleep: number
  deepSleep: number
}

export type SleepInsights = {
  averageQuality: number
  optimalBedtime: string
  optimalWakeTime: string
  sleepDebt: number
  circadianAlignment: number
  studyPerformanceCorrelation: number
  recommendations: string[]
}

export class SleepOptimization {
  static async recordSleep(userId: string, sleepData: Omit<SleepData, 'id'>): Promise<SleepData> {
    const bedTime = new Date(`${sleepData.date}T${sleepData.bedTime}:00`)
    const sleepTime = new Date(`${sleepData.date}T${sleepData.sleepTime}:00`)
    let wakeTime = new Date(`${sleepData.date}T${sleepData.wakeTime}:00`)
    
    // Handle wake time next day
    if (wakeTime < sleepTime) {
      wakeTime.setDate(wakeTime.getDate() + 1)
    }

    const duration = (wakeTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60)

    const sleep = await prisma.sleepData.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(sleepData.date)
        }
      },
      update: {
        bedTime,
        sleepTime,
        wakeTime,
        duration,
        quality: sleepData.quality,
        remSleep: sleepData.remSleep,
        deepSleep: sleepData.deepSleep,
        updatedAt: new Date()
      },
      create: {
        userId,
        date: new Date(sleepData.date),
        bedTime,
        sleepTime,
        wakeTime,
        duration,
        quality: sleepData.quality,
        remSleep: sleepData.remSleep,
        deepSleep: sleepData.deepSleep
      }
    })

    return this.mapToSleepData(sleep)
  }

  static async getSleepInsights(userId: string, days: number = 30): Promise<SleepInsights> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const [sleepRecords, studySessions] = await Promise.all([
      prisma.sleepData.findMany({
        where: {
          userId,
          date: { gte: cutoffDate }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: { gte: cutoffDate }
        }
      })
    ])

    if (sleepRecords.length === 0) {
      return {
        averageQuality: 0,
        optimalBedtime: '22:00',
        optimalWakeTime: '06:00',
        sleepDebt: 0,
        circadianAlignment: 0,
        studyPerformanceCorrelation: 0,
        recommendations: ['Start tracking your sleep to get personalized insights']
      }
    }

    const averageQuality = sleepRecords.reduce((sum, record) => sum + record.quality, 0) / sleepRecords.length
    const averageDuration = sleepRecords.reduce((sum, record) => sum + record.duration, 0) / sleepRecords.length
    
    // Calculate optimal sleep times
    const qualitySleepRecords = sleepRecords.filter(record => record.quality >= 7)
    const optimalBedtime = this.calculateOptimalTime(qualitySleepRecords, 'bedTime')
    const optimalWakeTime = this.calculateOptimalTime(qualitySleepRecords, 'wakeTime')

    // Calculate sleep debt (assuming 8 hours is optimal)
    const sleepDebt = Math.max(0, (8 - averageDuration) * sleepRecords.length)

    // Calculate circadian alignment (consistency of sleep/wake times)
    const circadianAlignment = this.calculateCircadianAlignment(sleepRecords)

    // Correlate sleep with study performance
    const studyPerformanceCorrelation = this.calculateSleepStudyCorrelation(sleepRecords, studySessions)

    const recommendations = this.generateSleepRecommendations({
      averageQuality,
      averageDuration,
      sleepDebt,
      circadianAlignment,
      studyPerformanceCorrelation
    })

    return {
      averageQuality,
      optimalBedtime,
      optimalWakeTime,
      sleepDebt,
      circadianAlignment,
      studyPerformanceCorrelation,
      recommendations
    }
  }

  private static calculateOptimalTime(records: any[], timeField: string): string {
    if (records.length === 0) return timeField === 'bedTime' ? '22:00' : '06:00'

    const times = records.map(record => {
      const time = new Date(record[timeField])
      return time.getHours() * 60 + time.getMinutes()
    })

    const averageMinutes = times.reduce((sum, time) => sum + time, 0) / times.length
    const hours = Math.floor(averageMinutes / 60)
    const minutes = Math.round(averageMinutes % 60)

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  private static calculateCircadianAlignment(records: any[]): number {
    if (records.length < 7) return 0

    const bedTimeVariance = this.calculateTimeVariance(records, 'bedTime')
    const wakeTimeVariance = this.calculateTimeVariance(records, 'wakeTime')
    
    // Lower variance = better alignment (scale 0-100)
    const alignment = Math.max(0, 100 - (bedTimeVariance + wakeTimeVariance) / 2)
    return Math.round(alignment)
  }

  private static calculateTimeVariance(records: any[], timeField: string): number {
    const times = records.map(record => {
      const time = new Date(record[timeField])
      return time.getHours() * 60 + time.getMinutes()
    })

    const mean = times.reduce((sum, time) => sum + time, 0) / times.length
    const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length
    
    return Math.sqrt(variance) / 60 // Convert to hours
  }

  private static calculateSleepStudyCorrelation(sleepRecords: any[], studySessions: any[]): number {
    if (sleepRecords.length === 0 || studySessions.length === 0) return 0

    // Group study sessions by date
    const dailyPerformance = new Map<string, number>()
    
    studySessions.forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0]
      const performance = session.questionsAttempted > 0 
        ? (session.questionsCorrect / session.questionsAttempted) * session.focusScore
        : 0

      const existing = dailyPerformance.get(date) || 0
      dailyPerformance.set(date, existing + performance)
    })

    // Correlate with sleep quality
    let correlationSum = 0
    let correlationCount = 0

    sleepRecords.forEach(sleep => {
      const date = new Date(sleep.date).toISOString().split('T')[0]
      const nextDate = new Date(sleep.date)
      nextDate.setDate(nextDate.getDate() + 1)
      const nextDateStr = nextDate.toISOString().split('T')[0]

      const performance = dailyPerformance.get(nextDateStr)
      if (performance !== undefined) {
        correlationSum += (sleep.quality / 10) * (performance / 100)
        correlationCount++
      }
    })

    return correlationCount > 0 ? (correlationSum / correlationCount) * 100 : 0
  }

  private static generateSleepRecommendations(metrics: any): string[] {
    const recommendations: string[] = []

    if (metrics.averageQuality < 6) {
      recommendations.push('Focus on improving sleep quality - consider sleep hygiene practices')
    }

    if (metrics.averageDuration < 7) {
      recommendations.push('Increase sleep duration - aim for 7-9 hours per night')
    }

    if (metrics.sleepDebt > 10) {
      recommendations.push('Address sleep debt - consider weekend recovery sleep')
    }

    if (metrics.circadianAlignment < 70) {
      recommendations.push('Maintain consistent sleep/wake times to improve circadian rhythm')
    }

    if (metrics.studyPerformanceCorrelation < 50) {
      recommendations.push('Better sleep quality could significantly improve study performance')
    }

    if (recommendations.length === 0) {
      recommendations.push('Great sleep habits! Continue maintaining your current routine')
    }

    return recommendations
  }

  static async getSleepTrends(userId: string, days: number = 30): Promise<{
    qualityTrend: { date: string; quality: number }[]
    durationTrend: { date: string; duration: number }[]
    consistencyScore: number
  }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const sleepRecords = await prisma.sleepData.findMany({
      where: {
        userId,
        date: { gte: cutoffDate }
      },
      orderBy: { date: 'asc' }
    })

    const qualityTrend = sleepRecords.map(record => ({
      date: new Date(record.date).toISOString().split('T')[0],
      quality: record.quality
    }))

    const durationTrend = sleepRecords.map(record => ({
      date: new Date(record.date).toISOString().split('T')[0],
      duration: record.duration
    }))

    const consistencyScore = this.calculateCircadianAlignment(sleepRecords)

    return {
      qualityTrend,
      durationTrend,
      consistencyScore
    }
  }

  private static mapToSleepData(sleep: any): SleepData {
    return {
      id: sleep.id,
      date: new Date(sleep.date).toISOString().split('T')[0],
      bedTime: new Date(sleep.bedTime).toTimeString().slice(0, 5),
      sleepTime: new Date(sleep.sleepTime).toTimeString().slice(0, 5),
      wakeTime: new Date(sleep.wakeTime).toTimeString().slice(0, 5),
      duration: sleep.duration,
      quality: sleep.quality,
      remSleep: sleep.remSleep,
      deepSleep: sleep.deepSleep
    }
  }
}