'use client'

import type React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Brain, Target, ClipboardCheck, Activity, ShieldCheck, Dna } from 'lucide-react'

// 1. Updated Type Definition
type FormData = {
  // Personal Profile
  category: string
  homeState: string
  coachingInstitute: string
  preparationStartDate: string

  // Academic Performance
  class12Percentage: string
  board: string
  schoolRank: string
  foundationStrength: string

  // Current Performance
  latestMockScore: string
  averageMockScore: string
  bestMockScore: string
  physicsAccuracy: string
  chemistryAccuracy: string
  botanyAccuracy: string
  zoologyAccuracy: string

  // Study Patterns
  dailyStudyHours: string
  physicsHours: string
  chemistryHours: string
  botanyHours: string
  zoologyHours: string
  questionSolvingSpeed: string

  // Bio‑Rhythm Sync
  sleepHours: string
  sleepQuality: string
  cycleLength: string
  energyLevel: string
  stressLevel: string

  // Learning Analytics
  retentionRate: string
  revisionEffectiveness: string
  weakAreas: string
  strongAreas: string
  strongAreasNotes: string // <--- ADDED THIS NEW FIELD
  improvementRate: string
}

const initialFormData: FormData = {
  category: '',
  homeState: '',
  coachingInstitute: '',
  preparationStartDate: '',
  class12Percentage: '',
  board: '',
  schoolRank: '',
  foundationStrength: '',
  latestMockScore: '',
  averageMockScore: '',
  bestMockScore: '',
  physicsAccuracy: '',
  chemistryAccuracy: '',
  botanyAccuracy: '',
  zoologyAccuracy: '',
  dailyStudyHours: '',
  physicsHours: '',
  chemistryHours: '',
  botanyHours: '',
  zoologyHours: '',
  questionSolvingSpeed: '',
  sleepHours: '',
  sleepQuality: '',
  cycleLength: '',
  energyLevel: '',
  stressLevel: '',
  retentionRate: '',
  revisionEffectiveness: '',
  weakAreas: '',
  strongAreas: '',
  strongAreasNotes: '', // <--- INITIALIZED HERE
  improvementRate: ''
}

// 2. Reusable UI Components (The "Medical" Look)
function FieldLabel({ children }: { children: string }) {
  return <label className="block text-xs font-medium text-cyan-200/60 uppercase tracking-wider mb-2">{children}</label>
}

function InputBase(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full p-3 rounded-xl text-white placeholder:text-white/20 bg-slate-950/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30 transition-all hover:bg-slate-950/60"
    />
  )
}

function SelectBase(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full p-3 rounded-xl text-white bg-slate-950/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30 transition-all cursor-pointer"
    />
  )
}

function TextareaBase(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full p-3 rounded-xl text-white placeholder:text-white/20 bg-slate-950/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/30 transition-all resize-none"
    />
  )
}

export default function DataCollectionForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const onSubmit = async () => {
    console.log('Sending to AI Engine:', formData)
    // Add your navigation or loading state here
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Medical-Tech Background Glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-cyan-600/10 blur-[130px]" />
        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-blue-600/10 blur-[130px]" />
      </div>

      <Card className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Animated Header Line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
        
        <CardHeader className="pb-8">
          <CardTitle className="text-white flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Brain className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                Success Engine Data Intake
              </div>
              <p className="text-white/50 text-sm font-normal mt-1">
                Calibrate the AI model with your academic and biological metrics.
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-12">
          
          {/* Section 1: Profile */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold border-b border-white/5 pb-3">
              <ClipboardCheck className="h-5 w-5" />
              <h3>Personal Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldLabel>Category</FieldLabel>
                <SelectBase value={formData.category} onChange={e => update('category', e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </SelectBase>
              </div>
              <div>
                <FieldLabel>Home State</FieldLabel>
                <InputBase placeholder="e.g., Maharashtra" value={formData.homeState} onChange={e => update('homeState', e.target.value)} />
              </div>
              {/* Added missing fields from your Option 2 */}
              <div>
                <FieldLabel>Coaching Institute</FieldLabel>
                <InputBase placeholder="e.g., Allen, Aakash" value={formData.coachingInstitute} onChange={e => update('coachingInstitute', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Prep Start Date</FieldLabel>
                <InputBase type="date" value={formData.preparationStartDate} onChange={e => update('preparationStartDate', e.target.value)} />
              </div>
            </div>
          </motion.section>

          {/* Section 2: Mock Performance */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold border-b border-white/5 pb-3">
              <Target className="h-5 w-5" />
              <h3>Mock Performance Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FieldLabel>Latest Score (/720)</FieldLabel>
                <InputBase type="number" placeholder="580" value={formData.latestMockScore} onChange={e => update('latestMockScore', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Average Score</FieldLabel>
                <InputBase type="number" placeholder="560" value={formData.averageMockScore} onChange={e => update('averageMockScore', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Best Score</FieldLabel>
                <InputBase type="number" placeholder="620" value={formData.bestMockScore} onChange={e => update('bestMockScore', e.target.value)} />
              </div>
            </div>
            {/* Subject Accuracy Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                 <FieldLabel>Physics Acc %</FieldLabel>
                 <InputBase type="number" placeholder="75" value={formData.physicsAccuracy} onChange={e => update('physicsAccuracy', e.target.value)} />
               </div>
               <div>
                 <FieldLabel>Chemistry Acc %</FieldLabel>
                 <InputBase type="number" placeholder="80" value={formData.chemistryAccuracy} onChange={e => update('chemistryAccuracy', e.target.value)} />
               </div>
               <div>
                 <FieldLabel>Botany Acc %</FieldLabel>
                 <InputBase type="number" placeholder="85" value={formData.botanyAccuracy} onChange={e => update('botanyAccuracy', e.target.value)} />
               </div>
               <div>
                 <FieldLabel>Zoology Acc %</FieldLabel>
                 <InputBase type="number" placeholder="90" value={formData.zoologyAccuracy} onChange={e => update('zoologyAccuracy', e.target.value)} />
               </div>
            </div>
          </motion.section>

          {/* Section 3: Bio-Rhythm Sync */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold border-b border-white/5 pb-3">
              <Dna className="h-5 w-5" />
              <h3>Bio-Rhythm Sync</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FieldLabel>Sleep Duration (Hrs)</FieldLabel>
                <InputBase type="number" placeholder="7" value={formData.sleepHours} onChange={e => update('sleepHours', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Energy Level (1-10)</FieldLabel>
                <InputBase type="number" placeholder="8" value={formData.energyLevel} onChange={e => update('energyLevel', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Bio-Cycle Day (Optional)</FieldLabel>
                <InputBase type="number" placeholder="14" value={formData.cycleLength} onChange={e => update('cycleLength', e.target.value)} />
              </div>
            </div>
          </motion.section>

          {/* Section 4: Learning Analytics (FIXED SECTION) */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold border-b border-white/5 pb-3">
              <Activity className="h-5 w-5" />
              <h3>Topic Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldLabel>Weak Areas (Comma Separated)</FieldLabel>
                <TextareaBase rows={3} placeholder="Rotational Motion, Organic Chemistry..." value={formData.weakAreas} onChange={e => update('weakAreas', e.target.value)} />
              </div>
              <div>
                {/* FIXED: This now points to strongAreasNotes */}
                <FieldLabel>Strong Areas (Detailed Notes)</FieldLabel>
                <TextareaBase rows={3} placeholder="Strong in Mechanics, need maintenance revision..." value={formData.strongAreasNotes} onChange={e => update('strongAreasNotes', e.target.value)} />
              </div>
            </div>
          </motion.section>

          {/* Primary CTA */}
          <div className="pt-6 space-y-4">
            <button
              onClick={onSubmit}
              className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                 <Brain className="h-5 w-5" /> Analyze My NEET Performance
              </span>
            </button>
            <div className="flex items-center justify-center gap-2 text-white/30 text-xs italic">
              <ShieldCheck className="h-3 w-3" />
              <span>Data encrypted & processed locally for AI estimation.</span>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}