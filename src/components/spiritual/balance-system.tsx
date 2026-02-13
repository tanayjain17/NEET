'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Activity, 
  Moon, 
  Sun, 
  Wind, 
  BookOpen, 
  Calendar, 
  Zap, 
  Microscope,
  Stethoscope,
  ShieldCheck,
  Clock,
  Flower2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Professional Interfaces ---

interface WellnessActivity {
  id: string;
  name: string;
  activityType: 'meditation' | 'reflection' | 'audit';
  duration: number;
  completed: boolean;
  neurologicalBenefit: string;
}

interface ReflectionEntry {
  id: string;
  date: string;
  content: string;
  timestamp: string;
}

interface PerformanceMetrics {
  dailyHomeostasis: number;
  weeklyAdherence: number;
  consistencyStreak: number;
}

export function WellnessBalanceSystem() {
  const [activities, setActivities] = useState<WellnessActivity[]>([
    {
      id: '1',
      name: 'Pranayama: Vagus Nerve Activation',
      activityType: 'meditation',
      duration: 10,
      completed: false,
      neurologicalBenefit: 'Cortisol reduction & focus stabilization'
    },
    {
      id: '2',
      name: 'Dopamine Baseline Audit',
      activityType: 'audit',
      duration: 5,
      completed: false,
      neurologicalBenefit: 'Gratitude-based reward pathway correction'
    },
    {
      id: '3',
      name: 'Circadian Neural Reset',
      activityType: 'reflection',
      duration: 10,
      completed: false,
      neurologicalBenefit: 'Alpha-wave promotion & stress dissipation'
    }
  ]);

  const [reflectionEntries, setReflectionEntries] = useState<ReflectionEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReflection, setNewReflection] = useState('');
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dailyHomeostasis: 0,
    weeklyAdherence: 88,
    consistencyStreak: 14
  });

  const spiritualAxioms = [
    {
      quote: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
      translation: "Focus on the protocol, not the rank.",
      clinicalContext: "Reduces pre-frontal cortex load by eliminating outcome-based anxiety."
    },
    {
      quote: "श्रद्धावान् लभते ज्ञानं",
      translation: "Deep conviction yields high-retention knowledge.",
      clinicalContext: "Belief in the preparation pipeline accelerates conceptual assimilation."
    }
  ];

  const recoveryTech = [
    {
      name: "Nadi Shodhana Focus Protocol",
      duration: "10 MIN",
      steps: [
        "Align spine vertically to optimize CSF flow.",
        "Execute alternate nostril breathing: 4s Inhale, 4s Hold, 8s Exhale.",
        "Visualizing the breath entering the Hippocampal region."
      ],
      imaging: "",
      outcome: "Parasympathetic dominance for post-intensive study recovery."
    }
  ];

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const currentHomeostasis = Math.round((activities.filter(a => a.completed).length / activities.length) * 100);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950/40 border-orange-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-3 text-sm tracking-[0.2em] uppercase">
              <Sun className="h-5 w-5 text-orange-400" />
              Cognitive Homeostasis Monitor
            </CardTitle>
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 font-mono animate-pulse">
              SYNC STATUS: {currentHomeostasis === 100 ? 'OPTIMAL' : 'PENDING'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBlock label="Daily Reset" value={`${currentHomeostasis}%`} color="text-orange-400" />
            <MetricBlock label="Weekly Flow" value={`${metrics.weeklyAdherence}%`} color="text-emerald-400" />
            <MetricBlock label="Neural Streak" value={metrics.consistencyStreak} color="text-indigo-400" />
            <MetricBlock label="Vagal Tone" value="STABLE" color="text-cyan-400" />
          </div>

          {/* Daily Protocol List */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap className="h-3 w-3 text-orange-500" />
              Active Recovery Protocols
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {activities.map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleActivity(a.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    a.completed ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${a.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {a.activityType === 'meditation' ? <Wind className="h-4 w-4" /> : <Flower2 className="h-4 w-4" />}
                    </div>
                    {a.completed && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase mb-1.5 leading-tight">{a.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-4">{a.neurologicalBenefit}</p>
                  <div className="text-[9px] font-mono text-slate-400 bg-black/30 w-fit px-2 py-1 rounded">
                    {a.duration} MIN SESSION
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tactical Wisdom & Tech Grid */}
          <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
            {/* Scriptural Logic */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-indigo-400" />
                Scriptural Logic Layer
              </h3>
              {spiritualAxioms.map((axiom, i) => (
                <div key={i} className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl">
                  <p className="text-orange-200/90 text-sm font-medium mb-1">{axiom.quote}</p>
                  <p className="text-slate-400 text-[11px] italic mb-3 opacity-70">"{axiom.translation}"</p>
                  <div className="flex items-start gap-2 p-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <Microscope className="h-3 w-3 text-indigo-400 mt-0.5" />
                    <p className="text-[10px] text-indigo-300/80 leading-relaxed">
                      <span className="font-bold uppercase tracking-tighter mr-1">NEURAL IMPACT:</span>
                      {axiom.clinicalContext}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Neural Recovery Tech */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Activity className="h-3 w-3 text-cyan-400" />
                Recovery Technicals
              </h3>
              {recoveryTech.map((tech, i) => (
                <div key={i} className="p-5 bg-black/40 border border-blue-500/20 rounded-2xl relative">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-blue-300 font-bold text-xs uppercase tracking-widest">{tech.name}</h4>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono text-[9px]">{tech.duration}</Badge>
                  </div>
                  <div className="space-y-3 mb-5">
                    {tech.steps.map((step, si) => (
                      <div key={si} className="flex gap-3 text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-blue-500 font-bold font-mono">{si + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-600 italic mb-4 font-mono uppercase tracking-tighter">
                    {tech.imaging}
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-medium italic">{tech.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dopamine Baseline Correction (Journal) */}
      <Card className="bg-slate-900/60 border-white/5 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-pink-500/10 rounded-xl border border-pink-500/20">
                <Heart className="h-4 w-4 text-pink-400" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Dopamine Correction</p>
                <p className="text-xs text-slate-300 font-medium">Record a critical preparation victory...</p>
             </div>
          </div>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-400 hover:bg-pink-400/5 gap-2">
            Protocol Journal <Clock className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricBlock({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <div className="text-center p-4 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner">
      <div className={`text-2xl font-black font-mono tracking-tighter ${color}`}>{value}</div>
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}