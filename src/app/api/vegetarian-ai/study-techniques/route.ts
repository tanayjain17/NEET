import { NextRequest, NextResponse } from 'next/server'
import { generateVegetarianStudyTechniques } from '@/lib/groq-vegetarian-optimization'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const techniques = await generateVegetarianStudyTechniques(data)
    return NextResponse.json({ success: true, data: techniques })
  } catch (error) {
    console.error('Vegetarian study techniques error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}