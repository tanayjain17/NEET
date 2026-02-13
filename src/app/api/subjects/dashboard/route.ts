import { NextRequest, NextResponse } from 'next/server'
import { SubjectRepository } from '@/lib/repositories/subject-repository'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const dashboardSummary = await SubjectRepository.getDashboardSummary()
    
    return NextResponse.json(dashboardSummary, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}"`
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}