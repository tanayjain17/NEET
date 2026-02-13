'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Activity,
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
  data?: {
    competitiveData?: Partial<CompetitiveData> & Record<string, unknown>;
  } & Record<string, unknown>;
};

const clampPct = (value: number) => Math.max(0, Math.min(100, value));
const safeNum = (n: unknown, fallback = 0) => (Number.isFinite(Number(n)) ? Number(n) : fallback);

export function CompetitiveEdgeSystem() {
  const [competitiveData, setCompetitiveData] = useState<CompetitiveData>({
    currentRank: 0,
    targetRank: 50,
    gapAnalysis: { questionsGap: 0, hoursGap: 0, accuracyGap: 0 },
    topperPatterns: { dailyQuestions: 400, studyHours: 12, accuracy: 85, revisionCycles: 3 },
    candidateProgress: { dailyQuestions: 0, studyHours: 0, accuracy: 0, revisionCycles: 0 },
  });

  const [isLoading, setIsLoading] = useState(true);

  // Insight panel state
  const [showInsight, setShowInsight] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState('');

  const calculateProgress = (current: number, target: number): number => {
    if (!target || target <= 0) return 0;
    return clampPct((current / target) * 100);
  };

  const derived = useMemo(() => {
    const qPct = calculateProgress(
      competitiveData.candidateProgress.dailyQuestions,
      competitiveData.topperPatterns.dailyQuestions
    );
    const hPct = calculateProgress(
      competitiveData.candidateProgress.studyHours,
      competitiveData.topperPatterns.studyHours
    );

    // accuracy is already a percentage; treat 85 as 85%
    const aPct = clampPct(competitiveData.candidateProgress.accuracy);

    return { qPct, hPct, aPct };
  }, [competitiveData]);

  const buildProfessionalInsight = (d: CompetitiveData) => {
    const qTarget = d.topperPatterns.dailyQuestions;
    const hTarget = d.topperPatterns.studyHours;
    const aTarget = d.topperPatterns.accuracy;

    const q = d.candidateProgress.dailyQuestions;
    const h = d.candidateProgress.studyHours;
    const a = d.candidateProgress.accuracy;

    const recommendations: string[] = [];

    // Prioritize the largest relative deficits first
    const qDef = qTarget > 0 ? (qTarget - q) / qTarget : 0;
    const hDef = hTarget > 0 ? (hTarget - h) / hTarget : 0;
    const aDef = aTarget > 0 ? (aTarget - a) / aTarget : 0;

    const deficits = [
      { key: 'volume', v: qDef },
      { key: 'duration', v: hDef },
      { key: 'accuracy', v: aDef },
    ].sort((x, y) => y.v - x.v);

    for (const item of deficits) {
      if (item.v <= 0.05) continue; // ignore small gaps

      if (item.key === 'volume') {
        const delta = Math.max(0, qTarget - q);
        recommendations.push(
          `Question throughput is below the benchmark by ~${delta}/day. Consider adding 2 focused blocks (timed mixed sets) to raise volume without increasing error rate.`
        );
      }
      if (item.key === 'duration') {
        const delta = Math.max(0, hTarget - h);
        recommendations.push(
          `Study time is below the benchmark by ~${delta} hour(s)/day. Prioritize high-yield topics and schedule a fixed deep-work window to stabilize daily consistency.`
        );
      }
      if (item.key === 'accuracy') {
        const delta = Math.max(0, aTarget - a);
        recommendations.push(
          `Accuracy is below the benchmark by ~${delta} percentage point(s). Shift 20–30% of practice time to error-log review and spaced revision to reduce repeat misses.`
        );
      }

      // Keep it concise: max 2 recommendations
      if (recommendations.length >= 2) break;
    }

    if (recommendations.length === 0) {
      return `Metrics are aligned with the benchmark cohort. Maintain current cadence and emphasize revision cycles to protect accuracy under time pressure.`;
    }

    return recommendations.join(' ');
  };

  const generatePerformanceInsight = () => {
    setIsAnalyzing(true);
    setShowInsight(true);
    setDisplayedInsight('');

    // short analysis delay for UX
    setTimeout(() => {
      setIsAnalyzing(false);

      const insight = buildProfessionalInsight(competitiveData);

      // Typewriter effect (kept, but now for professional insight text)
      let i = 0;
      const typeWriter = () => {
        if (i < insight.length) {
          setDisplayedInsight(insight.slice(0, i + 1));
          i += 1;
          setTimeout(typeWriter, 18);
        }
      };
      typeWriter();

      setTimeout(() => setShowInsight(false), insight.length * 18 + 3500);
    }, 800);
  };

  // Load real-time data from API (no name-specific fields)
  useEffect(() => {
    let isMounted = true;

    const loadRealData = async () => {
      const controller = new AbortController();
      try {
        setIsLoading(true);

        const response = await fetch('/api/competitive-edge-data', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });

        const result = (await response.json()) as ApiShape;

        if (!isMounted) return;

        if (result?.success) {
          const raw = (result.data?.competitiveData ?? result.data ?? {}) as Record<string, any>;

          // Backward compatibility: accept multiple generic keys, but remove any name-specific mapping.
          const candidateProgress =
            raw.candidateProgress ??
            raw.userProgress ??
            raw.studentProgress ??
            raw.progress ??
            competitiveData.candidateProgress;

          const normalized: CompetitiveData = {
            currentRank: safeNum(raw.currentRank, competitiveData.currentRank),
            targetRank: safeNum(raw.targetRank, competitiveData.targetRank),
            gapAnalysis: {
              questionsGap: safeNum(raw.gapAnalysis?.questionsGap, competitiveData.gapAnalysis.questionsGap),
              hoursGap: safeNum(raw.gapAnalysis?.hoursGap, competitiveData.gapAnalysis.hoursGap),
              accuracyGap: safeNum(raw.gapAnalysis?.accuracyGap, competitiveData.gapAnalysis.accuracyGap),
            },
            topperPatterns: {
              dailyQuestions: safeNum(raw.topperPatterns?.dailyQuestions, competitiveData.topperPatterns.dailyQuestions),
              studyHours: safeNum(raw.topperPatterns?.studyHours, competitiveData.topperPatterns.studyHours),
              accuracy: safeNum(raw.topperPatterns?.accuracy, competitiveData.topperPatterns.accuracy),
              revisionCycles: safeNum(raw.topperPatterns?.revisionCycles, competitiveData.topperPatterns.revisionCycles),
            },
            candidateProgress: {
              dailyQuestions: safeNum(candidateProgress?.dailyQuestions, competitiveData.candidateProgress.dailyQuestions),
              studyHours: safeNum(candidateProgress?.studyHours, competitiveData.candidateProgress.studyHours),
              accuracy: safeNum(candidateProgress?.accuracy, competitiveData.candidateProgress.accuracy),
              revisionCycles: safeNum(candidateProgress?.revisionCycles, competitiveData.candidateProgress.revisionCycles),
            },
          };

          setCompetitiveData(normalized);
        } else {
          console.error('Failed to load competitive analytics:', result?.error);
        }

        setIsLoading(false);
      } catch (error) {
        if ((error as any)?.name !== 'AbortError') {
          console.error('System error loading performance data:', error);
        }
        if (isMounted) setIsLoading(false);
      }

      return () => controller.abort();
    };

    loadRealData();
    const interval = setInterval(loadRealData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Card className="bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950 border-slate-800 shadow-2xl">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Microscope className="h-6 w-6 text-cyan-300" />
                <span>Competitive Performance Analytics</span>
                <BarChart3 className="h-4 w-4 text-indigo-300 animate-pulse" />
              </div>
              <Badge
                variant="outline"
                className="text-cyan-300 border-cyan-400/25 bg-cyan-950/25 font-mono text-xs"
              >
                REAL-TIME TELEMETRY
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* Performance Overview Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden p-5 bg-slate-950/35 border border-indigo-400/15 rounded-lg hover:border-indigo-300/25 transition-all duration-200">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <TrendingUp className="h-20 w-20 text-indigo-300" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Current Rank Projection
                  </span>
                  {isLoading ? (
                    <div className="text-3xl font-mono font-bold text-slate-500 animate-pulse mt-2">
                      PROCESSING…
                    </div>
                  ) : (
                    <div className="text-4xl font-mono font-bold text-indigo-300 mt-2">
                      #{competitiveData.currentRank.toLocaleString()}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Model-driven trajectory (latest data)
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-5 bg-slate-950/35 border border-emerald-400/15 rounded-lg hover:border-emerald-300/25 transition-all duration-200">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Target className="h-20 w-20 text-emerald-300" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Target Benchmark
                  </span>
                  <div className="text-4xl font-mono font-bold text-emerald-300 mt-2">
                    Top #{competitiveData.targetRank}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" />
                    Target cohort threshold
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Analysis Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
                <HeartPulse className="h-4 w-4 text-cyan-300" />
                Gap Analysis vs Benchmark Cohort
              </h3>

              <div className="space-y-4 bg-slate-950/25 p-5 rounded-lg border border-slate-800">
                {/* Daily Questions Metric */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <span className="col-span-3 text-slate-300 text-sm font-medium">Question Throughput</span>
                  <div className="col-span-6">
                    <Progress
                      value={derived.qPct}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{competitiveData.candidateProgress.dailyQuestions}</span>
                      <span>{competitiveData.topperPatterns.dailyQuestions}</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <Badge className="bg-indigo-950/35 text-indigo-200 border-indigo-800/40 font-mono text-xs">
                      {competitiveData.gapAnalysis.questionsGap >= 0 ? '−' : '+'}
                      {Math.abs(competitiveData.gapAnalysis.questionsGap)} / day
                    </Badge>
                  </div>
                </div>

                {/* Study Hours Metric */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <span className="col-span-3 text-slate-300 text-sm font-medium">Study Duration</span>
                  <div className="col-span-6">
                    <Progress
                      value={derived.hPct}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{competitiveData.candidateProgress.studyHours}h</span>
                      <span>{competitiveData.topperPatterns.studyHours}h</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <Badge className="bg-indigo-950/35 text-indigo-200 border-indigo-800/40 font-mono text-xs">
                      {competitiveData.gapAnalysis.hoursGap >= 0 ? '−' : '+'}
                      {Math.abs(competitiveData.gapAnalysis.hoursGap)}h / day
                    </Badge>
                  </div>
                </div>

                {/* Accuracy Metric */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <span className="col-span-3 text-slate-300 text-sm font-medium">Accuracy Rate</span>
                  <div className="col-span-6">
                    <Progress value={clampPct(competitiveData.candidateProgress.accuracy)} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{competitiveData.candidateProgress.accuracy}%</span>
                      <span>{competitiveData.topperPatterns.accuracy}%</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <Badge className="bg-indigo-950/35 text-indigo-200 border-indigo-800/40 font-mono text-xs">
                      {competitiveData.gapAnalysis.accuracyGap >= 0 ? '−' : '+'}
                      {Math.abs(competitiveData.gapAnalysis.accuracyGap)} pp
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Generator */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={generatePerformanceInsight}
                className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-blue-600 hover:from-indigo-700 hover:via-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-900/20 transform hover:scale-[1.02] transition-all duration-200 w-full max-w-md border border-indigo-500/50"
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Actionable Insight
              </Button>
            </div>

            {/* Insight Panel */}
            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 bg-gradient-to-r from-indigo-950/45 via-slate-950/45 to-cyan-950/45 border border-indigo-500/25 rounded-xl shadow-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-4 border-b border-indigo-500/15 pb-3">
                    <Lightbulb className="h-5 w-5 text-cyan-300" />
                    <h3 className="text-lg font-semibold text-slate-100">Analyst Summary</h3>
                  </div>

                  {isAnalyzing ? (
                    <div className="flex items-center gap-3 text-slate-300 py-4">
                      <Timer className="h-4 w-4 animate-spin text-cyan-300" />
                      <span className="text-sm font-mono">Synthesizing performance signals…</span>
                    </div>
                  ) : (
                    <div className="min-h-[3rem] py-2">
                      <p className="text-slate-200 text-base leading-relaxed font-medium">
                        {displayedInsight}
                        <span className="inline-block w-0.5 h-5 bg-cyan-300 ml-1 animate-pulse align-middle" />
                      </p>
                    </div>
                  )}

                  {!isAnalyzing && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={generatePerformanceInsight}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-200 hover:text-white hover:bg-indigo-900/40 transition-colors duration-200"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        Generate New Summary
                      </Button>
                    </div>
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
