'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle, Clock, Brain, Zap } from 'lucide-react'

interface EnhancedMistakePopupV2Props {
  isOpen: boolean
  onClose: () => void
  sessionType: 'daily_study' | 'test'
  sessionData: any
  onSubmit: (mistakeData: any) => void
}

export default function EnhancedMistakePopupV2({
  isOpen,
  onClose,
  sessionType,
  sessionData,
  onSubmit
}: EnhancedMistakePopupV2Props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [afternoonSessionData, setAfternoonSessionData] = useState({
    studiedInAfternoon: null as boolean | null,
    startTime: '',
    endTime: '',
    questionsAttempted: 0,
    questionsCorrect: 0,
    caffeineIntake: '',
    mealTiming: ''
  })
  const [mistakeData, setMistakeData] = useState({
    subjectSpecificMistakes: {
      physics: [] as string[],
      chemistry: [] as string[],
      biology: [] as string[]
    },
    mistakeContext: {
      timeOfDay: '',
      questionDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
      topicArea: ''
    },
    stressLevel: 5,
    energyLevel: 5,
    focusLevel: 5,
    timeWasted: 0,
    specificMistakes: [] as string[],
    improvementAreas: [] as string[]
  })

  const neetSpecificMistakes = {
    physics: [
      'formula_error',
      'unit_conversion',
      'vector_calculation_error',
      'diagram_misinterpretation',
      'concept_confusion',
      'numerical_approximation_error'
    ],
    chemistry: [
      'formula_error',
      'unit_conversion',
      'reaction_mechanism_error',
      'periodic_trend_confusion',
      'stoichiometry_error',
      'organic_structure_error'
    ],
    biology: [
      'diagram_misinterpretation',
      'terminology_confusion',
      'process_sequence_error',
      'classification_error',
      'function_structure_mismatch',
      'exception_rule_confusion'
    ]
  }

  const mistakeLabels = {
    'formula_error': 'Wrong Formula Applied',
    'unit_conversion': 'Unit Conversion Error',
    'vector_calculation_error': 'Vector Calculation Mistake',
    'diagram_misinterpretation': 'Diagram Misread',
    'concept_confusion': 'Concept Confusion',
    'numerical_approximation_error': 'Approximation Error',
    'reaction_mechanism_error': 'Reaction Mechanism Wrong',
    'periodic_trend_confusion': 'Periodic Trend Error',
    'stoichiometry_error': 'Stoichiometry Mistake',
    'organic_structure_error': 'Organic Structure Wrong',
    'terminology_confusion': 'Terminology Mixed Up',
    'process_sequence_error': 'Process Sequence Wrong',
    'classification_error': 'Classification Mistake',
    'function_structure_mismatch': 'Function-Structure Mismatch',
    'exception_rule_confusion': 'Exception/Rule Confusion'
  }

  const timeOfDayOptions = [
    { value: 'morning', label: '🌅 Morning (6-11 AM)' },
    { value: 'afternoon', label: '☀️ Afternoon (12-5 PM)', critical: true },
    { value: 'evening', label: '🌆 Evening (6-9 PM)' },
    { value: 'night', label: '🌙 Night (10 PM+)' }
  ]

  const handleSubjectMistakeToggle = (subject: keyof typeof neetSpecificMistakes, mistake: string) => {
    setMistakeData(prev => ({
      ...prev,
      subjectSpecificMistakes: {
        ...prev.subjectSpecificMistakes,
        [subject]: prev.subjectSpecificMistakes[subject].includes(mistake)
          ? prev.subjectSpecificMistakes[subject].filter(m => m !== mistake)
          : [...prev.subjectSpecificMistakes[subject], mistake]
      }
    }))
  }

  const handleSubmit = () => {
    // Compile all mistake categories
    const allMistakes = [
      ...mistakeData.subjectSpecificMistakes.physics,
      ...mistakeData.subjectSpecificMistakes.chemistry,
      ...mistakeData.subjectSpecificMistakes.biology
    ]

    const finalData = {
      ...mistakeData,
      mistakeCategories: allMistakes,
      sessionStartTime: new Date().toISOString(),
      isAfternoonSession: mistakeData.mistakeContext.timeOfDay === 'afternoon',
      afternoonSessionData
    }

    onSubmit(finalData)
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return true // Skip afternoon session requirement
      case 2:
        return true // No mistakes is also valid - this is learning analysis
      case 3:
        return mistakeData.mistakeContext.timeOfDay !== ''
      case 4:
        return true // Levels can be default
      default:
        return false
    }
  }

  const getTotalMistakes = () => {
    return Object.values(mistakeData.subjectSpecificMistakes).reduce(
      (total, mistakes) => total + mistakes.length, 0
    )
  }

  const calculateSessionDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
  }

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background-primary border border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-400" />
              AI Mistake Analysis - {sessionType === 'test' ? 'Test' : 'Study'} Session
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Step {currentStep}/4</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          {/* Step 1: Session Overview (Optional) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  📊 Session Overview (Optional)
                </h3>
                <p className="text-gray-300 text-sm">
                  Tell us about your study session today. This helps us provide better insights.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAfternoonSessionData(prev => ({ ...prev, studiedInAfternoon: true }))}
                  className={`p-6 rounded-lg text-center transition-all border-2 ${
                    afternoonSessionData.studiedInAfternoon === true
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-semibold">YES</div>
                  <div className="text-sm mt-1">I studied in afternoon</div>
                </button>

                <button
                  onClick={() => setAfternoonSessionData(prev => ({ ...prev, studiedInAfternoon: false }))}
                  className={`p-6 rounded-lg text-center transition-all border-2 ${
                    afternoonSessionData.studiedInAfternoon === false
                      ? 'bg-red-500/20 border-red-400 text-red-300'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-3xl mb-2">❌</div>
                  <div className="font-semibold">NO</div>
                  <div className="text-sm mt-1">No afternoon study</div>
                </button>
              </div>

              {/* Afternoon Session Details (if YES) */}
              {afternoonSessionData.studiedInAfternoon === true && (
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 space-y-4">
                  <h4 className="text-blue-300 font-semibold">📊 Afternoon Session Details (Required)</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={afternoonSessionData.startTime}
                        onChange={(e) => setAfternoonSessionData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                        min="12:00"
                        max="17:00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">End Time</label>
                      <input
                        type="time"
                        value={afternoonSessionData.endTime}
                        onChange={(e) => setAfternoonSessionData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                        min="12:00"
                        max="17:00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Questions Attempted</label>
                      <input
                        type="number"
                        value={afternoonSessionData.questionsAttempted}
                        onChange={(e) => setAfternoonSessionData(prev => ({ ...prev, questionsAttempted: Number(e.target.value) }))}
                        className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Questions Correct</label>
                      <input
                        type="number"
                        value={afternoonSessionData.questionsCorrect}
                        onChange={(e) => setAfternoonSessionData(prev => ({ ...prev, questionsCorrect: Number(e.target.value) }))}
                        className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                        min="0"
                        max={afternoonSessionData.questionsAttempted}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Caffeine Intake</label>
                      <select
                        value={afternoonSessionData.caffeineIntake}
                        onChange={(e) => setAfternoonSessionData(prev => ({ ...prev, caffeineIntake: e.target.value }))}
                        className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                      >
                        <option value="">Select</option>
                        <option value="none">No Caffeine</option>
                        <option value="tea_1cup">1 Cup Tea</option>
                        <option value="coffee_1cup">1 Cup Coffee</option>
                        <option value="tea_2cups">2 Cups Tea</option>
                        <option value="coffee_2cups">2 Cups Coffee</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Last Meal Timing</label>
                      <select
                        value={afternoonSessionData.mealTiming}
                        onChange={(e) => setAfternoonSessionData(prev => ({ ...prev, mealTiming: e.target.value }))}
                        className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                      >
                        <option value="">Select</option>
                        <option value="30min_ago">30 minutes ago</option>
                        <option value="1hour_ago">1 hour ago</option>
                        <option value="2hours_ago">2 hours ago</option>
                        <option value="3hours_ago">3+ hours ago</option>
                      </select>
                    </div>
                  </div>

                  {afternoonSessionData.questionsAttempted > 0 && (
                    <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                      <div className="text-green-300 font-semibold">
                        📈 Accuracy: {Math.round((afternoonSessionData.questionsCorrect / afternoonSessionData.questionsAttempted) * 100)}%
                      </div>
                      <div className="text-green-200 text-sm mt-1">
                        {afternoonSessionData.startTime && afternoonSessionData.endTime && (
                          <>Duration: {calculateSessionDuration(afternoonSessionData.startTime, afternoonSessionData.endTime)} minutes</>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* No Afternoon Study Warning */}
              {afternoonSessionData.studiedInAfternoon === false && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                  <div className="flex items-center text-red-300 mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">⚠️ CRITICAL: No Afternoon Study Detected!</span>
                  </div>
                  <div className="text-red-200 text-sm space-y-1">
                    <p>• NEET exam is from 2-5 PM - you MUST practice during these hours!</p>
                    <p>• Afternoon performance directly impacts your AIIMS Delhi chances</p>
                    <p>• Schedule at least 1 hour of afternoon study tomorrow</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Subject-Specific Mistakes */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  🎯 Learning Analysis - Mistakes (Optional)
                </h3>
                <p className="text-gray-300 text-sm">
                  Select any mistakes you made. If you made no mistakes, that's great! Just proceed to the next step.
                </p>
              </div>

              {Object.entries(neetSpecificMistakes).map(([subject, mistakes]) => (
                <div key={subject} className="bg-background-secondary/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                    {subject} Mistakes
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mistakes.map(mistake => (
                      <button
                        key={mistake}
                        onClick={() => handleSubjectMistakeToggle(subject as keyof typeof neetSpecificMistakes, mistake)}
                        className={`p-3 rounded-lg text-sm text-left transition-all ${
                          mistakeData.subjectSpecificMistakes[subject as keyof typeof mistakeData.subjectSpecificMistakes].includes(mistake)
                            ? 'bg-red-500/20 border border-red-400 text-red-300'
                            : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50'
                        }`}
                      >
                        {mistakeLabels[mistake as keyof typeof mistakeLabels]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {getTotalMistakes() > 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                  <div className="flex items-center text-yellow-300">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">
                      {getTotalMistakes()} mistake types identified
                    </span>
                  </div>
                  <p className="text-yellow-200 text-sm mt-1">
                    Each mistake type costs 3-8 marks on average. Let's fix these patterns!
                  </p>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                  <div className="flex items-center text-green-300">
                    <span className="mr-2">✨</span>
                    <span className="font-semibold">
                      Excellent! No mistakes identified
                    </span>
                  </div>
                  <p className="text-green-200 text-sm mt-1">
                    Perfect performance! This session data will help optimize your study patterns.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Context & Timing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  ⏰ Session Context & Timing
                </h3>
                <p className="text-gray-300 text-sm">
                  Help us understand when and how these mistakes occurred
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeOfDayOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setMistakeData(prev => ({
                      ...prev,
                      mistakeContext: { ...prev.mistakeContext, timeOfDay: option.value }
                    }))}
                    className={`p-4 rounded-lg text-center transition-all ${
                      mistakeData.mistakeContext.timeOfDay === option.value
                        ? 'bg-blue-500/20 border border-blue-400 text-blue-300'
                        : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50'
                    } ${option.critical ? 'ring-2 ring-red-400/50' : ''}`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    {option.critical && (
                      <div className="text-xs text-red-300 mt-1">NEET Exam Time!</div>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Question Difficulty</label>
                  <select
                    value={mistakeData.mistakeContext.questionDifficulty}
                    onChange={(e) => setMistakeData(prev => ({
                      ...prev,
                      mistakeContext: { 
                        ...prev.mistakeContext, 
                        questionDifficulty: e.target.value as 'easy' | 'medium' | 'hard'
                      }
                    }))}
                    className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                  >
                    <option value="easy">Easy Questions</option>
                    <option value="medium">Medium Questions</option>
                    <option value="hard">Hard Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Topic/Chapter Area</label>
                  <input
                    type="text"
                    value={mistakeData.mistakeContext.topicArea}
                    onChange={(e) => setMistakeData(prev => ({
                      ...prev,
                      mistakeContext: { ...prev.mistakeContext, topicArea: e.target.value }
                    }))}
                    placeholder="e.g., Mechanics, Organic Chemistry, Genetics"
                    className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Time Wasted (minutes)</label>
                <input
                  type="number"
                  value={mistakeData.timeWasted}
                  onChange={(e) => setMistakeData(prev => ({ ...prev, timeWasted: Number(e.target.value) }))}
                  min="0"
                  max="180"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* Step 4: Performance Levels */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  📊 Performance Levels
                </h3>
                <p className="text-gray-300 text-sm">
                  Rate your stress, energy, and focus during this session
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'stressLevel', label: 'Stress Level', icon: '😰', color: 'red' },
                  { key: 'energyLevel', label: 'Energy Level', icon: '⚡', color: 'yellow' },
                  { key: 'focusLevel', label: 'Focus Level', icon: '🎯', color: 'blue' }
                ].map(({ key, label, icon, color }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-medium flex items-center">
                        <span className="mr-2">{icon}</span>
                        {label}
                      </label>
                      <span className="text-white font-bold text-lg">
                        {mistakeData[key as 'stressLevel' | 'energyLevel' | 'focusLevel']}/10
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                        <button
                          key={value}
                          onClick={() => setMistakeData(prev => ({ ...prev, [key]: value }))}
                          className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                            mistakeData[key as 'stressLevel' | 'energyLevel' | 'focusLevel'] >= value
                              ? `bg-${color}-500 text-white`
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Insights */}
              <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Quick Insights</h4>
                <div className="space-y-1 text-sm">
                  {mistakeData.stressLevel > 7 && (
                    <div className="text-red-300">🚨 High stress detected - implement calming techniques</div>
                  )}
                  {mistakeData.energyLevel < 4 && (
                    <div className="text-yellow-300">⚡ Low energy - optimize sleep and nutrition</div>
                  )}
                  {mistakeData.focusLevel < 5 && (
                    <div className="text-blue-300">🎯 Poor focus - minimize distractions</div>
                  )}
                  {mistakeData.mistakeContext.timeOfDay === 'afternoon' && (
                    <div className="text-orange-300">☀️ Afternoon session - NEET exam timing practice!</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-600">
            <Button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentStep < 4 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepComplete(currentStep)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {currentStep === 1 && afternoonSessionData.studiedInAfternoon === false ? 'Continue (Fix Tomorrow!)' : 'Next Step'}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate AI Analysis
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}