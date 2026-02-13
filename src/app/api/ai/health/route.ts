import { NextRequest, NextResponse } from 'next/server';
import { aiInsightsService } from '@/lib/ai-insights';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = await aiInsightsService.healthCheck();
    
    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'healthy' ? 200 : 503,
    });
  } catch (error) {
    console.error('AI health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: 'Failed to perform health check',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}