import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MistakeAnalysisEngine } from '@/lib/mistake-analysis-engine'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { sessionType, sessionData, mistakeData } = await request.json()

    if (!sessionType || !mistakeData) {
      return NextResponse.json(
        { error: 'Session type and mistake data are required' },
        { status: 400 }
      )
    }

    // Use hardcoded user ID 
    const userId = '1'

    const analysis = await MistakeAnalysisEngine.analyzeMistakes(
      userId,
      sessionType,
      sessionData,
      mistakeData
    )

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Error analyzing mistakes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}