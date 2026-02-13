import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MistakeAnalysisEngine } from '@/lib/mistake-analysis-engine'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = '1' // user ID

    const recurringMistakes = await MistakeAnalysisEngine.getRecurringMistakes(userId)

    return NextResponse.json({
      success: true,
      data: recurringMistakes
    })

  } catch (error) {
    console.error('Error fetching mistake patterns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}