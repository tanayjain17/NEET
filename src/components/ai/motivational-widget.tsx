'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIInsights } from '@/hooks/use-ai-insights';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';

interface MotivationalWidgetProps {
  className?: string;
}

export function MotivationalWidget({ className }: MotivationalWidgetProps) {
  const { motivationalMessage, loading, error, generateInsights } = useAIInsights();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGetMotivation = async () => {
    await generateInsights('motivational-boost');
    setIsExpanded(true);
  };

  if (error) {
    return null; // Don't show widget if there's an error
  }

  return (
    <Card className={`bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 ${className}`}>
      <CardContent className="p-4">
        {!motivationalMessage && !isExpanded ? (
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-3">Need a motivation boost?</p>
            <Button
              onClick={handleGetMotivation}
              disabled={loading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Get AI Motivation
            </Button>
          </div>
        ) : motivationalMessage ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h3 className="font-medium text-blue-400">AI Motivation</h3>
              </div>
              <Button
                onClick={handleGetMotivation}
                disabled={loading}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{motivationalMessage}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Generating motivation...</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}