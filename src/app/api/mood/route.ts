import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const moodSchema = z.object({
  date: z.string(),
  mood: z.enum(['sad', 'neutral', 'happy'])
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const moodEntries = await prisma.moodEntry.findMany({
      orderBy: { date: 'desc' },
      take: 100
    })

    return NextResponse.json({
      success: true,
      data: moodEntries
    })

  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = moodSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { date, mood } = validationResult.data

    const moodEntry = await prisma.moodEntry.upsert({
      where: { date: new Date(date) },
      update: { mood },
      create: { date: new Date(date), mood }
    })

    return NextResponse.json({
      success: true,
      data: moodEntry
    })

  } catch (error) {
    console.error('Error saving mood entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}