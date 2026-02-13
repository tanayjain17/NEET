'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Target, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

// Define the shape of a Mistake Pattern
interface MistakePattern {
  id: string
  mistakeType: string
  subject: string
  frequency: number
  solutions: string[]
}

export default function RecurringMistakesAlert() {
  const queryClient = useQueryClient()

  const { data: mistakes = [], isLoading } = useQuery<MistakePattern[]>({
    queryKey: ['mistake-patterns'],
    queryFn: async () => {
      // In a real app, this would fetch from your API
      // For demo, we return an empty array or mock data if needed
      // const response = await fetch('/api/mistakes/patterns')
      // return response.json()
      
      // Mock Data for Demo Visualization
      return [
        {
          id: '1',
          mistakeType: 'calculation_error',
          subject: 'Physics',
          frequency: 6,
          solutions: ['Write down every step', 'Double check unit conversions']
        },
        {
          id: '2',
          mistakeType: 'conceptual_gap',
          subject: 'Organic Chemistry',
          frequency: 3,
          solutions: ['Review GOC mechanisms', 'Practice reaction maps']
        }
      ] 
    },
    // refetchInterval: 30000 
  })

  const resolveMistake = async (mistakeId: string) => {
    try {
      // Mock API call
      // await fetch('/api/mistakes/resolve', { method: 'POST', body: JSON.stringify({ id: mistakeId }) })
      
      // Optimistic update (remove from list locally)
      queryClient.setQueryData(['mistake-patterns'], (old: MistakePattern[] | undefined) => 
        old ? old.filter(m => m.id !== mistakeId) : []
      )
    } catch (error) {
      console.error('Error resolving mistake:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-black/40 border border-white/10 animate-pulse">
        <CardContent className="p-6 space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </CardContent>
      </Card>
    )
  }

  if (mistakes.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border border-emerald-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-lg">Pattern Clearance Verified</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 text-sm">No recurring error patterns detected. Maintain current protocols.</p>
        </CardContent>
      </Card>
    )
  }

  const criticalMistakes = mistakes.filter(m => m.frequency >= 5)
  const moderateMistakes = mistakes.filter(m => m.frequency >= 3 && m.frequency < 5)

  return (
    <div className="space-y-6">
      
      {/* Critical Mistakes Alert */}
      {criticalMistakes.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-rose-500/5 border border-rose-500/30 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
                <span className="text-lg">Critical Pattern Detected</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
                <p className="text-rose-200 text-sm font-medium">
                  Recurring error frequency exceeds threshold (5+). Immediate remediation required.
                </p>
              </div>

              <div className="space-y-3">
                {criticalMistakes.map((mistake) => (
                  <div key={mistake.id} className="p-3 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-rose-400 font-mono font-bold text-lg">#{mistake.frequency}</span>
                        <div>
                          <div className="text-white font-medium text-sm">
                            {mistake.mistakeType.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-white/40 text-xs uppercase tracking-wider">{mistake.subject}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => resolveMistake(mistake.id)}
                        className="text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" /> Resolve
                      </button>
                    </div>
                    
                    <div className="pl-2 border-l-2 border-white/10 ml-1">
                      <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Recommended Protocol</div>
                      <ul className="text-xs text-white/70 space-y-1">
                        {mistake.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-rose-400 mt-0.5">•</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Moderate Mistakes */}
      {moderateMistakes.length > 0 && (
        <Card className="bg-black/40 border border-yellow-500/20 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <span className="text-lg">Emerging Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moderateMistakes.map((mistake) => (
              <div key={mistake.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <span className="text-yellow-400 font-bold text-xs">{mistake.frequency}</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{mistake.mistakeType.replace('_', ' ')}</div>
                    <div className="text-white/40 text-xs">{mistake.subject}</div>
                  </div>
                </div>
                <button
                  onClick={() => resolveMistake(mistake.id)}
                  className="text-xs px-2 py-1 text-white/40 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      <Card className="bg-black/40 border border-blue-500/20 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            <span className="text-lg">Correction Protocol</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h4 className="text-blue-300 text-sm font-semibold mb-2">Immediate Remediation</h4>
            <ul className="text-xs text-blue-100/70 space-y-1.5">
              <li className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-blue-400" />
                Execute 10 targeted practice questions on weak error types.
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3 text-blue-400" />
                Conduct post-session review immediately after study block.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}