import { NextRequest, NextResponse } from 'next/server'
import { CycleOptimizationEngine } from '@/lib/cycle-optimization-engine'
import { CyclePhase } from '@/lib/menstrual-cycle-predictor'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cyclePhase = searchParams.get('phase') as CyclePhase
    const subject = searchParams.get('subject')

    if (!cyclePhase || !subject) {
      return NextResponse.json({ error: 'Phase and subject are required' }, { status: 400 })
    }

    const techniques = CycleOptimizationEngine.getStudyTechniques(cyclePhase, subject)
    return NextResponse.json({ success: true, data: techniques })
  } catch (error) {
    console.error('Study techniques error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}