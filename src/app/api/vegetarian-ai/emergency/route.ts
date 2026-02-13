import { NextRequest, NextResponse } from 'next/server'
import { generateEmergencyVegetarianSupport } from '@/lib/groq-vegetarian-optimization'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const support = await generateEmergencyVegetarianSupport(data)
    return NextResponse.json({ success: true, data: support })
  } catch (error) {
    console.error('Vegetarian emergency support error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}