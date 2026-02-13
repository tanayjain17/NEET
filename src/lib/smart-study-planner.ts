import { prisma } from './prisma'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export type StudyBlock = {
  id: string
  subject: string
  chapter?: string
  startTime: string
  endTime: string
  duration: number
  type: 'study' | 'break' | 'revision' | 'test'
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

export type SmartPlan = {
  id: string
  date: string
  totalStudyHours: number
  energyLevel: number
  focusLevel: number
  schedule: StudyBlock[]
  completed: boolean
  aiGenerated: boolean
}

export class SmartStudyPlanner {
  static async generateDailyPlan(userId: string, date: Date, preferences: {
    energyLevel: number
    availableHours: number
    weakAreas: string[]
    menstrualPhase?: string
  }): Promise<SmartPlan> {
    try {
      // Check if plan exists for this date
      const existingPlan = await prisma.smartStudyPlan.findUnique({
        where: {
          userId_date: {
            userId,
            date
          }
        }
      })

      // If it's a new day, reset completion status
      const isNewDay = !existingPlan || new Date(existingPlan.date).toDateString() !== date.toDateString()
      
      // Get user data for context
      const [subjects, dailyGoals, testPerformances, sleepData] = await Promise.all([
        prisma.subject.findMany({ include: { chapters: true } }),
        prisma.dailyGoal.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 7
        }),
        prisma.testPerformance.findMany({
          where: { userId },
          orderBy: { testDate: 'desc' },
          take: 5
        }),
        prisma.sleepData.findFirst({
          where: { 
            userId,
            date: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        })
      ])

      // Generate AI-powered schedule
      let aiSchedule = await this.generateAISchedule(
        preferences,
        subjects,
        testPerformances,
        sleepData
      )

      // Reset completion status for new day
      if (isNewDay) {
        aiSchedule = aiSchedule.map(block => ({ ...block, completed: false }))
      } else if (existingPlan) {
        // Preserve existing completion status
        const existingSchedule = existingPlan.schedule as StudyBlock[]
        aiSchedule = aiSchedule.map(block => {
          const existingBlock = existingSchedule.find(eb => eb.id === block.id)
          return existingBlock ? { ...block, completed: existingBlock.completed } : block
        })
      }

      // Save to database
      const studyPlan = await prisma.smartStudyPlan.upsert({
        where: {
          userId_date: {
            userId,
            date
          }
        },
        update: {
          totalStudyHours: 14, // Set target to 14 hours
          energyLevel: preferences?.energyLevel || 5,
          focusLevel: sleepData?.quality || 5,
          schedule: aiSchedule,
          aiGenerated: true
        },
        create: {
          userId,
          date,
          totalStudyHours: 14, // Set target to 14 hours
          energyLevel: preferences?.energyLevel || 5,
          focusLevel: sleepData?.quality || 5,
          schedule: aiSchedule,
          aiGenerated: true
        }
      })

      return {
        id: studyPlan.id,
        date: studyPlan.date.toISOString().split('T')[0],
        totalStudyHours: studyPlan.totalStudyHours,
        energyLevel: studyPlan.energyLevel,
        focusLevel: studyPlan.focusLevel,
        schedule: studyPlan.schedule as StudyBlock[],
        completed: studyPlan.completed,
        aiGenerated: studyPlan.aiGenerated
      }
    } catch (error) {
      console.error('Smart study planner error:', error)
      throw error
    }
  }

  private static async generateAISchedule(
    preferences: any,
    subjects: any[],
    testPerformances: any[],
    sleepData: any
  ): Promise<StudyBlock[]> {
    try {
      const prompt = `
Create an optimal study schedule for NEET preparation with these parameters:
- Available study hours: ${preferences?.availableHours || 8}
- Energy level: ${preferences?.energyLevel || 5}/10
- Weak areas: ${preferences?.weakAreas?.join(', ') || 'None'}
- Menstrual phase: ${preferences?.menstrualPhase || 'normal'}
- Sleep quality: ${sleepData?.quality || 5}/10
- Recent test average: ${testPerformances.length > 0 ? Math.round(testPerformances.reduce((sum: number, t: any) => sum + t.score, 0) / testPerformances.length) : 0}/720

Generate a JSON array of study blocks with this structure:
[{
  "id": "unique_id",
  "subject": "Physics/Chemistry/Biology",
  "chapter": "specific_chapter",
  "startTime": "HH:MM",
  "endTime": "HH:MM", 
  "duration": minutes,
  "type": "study/break/revision/test",
  "priority": "high/medium/low",
  "completed": false
}]

Rules:
- Start at 6:00 AM
- Include 15-min breaks every 90 minutes
- Prioritize weak areas during high energy times
- Adjust intensity based on menstrual phase
- Include revision slots
- End by 10:00 PM
`

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.6,
        max_tokens: 1000,
      })

      const response = completion.choices[0]?.message?.content || '[]'
      
      try {
        return JSON.parse(response)
      } catch {
        return this.generateFallbackSchedule(preferences)
      }
    } catch (error) {
      console.error('AI schedule generation error:', error)
      return this.generateFallbackSchedule(preferences)
    }
  }

  private static generateFallbackSchedule(preferences: any): StudyBlock[] {
    const schedule: StudyBlock[] = []
    let currentTime = '06:00'
    let blockId = 1

    const subjects = ['Physics', 'Chemistry', 'Biology']
    const hoursPerSubject = Math.floor((preferences?.availableHours || 8) / 3)

    subjects.forEach(subject => {
      for (let i = 0; i < hoursPerSubject; i++) {
        schedule.push({
          id: `block_${blockId++}`,
          subject,
          startTime: currentTime,
          endTime: this.addMinutes(currentTime, 90),
          duration: 90,
          type: 'study',
          priority: preferences?.weakAreas?.includes(subject) ? 'high' : 'medium',
          completed: false
        })
        
        currentTime = this.addMinutes(currentTime, 90)
        
        // Add break
        schedule.push({
          id: `break_${blockId++}`,
          subject: 'Break',
          startTime: currentTime,
          endTime: this.addMinutes(currentTime, 15),
          duration: 15,
          type: 'break',
          priority: 'medium',
          completed: false
        })
        
        currentTime = this.addMinutes(currentTime, 15)
      }
    })

    return schedule
  }

  private static addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  static async updateBlockCompletion(userId: string, planId: string, blockId: string, completed: boolean): Promise<void> {
    console.log('updateBlockCompletion called:', { userId, planId, blockId, completed })
    
    const plan = await prisma.smartStudyPlan.findUnique({
      where: { id: planId, userId }
    })

    console.log('Found plan:', plan ? 'Yes' : 'No')

    if (plan) {
      const schedule = plan.schedule as StudyBlock[]
      console.log('Current schedule blocks:', schedule.length)
      
      const updatedSchedule = schedule.map(block => 
        block.id === blockId ? { ...block, completed } : block
      )

      console.log('Updated schedule:', updatedSchedule.find(b => b.id === blockId))

      await prisma.smartStudyPlan.update({
        where: { id: planId },
        data: { 
          schedule: updatedSchedule,
          updatedAt: new Date()
        }
      })
      
      console.log('Block completion updated successfully')
    } else {
      console.error('Plan not found or user mismatch')
      throw new Error('Plan not found')
    }
  }
}