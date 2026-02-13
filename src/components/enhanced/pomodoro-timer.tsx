'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Clock, History, Settings } from 'lucide-react'

interface PomodoroTimerProps {
  subject?: string
  chapter?: string
  onSessionComplete?: (data: any) => void
}

type SessionDuration = {
  label: string
  minutes: number
  color: string
  icon: string
}

const SESSION_DURATIONS: SessionDuration[] = [
  { label: 'Quick Focus', minutes: 10, color: 'bg-blue-500', icon: '⚡' },
  { label: 'Standard', minutes: 25, color: 'bg-green-500', icon: '🍅' },
  { label: 'Deep Work', minutes: 45, color: 'bg-purple-500', icon: '🧠' },
  { label: 'Marathon', minutes: 90, color: 'bg-red-500', icon: '🔥' },
  { label: 'Extended', minutes: 120, color: 'bg-orange-500', icon: '🚀' }
]

export default function PomodoroTimer({ subject = '', chapter = '', onSessionComplete }: PomodoroTimerProps) {
  const { user } = useAuth()
  const [selectedDuration, setSelectedDuration] = useState(SESSION_DURATIONS[1]) // Default to 25 min
  const [timeLeft, setTimeLeft] = useState(selectedDuration.minutes * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [currentSubject, setCurrentSubject] = useState(subject)
  const [currentChapter, setCurrentChapter] = useState(chapter)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Fetch session history
  const { data: sessionHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['pomodoro-history'],
    queryFn: async () => {
      const response = await fetch('/api/pomodoro-sessions')
      if (!response.ok) throw new Error('Failed to fetch sessions')
      return response.json()
    }
  })

  useEffect(() => {
    setTimeLeft(selectedDuration.minutes * 60)
  }, [selectedDuration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSessionComplete = async () => {
    setIsActive(false)
    
    if (!isBreak) {
      // Work session completed
      setSessionCount(prev => prev + 1)
      
      // Save session to database with detailed info
      try {
        await fetch('/api/pomodoro-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: currentSubject || 'General Study',
            chapter: currentChapter || '',
            duration: selectedDuration.minutes,
            sessionType: selectedDuration.label,
            completed: true,
            focusScore: 9, // High focus for completed sessions
            productivity: 9,
            startTime: new Date(Date.now() - selectedDuration.minutes * 60 * 1000).toISOString(),
            endTime: new Date().toISOString()
          })
        })
        refetchHistory() // Refresh history
      } catch (error) {
        console.error('Failed to save pomodoro session:', error)
      }

      // Start break
      setIsBreak(true)
      const breakDuration = sessionCount % 4 === 3 ? 15 : 5 // Long break every 4 sessions
      setTimeLeft(breakDuration * 60)
      
      if (onSessionComplete) {
        onSessionComplete({
          subject: currentSubject,
          chapter: currentChapter,
          duration: selectedDuration.minutes,
          sessionCount: sessionCount + 1
        })
      }
    } else {
      // Break completed
      setIsBreak(false)
      setTimeLeft(selectedDuration.minutes * 60)
    }
  }

  const startTimer = () => setIsActive(true)
  const pauseTimer = () => setIsActive(false)
  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTimeLeft(selectedDuration.minutes * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const totalTime = isBreak 
    ? (sessionCount % 4 === 3 ? 15 * 60 : 5 * 60)
    : selectedDuration.minutes * 60
  const progress = (totalTime - timeLeft) / totalTime

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {selectedDuration.icon} Pomodoro Timer
          </h2>
          <p className="text-gray-400">Focus • Achieve • Repeat</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white border-gray-600"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-white border-gray-600"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <Card className="glass-effect border-gray-700 overflow-hidden">
            <CardContent className="p-8">
              {/* Timer Display */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative w-64 h-64 mx-auto mb-6"
                >
                  {/* Outer Ring */}
                  <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                      className={isBreak ? 'text-green-400' : selectedDuration.color.replace('bg-', 'text-')}
                      strokeLinecap="round"
                      animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress)}` }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  
                  {/* Timer Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        key={timeLeft}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-bold text-white mb-2"
                      >
                        {formatTime(timeLeft)}
                      </motion.div>
                      <Badge 
                        variant="outline" 
                        className={`${isBreak ? 'text-green-400 border-green-400' : 'text-white border-gray-400'}`}
                      >
                        {isBreak ? '☕ Break Time' : `${selectedDuration.icon} ${selectedDuration.label}`}
                      </Badge>
                      {currentSubject && (
                        <p className="text-gray-400 text-sm mt-2">
                          {currentSubject} {currentChapter && `• ${currentChapter}`}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Session Info */}
                <div className="flex justify-center items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{sessionCount}</div>
                    <div className="text-xs text-gray-400">Sessions Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedDuration.minutes}m</div>
                    <div className="text-xs text-gray-400">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{Math.round(progress * 100)}%</div>
                    <div className="text-xs text-gray-400">Progress</div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={isActive ? pauseTimer : startTimer}
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold ${
                    isActive 
                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isActive ? (
                    <><Pause className="h-5 w-5 mr-2" /> Pause</>
                  ) : (
                    <><Play className="h-5 w-5 mr-2" /> Start</>
                  )}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold text-white border-gray-600"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session Setup */}
          {!isActive && (
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Physics, Chemistry"
                    value={currentSubject}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Chapter (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Mechanics, Organic"
                    value={currentChapter}
                    onChange={(e) => setCurrentChapter(e.target.value)}
                    className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Duration Selection */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-effect border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Duration Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {SESSION_DURATIONS.map((duration) => (
                        <motion.button
                          key={duration.minutes}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDuration(duration)}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            selectedDuration.minutes === duration.minutes
                              ? `${duration.color} border-white/30 text-white`
                              : 'bg-background-secondary border-gray-600 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{duration.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold">{duration.label}</div>
                                <div className="text-sm opacity-80">{duration.minutes} minutes</div>
                              </div>
                            </div>
                            {selectedDuration.minutes === duration.minutes && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session Progress */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < sessionCount ? selectedDuration.color : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{sessionCount}</div>
                  <div className="text-sm text-gray-400">Sessions Completed</div>
                </div>
                {sessionHistory?.data && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      {Math.round(sessionHistory.data.reduce((sum: number, s: any) => sum + s.duration, 0) / 60)}h
                    </div>
                    <div className="text-xs text-gray-400">Total Focus Time</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session History */}
      <AnimatePresence>
        {showHistory && sessionHistory?.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Session History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {sessionHistory.data.slice(0, 10).map((session: any, index: number) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {SESSION_DURATIONS.find(d => d.minutes === session.duration)?.icon || '🍅'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{session.subject}</div>
                          <div className="text-xs text-gray-400">
                            {session.duration}m • {new Date(session.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Export session durations for use in other components
export { SESSION_DURATIONS }