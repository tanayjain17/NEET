import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Initialize subjects and chapters for a new user
 * This creates the default NEET subjects structure for a user
 */
export async function initializeUserSubjects(userId: string) {
  const subjects = [
    {
      name: 'Physics',
      chapters: [
        { name: 'Mechanics', lectureCount: 25 },
        { name: 'Thermodynamics', lectureCount: 18 },
        { name: 'Waves and Oscillations', lectureCount: 20 },
        { name: 'Electrostatics', lectureCount: 22 },
        { name: 'Current Electricity', lectureCount: 16 },
        { name: 'Magnetism', lectureCount: 19 },
        { name: 'Electromagnetic Induction', lectureCount: 15 },
        { name: 'Optics', lectureCount: 24 },
        { name: 'Modern Physics', lectureCount: 21 },
      ]
    },
    {
      name: 'Chemistry',
      chapters: [
        { name: 'Atomic Structure', lectureCount: 20 },
        { name: 'Chemical Bonding', lectureCount: 18 },
        { name: 'Periodic Table', lectureCount: 16 },
        { name: 'Chemical Equilibrium', lectureCount: 22 },
        { name: 'Thermodynamics', lectureCount: 19 },
        { name: 'Electrochemistry', lectureCount: 17 },
        { name: 'Organic Chemistry Basics', lectureCount: 25 },
        { name: 'Hydrocarbons', lectureCount: 23 },
        { name: 'Biomolecules', lectureCount: 21 },
      ]
    },
    {
      name: 'Botany',
      chapters: [
        { name: 'Plant Kingdom', lectureCount: 22 },
        { name: 'Morphology of Flowering Plants', lectureCount: 18 },
        { name: 'Anatomy of Flowering Plants', lectureCount: 20 },
        { name: 'Cell Structure and Function', lectureCount: 24 },
        { name: 'Plant Physiology', lectureCount: 26 },
        { name: 'Reproduction in Plants', lectureCount: 19 },
        { name: 'Genetics and Evolution', lectureCount: 23 },
        { name: 'Ecology', lectureCount: 17 },
      ]
    },
    {
      name: 'Zoology',
      chapters: [
        { name: 'Animal Kingdom', lectureCount: 25 },
        { name: 'Structural Organization in Animals', lectureCount: 20 },
        { name: 'Biomolecules', lectureCount: 18 },
        { name: 'Digestion and Absorption', lectureCount: 16 },
        { name: 'Breathing and Exchange of Gases', lectureCount: 14 },
        { name: 'Body Fluids and Circulation', lectureCount: 17 },
        { name: 'Excretory Products and Elimination', lectureCount: 15 },
        { name: 'Neural Control and Coordination', lectureCount: 22 },
        { name: 'Reproduction', lectureCount: 21 },
        { name: 'Human Health and Disease', lectureCount: 19 },
      ]
    }
  ]

  const createdSubjects = []

  for (const subjectData of subjects) {
    const subject = await prisma.subject.create({
      data: {
        name: subjectData.name,
        totalQuestions: 0,
        completionPercentage: 0,
      },
    })

    const chapters = await Promise.all(
      subjectData.chapters.map(chapterData =>
        prisma.chapter.create({
          data: {
            subjectId: subject.id,
            name: chapterData.name,
            lectureCount: chapterData.lectureCount,
            lecturesCompleted: new Array(chapterData.lectureCount).fill(false),
            dppCompleted: new Array(chapterData.lectureCount).fill(false),
            assignmentQuestions: 0,
            assignmentCompleted: [],
            kattarQuestions: 0,
            kattarCompleted: [],
            revisionScore: 1,
          },
        })
      )
    )

    createdSubjects.push({
      ...subject,
      chapters,
    })
  }

  return createdSubjects
}

/**
 * Check if a user has subjects initialized
 */
export async function hasUserSubjects(userId: string): Promise<boolean> {
  const subjectCount = await prisma.subject.count()
  return subjectCount > 0
}

/**
 * Get all subjects with chapters for a user
 */
export async function getUserSubjectsWithChapters(userId: string) {
  return await prisma.subject.findMany({
    include: {
      chapters: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

/**
 * Calculate and update completion percentage for a subject
 */
export async function updateSubjectCompletion(subjectId: string) {
  const chapters = await prisma.chapter.findMany({
    where: { subjectId },
  })

  if (chapters.length === 0) return

  let totalLectures = 0
  let completedLectures = 0
  let totalDpp = 0
  let completedDpp = 0

  chapters.forEach(chapter => {
    totalLectures += chapter.lectureCount
    completedLectures += Array.isArray(chapter.lecturesCompleted) 
      ? (chapter.lecturesCompleted as boolean[]).filter(Boolean).length 
      : 0
    totalDpp += chapter.lectureCount // DPP count equals lecture count
    completedDpp += Array.isArray(chapter.dppCompleted) 
      ? (chapter.dppCompleted as boolean[]).filter(Boolean).length 
      : 0
  })

  // Calculate overall completion percentage (lectures + DPP combined)
  const totalItems = totalLectures + totalDpp
  const completedItems = completedLectures + completedDpp
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  await prisma.subject.update({
    where: { id: subjectId },
    data: { completionPercentage },
  })

  return completionPercentage
}

export { prisma }