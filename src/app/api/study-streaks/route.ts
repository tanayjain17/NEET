import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let streak = await prisma.studyStreak.findFirst({
      where: { 
        userId: session.user.email,
        streakType: 'daily'
      }
    })

    if (!streak) {
      streak = await prisma.studyStreak.create({
        data: {
          userId: session.user.email,
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: new Date(),
          totalDays: 0,
          streakType: 'daily'
        }
      })
    }

    // Check if streak should be reset (48-hour grace period)
    const now = new Date()
    const lastStudyDate = new Date(streak.lastStudyDate)
    const hoursDiff = (now.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff > 48 && streak.currentStreak > 0) {
      // Reset streak after 48 hours
      streak = await prisma.studyStreak.update({
        where: { id: streak.id },
        data: {
          currentStreak: 0
        }
      })
    }

    return NextResponse.json(streak)
  } catch (error) {
    console.error('Error fetching study streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = await prisma.studyStreak.findFirst({
      where: { 
        userId: session.user.email,
        streakType: 'daily'
      }
    })

    if (!streak) {
      const newStreak = await prisma.studyStreak.create({
        data: {
          userId: session.user.email,
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: today,
          totalDays: 1,
          streakType: 'daily'
        }
      })
      return NextResponse.json({ success: true, data: newStreak })
    }

    const lastStudyDate = new Date(streak.lastStudyDate)
    lastStudyDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24))
    const hoursDiff = (new Date().getTime() - new Date(streak.lastStudyDate).getTime()) / (1000 * 60 * 60)

    let updatedStreak
    if (daysDiff === 0) {
      // Already studied today, just update timestamp
      updatedStreak = await prisma.studyStreak.update({
        where: { id: streak.id },
        data: {
          lastStudyDate: new Date()
        }
      })
      return NextResponse.json({ success: true, data: updatedStreak, message: 'Updated for today' })
    } else if (daysDiff === 1 || (daysDiff === 2 && hoursDiff <= 48)) {
      // Consecutive day or within 48-hour grace period
      const newCurrentStreak = streak.currentStreak + 1
      updatedStreak = await prisma.studyStreak.update({
        where: { id: streak.id },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
          lastStudyDate: new Date(),
          totalDays: streak.totalDays + 1
        }
      })
    } else {
      // Streak broken (more than 48 hours)
      updatedStreak = await prisma.studyStreak.update({
        where: { id: streak.id },
        data: {
          currentStreak: 1,
          lastStudyDate: new Date(),
          totalDays: streak.totalDays + 1
        }
      })
    }

    return NextResponse.json({ success: true, data: updatedStreak })
  } catch (error) {
    console.error('Error updating study streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}