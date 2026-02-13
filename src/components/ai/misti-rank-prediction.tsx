
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Target, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { RankPredictionResult } from '@/lib/rank-prediction-engine'

// Helper to format large numbers
const formatNumber = (num: number) => num.toLocaleString()

export default function RankPredictionDisplay() {
  const [prediction, setPrediction] = useState<RankPredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const generatePrediction = async () => {
    setLoading(true)
    try {
      // Demo payload preserved as-is (neutral/professional branding)
      const response = await fetch('/api/air-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latestMockScore: 640,
          averageMockScore: 610,
          physicsAccuracy: 85,
          chemistryAccuracy: 90,
          botanyAccuracy: 95,
          zoologyAccuracy: 92,
          dailyStudyHours: 10,
          sleepQuality: 7,
          stressLevel: 4
        })
      })

      const result = await response.json()
      if (result.success) {
        setPrediction(result.data)
      }
    } catch (error) {
      console.error('Error generating prediction:', error)
    } finally {
      setLoading(false)
    }
  }

  // Visual Helpers (Rose / Blue / Emerald palette)
  const getScoreColor = (score: number) => {
    if (score >= 680) return 'text-emerald-400'
    if (score >= 600) return 'text-blue-400'
    return 'text-rose-400'
  }

  const getRankColor = (rank: number) => {
    if (rank <= 1000) return 'text-emerald-400'
    if (rank <= 10000) return 'text-blue-400'
    return 'text-rose-400'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-blue-600" />
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/15">
              <Target className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <div className="text-xl font-bold flex items-center gap-2">
                <span>🧠</span>
                <span>AI Rank Prediction Engine</span>
              </div>
              <div className="text-sm text-white/50 font-normal">
                Based on academic velocity, Bio‑Rhythm Sync signals, and historical trends
              </div>
            </div>
          </CardTitle>

          <button
            type="button"
            onClick={generatePrediction}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing Data...' : 'Run Simulation'}
          </button>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-300 rounded-full animate-spin mb-4" />
          <p className="text-cyan-200 animate-pulse">Processing academic metrics...</p>
          <p className="text-white/40 text-sm mt-2">Computing projections and confidence intervals</p>
        </motion.div>
      )}

      {/* Results Display */}
      {prediction && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Projected Score */}
            <Card className="bg-black/40 border border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-white/50 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                  <span>🧬</span>
                  <span>Projected Score</span>
                </div>

                <div className={`text-5xl font-bold mb-2 ${getScoreColor(prediction.predictedScore.mostLikely)}`}>
                  {prediction.predictedScore.mostLikely}
                  <span className="text-xl text-white/30 ml-1">/720</span>
                </div>

                <div className="text-xs text-white/40">
                  Range: {prediction.predictedScore.confidenceRange.min} - {prediction.predictedScore.confidenceRange.max}
                </div>
              </CardContent>
            </Card>

            {/* Projected AIR */}
            <Card className="bg-black/40 border border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-white/50 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                  <span>🩺</span>
                  <span>Predicted Rank (AIR)</span>
                </div>

                <div className={`text-5xl font-bold mb-2 ${getRankColor(prediction.predictedRank.mostLikely)}`}>
                  {formatNumber(prediction.predictedRank.mostLikely)}
                </div>

                <div className="text-xs text-white/40">
                  Range: {formatNumber(prediction.predictedRank.confidenceRange.min)} -{' '}
                  {formatNumber(prediction.predictedRank.confidenceRange.max)}
                </div>
              </CardContent>
            </Card>

            {/* Confidence */}
            <Card className="bg-black/40 border border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-white/50 uppercase tracking-wider mb-2">Model Confidence</div>
                <div className="text-5xl font-bold text-cyan-300 mb-2">
                  {(prediction.confidenceLevel * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-white/40">Based on data completeness</div>
              </CardContent>
            </Card>
          </div>

          {/* Admission Probabilities */}
          <Card className="bg-black/40 border border-cyan-500/15">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-300" />
                Admission Probabilities
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Top 1000 AIR</span>
                  <span className="text-emerald-400 font-mono font-bold">{prediction.probabilities.air1to1000}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${prediction.probabilities.air1to1000}%` }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Govt. Medical College</span>
                  <span className="text-blue-400 font-mono font-bold">{prediction.probabilities.governmentMedical}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${prediction.probabilities.governmentMedical}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">State Quota Seat</span>
                  <span className="text-cyan-300 font-mono font-bold">{prediction.probabilities.stateQuota}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${prediction.probabilities.stateQuota}%` }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Private Medical College</span>
                  <span className="text-indigo-300 font-mono font-bold">{prediction.probabilities.privateMedical}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${prediction.probabilities.privateMedical}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis & Roadmap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clinical Analysis */}
            <Card className="bg-black/40 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <span>🧬</span>
                  <span>Clinical Performance Analysis</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2">Key Strengths</h4>
                  <ul className="space-y-2">
                    {prediction.detailedAnalysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-rose-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Critical Attention Required
                  </h4>
                  <ul className="space-y-2">
                    {prediction.detailedAnalysis.criticalWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Roadmap */}
            <Card className="bg-black/40 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-300" />
                  Strategic Roadmap (Next 30 Days)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Physics Target</span>
                    <span className="text-white font-mono">
                      {prediction.improvementRoadmap.next30Days.dailyTargets.physics} Qs/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">Chemistry Target</span>
                    <span className="text-white font-mono">
                      {prediction.improvementRoadmap.next30Days.dailyTargets.chemistry} Qs/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Biology Target</span>
                    <span className="text-white font-mono">
                      {prediction.improvementRoadmap.next30Days.dailyTargets.biology} Qs/day
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">
                    High-Yield Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.improvementRoadmap.next30Days.focusAreas.map((area, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-blue-500/15 bg-blue-500/5 text-sm text-white/70">
                  <div className="font-semibold text-blue-200 mb-1">🩺 Bio‑Rhythm Sync</div>
                  <div className="text-white/55">
                    "Bio‑Rhythm Sync" is used as a professional interface term for biologically informed performance calibration.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  )
}
