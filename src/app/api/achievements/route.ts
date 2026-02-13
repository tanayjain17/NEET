import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AchievementTracker } from '@/lib/achievement-tracker'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Initialize achievements if none exist
    await AchievementTracker.initializeDefaultAchievements()

    // Update achievements based on current progress
    await AchievementTracker.checkAndUpdateAchievements(session.user.email)

    // Get all achievements with user progress
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
      include: {
        userAchievements: {
          where: { userId: session.user.email }
        }
      },
      orderBy: { points: 'desc' }
    })

    // Format response with progress data
    const formattedAchievements = achievements.map(achievement => {
      const userAchievement = achievement.userAchievements[0]
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon,
        points: achievement.points,
        rarity: achievement.rarity,
        isCompleted: userAchievement?.isCompleted || false,
        progress: userAchievement?.progress || 0,
        unlockedAt: userAchievement?.unlockedAt
      }
    })

    return NextResponse.json(formattedAchievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Force refresh achievements based on current progress
    const stats = await AchievementTracker.checkAndUpdateAchievements(session.user.email)

    return NextResponse.json({ 
      success: true, 
      message: 'Achievements updated', 
      stats 
    })
  } catch (error) {
    console.error('Error updating achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}