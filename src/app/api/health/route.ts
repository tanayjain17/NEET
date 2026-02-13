import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if subjects exist
    const subjectCount = await prisma.subject.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      subjects: subjectCount,
      message: subjectCount === 0 ? 'Database needs seeding' : 'Ready to go!'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}