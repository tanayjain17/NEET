'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  HeartPulse, 
  Calendar, 
  Award, 
  MessageSquare, 
  Target,
  Activity,
  Stethoscope,
  Microscope,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface SupportMetrics {
  supportMoments: number;
  encouragementPoints: number;
  wellnessChecks: number;
  learningInteractions: number;
  lastSupportAction: string;
  motivationStreak: number;
  weeklyGoal: number;
}

export function AcademicSupportSystem() {
  const [metrics, setMetrics] = useState<SupportMetrics>({
    supportMoments: 0,
    encouragementPoints: 0,
    wellnessChecks: 0,
    learningInteractions: 0,
    lastSupportAction: '',
    motivationStreak: 0,
    weeklyGoal: 10,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('academicSupportMetrics');
    if (savedData) setMetrics(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('academicSupportMetrics', JSON.stringify(metrics));
  }, [metrics]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const supportActions = [
    { action: "Cognitive Milestone Acknowledged", points: 5, icon: Award },
    { action: "Pre-Assessment Clinical Briefing", points: 10, icon: HeartPulse },
    { action: "Conceptual Breakthrough Support", points: 15, icon: Brain },
    { action: "Systemic Strategy Review", points: 8, icon: MessageSquare },
    { action: "High-Intensity Wellness Check", points: 7, icon: Activity }
  ];

  const logSupportMoment = (action: string, points: number) => {
    const today = new Date().toDateString();
    const lastActionDate = localStorage.getItem('lastSupportDate');
    
    let newStreak = metrics.motivationStreak;
    if (lastActionDate !== today) {
      newStreak = metrics.motivationStreak + 1;
      localStorage.setItem('lastSupportDate', today);
    }

    setMetrics(prev => ({
      ...prev,
      supportMoments: prev.supportMoments + 1,
      encouragementPoints: prev.encouragementPoints + points,
      lastSupportAction: action,
      motivationStreak: newStreak,
    }));

    setConfirmationMessage(`Protocol logged: ${action} (+${points} XP)`);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const progressToWeeklyGoal = (metrics.supportMoments / metrics.weeklyGoal) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950/40 backdrop-blur-xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-bold tracking-tight uppercase">Academic Support Protocol</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-blue-400 font-mono">{metrics.supportMoments}</div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Interventions</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-indigo-400 font-mono">{metrics.encouragementPoints}</div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Credits</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-emerald-400 font-mono">{progressToWeeklyGoal.toFixed(0)}%</div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Goal Status</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-cyan-400 font-mono">{metrics.motivationStreak}</div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Day Streak</div>
            </div>
          </div>

          {/* Weekly Progress Track */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-400">Weekly Support Quota</span>
              <span className="text-cyan-400">{metrics.supportMoments} / {metrics.weeklyGoal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToWeeklyGoal, 100)}%` }}
              />
            </div>
          </div>

          {/* Intervention Logger */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Manual Performance Entry</h3>
            <div className="grid gap-2">
              {supportActions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-blue-500/40 transition-all">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-200 text-sm font-medium">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono">+{item.points} CR</Badge>
                      <Button 
                        size="sm"
                        onClick={() => logSupportMoment(item.action, item.points)}
                        className="h-7 bg-blue-600 hover:bg-blue-500 text-xs font-bold px-4"
                      >
                        LOG
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Toasts */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg overflow-hidden"
              >
                <p className="text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {confirmationMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Strategic Context Footer */}
          <div className="p-4 bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-white/10 rounded-xl">
             <h4 className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
               <Activity className="h-3 w-3" />
               Mission Alignment
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-slate-400 font-bold tracking-tight uppercase">
                <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"/> AIIMS Delhi Trajectory Support</div>
                <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-cyan-500"/> 188K Question Cognitive Load</div>
                <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500"/> Clinical Mastery Environment</div>
                <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-indigo-500"/> Bio-Rhythm Sync Optimization</div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}