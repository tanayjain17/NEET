import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAIR50Features() {
  console.log('Seeding AIR 50 menstrual health features...')

  // Seed Study Technique Recommendations
  const studyTechniques = [
    // Menstrual Phase
    { cyclePhase: 'menstrual', subject: 'Physics', technique: 'Formula Review', description: 'Review and memorize key physics formulas', duration: 30, difficulty: 'light', effectiveness: 0.7 },
    { cyclePhase: 'menstrual', subject: 'Physics', technique: 'Previous Year MCQs', description: 'Solve easy to moderate physics PYQs', duration: 45, difficulty: 'light', effectiveness: 0.8 },
    { cyclePhase: 'menstrual', subject: 'Chemistry', technique: 'Reaction Revision', description: 'Review organic and inorganic reactions', duration: 30, difficulty: 'light', effectiveness: 0.75 },
    { cyclePhase: 'menstrual', subject: 'Chemistry', technique: 'Periodic Table Practice', description: 'Memorize trends and properties', duration: 20, difficulty: 'light', effectiveness: 0.8 },
    { cyclePhase: 'menstrual', subject: 'Botany', technique: 'Diagram Practice', description: 'Draw and label plant structures', duration: 40, difficulty: 'light', effectiveness: 0.85 },
    { cyclePhase: 'menstrual', subject: 'Zoology', technique: 'System Review', description: 'Review body systems and functions', duration: 35, difficulty: 'light', effectiveness: 0.8 },

    // Follicular Phase
    { cyclePhase: 'follicular', subject: 'Physics', technique: 'New Concept Learning', description: 'Tackle new physics concepts and theories', duration: 90, difficulty: 'intense', effectiveness: 0.95 },
    { cyclePhase: 'follicular', subject: 'Physics', technique: 'Complex Problem Solving', description: 'Solve challenging numerical problems', duration: 120, difficulty: 'intense', effectiveness: 0.9 },
    { cyclePhase: 'follicular', subject: 'Chemistry', technique: 'Mechanism Learning', description: 'Learn new reaction mechanisms', duration: 75, difficulty: 'intense', effectiveness: 0.92 },
    { cyclePhase: 'follicular', subject: 'Chemistry', technique: 'Concept Building', description: 'Build strong conceptual foundation', duration: 90, difficulty: 'intense', effectiveness: 0.88 },
    { cyclePhase: 'follicular', subject: 'Botany', technique: 'New Chapter Study', description: 'Start new botany chapters', duration: 80, difficulty: 'moderate', effectiveness: 0.85 },
    { cyclePhase: 'follicular', subject: 'Zoology', technique: 'Detailed System Study', description: 'Deep dive into complex body systems', duration: 85, difficulty: 'moderate', effectiveness: 0.87 },

    // Ovulation Phase
    { cyclePhase: 'ovulation', subject: 'Physics', technique: 'Mock Test Marathon', description: 'Take full-length physics mock tests', duration: 180, difficulty: 'intense', effectiveness: 0.98 },
    { cyclePhase: 'ovulation', subject: 'Physics', technique: 'Toughest Problems', description: 'Solve most challenging numericals', duration: 150, difficulty: 'intense', effectiveness: 0.95 },
    { cyclePhase: 'ovulation', subject: 'Chemistry', technique: 'Speed Problem Solving', description: 'Rapid-fire chemistry problem solving', duration: 120, difficulty: 'intense', effectiveness: 0.96 },
    { cyclePhase: 'ovulation', subject: 'Chemistry', technique: 'Full Mock Tests', description: 'Complete chemistry section tests', duration: 180, difficulty: 'intense', effectiveness: 0.97 },
    { cyclePhase: 'ovulation', subject: 'Botany', technique: 'Memory Palace Creation', description: 'Create memory palaces for botanical facts', duration: 90, difficulty: 'intense', effectiveness: 0.93 },
    { cyclePhase: 'ovulation', subject: 'Zoology', technique: 'Rapid Recall Practice', description: 'Speed-based fact recall sessions', duration: 60, difficulty: 'intense', effectiveness: 0.94 },

    // Luteal Phase
    { cyclePhase: 'luteal', subject: 'Physics', technique: 'Formula Consolidation', description: 'Organize and practice all formulas', duration: 60, difficulty: 'moderate', effectiveness: 0.82 },
    { cyclePhase: 'luteal', subject: 'Physics', technique: 'Error Analysis', description: 'Analyze and correct previous mistakes', duration: 45, difficulty: 'moderate', effectiveness: 0.85 },
    { cyclePhase: 'luteal', subject: 'Chemistry', technique: 'Reaction Summary', description: 'Summarize all chemical reactions', duration: 70, difficulty: 'moderate', effectiveness: 0.83 },
    { cyclePhase: 'luteal', subject: 'Chemistry', technique: 'Concept Mapping', description: 'Create comprehensive concept maps', duration: 50, difficulty: 'moderate', effectiveness: 0.8 },
    { cyclePhase: 'luteal', subject: 'Botany', technique: 'Flashcard Review', description: 'Systematic flashcard-based revision', duration: 40, difficulty: 'moderate', effectiveness: 0.88 },
    { cyclePhase: 'luteal', subject: 'Zoology', technique: 'System Integration', description: 'Integrate knowledge across systems', duration: 65, difficulty: 'moderate', effectiveness: 0.86 }
  ]

  // Batch create study techniques
  await prisma.studyTechniqueRecommendation.createMany({
    data: studyTechniques.map(technique => ({
      id: `${technique.cyclePhase}-${technique.subject}-${technique.technique}`.replace(/\s+/g, '-').toLowerCase(),
      ...technique
    })),
    skipDuplicates: true
  })

  // Seed Emergency Support Protocols
  const emergencySupports = [
    // Pain Relief
    {
      type: 'pain_relief',
      title: '5-Minute Pain Relief Protocol',
      description: 'Quick relief for menstrual cramps during study sessions',
      steps: ['Apply heat pad to lower abdomen', 'Take 3 deep breaths', 'Gentle lower back stretch', 'Drink warm water', 'Light abdominal massage'],
      duration: 5,
      severity: 'mild',
      category: 'physical'
    },
    {
      type: 'pain_relief',
      title: '10-Minute Pain Management',
      description: 'Moderate pain relief with study continuation',
      steps: ['Heat therapy + gentle massage', 'Take prescribed pain medication', 'Comfortable study position', 'Breathing exercises', 'Light stretching'],
      duration: 10,
      severity: 'moderate',
      category: 'physical'
    },
    {
      type: 'pain_relief',
      title: 'Intensive Pain Protocol',
      description: 'Severe pain management with study break',
      steps: ['Immediate rest in comfortable position', 'Strong heat therapy', 'Pain medication as prescribed', 'Call support person if needed', 'Plan study resumption'],
      duration: 20,
      severity: 'severe',
      category: 'physical'
    },

    // Energy Boost
    {
      type: 'energy_boost',
      title: 'Quick Energy Revival',
      description: 'Instant energy boost for continued studying',
      steps: ['5-minute brisk walk', 'Hydrate with electrolyte water', 'Healthy protein snack', 'Fresh air exposure', 'Energizing music'],
      duration: 5,
      severity: 'mild',
      category: 'physical'
    },
    {
      type: 'energy_boost',
      title: 'Energy Recovery Protocol',
      description: 'Moderate energy restoration technique',
      steps: ['10-minute power nap', 'Balanced snack with protein', 'Light physical activity', 'Hydration boost', 'Motivational affirmations'],
      duration: 15,
      severity: 'moderate',
      category: 'physical'
    },
    {
      type: 'energy_boost',
      title: 'Energy Emergency Plan',
      description: 'Comprehensive energy restoration',
      steps: ['20-minute rest period', 'Nutritious meal', 'Light exercise or yoga', 'Adjust study plan', 'Set realistic goals'],
      duration: 30,
      severity: 'severe',
      category: 'physical'
    },

    // Mood Stabilizer
    {
      type: 'mood_stabilizer',
      title: 'Mood Lift Technique',
      description: 'Quick mood improvement for study focus',
      steps: ['3-minute breathing exercise', 'Positive self-affirmations', 'Favorite uplifting music', 'Gratitude practice', 'Smile exercise'],
      duration: 5,
      severity: 'mild',
      category: 'mental'
    },
    {
      type: 'mood_stabilizer',
      title: 'Emotional Reset Protocol',
      description: 'Moderate mood stabilization technique',
      steps: ['10-minute guided meditation', 'Journaling emotions', 'Call supportive friend/family', 'Positive visualization', 'Self-compassion practice'],
      duration: 15,
      severity: 'moderate',
      category: 'mental'
    },
    {
      type: 'mood_stabilizer',
      title: 'Crisis Management Plan',
      description: 'Comprehensive emotional support',
      steps: ['Immediate self-care activities', 'Contact professional support', 'Take study break', 'Create recovery plan', 'Seek additional help'],
      duration: 60,
      severity: 'severe',
      category: 'mental'
    },

    // Study Technique Emergency
    {
      type: 'study_technique',
      title: 'Focus Recovery Method',
      description: 'Quick technique to regain study focus',
      steps: ['Change study position', 'Switch to different subject', 'Use active recall method', 'Take 2-minute break', 'Set micro-goals'],
      duration: 5,
      severity: 'mild',
      category: 'cognitive'
    },
    {
      type: 'study_technique',
      title: 'Concentration Restoration',
      description: 'Moderate focus improvement protocol',
      steps: ['Change study environment', 'Use different learning method', 'Break topic into smaller parts', 'Active learning techniques', 'Reward system'],
      duration: 10,
      severity: 'moderate',
      category: 'cognitive'
    },
    {
      type: 'study_technique',
      title: 'Study Emergency Protocol',
      description: 'Complete study method overhaul',
      steps: ['Complete environment change', 'Switch to easiest subject', 'Use multimedia learning', 'Implement buddy system', 'Adjust daily goals'],
      duration: 20,
      severity: 'severe',
      category: 'cognitive'
    }
  ]

  // Batch create emergency supports
  await prisma.emergencySupport.createMany({
    data: emergencySupports.map(support => ({
      id: `${support.type}-${support.severity}`.replace(/\s+/g, '-').toLowerCase(),
      ...support
    })),
    skipDuplicates: true
  })

  console.log('✅ AIR 50 features seeded successfully!')
}

seedAIR50Features()
  .catch((e) => {
    console.error('❌ Error seeding AIR 50 features:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })