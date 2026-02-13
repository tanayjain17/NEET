import { NextRequest, NextResponse } from 'next/server'
import { CycleOptimizationEngine } from '@/lib/cycle-optimization-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const severity = searchParams.get('severity') as 'mild' | 'moderate' | 'severe'

    if (!type || !severity) {
      return NextResponse.json({ error: 'Type and severity are required' }, { status: 400 })
    }

    const support = CycleOptimizationEngine.getEmergencySupport(type, severity)
    return NextResponse.json({ success: true, data: support })
  } catch (error) {
    console.error('Emergency support error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}