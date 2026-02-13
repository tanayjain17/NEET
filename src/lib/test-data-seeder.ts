import { TestPerformanceRepository, TestType } from './repositories/test-performance-repository'

export async function seedTestData(userId: string) {
  const testTypes: TestType[] = ['Weekly Test', 'Rank Booster', 'Test Series', 'AITS', 'Full Length Test']
  
  // Generate sample test data over the last 3 months
  const tests = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 3)
  
  for (let i = 0; i < 15; i++) {
    const testDate = new Date(startDate)
    testDate.setDate(startDate.getDate() + (i * 7)) // Weekly tests
    
    const testType = testTypes[i % testTypes.length]
    
    // Simulate improving scores with some variation
    const baseScore = 300 + (i * 20) + Math.floor(Math.random() * 50)
    const score = Math.min(720, Math.max(0, baseScore))
    
    tests.push({
      userId,
      testType,
      testNumber: `Test-${String(i + 1).padStart(2, '0')}`,
      score,
      testDate
    })
  }
  
  // Create all test records
  for (const test of tests) {
    try {
      await TestPerformanceRepository.create(test)
    } catch (error) {
      console.error('Error creating test:', error)
    }
  }
  
  console.log(`Seeded ${tests.length} test records for user ${userId}`)
}