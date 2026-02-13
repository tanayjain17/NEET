import Groq from 'groq-sdk';

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10, // Max requests per minute
  windowMs: 60 * 1000, // 1 minute window
};

// Simple in-memory rate limiter
class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than the window
    this.requests = this.requests.filter(time => now - time < RATE_LIMIT.windowMs);
    
    if (this.requests.length >= RATE_LIMIT.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, RATE_LIMIT.windowMs - (Date.now() - oldestRequest));
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Lazy initialization of Groq client
let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new GroqError('Groq API key is not configured', 'MISSING_API_KEY');
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

// Error types for better error handling
export class GroqError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'GroqError';
  }
}

export class RateLimitError extends GroqError {
  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Retry after ${Math.ceil(retryAfter / 1000)} seconds.`);
    this.code = 'RATE_LIMIT_EXCEEDED';
  }
}

// Groq API client with error handling and rate limiting
export class GroqClient {
  private static instance: GroqClient;

  private constructor() {}

  static getInstance(): GroqClient {
    if (!GroqClient.instance) {
      GroqClient.instance = new GroqClient();
    }
    return GroqClient.instance;
  }

  async generateCompletion(
    prompt: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<string> {
    // Check rate limit
    if (!rateLimiter.canMakeRequest()) {
      const retryAfter = rateLimiter.getTimeUntilReset();
      throw new RateLimitError(retryAfter);
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      throw new GroqError('Groq API key is not configured', 'MISSING_API_KEY');
    }

    try {
      const groqClient = getGroqClient();
      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: options.model || 'llama-3.1-8b-instant',
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new GroqError('No content received from Groq API', 'EMPTY_RESPONSE');
      }

      return content;
    } catch (error: any) {
      // Handle different types of errors
      if (error.status === 429) {
        throw new RateLimitError(60000); // 1 minute retry
      } else if (error.status === 401) {
        throw new GroqError('Invalid API key', 'INVALID_API_KEY');
      } else if (error.status === 400) {
        throw new GroqError('Invalid request parameters', 'INVALID_REQUEST');
      } else if (error.status >= 500) {
        throw new GroqError('Groq API server error', 'SERVER_ERROR');
      } else if (error instanceof GroqError) {
        throw error;
      } else {
        throw new GroqError(
          `Unexpected error: ${error.message || 'Unknown error'}`,
          'UNKNOWN_ERROR'
        );
      }
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.generateCompletion('Hello', { maxTokens: 10 });
      return true;
    } catch (error) {
      console.error('Groq health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const groqClient = GroqClient.getInstance();