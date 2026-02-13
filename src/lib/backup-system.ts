import { PrismaClient } from '@prisma/client'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export class BackupSystem {
  private backupDir = path.join(process.cwd(), 'backups')

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.json`
    const filepath = path.join(this.backupDir, filename)

    if (!existsSync(this.backupDir)) {
      await mkdir(this.backupDir, { recursive: true })
    }

    const data = await this.exportAllData()
    await writeFile(filepath, JSON.stringify(data, null, 2))
    
    return filepath
  }

  private async exportAllData() {
    const [
      subjects, chapters, dailyGoals, questionAnalytics,
      testPerformance, moodEntries, achievements, userAchievements
    ] = await Promise.allSettled([
      prisma.subject.findMany({ include: { chapters: true } }),
      prisma.chapter.findMany(),
      prisma.dailyGoal.findMany(),
      prisma.questionAnalytics.findMany(),
      prisma.testPerformance.findMany(),
      prisma.moodEntry.findMany(),
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany()
    ])

    return {
      timestamp: new Date().toISOString(),
      subjects: subjects.status === 'fulfilled' ? subjects.value : [],
      chapters: chapters.status === 'fulfilled' ? chapters.value : [],
      dailyGoals: dailyGoals.status === 'fulfilled' ? dailyGoals.value : [],
      questionAnalytics: questionAnalytics.status === 'fulfilled' ? questionAnalytics.value : [],
      testPerformance: testPerformance.status === 'fulfilled' ? testPerformance.value : [],
      moodEntries: moodEntries.status === 'fulfilled' ? moodEntries.value : [],
      achievements: achievements.status === 'fulfilled' ? achievements.value : [],
      userAchievements: userAchievements.status === 'fulfilled' ? userAchievements.value : []
    }
  }

  async restoreBackup(filepath: string): Promise<boolean> {
    try {
      const data = JSON.parse(await readFile(filepath, 'utf-8'))
      return await this.restoreFromData(data)
    } catch (error) {
      console.error('Restore failed:', error)
      return false
    }
  }

  async restoreFromData(data: any): Promise<boolean> {
    try {
      // Clear existing data
      await prisma.$transaction([
        prisma.userAchievement.deleteMany(),
        prisma.achievement.deleteMany(),
        prisma.moodEntry.deleteMany(),
        prisma.testPerformance.deleteMany(),
        prisma.questionAnalytics.deleteMany(),
        prisma.dailyGoal.deleteMany(),
        prisma.chapter.deleteMany(),
        prisma.subject.deleteMany()
      ])

      // Restore data
      await prisma.$transaction([
        prisma.subject.createMany({ data: data.subjects.map((s: any) => ({ ...s, chapters: undefined })) }),
        prisma.chapter.createMany({ data: data.chapters }),
        prisma.dailyGoal.createMany({ data: data.dailyGoals }),
        prisma.questionAnalytics.createMany({ data: data.questionAnalytics || [] }),
        prisma.testPerformance.createMany({ data: data.testPerformance }),
        prisma.moodEntry.createMany({ data: data.moodEntries }),
        prisma.achievement.createMany({ data: data.achievements }),
        prisma.userAchievement.createMany({ data: data.userAchievements || [] })
      ])

      return true
    } catch (error) {
      console.error('Restore failed:', error)
      return false
    }
  }

  async verifyBackup(filepath: string): Promise<boolean> {
    try {
      const data = JSON.parse(await readFile(filepath, 'utf-8'))
      return !!(data.timestamp && data.subjects && data.chapters)
    } catch {
      return false
    }
  }

  async downloadBackup(): Promise<string> {
    const data = await this.exportAllData()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.json`
    
    return JSON.stringify(data, null, 2)
  }
}