import { prisma } from './prisma'
import { MenstrualCyclePredictor, CyclePhase } from './menstrual-cycle-predictor'

export type StudyBlock = {
  startTime: string
  endTime: string
  subject: string
  topic: string
  difficulty: 'light' | 'moderate' | 'intense'
  type: 'lecture' | 'practice' | 'revision' | 'mock_test'
  duration: number
}

export type OptimizedSchedule = {
  date: Date
  cyclePhase: CyclePhase
  energyLevel: number
  studyBlocks: StudyBlock[]
  mockTestSlot?: Date
  difficultyFocus: 'light' | 'moderate' | 'intense'
  totalStudyHours: number
}

export class CycleOptimizationEngine {
  /**
   * Generate AI-powered study schedule based on menstrual cycle
   */
  static async generateOptimizedSchedule(userId: string, targetDate: Date): Promise<OptimizedSchedule> {
    // Get latest cycle data
    const latestCycle = await prisma.menstrualCycle.findFirst({
      where: { userId },
      orderBy: { cycleStartDate: 'desc' }
    })

    if (!latestCycle) {
      return this.getDefaultSchedule(targetDate)
    }

    // Predict cycle phase for target date
    const cyclePrediction = MenstrualCyclePredictor.predictCurrentCycle(
      latestCycle.cycleStartDate,
      latestCycle.cycleLength,
      latestCycle.periodLength
    )

    const daysSinceStart = Math.floor((targetDate.getTime() - latestCycle.cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceStart % latestCycle.cycleLength) + 1
    const currentPhase = this.determineCyclePhase(cycleDay, latestCycle.periodLength, latestCycle.cycleLength)
    
    // Generate optimized study blocks
    const studyBlocks = this.generateStudyBlocks(currentPhase, cycleDay)
    const energyLevel = this.predictEnergyLevel(currentPhase, cycleDay)
    const difficultyFocus = this.getDifficultyFocus(currentPhase)

    // Schedule mock test during optimal phase
    const mockTestSlot = currentPhase === 'ovulation' ? 
      new Date(targetDate.getTime() + 10 * 60 * 60 * 1000) : // 10 AM during ovulation
      undefined

    return {
      date: targetDate,
      cyclePhase: currentPhase,
      energyLevel,
      studyBlocks,
      mockTestSlot,
      difficultyFocus,
      totalStudyHours: studyBlocks.reduce((total, block) => total + block.duration / 60, 0)
    }
  }

  /**
   * Generate energy and mood predictions for next 7 days
   */
  static async generateEnergyMoodPredictions(userId: string): Promise<any[]> {
    const latestCycle = await prisma.menstrualCycle.findFirst({
      where: { userId },
      orderBy: { cycleStartDate: 'desc' }
    })

    if (!latestCycle) return []

    const predictions = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + i)

      const daysSinceStart = Math.floor((targetDate.getTime() - latestCycle.cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))
      const cycleDay = (daysSinceStart % latestCycle.cycleLength) + 1
      const cyclePhase = this.determineCyclePhase(cycleDay, latestCycle.periodLength, latestCycle.cycleLength)

      predictions.push({
        date: targetDate,
        predictedEnergy: this.predictEnergyLevel(cyclePhase, cycleDay),
        predictedMood: this.predictMoodLevel(cyclePhase, cycleDay),
        predictedFocus: this.predictFocusLevel(cyclePhase, cycleDay),
        cycleDay,
        cyclePhase,
        confidence: this.calculatePredictionConfidence(cyclePhase, cycleDay)
      })
    }

    return predictions
  }

  /**
   * Get cycle-specific study techniques
   */
  static getStudyTechniques(cyclePhase: CyclePhase, subject: string): any[] {
    const techniques: Record<string, Record<string, any[]>> = {
      menstrual: {
        Physics: [
          { technique: 'Formula Review', description: 'Review and memorize key formulas', duration: 30, difficulty: 'light' },
          { technique: 'Previous Year MCQs', description: 'Solve easy to moderate PYQs', duration: 45, difficulty: 'light' }
        ],
        Chemistry: [
          { technique: 'Reaction Revision', description: 'Review organic reactions', duration: 30, difficulty: 'light' },
          { technique: 'Periodic Table Practice', description: 'Memorize trends and properties', duration: 20, difficulty: 'light' }
        ],
        Botany: [
          { technique: 'Diagram Practice', description: 'Draw and label plant structures', duration: 40, difficulty: 'light' },
          { technique: 'Classification Review', description: 'Revise taxonomic classifications', duration: 30, difficulty: 'light' }
        ],
        Zoology: [
          { technique: 'System Review', description: 'Review body systems', duration: 35, difficulty: 'light' },
          { technique: 'Life Cycle Diagrams', description: 'Practice drawing life cycles', duration: 25, difficulty: 'light' }
        ]
      },
      follicular: {
        Physics: [
          { technique: 'New Concept Learning', description: 'Tackle new physics concepts', duration: 90, difficulty: 'intense' },
          { technique: 'Problem Solving', description: 'Solve complex numerical problems', duration: 120, difficulty: 'intense' }
        ],
        Chemistry: [
          { technique: 'Mechanism Learning', description: 'Learn new reaction mechanisms', duration: 75, difficulty: 'intense' },
          { technique: 'Concept Building', description: 'Build strong conceptual foundation', duration: 90, difficulty: 'intense' }
        ],
        Botany: [
          { technique: 'New Chapter Study', description: 'Start new botany chapters', duration: 80, difficulty: 'moderate' },
          { technique: 'Detailed Notes', description: 'Make comprehensive notes', duration: 60, difficulty: 'moderate' }
        ],
        Zoology: [
          { technique: 'System Study', description: 'Deep dive into body systems', duration: 85, difficulty: 'moderate' },
          { technique: 'Comparative Study', description: 'Compare different organisms', duration: 70, difficulty: 'moderate' }
        ]
      },
      ovulation: {
        Physics: [
          { technique: 'Mock Test Marathon', description: 'Take full-length physics tests', duration: 180, difficulty: 'intense' },
          { technique: 'Toughest Problems', description: 'Solve most challenging numericals', duration: 150, difficulty: 'intense' }
        ],
        Chemistry: [
          { technique: 'Full Mock Tests', description: 'Complete chemistry mock tests', duration: 180, difficulty: 'intense' },
          { technique: 'Speed Problem Solving', description: 'Rapid-fire problem solving', duration: 120, difficulty: 'intense' }
        ],
        Botany: [
          { technique: 'Comprehensive Tests', description: 'Full botany mock tests', duration: 120, difficulty: 'intense' },
          { technique: 'Memory Palace', description: 'Create memory palaces for facts', duration: 90, difficulty: 'intense' }
        ],
        Zoology: [
          { technique: 'Full Section Tests', description: 'Complete zoology sections', duration: 120, difficulty: 'intense' },
          { technique: 'Rapid Recall', description: 'Speed-based fact recall', duration: 60, difficulty: 'intense' }
        ]
      },
      luteal: {
        Physics: [
          { technique: 'Formula Consolidation', description: 'Organize and practice formulas', duration: 60, difficulty: 'moderate' },
          { technique: 'Error Analysis', description: 'Analyze and correct mistakes', duration: 45, difficulty: 'moderate' }
        ],
        Chemistry: [
          { technique: 'Reaction Summary', description: 'Summarize all reactions', duration: 70, difficulty: 'moderate' },
          { technique: 'Concept Mapping', description: 'Create concept maps', duration: 50, difficulty: 'moderate' }
        ],
        Botany: [
          { technique: 'Flashcard Review', description: 'Review using flashcards', duration: 40, difficulty: 'moderate' },
          { technique: 'Quick Revision', description: 'Rapid chapter revision', duration: 55, difficulty: 'moderate' }
        ],
        Zoology: [
          { technique: 'System Integration', description: 'Integrate system knowledge', duration: 65, difficulty: 'moderate' },
          { technique: 'Fact Compilation', description: 'Compile important facts', duration: 45, difficulty: 'moderate' }
        ]
      }
    }

    return techniques[cyclePhase]?.[subject] || []
  }

  /**
   * Get hormonal optimization recommendations
   */
  static getHormonalOptimization(cyclePhase: CyclePhase): any {
    const optimizations = {
      menstrual: {
        supplements: ['Iron (18mg from plant sources)', 'Magnesium (200mg)', 'Vitamin B12 (500mcg)', 'Folate (400mcg)'],
        nutrition: ['Spinach & kale', 'Chickpeas & lentils', 'Pumpkin seeds', 'Dark chocolate (70%+)', 'Quinoa', 'Beetroot'],
        caffeineTime: 'Avoid caffeine - use herbal alternatives',
        nootropics: ['Fresh ginger root', 'Turmeric with black pepper', 'Brahmi (Bacopa)', 'Chamomile'],
        stressManagement: ['Pranayama breathing', 'Gentle yoga', 'Warm sesame oil massage', 'Early sleep (9 PM)']
      },
      follicular: {
        supplements: ['Algae Omega-3 (1000mg)', 'Vitamin D3 (2000 IU)', 'B-Complex (plant-based)', 'Zinc (15mg)'],
        nutrition: ['Flax & chia seeds', 'Walnuts & almonds', 'Blueberries & pomegranate', 'Avocado', 'Broccoli', 'Sweet potato'],
        caffeineTime: 'Matcha or green coffee bean extract (8 AM)',
        nootropics: ['Brahmi powder', 'Dark chocolate', 'Gotu kola', 'Rhodiola rosea'],
        stressManagement: ['Surya namaskars', 'Cold water face wash', 'Meditation', 'Cardio exercise']
      },
      ovulation: {
        supplements: ['Algae Omega-3 (1500mg)', 'Rhodiola (300mg)', 'Ginkgo Biloba (120mg)', 'CoQ10 (100mg)'],
        nutrition: ['Avocados & nuts', 'Pumpkin & sunflower seeds', 'Quinoa & amaranth', 'Paneer & Greek yogurt', 'Berries'],
        caffeineTime: 'Green coffee extract (7 AM & 1 PM)',
        nootropics: ['Lion\'s mane mushroom', 'Phosphatidylserine (soy-free)', 'Creatine monohydrate', 'Ginseng'],
        stressManagement: ['High-intensity yoga', 'Competitive study groups', '20-min power naps', 'Cold shower']
      },
      luteal: {
        supplements: ['Magnesium glycinate (300mg)', 'Vitamin B6 (100mg)', 'Calcium (500mg)', 'Evening primrose oil'],
        nutrition: ['Oats & brown rice', 'Bananas & dates', 'Sesame seeds & tahini', 'Herbal milk (almond/oat)', 'Pumpkin'],
        caffeineTime: 'Herbal coffee alternatives only (chicory, dandelion)',
        nootropics: ['Ashwagandha root', 'Lemon balm', 'Passionflower', 'Jatamansi'],
        stressManagement: ['Restorative yoga', 'Journaling', 'Oil pulling', 'Abhyanga massage']
      }
    }

    return optimizations[cyclePhase]
  }

  /**
   * Get emergency support protocols
   */
  static getEmergencySupport(type: string, severity: 'mild' | 'moderate' | 'severe'): any {
    const protocols: Record<string, Record<string, any>> = {
      pain_relief: {
        mild: {
          title: '5-Minute Pain Relief',
          steps: ['Apply heat pad to lower abdomen', 'Gentle stretching', 'Deep breathing'],
          duration: 5
        },
        moderate: {
          title: '10-Minute Pain Management',
          steps: ['Heat therapy + gentle massage', 'Ibuprofen (if needed)', 'Relaxation position'],
          duration: 10
        },
        severe: {
          title: 'Intensive Pain Protocol',
          steps: ['Immediate rest', 'Strong heat therapy', 'Pain medication', 'Consider medical help'],
          duration: 20
        }
      },
      energy_boost: {
        mild: {
          title: 'Quick Energy Boost',
          steps: ['5-minute walk', 'Hydrate with electrolytes', 'Light snack'],
          duration: 5
        },
        moderate: {
          title: 'Energy Revival Protocol',
          steps: ['10-minute power nap', 'Protein snack', 'Fresh air exposure'],
          duration: 15
        },
        severe: {
          title: 'Energy Emergency Plan',
          steps: ['20-minute rest', 'Balanced meal', 'Light exercise', 'Adjust study plan'],
          duration: 30
        }
      },
      mood_stabilizer: {
        mild: {
          title: 'Mood Lift Technique',
          steps: ['3-minute breathing exercise', 'Positive affirmations', 'Favorite music'],
          duration: 5
        },
        moderate: {
          title: 'Emotional Reset',
          steps: ['10-minute meditation', 'Journaling', 'Call support person'],
          duration: 15
        },
        severe: {
          title: 'Crisis Management',
          steps: ['Immediate self-care', 'Professional support', 'Study break', 'Recovery plan'],
          duration: 60
        }
      }
    }

    return protocols[type]?.[severity]
  }

  // Helper methods
  private static determineCyclePhase(cycleDay: number, periodLength: number, cycleLength: number): CyclePhase {
    if (cycleDay <= periodLength) return 'menstrual'
    if (cycleDay <= 13) return 'follicular'
    if (cycleDay <= 16) return 'ovulation'
    return 'luteal'
  }

  private static generateStudyBlocks(phase: CyclePhase, cycleDay: number): StudyBlock[] {
    const phaseConfigs = {
      menstrual: { totalHours: 4, intensity: 'light', subjects: ['Botany', 'Zoology'] },
      follicular: { totalHours: 8, intensity: 'intense', subjects: ['Physics', 'Chemistry'] },
      ovulation: { totalHours: 10, intensity: 'intense', subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'] },
      luteal: { totalHours: 6, intensity: 'moderate', subjects: ['Botany', 'Zoology', 'Physics'] }
    }

    const config = phaseConfigs[phase]
    const blocks: StudyBlock[] = []
    let currentTime = 9 // Start at 9 AM

    config.subjects.forEach((subject, index) => {
      const duration = (config.totalHours * 60) / config.subjects.length
      blocks.push({
        startTime: `${Math.floor(currentTime)}:${(currentTime % 1) * 60 || '00'}`,
        endTime: `${Math.floor(currentTime + duration/60)}:${((currentTime + duration/60) % 1) * 60 || '00'}`,
        subject,
        topic: `${subject} - ${phase} phase focus`,
        difficulty: config.intensity as any,
        type: phase === 'ovulation' ? 'mock_test' : 'lecture',
        duration
      })
      currentTime += duration/60 + 0.25 // Add 15-minute break
    })

    return blocks
  }

  private static predictEnergyLevel(phase: CyclePhase, cycleDay: number): number {
    const baseLevels = { menstrual: 3, follicular: 8, ovulation: 10, luteal: 6 }
    return baseLevels[phase]
  }

  private static predictMoodLevel(phase: CyclePhase, cycleDay: number): number {
    const baseLevels = { menstrual: 4, follicular: 8, ovulation: 9, luteal: 5 }
    return baseLevels[phase]
  }

  private static predictFocusLevel(phase: CyclePhase, cycleDay: number): number {
    const baseLevels = { menstrual: 4, follicular: 9, ovulation: 10, luteal: 7 }
    return baseLevels[phase]
  }

  private static getDifficultyFocus(phase: CyclePhase): 'light' | 'moderate' | 'intense' {
    const focuses = { menstrual: 'light', follicular: 'intense', ovulation: 'intense', luteal: 'moderate' }
    return focuses[phase] as any
  }

  private static calculatePredictionConfidence(phase: CyclePhase, cycleDay: number): number {
    // Higher confidence for well-established phases
    if (phase === 'ovulation') return 0.95
    if (phase === 'menstrual') return 0.90
    return 0.85
  }

  private static getDefaultSchedule(date: Date): OptimizedSchedule {
    return {
      date,
      cyclePhase: 'follicular',
      energyLevel: 7,
      studyBlocks: [
        {
          startTime: '9:00',
          endTime: '11:00',
          subject: 'Physics',
          topic: 'General Study',
          difficulty: 'moderate',
          type: 'lecture',
          duration: 120
        }
      ],
      difficultyFocus: 'moderate',
      totalStudyHours: 6
    }
  }
}