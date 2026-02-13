import Groq from 'groq-sdk'
import { ComprehensiveData } from './comprehensive-data-fetcher'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export type AIInsightResponse = {
  motivation: string          // Maps to "Performance Briefing"
  schedulePlanner: string     // Maps to "Operational Protocol"
  weakAreaAnalysis: string    // Maps to "Deficit Audit"
  strategicSuggestions: string // Maps to "Trajectory Optimization"
  timelineOptimization: string
}

export async function generateComprehensiveAIInsights(data: ComprehensiveData, predictedAIR: number): Promise<AIInsightResponse> {
  try {
    // 1. PERFORMANCE BRIEFING (Formerly Motivation)
    // Objective: High-level executive summary of student's current standing.
    const motivationPrompt = `
    ACT AS: Senior Clinical Performance Director.
    OBJECTIVE: Generate a high-level Executive Performance Briefing for a medical aspirant.
    DATA:
    - Predicted Rank Trajectory: ${predictedAIR}
    - Cumulative Question Volume: ${data.totalQuestionsLifetime}
    - Mean Assessment Score: ${Math.round(data.averageTestScore)}/720
    - Consistency Index: ${Math.round(data.consistencyScore)}%
    - Clinical Deficits: ${data.weakAreas.join(', ') || 'None Detected'}
    - Core Competencies: ${data.strongAreas.join(', ') || 'Establishing Baseline'}

    INSTRUCTIONS:
    - Tone: Professional, authoritative, clinical, yet inspiring.
    - Focus: Data validation, trajectory confirmation, and professional identity reinforcement.
    - Avoid: Casual nicknames, emojis like 💕, or generic "cheerleading". Use terms like "Aspirant", "Future Professional".

    FORMAT (HTML):
    - Container: <div class="mb-4 p-5 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-500/30 shadow-lg">
    - Heading: <h3 class="text-lg font-bold text-blue-300 mb-3 flex items-center uppercase tracking-widest"><span class="mr-2">📋</span>Executive Performance Briefing</h3>
    - Text: <p class="text-slate-300 leading-relaxed mb-3 text-sm">
    - Emphasis: <strong class="text-white font-mono">
    - Highlight: <span class="text-cyan-400">
    - List: <ul class="space-y-2 mt-3">, <li class="flex items-start text-xs text-slate-400"><span class="text-emerald-400 mr-2">✔</span>
    `

    // 2. OPERATIONAL PROTOCOL (Formerly Schedule Planner)
    // Objective: Strict, time-blocked schedule based on cognitive load.
    const schedulePlannerPrompt = `
    ACT AS: Clinical Protocol Architect.
    OBJECTIVE: Design a 7-Day High-Precision Operational Protocol.
    DATA:
    - Target Rank: < ${predictedAIR}
    - Deficit Modules: ${data.weakAreas.join(', ') || 'General Consolidation'}
    - Daily Load Target: 300+ Questions
    - Performance Baseline: ${Math.round(data.averageTestScore)}/720

    INSTRUCTIONS:
    - Create a rigorous schedule optimizing cognitive load.
    - Use terms like "Neural Activation", "Cognitive Load", "Retention Block".
    - Focus on specific subjects for specific time slots.

    FORMAT (HTML):
    - Container: <div class="space-y-4">
    - Day Card: <div class="bg-slate-900/50 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-colors">
    - Header: <h4 class="text-cyan-300 font-bold text-sm mb-3 flex items-center uppercase tracking-wider"><span class="mr-2">📅</span>Day Name</h4>
    - Grid: <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    - Block: <div class="bg-black/20 p-3 rounded border-l-2 border-indigo-500">
    - Time: <div class="text-[10px] text-slate-500 font-mono uppercase">06:00 - 08:00</div>
    - Subject: <div class="text-sm font-bold text-white">Physics: Mechanics</div>
    - Target: <div class="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">Target: 50 Qs</div>
    `

    // 3. DEFICIT AUDIT & DIAGRAMS (Formerly Weak Area Analysis)
    // Objective: Root cause analysis of weak areas with visual aids.
    const weakAreaPrompt = `
    ACT AS: Diagnostic Remediation Specialist.
    OBJECTIVE: Analyze clinical deficits and prescribe remediation protocols.
    DATA:
    - Identified Deficits: ${data.weakAreas.join(', ') || 'General calibration required'}
    - Recent Scores: ${data.testPerformances.slice(0, 5).map(t => t.score).join(', ')}

    INSTRUCTIONS:
    - Diagnose the root cause of score leakage in these areas.
    - Prescribe specific "Intervention Protocols" (e.g., active recall, numerical drills).
    - **DIAGRAM INSERTION:** If a specific concept (e.g., "Cardiac Cycle", "Ray Optics", "Calvin Cycle") is mentioned, INSERT a diagram tag like 

[Image of human cardiac cycle diagram]
 or 

[Image of ray optics diagram]
 immediately after the concept to aid visual encoding. Do not overuse, only for key deficits.

    FORMAT (HTML):
    - Container: <div class="space-y-6">
    - Card: <div class="bg-gradient-to-r from-rose-900/10 to-orange-900/10 rounded-xl p-5 border border-rose-500/20">
    - Header: <h4 class="text-rose-300 font-bold mb-4 flex items-center uppercase tracking-widest text-sm"><span class="mr-2">⚠️</span>Deficit Sector: Subject</h4>
    - Strategy Box: <div class="bg-black/20 p-4 rounded-lg border border-white/5">
    - Title: <h5 class="text-white font-bold text-xs mb-2 uppercase tracking-wide flex items-center"><span class="mr-2">💉</span>Intervention Protocol</h5>
    - List: <ul class="space-y-2 text-xs text-slate-300">
    - Item: <li class="flex items-start"><span class="text-rose-400 mr-2">›</span>
    `

    // 4. TRAJECTORY OPTIMIZATION (Formerly Strategic Suggestions)
    // Objective: Long-term strategy to bridge the gap to AIIMS.
    const strategicPrompt = `
    ACT AS: Rank Trajectory Strategist.
    OBJECTIVE: Provide a strategic roadmap to secure AIR < 100.
    DATA:
    - Current Trajectory: ${predictedAIR}
    - Days Remaining: ${Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
    - Consistency: ${Math.round(data.consistencyScore)}%

    INSTRUCTIONS:
    - Focus on "High Yield" strategies and "Error Margin Reduction".
    - Use military/clinical precision in language.

    FORMAT (HTML):
    - Container: <div class="space-y-6">
    - Section: <div class="bg-gradient-to-r from-emerald-900/10 to-cyan-900/10 rounded-xl p-6 border border-emerald-500/20">
    - Heading: <h3 class="text-emerald-300 font-bold text-sm mb-4 flex items-center uppercase tracking-[0.2em]"><span class="mr-2">🚀</span>Trajectory Optimization</h3>
    - Grid: <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    - Card: <div class="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all">
    - Card Title: <h4 class="text-white font-bold text-xs mb-2 uppercase">Strategy Title</h4>
    - Desc: <p class="text-slate-400 text-xs leading-relaxed mb-3">
    - Action: <div class="bg-emerald-500/10 p-2 rounded text-[10px] text-emerald-300 font-mono border border-emerald-500/20">
    `

    // Execute Parallel API Calls
    const [motivationResponse, scheduleResponse, weakAreaResponse, strategicResponse] = await Promise.all([
      groq.chat.completions.create({
        messages: [{ role: 'user', content: motivationPrompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7, // Balanced for professional tone
        max_tokens: 300,
      }),
      groq.chat.completions.create({
        messages: [{ role: 'user', content: schedulePlannerPrompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.5, // Strict structure
        max_tokens: 600,
      }),
      groq.chat.completions.create({
        messages: [{ role: 'user', content: weakAreaPrompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.6,
        max_tokens: 500,
      }),
      groq.chat.completions.create({
        messages: [{ role: 'user', content: strategicPrompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.6,
        max_tokens: 500,
      })
    ])

    // Return structured response with professional fallbacks
    return {
      motivation: motivationResponse.choices[0]?.message?.content || 
        '<div class="mb-4 p-5 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-500/30 shadow-lg"><h3 class="text-lg font-bold text-blue-300 mb-3 flex items-center uppercase tracking-widest"><span class="mr-2">📋</span>Performance Briefing</h3><p class="text-slate-300 leading-relaxed text-sm">Data streams active. Trajectory assessment in progress. Maintain operational discipline.</p></div>',
      
      schedulePlanner: scheduleResponse.choices[0]?.message?.content || 
        '<div class="bg-slate-900/50 rounded-xl p-4 border border-white/10"><h4 class="text-cyan-300 font-bold text-sm mb-3 flex items-center uppercase tracking-wider"><span class="mr-2">⚠️</span>Protocol Synchronization</h4><p class="text-slate-400 text-xs">Generating high-precision daily vectors...</p></div>',
      
      weakAreaAnalysis: weakAreaResponse.choices[0]?.message?.content || 
        '<div class="bg-gradient-to-r from-rose-900/10 to-orange-900/10 rounded-xl p-5 border border-rose-500/20"><h4 class="text-rose-300 font-bold mb-3 flex items-center uppercase tracking-widest text-sm"><span class="mr-2">🔎</span>Deficit Audit</h4><p class="text-slate-300 text-xs">Scanning performance logs for conceptual gaps...</p></div>',
      
      strategicSuggestions: strategicResponse.choices[0]?.message?.content || 
        '<div class="bg-gradient-to-r from-emerald-900/10 to-cyan-900/10 rounded-xl p-6 border border-emerald-500/20"><h3 class="text-emerald-300 font-bold text-sm mb-3 flex items-center uppercase tracking-[0.2em]"><span class="mr-2">🔄</span>Strategy Synthesis</h3><p class="text-slate-400 text-xs">Calculating optimal path to AIR < 50...</p></div>',
      
      timelineOptimization: '<div class="bg-gradient-to-r from-purple-900/10 to-indigo-900/10 rounded-xl p-4 border border-purple-500/20"><h4 class="text-purple-300 font-bold mb-3 flex items-center uppercase tracking-widest text-sm"><span class="mr-2">⏳</span>Timeline Calibration</h4><p class="text-slate-400 text-xs">Timeline optimization based on current velocity and 2026 milestones.</p></div>'
    }
  } catch (error) {
    console.error('Clinical Intelligence Engine Error:', error)
    return {
      motivation: '<div class="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300">System Interruption. Re-establishing connection to Neural Engine.</div>',
      schedulePlanner: 'Protocol generation paused. Manual override recommended.',
      weakAreaAnalysis: 'Diagnostic scan delayed.',
      strategicSuggestions: 'Strategy module offline.',
      timelineOptimization: 'Timeline sync pending...'
    }
  }
}