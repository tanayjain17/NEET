export class DatabaseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function handleDatabaseError(error: any): never {
  console.error('Database error:', error)
  
  if (error.code === 'P2002') {
    throw new DatabaseError('Data already exists')
  }
  
  if (error.code === 'P2025') {
    throw new DatabaseError('Record not found')
  }
  
  throw new DatabaseError('Database operation failed', error)
}

export function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let lastError: Error = new Error('Unknown error')
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await operation()
        resolve(result)
        return
      } catch (error) {
        lastError = error as Error
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }
    
    reject(lastError)
  })
}