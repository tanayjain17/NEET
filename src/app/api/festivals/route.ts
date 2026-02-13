import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Major Indian festivals for 2024-2026
const INDIAN_FESTIVALS = [
  // 2024
  { name: 'Diwali', date: '2024-11-01', duration: 5, impact: 'high', region: 'national' },
  { name: 'Dussehra', date: '2024-10-12', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Karva Chauth', date: '2024-11-01', duration: 1, impact: 'medium', region: 'north' },
  { name: 'Bhai Dooj', date: '2024-11-03', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Chhath Puja', date: '2024-11-07', duration: 4, impact: 'high', region: 'north' },
  { name: 'Christmas', date: '2024-12-25', duration: 1, impact: 'medium', region: 'national' },
  { name: 'New Year', date: '2024-12-31', duration: 2, impact: 'medium', region: 'national' },
  
  // 2025
  { name: 'Makar Sankranti', date: '2025-01-14', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Republic Day', date: '2025-01-26', duration: 1, impact: 'low', region: 'national' },
  { name: 'Maha Shivratri', date: '2025-02-26', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Holi', date: '2025-03-14', duration: 2, impact: 'high', region: 'national' },
  { name: 'Ram Navami', date: '2025-04-06', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Good Friday', date: '2025-04-18', duration: 1, impact: 'low', region: 'national' },
  { name: 'Eid ul-Fitr', date: '2025-03-31', duration: 2, impact: 'high', region: 'national' },
  { name: 'Independence Day', date: '2025-08-15', duration: 1, impact: 'low', region: 'national' },
  { name: 'Janmashtami', date: '2025-08-16', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Ganesh Chaturthi', date: '2025-08-27', duration: 11, impact: 'high', region: 'west' },
  { name: 'Dussehra', date: '2025-10-02', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Diwali', date: '2025-10-20', duration: 5, impact: 'high', region: 'national' },
  { name: 'Bhai Dooj', date: '2025-10-22', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Chhath Puja', date: '2025-10-28', duration: 4, impact: 'high', region: 'north' },
  { name: 'Christmas', date: '2025-12-25', duration: 1, impact: 'medium', region: 'national' },
  
  // 2026 (up to NEET exam)
  { name: 'New Year', date: '2026-01-01', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Makar Sankranti', date: '2026-01-14', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Republic Day', date: '2026-01-26', duration: 1, impact: 'low', region: 'national' },
  { name: 'Maha Shivratri', date: '2026-03-17', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Holi', date: '2026-03-03', duration: 2, impact: 'high', region: 'national' },
  { name: 'Ram Navami', date: '2026-03-25', duration: 1, impact: 'medium', region: 'national' },
  { name: 'Good Friday', date: '2026-04-03', duration: 1, impact: 'low', region: 'national' },
  { name: 'Eid ul-Fitr', date: '2026-03-20', duration: 2, impact: 'high', region: 'national' }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let whereClause = {};
    if (startDate && endDate) {
      whereClause = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }
    
    const festivals = await prisma.indianFestival.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });
    
    return NextResponse.json({ data: festivals });
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Seed festivals if they don't exist
    for (const festival of INDIAN_FESTIVALS) {
      const existing = await prisma.indianFestival.findFirst({
        where: {
          name: festival.name,
          date: new Date(festival.date)
        }
      });
      
      if (!existing) {
        await prisma.indianFestival.create({
          data: {
            name: festival.name,
            date: new Date(festival.date),
            duration: festival.duration,
            impact: festival.impact,
            region: festival.region,
            studyAdjust: `Reduce study intensity by ${festival.impact === 'high' ? '70%' : festival.impact === 'medium' ? '50%' : '20%'} during ${festival.name}`
          }
        });
      }
    }
    
    return NextResponse.json({ message: 'Festivals seeded successfully' });
  } catch (error) {
    console.error('Error seeding festivals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}