/**
 * Data Validation & Offline Sync Engine
 * Ensures data consistency and handles offline scenarios
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitizedData?: any
}

export class DataValidationEngine {
  /**
   * Validate daily goals data
   */
  static validateDailyGoals(data: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Required fields
    if (!data.date) errors.push('Date is required')
    if (typeof data.physicsQuestions !== 'number') errors.push('Physics questions must be a number')
    if (typeof data.chemistryQuestions !== 'number') errors.push('Chemistry questions must be a number')
    if (typeof data.botanyQuestions !== 'number') errors.push('Botany questions must be a number')
    if (typeof data.zoologyQuestions !== 'number') errors.push('Zoology questions must be a number')
    
    // Range validation
    if (data.physicsQuestions < 0 || data.physicsQuestions > 1000) {
      errors.push('Physics questions must be between 0-1000')
    }
    if (data.chemistryQuestions < 0 || data.chemistryQuestions > 1000) {
      errors.push('Chemistry questions must be between 0-1000')
    }
    if (data.botanyQuestions < 0 || data.botanyQuestions > 1000) {
      errors.push('Botany questions must be between 0-1000')
    }
    if (data.zoologyQuestions < 0 || data.zoologyQuestions > 1000) {
      errors.push('Zoology questions must be between 0-1000')
    }
    
    // Logic validation
    const totalQuestions = data.physicsQuestions + data.chemistryQuestions + data.botanyQuestions + data.zoologyQuestions
    if (totalQuestions > 2000) {
      warnings.push('Total questions exceed 2000 - this seems unusually high')
    }
    if (totalQuestions < 100) {
      warnings.push('Total questions below 100 - consider increasing daily target')
    }
    
    // Date validation
    const inputDate = new Date(data.date)
    const today = new Date()
    const futureLimit = new Date()
    futureLimit.setDate(today.getDate() + 1)
    
    if (inputDate > futureLimit) {
      errors.push('Cannot log goals for future dates beyond tomorrow')
    }
    
    const pastLimit = new Date()
    pastLimit.setDate(today.getDate() - 30)
    if (inputDate < pastLimit) {
      warnings.push('Logging goals for more than 30 days ago - data might be outdated')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData: errors.length === 0 ? {
        ...data,
        totalQuestions,
        date: inputDate.toISOString().split('T')[0]
      } : undefined
    }
  }

  /**
   * Validate test performance data
   */
  static validateTestPerformance(data: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Required fields
    if (!data.testType) errors.push('Test type is required')
    if (!data.testNumber) errors.push('Test number is required')
    if (typeof data.score !== 'number') errors.push('Score must be a number')
    if (!data.testDate) errors.push('Test date is required')
    
    // Score validation
    if (data.score < 0 || data.score > 720) {
      errors.push('Score must be between 0-720')
    }
    
    // Performance analysis
    if (data.score < 300) {
      warnings.push('Score below 300 - consider reviewing preparation strategy')
    } else if (data.score > 700) {
      warnings.push('Excellent score! Maintain this performance level')
    }
    
    // Test type validation
    const validTestTypes = [
      'Physics Wallah Mock',
      'Weekly Test',
      'Monthly Test',
      'Full Syllabus Test',
      'Subject Test',
      'Practice Test'
    ]
    
    if (!validTestTypes.includes(data.testType)) {
      warnings.push('Unusual test type - ensure it\'s a valid NEET preparation test')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData: errors.length === 0 ? {
        ...data,
        percentage: Math.round((data.score / 720) * 100),
        testDate: new Date(data.testDate).toISOString()
      } : undefined
    }
  }

  /**
   * Validate mistake analysis data
   */
  static validateMistakeAnalysis(data: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Required fields
    if (!data.mistakeCategories || !Array.isArray(data.mistakeCategories)) {
      errors.push('Mistake categories must be an array')
    }
    if (typeof data.stressLevel !== 'number' || data.stressLevel < 1 || data.stressLevel > 10) {
      errors.push('Stress level must be between 1-10')
    }
    if (typeof data.energyLevel !== 'number' || data.energyLevel < 1 || data.energyLevel > 10) {
      errors.push('Energy level must be between 1-10')
    }
    if (typeof data.focusLevel !== 'number' || data.focusLevel < 1 || data.focusLevel > 10) {
      errors.push('Focus level must be between 1-10')
    }
    
    // Validate mistake categories
    const validCategories = [
      'formula_error',
      'unit_conversion',
      'diagram_misinterpretation',
      'calculation_error',
      'question_misreading',
      'conceptual_gaps',
      'silly_mistakes',
      'overthinking',
      'time_pressure',
      'panic_response'
    ]
    
    if (data.mistakeCategories) {
      const invalidCategories = data.mistakeCategories.filter((cat: string) => !validCategories.includes(cat))
      if (invalidCategories.length > 0) {
        warnings.push(`Unknown mistake categories: ${invalidCategories.join(', ')}`)
      }
    }
    
    // Performance correlation warnings
    if (data.stressLevel > 8 && data.focusLevel > 7) {
      warnings.push('High stress with high focus - monitor for burnout signs')
    }
    if (data.energyLevel < 3 && data.focusLevel > 6) {
      warnings.push('Low energy with high focus - unsustainable pattern')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData: errors.length === 0 ? data : undefined
    }
  }
}

/**
 * Offline Sync Manager
 */
export class OfflineSyncManager {
  private static readonly STORAGE_KEY = 'neet_tracker_offline_data'
  
  /**
   * Store data offline
   */
  static storeOfflineData(type: string, data: any) {
    try {
      const offlineData = this.getOfflineData()
      const timestamp = new Date().toISOString()
      
      if (!offlineData[type]) {
        offlineData[type] = []
      }
      
      offlineData[type].push({
        ...data,
        _offline_timestamp: timestamp,
        _offline_id: this.generateOfflineId()
      })
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offlineData))
      
      return true
    } catch (error) {
      console.error('Failed to store offline data:', error)
      return false
    }
  }
  
  /**
   * Get offline data
   */
  static getOfflineData(): Record<string, any[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Failed to get offline data:', error)
      return {}
    }
  }
  
  /**
   * Sync offline data when online
   */
  static async syncOfflineData() {
    const offlineData = this.getOfflineData()
    const syncResults = []
    
    for (const [type, items] of Object.entries(offlineData)) {
      for (const item of items) {
        try {
          const result = await this.syncSingleItem(type, item)
          syncResults.push({ type, item, success: result.success, error: result.error })
          
          if (result.success) {
            // Remove from offline storage
            this.removeOfflineItem(type, item._offline_id)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          syncResults.push({ type, item, success: false, error: errorMessage })
        }
      }
    }
    
    return syncResults
  }
  
  /**
   * Sync single item
   */
  private static async syncSingleItem(type: string, item: any) {
    const endpoints = {
      'daily_goals': '/api/daily-goals',
      'test_performance': '/api/tests',
      'mistake_analysis': '/api/mistakes/analyze'
    }
    
    const endpoint = endpoints[type as keyof typeof endpoints]
    if (!endpoint) {
      return { success: false, error: 'Unknown data type' }
    }
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      
      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: `HTTP ${response.status}` }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * Remove offline item
   */
  private static removeOfflineItem(type: string, offlineId: string) {
    const offlineData = this.getOfflineData()
    if (offlineData[type]) {
      offlineData[type] = offlineData[type].filter(item => item._offline_id !== offlineId)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offlineData))
    }
  }
  
  /**
   * Generate offline ID
   */
  private static generateOfflineId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Check if online
   */
  static isOnline(): boolean {
    return navigator.onLine
  }
  
  /**
   * Get offline data count
   */
  static getOfflineDataCount(): number {
    const offlineData = this.getOfflineData()
    return Object.values(offlineData).reduce((total, items) => total + items.length, 0)
  }
  
  /**
   * Clear all offline data
   */
  static clearOfflineData() {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}