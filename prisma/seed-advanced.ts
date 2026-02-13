import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function seedAdvancedFeatures() {
    console.log('🚀 Starting advanced features seeding...');

    try {
        // Seed Indian Festivals
        console.log('📅 Seeding Indian festivals...');
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
                        studyAdjust: `Reduce study intensity by ${festival.impact === 'high' ? '70%' :
                            festival.impact === 'medium' ? '50%' : '20%'
                            } during ${festival.name}. Focus on light revision and family time.`
                    }
                });
                console.log(`  ✅ Added festival: ${festival.name} (${festival.date})`);
            }
        }

        // Create sample menstrual cycle data (for demo purposes)
        console.log('🩸 Creating sample menstrual cycle data...');
        const sampleUserId = 'demo@example.com'; // Replace with actual user ID

        const existingCycle = await prisma.menstrualCycle.findFirst({
            where: { userId: sampleUserId }
        });

        if (!existingCycle) {
            // Create last 3 cycles
            const cycles = [
                {
                    cycleStartDate: new Date('2024-10-01'),
                    cycleLength: 28,
                    periodLength: 5,
                    symptoms: ['cramps', 'mood_swings'],
                    energyLevel: 6,
                    studyCapacity: 7,
                    notes: 'Moderate energy, good focus during follicular phase'
                },
                {
                    cycleStartDate: new Date('2024-09-03'),
                    cycleLength: 29,
                    periodLength: 4,
                    symptoms: ['fatigue', 'headache'],
                    energyLevel: 5,
                    studyCapacity: 6,
                    notes: 'Lower energy, needed more breaks'
                },
                {
                    cycleStartDate: new Date('2024-08-05'),
                    cycleLength: 28,
                    periodLength: 5,
                    symptoms: ['cramps'],
                    energyLevel: 7,
                    studyCapacity: 8,
                    notes: 'Good cycle, maintained study schedule well'
                }
            ];

            for (const cycle of cycles) {
                await prisma.menstrualCycle.create({
                    data: {
                        userId: sampleUserId,
                        ...cycle
                    }
                });
            }
            console.log('  ✅ Created sample menstrual cycle data');
        }

        // Create sample BSc schedule
        console.log('📚 Creating sample BSc schedule...');
        const existingBscSchedule = await prisma.bSCSchedule.findFirst({
            where: { userId: sampleUserId }
        });

        if (!existingBscSchedule) {
            const bscExams = [
                {
                    semester: 3,
                    subject: 'Organic Chemistry',
                    examDate: new Date('2024-12-15'),
                    syllabusLoad: 8,
                    priority: 'high'
                },
                {
                    semester: 3,
                    subject: 'Physics Lab',
                    examDate: new Date('2024-12-18'),
                    syllabusLoad: 5,
                    priority: 'medium'
                },
                {
                    semester: 3,
                    subject: 'Mathematics',
                    examDate: new Date('2024-12-20'),
                    syllabusLoad: 7,
                    priority: 'high'
                },
                {
                    semester: 4,
                    subject: 'Biochemistry',
                    examDate: new Date('2025-05-10'),
                    syllabusLoad: 9,
                    priority: 'high'
                }
            ];

            for (const exam of bscExams) {
                await prisma.bSCSchedule.create({
                    data: {
                        userId: sampleUserId,
                        ...exam
                    }
                });
            }
            console.log('  ✅ Created sample BSc schedule');
        }

        // Create sample smart reminders
        console.log('🔔 Creating sample smart reminders...');
        const existingReminder = await prisma.smartReminder.findFirst({
            where: { userId: sampleUserId }
        });

        if (!existingReminder) {
            const reminders = [
                {
                    type: 'study',
                    title: 'Physics Problem Solving',
                    message: 'Time for your daily physics problem solving session! Focus on mechanics today.',
                    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                    isRecurring: true,
                    recurringType: 'daily',
                    priority: 'high',
                    aiGenerated: true,
                    contextData: { subject: 'Physics', chapter: 'Mechanics', difficulty: 'medium' }
                },
                {
                    type: 'break',
                    title: 'Menstrual Phase Break',
                    message: 'You\'re in your menstrual phase. Take a 15-minute break and have some warm tea.',
                    scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
                    isRecurring: false,
                    priority: 'medium',
                    aiGenerated: true,
                    contextData: { cyclePhase: 'menstrual', energyLevel: 4 }
                },
                {
                    type: 'revision',
                    title: 'Chemistry Revision',
                    message: 'Perfect time for organic chemistry revision. Your energy levels are optimal!',
                    scheduledFor: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
                    isRecurring: true,
                    recurringType: 'weekly',
                    priority: 'high',
                    aiGenerated: true,
                    contextData: { subject: 'Chemistry', energyLevel: 8, cyclePhase: 'follicular' }
                }
            ];

            for (const reminder of reminders) {
                await prisma.smartReminder.create({
                    data: {
                        userId: sampleUserId,
                        ...reminder
                    }
                });
            }
            console.log('  ✅ Created sample smart reminders');
        }

        // Create sample AIR prediction
        console.log('🎯 Creating sample AIR prediction...');
        const existingPrediction = await prisma.aIRPrediction.findFirst({
            where: { userId: sampleUserId }
        });

        if (!existingPrediction) {
            await prisma.aIRPrediction.create({
                data: {
                    userId: sampleUserId,
                    predictedAIR: 1250,
                    confidenceScore: 0.78,
                    currentProgress: 65.5,
                    requiredProgress: 90.0,
                    timeRemaining: 520, // days to NEET
                    keyFactors: [
                        'Strong performance in Chemistry',
                        'Consistent daily practice',
                        'Good mood stability',
                        'Effective menstrual cycle management'
                    ],
                    recommendations: [
                        'Increase Physics problem solving to 100 questions daily',
                        'Complete pending Biology lectures within 3 weeks',
                        'Take weekly mock tests starting next month',
                        'Focus extra time during follicular phase',
                        'Plan light study during festival periods',
                        'Balance BSc commitments with NEET preparation'
                    ],
                    riskAssessment: 'medium'
                }
            });
            console.log('  ✅ Created sample AIR prediction');
        }

        console.log('🎉 Advanced features seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  • ${INDIAN_FESTIVALS.length} festivals added`);
        console.log('  • Menstrual cycle tracking enabled');
        console.log('  • BSc schedule integration ready');
        console.log('  • Smart reminders system active');
        console.log('  • AIR prediction engine initialized');
        console.log('\n💡 Next steps:');
        console.log('  1. Run: npm run db:push');
        console.log('  2. Start the app: npm run dev');
        console.log('  3. Visit /insights to see the new AI features');
        console.log('  4. Update user email in seed script for real data');

    } catch (error) {
        console.error('❌ Error during advanced seeding:', error);
        throw error;
    }
}

async function main() {
    await seedAdvancedFeatures();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });