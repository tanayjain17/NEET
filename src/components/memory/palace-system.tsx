'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Network, 
  MapPin, 
  Database, 
  Zap, 
  BookOpen, 
  Activity,
  Share2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Professional Interfaces ---

interface LociSystem {
  id: string;
  designation: string;
  domain: string;
  anchors: StorageNode[];
  totalNodes: number;
}

interface StorageNode {
  id: string;
  anchorPoint: string;
  conceptData: string;
  visualTrigger: string;
  narrativeLinkage: string;
  complexityIndex: number; // 1 (Simple) to 5 (High Load)
  lastConsolidation: string; // ISO Date String
  status: 'active' | 'consolidated' | 'volatile';
}

export default function CognitiveLociTracker() {
  const [systems, setSystems] = useState<LociSystem[]>([
    {
      id: '1',
      designation: 'Domestic Loci Framework',
      domain: 'Human Physiology',
      anchors: [
        {
          id: '1',
          anchorPoint: 'Entryway/Foyer',
          conceptData: 'Digestive System: Alimentary Canal',
          visualTrigger: 'Conveyor belt processing inputs',
          narrativeLinkage: 'Food bolus enters via door (Mouth), processed in hallway (Esophagus), stored in cabinet (Stomach).',
          complexityIndex: 3,
          lastConsolidation: '2024-02-10',
          status: 'consolidated'
        },
        {
          id: '2',
          anchorPoint: 'Central Living Area',
          conceptData: 'Circulatory System: Cardiac Cycle',
          visualTrigger: 'Central HVAC pump distribution',
          narrativeLinkage: 'Main pump (Heart) pushes fluid through wall pipes (Arteries) returning via floor vents (Veins).',
          complexityIndex: 5, // High complexity degrades faster
          lastConsolidation: '2024-02-05', // Older date to trigger volatility
          status: 'consolidated' 
        }
      ],
      totalNodes: 15
    }
  ]);

  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);

  // --- Dynamic Neural Logic ---

  // 1. Retention Rate Calculator
  const calculateRetentionRate = (anchors: StorageNode[]) => {
    if (anchors.length === 0) return 0;
    const consolidated = anchors.filter(a => a.status === 'consolidated').length;
    return Math.round((consolidated / anchors.length) * 100);
  };

  // 2. Neural Stability Index (System Health)
  const calculateNSI = (anchors: StorageNode[]) => {
    if (anchors.length === 0) return 0;
    // NSI favors consolidated nodes, penalizes volatile ones heavily based on complexity
    let score = 0;
    anchors.forEach(node => {
      if (node.status === 'consolidated') score += 10;
      if (node.status === 'active') score += 5;
      if (node.status === 'volatile') score -= (node.complexityIndex * 2); // Higher penalty for complex volatility
    });
    // Normalize to 0-100 scale approximately
    const maxScore = anchors.length * 10;
    return Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
  };

  // 3. Cognitive Decay Model (Run on Mount)
  useEffect(() => {
    const checkNeuralDecay = () => {
      const today = new Date();
      
      setSystems(prev => prev.map(sys => ({
        ...sys,
        anchors: sys.anchors.map(node => {
          const lastReview = new Date(node.lastConsolidation);
          const daysSince = Math.floor((today.getTime() - lastReview.getTime()) / (1000 * 3600 * 24));
          
          // Decay Formula: Complexity * Days. 
          // High complexity (5) decays in 3 days. Low complexity (1) lasts 14 days.
          const decayThreshold = Math.max(3, 15 - (node.complexityIndex * 2));
          
          if (daysSince > decayThreshold && node.status === 'consolidated') {
            return { ...node, status: 'volatile' }; // Auto-degrade
          }
          return node;
        })
      })));
    };

    checkNeuralDecay();
  }, []);

  const executeReview = (systemId: string, nodeId: string) => {
    setSystems(prev => prev.map(sys => {
      if (sys.id === systemId) {
        return {
          ...sys,
          anchors: sys.anchors.map(node => {
            if (node.id === nodeId) {
              return {
                ...node,
                lastConsolidation: new Date().toISOString().split('T')[0],
                status: 'consolidated'
              };
            }
            return node;
          })
        };
      }
      return sys;
    }));
  };

  const selectedSystem = useMemo(() => 
    systems.find(s => s.id === selectedSystemId), 
  [systems, selectedSystemId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'consolidated': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'volatile': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
  };

  const getComplexityVisuals = (index: number) => {
    // Returns pulse intensity based on complexity
    if (index >= 4) return "animate-pulse border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
    return "border-white/5";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg tracking-tight uppercase">
            <Brain className="h-5 w-5 text-cyan-400" />
            Adaptive Neural Encoding Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* System Overview Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {systems.map((sys) => {
              const retention = calculateRetentionRate(sys.anchors);
              const nsi = calculateNSI(sys.anchors);
              
              return (
                <motion.div 
                  key={sys.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-cyan-500/50 transition-all group relative overflow-hidden"
                  onClick={() => setSelectedSystemId(sys.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:text-cyan-400 transition-colors">
                      <Network className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">{sys.designation}</h3>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{sys.domain}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider">
                      <span>Retention</span>
                      <span className={retention < 50 ? 'text-rose-400' : 'text-emerald-400'}>{retention}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${retention < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${retention}%` }}
                      />
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">NSI Score</span>
                      <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-300 font-mono bg-indigo-500/10">
                        {nsi}/100
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-5 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-cyan-400"
              onClick={() => alert("Initialize New Loci Framework")}
            >
              <MapPin className="h-6 w-6 mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest">Initialize New System</span>
            </motion.div>
          </div>

          {/* Detailed Node View */}
          <AnimatePresence mode="wait">
            {selectedSystem && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="border-b border-white/5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                          <Database className="h-4 w-4 text-indigo-400" />
                          Active Loci: {selectedSystem.designation}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400 font-mono">
                          Stability Index: {calculateNSI(selectedSystem.anchors)}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-700 text-slate-400 font-mono">
                        {selectedSystem.domain}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {selectedSystem.anchors.map((node) => (
                      <div key={node.id} className={`p-4 bg-white/5 rounded-xl border hover:border-white/10 transition-all ${getComplexityVisuals(node.complexityIndex)}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg border ${getStatusColor(node.status)}`}>
                              {node.status === 'volatile' ? <AlertTriangle className="h-4 w-4 animate-bounce" /> : <Activity className="h-4 w-4" />}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-200 uppercase tracking-wide block">
                                {node.anchorPoint}
                              </span>
                              {node.complexityIndex >= 4 && (
                                <span className="text-[9px] text-rose-400 font-mono uppercase tracking-tight">High Cognitive Load</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getStatusColor(node.status)}`}>
                              {node.status}
                            </span>
                            <Button 
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs border border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 gap-2"
                              onClick={() => executeReview(selectedSystem.id, node.id)}
                            >
                              <RefreshCw className="h-3 w-3" />
                              Consolidate
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Target Concept</span>
                              <span className="text-slate-300 font-medium">{node.conceptData}</span>
                              {node.conceptData.includes('Digestive') && (
                                <span className="text-[10px] text-slate-500 mt-1 italic flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" /> 

[Image of human digestive system anatomy]

                                </span>
                              )}
                              {node.conceptData.includes('Circulatory') && (
                                <span className="text-[10px] text-slate-500 mt-1 italic flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" /> 

[Image of human circulatory system schematic]

                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1">Visual Trigger</span>
                              <span className="text-slate-300">{node.visualTrigger}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-black/20 rounded-lg border border-white/5 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1 block">Narrative Linkage</span>
                              <p className="text-slate-400 leading-relaxed italic">"{node.narrativeLinkage}"</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between text-[9px] text-slate-500 font-mono">
                              <span>Complexity: {node.complexityIndex}/5</span>
                              <span>Last Cons: {node.lastConsolidation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Protocols & Techniques */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Techniques */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Share2 className="h-3 w-3 text-yellow-500" />
                  Encoding Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-yellow-500/20 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-yellow-500/90">Mnemonic Encoding</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">Anatomy</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Compression of complex lists into retrieval keys.</p>
                  <div className="text-[10px] text-emerald-400 font-mono bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                    Ex: R.I.C.E (Rest, Ice, Compression, Elevation)
                  </div>
                </div>
                {/* Other protocols would map here */}
              </CardContent>
            </Card>

            {/* Optimization Tips */}
            <Card className="bg-gradient-to-br from-indigo-900/10 to-blue-900/10 border-indigo-500/20">
              <CardHeader className="pb-3 border-b border-indigo-500/10">
                <CardTitle className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Retention Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    <span className="text-xs text-slate-300 leading-relaxed">Utilize spatial familiarity for baseline anchoring.</span>
                  </div>
                  {/* Other tips... */}
                </div>
                <div className="mt-6 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                    Next Consolidation Cycle: 24 Hours
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}