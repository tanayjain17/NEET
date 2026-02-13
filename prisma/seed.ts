import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subjects = [
  {
    name: 'Physics',
    chapters: [
      { name: 'Basics Maths', lectureCount: 15 },
      { name: 'Unit & Dimension', lectureCount: 12 },
      { name: 'Vectors', lectureCount: 9 },
      { name: 'Motion in Straight', lectureCount: 16 },
      { name: 'Motion in Plane', lectureCount: 10 },
      { name: 'Law\'s of Motion', lectureCount: 18 },
      { name: 'WPE & COM', lectureCount: 12 },
      { name: 'Rotation Motion', lectureCount: 14 },
      { name: 'Gravitation', lectureCount: 8 },
      { name: 'Mech Prop Sol & Fluid', lectureCount: 8 },
      { name: 'Thermal Prop', lectureCount: 9 },
      { name: 'KTG & Thermodynamic', lectureCount: 8 },
      { name: 'Oscillations', lectureCount: 7 },
      { name: 'Waves', lectureCount: 9 },
      { name: 'Elec Charge & Field', lectureCount: 10 },
      { name: 'Electrostatic & Capci', lectureCount: 12 },
      { name: 'Current Electricity', lectureCount: 10 },
      { name: 'Moving Charges & Magnetism', lectureCount: 2 },
      { name: 'Magnetism & Matter', lectureCount: 12 },
      { name: 'Electromag Induction', lectureCount: 7 },
      { name: 'AC Waves & EM Waves', lectureCount: 8 },
      { name: 'Ray Optics', lectureCount: 11 },
      { name: 'Waves Optics', lectureCount: 6 },
      { name: 'Dual Nature & Atoms', lectureCount: 6 },
      { name: 'Nuclei & Semicon', lectureCount: 12 },
    ]
  },
  {
    name: 'Chemistry',
    chapters: [
      { name: 'Basic Concept of Chem', lectureCount: 15 },
      { name: 'Redox Reaction', lectureCount: 7 },
      { name: 'Solution', lectureCount: 11 },
      { name: 'Thermodynamics', lectureCount: 12 },
      { name: 'Chemical Equilibrium', lectureCount: 7 },
      { name: 'Ionic Equilibrium', lectureCount: 11 },
      { name: 'Electrochemistry', lectureCount: 9 },
      { name: 'Chemical Kinetics', lectureCount: 9 },
      { name: 'Structure of Atoms', lectureCount: 11 },
      { name: 'Practical Phy Chem', lectureCount: 2 },
      { name: 'Classification of Element and', lectureCount: 14 },
      { name: 'Chemical Bonding and Molec Struc', lectureCount: 18 },
      { name: 'Coord Compounds', lectureCount: 12 },
      { name: 'D-F Blocks', lectureCount: 6 },
      { name: 'P-Blocks', lectureCount: 9 },
      { name: 'Salt Analysis', lectureCount: 6 },
      { name: 'Organic Chem: IUPAC', lectureCount: 12 },
      { name: 'Org Chem: Isomerism', lectureCount: 15 },
      { name: 'Org Chem: GOC', lectureCount: 14 },
      { name: 'Hydrocarbon', lectureCount: 14 },
      { name: 'Haloalkanes & Haloare', lectureCount: 10 },
      { name: 'Alcohol Ether and Phenols', lectureCount: 8 },
      { name: 'Aldehyde Ketones and Carboxylic Acid', lectureCount: 11 },
      { name: 'Amines', lectureCount: 6 },
      { name: 'Biomolecules', lectureCount: 7 },
      { name: 'Ification and Quant Anal', lectureCount: 3 },
    ]
  },
  {
    name: 'Botany',
    chapters: [
      { name: 'Cell', lectureCount: 12 },
      { name: 'Cell cycle and cell division', lectureCount: 6 },
      { name: 'Living world', lectureCount: 5 },
      { name: 'Biological classification', lectureCount: 7 },
      { name: 'Plant kingdom', lectureCount: 10 },
      { name: 'Morphology', lectureCount: 18 },
      { name: 'Anatomy', lectureCount: 12 },
      { name: 'Respiration', lectureCount: 14 },
      { name: 'Photosynthesis', lectureCount: 8 },
      { name: 'Pgr', lectureCount: 8 },
      { name: 'Sexual repro', lectureCount: 9 },
      { name: 'Mbi', lectureCount: 8 },
      { name: 'Poi', lectureCount: 7 },
      { name: 'Microbes', lectureCount: 9 },
      { name: 'Organism', lectureCount: 12 },
      { name: 'Ecosystem', lectureCount: 10 },
      { name: 'Biodiversity', lectureCount: 10 },
    ]
  },
  {
    name: 'Zoology',
    chapters: [
      { name: 'Structural organisation', lectureCount: 13 },
      { name: 'Breathing', lectureCount: 7 },
      { name: 'Body fluid', lectureCount: 9 },
      { name: 'Excretion', lectureCount: 16 },
      { name: 'Locomotion', lectureCount: 10 },
      { name: 'Neural control', lectureCount: 18 },
      { name: 'Chemical control and coordination', lectureCount: 12 },
      { name: 'Animal kingdom', lectureCount: 14 },
      { name: 'Biolmolecules', lectureCount: 8 },
      { name: 'Human repro', lectureCount: 8 },
      { name: 'Reproductive health', lectureCount: 9 },
      { name: 'Human health and diseases', lectureCount: 8 },
      { name: 'Biotech processes', lectureCount: 7 },
      { name: 'Biotech applications', lectureCount: 9 },
      { name: 'Evolution', lectureCount: 12 },
    ]
  }
];

async function main() {
  console.log('Start seeding...')

  // Seed subjects and chapters
  for (const subjectData of subjects) {
    // Check if subject already exists
    let subject = await prisma.subject.findFirst({
      where: {
        name: subjectData.name
      }
    })

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: subjectData.name,
          totalQuestions: 0,
          completionPercentage: 0,
        },
      })
    }

    console.log(`Created subject: ${subject.name}`)

    // Create chapters for this subject
    for (const chapterData of subjectData.chapters) {
      // Check if chapter already exists
      let chapter = await prisma.chapter.findFirst({
        where: {
          subjectId: subject.id,
          name: chapterData.name
        }
      })

      if (!chapter) {
        chapter = await prisma.chapter.create({
          data: {
            subjectId: subject.id,
            name: chapterData.name,
            lectureCount: chapterData.lectureCount,
            lecturesCompleted: new Array(chapterData.lectureCount).fill(false),
            dppCompleted: new Array(chapterData.lectureCount).fill(false),
            dppQuestionCounts: new Array(chapterData.lectureCount).fill(0),
            assignmentQuestions: 0,
            assignmentCompleted: [],
            kattarQuestions: 0,
            kattarCompleted: [],
            revisionScore: 1,
          },
        })
      }

      console.log(`  Created chapter: ${chapter.name} (${chapter.lectureCount} lectures)`)
    }
  }
  
  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })