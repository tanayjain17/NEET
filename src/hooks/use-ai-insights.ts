import { useState, useCallback } from 'react';
import { StudyInsights, OptimalSchedule, WeakAreaFocus } from '@/lib/ai-insights';

type InsightType = 'study-insights' | 'optimal-schedule' | 'motivational-boost' | 'weak-area-focus';

interface UseAIInsightsReturn {
  insights: StudyInsights | null;
  schedule: OptimalSchedule | null;
  motivationalMessage: string | null;
  weakAreaFocus: WeakAreaFocus | null;
  loading: boolean;
  error: string | null;
  generateInsights: (type: InsightType) => Promise<void>;
  clearError: () => void;
}

export function useAIInsights(): UseAIInsightsReturn {
  const [insights, setInsights] = useState<StudyInsights | null>(null);
  const [schedule, setSchedule] = useState<OptimalSchedule | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  const [weakAreaFocus, setWeakAreaFocus] = useState<WeakAreaFocus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = useCallback(async (type: InsightType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ insightType: type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
        } else if (response.status === 503) {
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        } else {
          throw new Error(errorData.error || 'Failed to generate insights');
        }
      }

      const data = await response.json();

      // Update the appropriate state based on insight type
      switch (type) {
        case 'study-insights':
          setInsights(data.data);
          break;
        case 'optimal-schedule':
          setSchedule(data.data);
          break;
        case 'motivational-boost':
          setMotivationalMessage(data.data);
          break;
        case 'weak-area-focus':
          setWeakAreaFocus(data.data);
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('AI insights error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    insights,
    schedule,
    motivationalMessage,
    weakAreaFocus,
    loading,
    error,
    generateInsights,
    clearError,
  };
}