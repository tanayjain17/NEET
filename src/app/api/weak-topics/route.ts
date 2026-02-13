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

    const weakTopics = await prisma.weakTopic.findMany({
      where: { userId: session.user.email },
      orderBy: { weaknessScore: 'desc' }
    })

    return NextResponse.json(weakTopics)
  } catch (error) {
    console.error('Error fetching weak topics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subject, chapter, topic, isCorrect } = body

    // Find or create weak topic
    const existingTopic = await prisma.weakTopic.findFirst({
      where: {
        userId: session.user.email,
        subject,
        chapter,
        topic
      }
    })

    if (existingTopic) {
      // Update existing topic
      const newAttempts = existingTopic.attempts + 1
      const newCorrectAnswers = existingTopic.correctAnswers + (isCorrect ? 1 : 0)
      const accuracy = newCorrectAnswers / newAttempts
      
      // Calculate weakness score (higher = weaker)
      const weaknessScore = Math.max(0, (1 - accuracy) * 100)
      
      const updatedTopic = await prisma.weakTopic.update({
        where: { id: existingTopic.id },
        data: {
          attempts: newAttempts,
          correctAnswers: newCorrectAnswers,
          weaknessScore,
          lastAttempt: new Date(),
          isResolved: weaknessScore < 30 // Mark as resolved if weakness < 30%
        }
      })

      return NextResponse.json({ success: true, data: updatedTopic })
    } else {
      // Create new weak topic
      const weaknessScore = isCorrect ? 20 : 80 // Initial score based on first attempt
      
      const newTopic = await prisma.weakTopic.create({
        data: {
          userId: session.user.email,
          subject,
          chapter,
          topic,
          attempts: 1,
          correctAnswers: isCorrect ? 1 : 0,
          weaknessScore,
          lastAttempt: new Date(),
          isResolved: false
        }
      })

      return NextResponse.json({ success: true, data: newTopic })
    }
  } catch (error) {
    console.error('Error updating weak topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}