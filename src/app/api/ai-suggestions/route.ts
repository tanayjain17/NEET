import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ComprehensiveDataFetcher } from '@/lib/comprehensive-data-fetcher'
import { generateComprehensiveAIInsights } from '@/lib/groq-air-insights'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { predictedAIR } = await request.json()

    // Fetch comprehensive user data
    const comprehensiveData = await ComprehensiveDataFetcher.fetchAllUserData(session.user.email)
    
    // Generate AI insights on demand
    const aiInsights = await generateComprehensiveAIInsights(comprehensiveData, predictedAIR)

    return NextResponse.json({ 
      success: true, 
      data: aiInsights
    })
  } catch (error) {
    console.error('AI suggestions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}