import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hinduWisdom, TOTAL_QUOTES } from '@/lib/hindu-wisdom-250';

export async function GET() {
  try {
    // Validate quotes array
    if (!hinduWisdom || hinduWisdom.length < 1) {
      throw new Error('Hindu wisdom quotes not available');
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Try to get today's wisdom from database
    let wisdom = await prisma.dailyWisdom.findUnique({
      where: { date: new Date(today) }
    });

    // If not found, create new wisdom for today
    if (!wisdom) {
      const fourHourBlock = Math.floor(Date.now() / (1000 * 60 * 60 * 4));
      const randomSeed = fourHourBlock * 7919; // Prime number for better distribution
      const wisdomIndex = Math.abs(randomSeed) % TOTAL_QUOTES;
      const selectedWisdom = hinduWisdom[wisdomIndex];
      
      if (!selectedWisdom) {
        throw new Error('Selected wisdom quote not found');
      }

      wisdom = await prisma.dailyWisdom.create({
        data: {
          date: new Date(today),
          quote: selectedWisdom.quote,
          translation: selectedWisdom.translation,
          source: selectedWisdom.source,
          relevance: selectedWisdom.relevance
        }
      });
    }

    return NextResponse.json({
      success: true,
      wisdom: {
        id: wisdom.id,
        date: wisdom.date.toISOString().split('T')[0],
        quote: wisdom.quote,
        translation: wisdom.translation,
        source: wisdom.source,
        relevance: wisdom.relevance
      }
    });
  } catch (error) {
    console.error('Daily wisdom error:', error);
    
    // Comprehensive fallback with error logging
    try {
      const fallbackWisdom = hinduWisdom[0];
      if (!fallbackWisdom) {
        throw new Error('Fallback wisdom not available');
      }
      
      return NextResponse.json({
        success: true,
        wisdom: {
          id: 'fallback-1',
          date: new Date().toISOString().split('T')[0],
          quote: fallbackWisdom.quote,
          translation: fallbackWisdom.translation,
          source: fallbackWisdom.source,
          relevance: fallbackWisdom.relevance
        },
        fallback: true
      });
    } catch (fallbackError) {
      console.error('Fallback wisdom error:', fallbackError);
      
      // Ultimate fallback
      return NextResponse.json({
        success: true,
        wisdom: {
          id: 'ultimate-fallback',
          date: new Date().toISOString().split('T')[0],
          quote: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
          translation: 'You have the right to perform your actions, but not to the fruits of action',
          source: 'Bhagavad Gita 2.47',
          relevance: 'Focus on your studies without attachment to results.'
        },
        fallback: true,
        error: 'System fallback activated'
      });
    }
  }
}