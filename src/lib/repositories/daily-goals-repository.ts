import { prisma } from '../prisma'
import { DailyGoal } from '@prisma/client'

// --- Professional Data Types ---

export type ClinicalDailyMetrics = {
  userId: string
  date: Date
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
  physicsDpp: number
  chemistryDpp: number
  botanyDpp: number
  zoologyDpp: number
  physicsRevision: number
  chemistryRevision: number
  botanyRevision: number
  zoologyRevision: number
}

export type VolumeAudit = {
  totalInterventions: number // Total Questions
  auxiliaryVolume: number    // DPPs
  revisionHours: number
  subjectDistribution: {
    physics: SubjectLoad
    chemistry: SubjectLoad
    botany: SubjectLoad
    zoology: SubjectLoad
  }
  statusIndicator: 'CRITICAL' | 'MODERATE' | 'OPTIMAL' | 'ELITE'
  clinicalBriefing: string
}

type SubjectLoad = {
  primary: number // Questions
  auxiliary: number // DPP
  revision: number
}

export type CumulativeVolumeMetrics = {
  daily: number
  weekly: number
  monthly: number
  lifetime: number
  weeklyTarget: number
  monthlyTarget: number
  dailyTargetMet: boolean
  weeklyVelocity: number // % of target
  monthlyVelocity: number // % of target
}

export class DailyVolumeRepository {
  
  /**
   * Sync daily clinical volume metrics (Upsert Protocol)
   */
  static async syncVolumeMetrics(data: ClinicalDailyMetrics): Promise<DailyGoal> {
    const totalQuestions = data.physicsQuestions + data.chemistryQuestions + 
                           data.botanyQuestions + data.zoologyQuestions

    return await prisma.dailyGoal.upsert({
      where: {
        userId_date: {
          userId: data.userId,
          date: data.date
        }
      },
      update: {
        ...this.mapMetricsToSchema(data),
        totalQuestions,
        updatedAt: new Date()
      },
      create: {
        ...this.mapMetricsToSchema(data),
        userId: data.userId,
        date: data.date,
        totalQuestions
      }
    })
  }

  /**
   * Retrieve specific date metrics
   */
  static async getByDate(userId: string, date: Date): Promise<DailyGoal | null> {
    const start = new Date(date); start.setHours(0,0,0,0);
    const end = new Date(date); end.setHours(23,59,59,999);

    return await prisma.dailyGoal.findFirst({
      where: {
        userId,
        date: { gte: start, lte: end }
      }
    })
  }

  /**
   * Get today's active protocol (IST Normalized)
   */
  static async getActiveProtocol(userId: string): Promise<DailyGoal> {
    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const today = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate())
    
    // Auto-initialize if missing
    return await prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date: today } },
      update: {},
      create: {
        userId,
        date: today,
        // ...Initialize all fields to 0 (Implicit in Prisma defaults usually, but explicit here for safety)
        physicsQuestions: 0, chemistryQuestions: 0, botanyQuestions: 0, zoologyQuestions: 0,
        physicsDpp: 0, chemistryDpp: 0, botanyDpp: 0, zoologyDpp: 0,
        physicsRevision: 0, chemistryRevision: 0, botanyRevision: 0, zoologyRevision: 0,
        totalQuestions: 0
      }
    })
  }

  /**
   * Generate Daily Volume Audit
   */
  static async getVolumeAudit(userId: string, date: Date): Promise<VolumeAudit> {
    const istDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const record = await this.getByDate(userId, istDate)
    
    if (!record) {
      return this.getEmptyAudit()
    }

    const totalQuestions = record.totalQuestions
    const totalDpp = record.physicsDpp + record.chemistryDpp + record.botanyDpp + record.zoologyDpp
    const totalRevision = record.physicsRevision + record.chemistryRevision + record.botanyRevision + record.zoologyRevision

    // Clinical Thresholds
    let status: VolumeAudit['statusIndicator'] = 'CRITICAL'
    let briefing = 'Volume deficit detected. Immediate intervention required.'

    if (totalQuestions >= 400) {
      status = 'ELITE'
      briefing = 'Exceptional volume. Neural saturation maximal. Maintain rhythm.'
    } else if (totalQuestions >= 250) {
      status = 'OPTIMAL'
      briefing = 'Target volume achieved. Standard protocol adherence verified.'
    } else if (totalQuestions >= 100) {
      status = 'MODERATE'
      briefing = 'Sub-optimal volume. Escalate output to meet competitive benchmarks.'
    }

    return {
      totalInterventions: totalQuestions,
      auxiliaryVolume: totalDpp,
      revisionHours: totalRevision,
      subjectDistribution: {
        physics: { primary: record.physicsQuestions, auxiliary: record.physicsDpp, revision: record.physicsRevision },
        chemistry: { primary: record.chemistryQuestions, auxiliary: record.chemistryDpp, revision: record.chemistryRevision },
        botany: { primary: record.botanyQuestions, auxiliary: record.botanyDpp, revision: record.botanyRevision },
        zoology: { primary: record.zoologyQuestions, auxiliary: record.zoologyDpp, revision: record.zoologyRevision }
      },
      statusIndicator: status,
      clinicalBriefing: briefing
    }
  }

  /**
   * Get Cumulative Volume Metrics
   */
  static async getCumulativeMetrics(userId: string): Promise<CumulativeVolumeMetrics> {
    const today = new Date()
    const weekStart = new Date(today); weekStart.setDate(today.getDate() - 7);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [dailyRecord, weeklyRecords, monthlyRecords, allRecords] = await Promise.all([
      this.getActiveProtocol(userId),
      prisma.dailyGoal.findMany({ where: { userId, date: { gte: weekStart } } }),
      prisma.dailyGoal.findMany({ where: { userId, date: { gte: monthStart } } }),
      prisma.dailyGoal.findMany({ where: { userId } })
    ])

    const daily = dailyRecord.totalQuestions
    const weekly = weeklyRecords.reduce((sum, r) => sum + r.totalQuestions, 0)
    const monthly = monthlyRecords.reduce((sum, r) => sum + r.totalQuestions, 0)
    const lifetime = allRecords.reduce((sum, r) => sum + r.totalQuestions, 0)

    // Targets based on AIIMS Delhi benchmarks
    const WEEKLY_TARGET = 2100 // 300/day
    const MONTHLY_TARGET = 9000

    return {
      daily,
      weekly,
      monthly,
      lifetime,
      weeklyTarget: WEEKLY_TARGET,
      monthlyTarget: MONTHLY_TARGET,
      dailyTargetMet: daily >= 300,
      weeklyVelocity: Math.min(100, Math.round((weekly / WEEKLY_TARGET) * 100)),
      monthlyVelocity: Math.min(100, Math.round((monthly / MONTHLY_TARGET) * 100))
    }
  }

  // --- Helpers ---

  private static mapMetricsToSchema(data: ClinicalDailyMetrics) {
    return {
      physicsQuestions: data.physicsQuestions,
      chemistryQuestions: data.chemistryQuestions,
      botanyQuestions: data.botanyQuestions,
      zoologyQuestions: data.zoologyQuestions,
      physicsDpp: data.physicsDpp,
      chemistryDpp: data.chemistryDpp,
      botanyDpp: data.botanyDpp,
      zoologyDpp: data.zoologyDpp,
      physicsRevision: data.physicsRevision,
      chemistryRevision: data.chemistryRevision,
      botanyRevision: data.botanyRevision,
      zoologyRevision: data.zoologyRevision,
    }
  }

  private static getEmptyAudit(): VolumeAudit {
    return {
      totalInterventions: 0,
      auxiliaryVolume: 0,
      revisionHours: 0,
      subjectDistribution: {
        physics: { primary: 0, auxiliary: 0, revision: 0 },
        chemistry: { primary: 0, auxiliary: 0, revision: 0 },
        botany: { primary: 0, auxiliary: 0, revision: 0 },
        zoology: { primary: 0, auxiliary: 0, revision: 0 }
      },
      statusIndicator: 'CRITICAL',
      clinicalBriefing: 'No data logged. Protocol initiation required.'
    }
  }
}