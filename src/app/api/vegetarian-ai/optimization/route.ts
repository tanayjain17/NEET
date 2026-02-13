import { NextRequest, NextResponse } from 'next/server'
import { generateVegetarianOptimization } from '@/lib/groq-vegetarian-optimization'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const optimization = await generateVegetarianOptimization(data)
    return NextResponse.json({ success: true, data: optimization })
  } catch (error) {
    console.error('Vegetarian optimization error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}