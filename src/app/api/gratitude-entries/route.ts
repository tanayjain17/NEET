import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userId = '1';
    
    const entries = await prisma.gratitudeEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    return NextResponse.json({
      success: true,
      entries: entries.map(entry => ({
        id: entry.id,
        date: entry.date.toISOString().split('T')[0],
        content: entry.content,
        createdAt: entry.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Gratitude entries GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    const userId = '1';
    const today = new Date().toISOString().split('T')[0];

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const entry = await prisma.gratitudeEntry.create({
      data: {
        userId,
        date: new Date(today),
        content: content.trim()
      }
    });

    return NextResponse.json({ 
      success: true, 
      entry: {
        id: entry.id,
        date: entry.date.toISOString().split('T')[0],
        content: entry.content,
        createdAt: entry.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Gratitude entries POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save entry' }, { status: 500 });
  }
}