'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
// Assuming EnhancedMistakePopup is updated to receive 'clinical' props
import EnhancedMistakePopup from '@/components/ai/enhanced-mistake-popup'
import { 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Activity, 
  Save,
  Target
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function DiagnosticDataEntry() {
  const [testData, setTestData] = useState({
    testType: '',
    testNumber: '',
    score: 0,
    testDate: new Date().toISOString().split('T')[0]
  })
  
  const [pendingAudit, setPendingAudit] = useState(false)
  const [auditCompleted, setAuditCompleted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const AIIMS_CUTOFF = 705; // 2026 Projected Cutoff

  const handleSaveAttempt = () => {
    if (!testData.testType || !testData.testNumber || testData.score === 0) {
      alert('PROTOCOL ERROR: Incomplete diagnostic data.')
      return
    }

    if (testData.score > 720) {
      alert('DATA ERROR: Score exceeds theoretical maximum (720).')
      return
    }

    // Initiate Audit Protocol
    setPendingAudit(true)
    setShowPopup(true)
  }

  const handleAuditSubmit = async (auditData: any) => {
    try {
      // 1. Archive Test Data
      const testResponse = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current_user', // Dynamic ID in production
          testType: testData.testType,
          testNumber: testData.testNumber,
          score: testData.score,
          testDate: new Date(testData.testDate)
        })
      })

      if (!testResponse.ok) throw new Error('Data Archival Failed')

      // 2. Submit Clinical Audit
      const analysisResponse = await fetch('/api/mistakes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'diagnostic_test',
          sessionData: {
            testScore: testData.score,
            testType: `${testData.testType} - ${testData.testNumber}`
          },
          auditData
        })
      })

      if (!analysisResponse.ok) throw new Error('Audit Processing Failed')

      // Success Sequence
      setAuditCompleted(true)
      setPendingAudit(false)
      setShowPopup(false)
      
      setTestData({
        testType: '',
        testNumber: '',
        score: 0,
        testDate: new Date().toISOString().split('T')[0]
      })
      
      // Clinical Confirmation
      alert('✅ DIAGNOSTIC PROTOCOL COMPLETE. Data synced to Neural Engine.')
      
    } catch (error) {
      console.error('System Error:', error)
      alert('❌ SYSTEM ERROR: Audit synchronization failed. Check network connection.')
      setPendingAudit(false)
    }
  }

  const getScoreStatus = (score: number) => {
    if (score >= 680) return { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', label: 'ELITE TRAJECTORY' }
    if (score >= 600) return { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', label: 'OPTIMAL PERFORMANCE' }
    if (score >= 500) return { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', label: 'MODERATE DEFICIT' }
    return { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', label: 'CRITICAL INTERVENTION' }
  }

  const status = getScoreStatus(testData.score)

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950/40 border-blue-500/20 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              </div>
              <span className="uppercase tracking-widest text-sm font-bold text-slate-300">Diagnostic Data Intake</span>
            </div>
            {auditCompleted && (
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 gap-2">
                <CheckCircle2 className="h-3 w-3" /> AUDIT VERIFIED
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assessment Category</label>
              <select
                value={testData.testType}
                onChange={(e) => setTestData(prev => ({ ...prev, testType: e.target.value }))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                disabled={pendingAudit}
              >
                <option value="">Select Protocol...</option>
                <option value="Institutional Mock">Institutional Mock (Full Syllabus)</option>
                <option value="Unit Test">Unit Test (Module Specific)</option>
                <option value="All India Series">All India Test Series (AITS)</option>
                <option value="Previous Year Paper">Previous Year Paper (PYQ)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Paper ID / Code</label>
              <input
                type="text"
                value={testData.testNumber}
                onChange={(e) => setTestData(prev => ({ ...prev, testNumber: e.target.value }))}
                placeholder="e.g. AITS-26-04"
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                disabled={pendingAudit}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregated Score</label>
              <div className="relative">
                <input
                  type="number"
                  value={testData.score}
                  onChange={(e) => setTestData(prev => ({ ...prev, score: Number(e.target.value) }))}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 pl-10 text-sm text-white font-mono focus:border-blue-500 outline-none transition-all"
                  min="0"
                  max="720"
                  disabled={pendingAudit}
                />
                <Activity className="absolute left-3 top-3.5 h-4 w-4 text-slate-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Execution Date</label>
              <input
                type="date"
                value={testData.testDate}
                onChange={(e) => setTestData(prev => ({ ...prev, testDate: e.target.value }))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                disabled={pendingAudit}
              />
            </div>
          </div>

          {/* Clinical Analysis Card */}
          <AnimatePresence>
            {testData.score > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-5 rounded-xl border ${status.border} ${status.bg}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-mono font-bold ${status.color}`}>
                      {testData.score}<span className="text-sm text-slate-500 font-normal">/720</span>
                    </span>
                    <Badge variant="outline" className={`${status.border} ${status.color} bg-black/20 text-[9px]`}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Target className="h-3 w-3" /> AIIMS Delhi Target
                    </div>
                    <div className="text-sm font-mono text-slate-300">
                      Gap: <span className={testData.score >= AIIMS_CUTOFF ? 'text-emerald-400' : 'text-rose-400'}>
                        {testData.score >= AIIMS_CUTOFF ? '+' : ''}{testData.score - AIIMS_CUTOFF}
                      </span> marks
                    </div>
                  </div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="h-1.5 w-full bg-slate-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${status.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(testData.score / 720) * 100}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            onClick={handleSaveAttempt}
            disabled={pendingAudit || !testData.testType || !testData.testNumber || testData.score === 0}
            className={`w-full py-4 font-bold rounded-lg transition-all flex items-center justify-center uppercase tracking-wider text-xs ${
              pendingAudit
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : (!testData.testType || !testData.testNumber || testData.score === 0)
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            {pendingAudit ? (
              <>
                <Lock className="h-4 w-4 mr-2 animate-pulse" />
                Audit Protocol Active...
              </>
            ) : (!testData.testType || !testData.testNumber || testData.score === 0) ? (
              'Awaiting Data Input...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Initialize Deficit Audit
              </>
            )}
          </button>

          {pendingAudit && (
            <div className="flex items-center justify-center gap-2 text-[10px] text-amber-400 uppercase tracking-wider animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              Protocol Alert: Deficit Audit required for data archival
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mandatory Clinical Audit Interface */}
      <EnhancedMistakePopup
        isOpen={showPopup}
        onClose={() => alert('PROTOCOL ALERT: Audit completion is mandatory for diagnostic data integrity.')}
        sessionType="diagnostic_test"
        sessionData={{
          testScore: testData.score,
          testType: `${testData.testType} [${testData.testNumber}]`
        }}
        onSubmit={handleAuditSubmit}
      />
    </div>
  )
}