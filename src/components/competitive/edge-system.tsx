'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Brain,
  BarChart3,
  Lightbulb,
  TrendingUp,
  ArrowUpRight,
  Timer,
  Microscope,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompetitiveData {
  currentRank: number;
  targetRank: number;
  gapAnalysis: {
    questionsGap: number;
    hoursGap: number;
    accuracyGap: number;
  };
  topperPatterns: {
    dailyQuestions: number;
    studyHours: number;
    accuracy: number;
    revisionCycles: number;
  };
  candidateProgress: {
    dailyQuestions: number;
    studyHours: number;
    accuracy: number;
    revisionCycles: number;
  };
}

type ApiShape = {
  success: boolean;
  error?: string;
  data?: any;
};

const clampPct = (value: number) => Math.max(0, Math.min(100, value));
const safeNum = (n: unknown, fallback = 0) =>
  Number.isFinite(Number(n)) ? Number(n) : fallback;

export default function CompetitiveEdgeSystem() {
  const [competitiveData, setCompetitiveData] = useState<CompetitiveData>({
    currentRank: 0,
    targetRank: 50,
    gapAnalysis: { questionsGap: 0, hoursGap: 0, accuracyGap: 0 },
    topperPatterns: {
      dailyQuestions: 400,
      studyHours: 12,
      accuracy: 85,
      revisionCycles: 3,
    },
    candidateProgress: {
      dailyQuestions: 0,
      studyHours: 0,
      accuracy: 0,
      revisionCycles: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showInsight, setShowInsight] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState('');

  const calculateProgress = (current: number, target: number) => {
    if (!target || target <= 0) return 0;
    return clampPct((current / target) * 100);
  };

  const derived = useMemo(() => {
    return {
      qPct: calculateProgress(
        competitiveData.candidateProgress.dailyQuestions,
        competitiveData.topperPatterns.dailyQuestions
      ),
      hPct: calculateProgress(
        competitiveData.candidateProgress.studyHours,
        competitiveData.topperPatterns.studyHours
      ),
      aPct: clampPct(competitiveData.candidateProgress.accuracy),
    };
  }, [competitiveData]);

  const buildProfessionalInsight = (d: CompetitiveData) => {
    const recommendations: string[] = [];

    const qDef =
      (d.topperPatterns.dailyQuestions - d.candidateProgress.dailyQuestions) /
      d.topperPatterns.dailyQuestions;

    const hDef =
      (d.topperPatterns.studyHours - d.candidateProgress.studyHours) /
      d.topperPatterns.studyHours;

    const aDef =
      (d.topperPatterns.accuracy - d.candidateProgress.accuracy) /
      d.topperPatterns.accuracy;

    const deficits = [
      { key: 'volume', v: qDef },
      { key: 'duration', v: hDef },
      { key: 'accuracy', v: aDef },
    ].sort((a, b) => b.v - a.v);

    for (const item of deficits) {
      if (item.v <= 0.05) continue;

      if (item.key === 'volume') {
        recommendations.push(
          `Increase daily question throughput with timed mixed sets to close volume gap.`
        );
      }
      if (item.key === 'duration') {
        recommendations.push(
          `Stabilize daily deep-work blocks to match top cohort study duration.`
        );
      }
      if (item.key === 'accuracy') {
        recommendations.push(
          `Allocate 25% practice time to structured error-log review to improve accuracy.`
        );
      }

      if (recommendations.length >= 2) break;
    }

    if (!recommendations.length) {
      return `Metrics aligned with benchmark cohort. Maintain cadence and prioritize revision cycles under timed conditions.`;
    }

    return recommendations.join(' ');
  };

  const generatePerformanceInsight = () => {
    setIsAnalyzing(true);
    setShowInsight(true);
    setDisplayedInsight('');

    setTimeout(() => {
      setIsAnalyzing(false);
      const insight = buildProfessionalInsight(competitiveData);

      let i = 0;
      const typeWriter = () => {
        if (i < insight.length) {
          setDisplayedInsight(insight.slice(0, i + 1));
          i++;
          setTimeout(typeWriter, 15);
        }
      };
      typeWriter();
    }, 700);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/competitive-edge-data');
        const result = (await response.json()) as ApiShape;

        if (!isMounted || !result?.success) return;

        const raw = result.data ?? {};

        const normalized: CompetitiveData = {
          currentRank: safeNum(raw.currentRank),
          targetRank: safeNum(raw.targetRank, 50),
          gapAnalysis: {
            questionsGap: safeNum(raw.gapAnalysis?.questionsGap),
            hoursGap: safeNum(raw.gapAnalysis?.hoursGap),
            accuracyGap: safeNum(raw.gapAnalysis?.accuracyGap),
          },
          topperPatterns: {
            dailyQuestions: safeNum(raw.topperPatterns?.dailyQuestions, 400),
            studyHours: safeNum(raw.topperPatterns?.studyHours, 12),
            accuracy: safeNum(raw.topperPatterns?.accuracy, 85),
            revisionCycles: safeNum(raw.topperPatterns?.revisionCycles, 3),
          },
          candidateProgress: {
            dailyQuestions: safeNum(raw.candidateProgress?.dailyQuestions),
            studyHours: safeNum(raw.candidateProgress?.studyHours),
            accuracy: safeNum(raw.candidateProgress?.accuracy),
            revisionCycles: safeNum(raw.candidateProgress?.revisionCycles),
          },
        };

        setCompetitiveData(normalized);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="bg-slate-950 border-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Microscope className="h-5 w-5 text-cyan-300" />
              Competitive Performance Analytics
              <BarChart3 className="h-4 w-4 text-indigo-300 animate-pulse" />
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Button
                onClick={generatePerformanceInsight}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Actionable Insight
              </Button>
            </div>

            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-indigo-950/40 rounded-lg border border-indigo-500/25"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Timer className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <p className="text-slate-200">{displayedInsight}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
