'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIInsights } from '@/hooks/use-ai-insights';
import { Brain, Calendar, Target, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

export function AIInsightsDashboard() {
  const {
    insights,
    schedule,
    motivationalMessage,
    weakAreaFocus,
    loading,
    error,
    generateInsights,
    clearError,
  } = useAIInsights();

  const [activeTab, setActiveTab] = useState<'insights' | 'schedule' | 'motivation' | 'weak-areas'>('insights');

  const handleGenerateInsights = async (type: 'study-insights' | 'optimal-schedule' | 'motivational-boost' | 'weak-area-focus') => {
    clearError();
    await generateInsights(type);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getConsistencyColor = (consistency: 'high' | 'medium' | 'low') => {
    switch (consistency) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-2 px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white flex items-center justify-center gap-2 flex-wrap">
          <Brain className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-blue-400" />
          <span className="break-words">AI Study Insights</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-1 sm:px-2 md:px-4">
          Get personalized recommendations powered by AI to optimize your NEET preparation
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 lg:gap-4 justify-center px-2 sm:px-4">
        <Button
          variant={activeTab === 'insights' ? 'default' : 'outline'}
          onClick={() => setActiveTab('insights')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 lg:px-6"
          size="sm"
        >
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline md:hidden lg:inline">Study </span>Insights
        </Button>
        <Button
          variant={activeTab === 'schedule' ? 'default' : 'outline'}
          onClick={() => setActiveTab('schedule')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 lg:px-6"
          size="sm"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline md:hidden lg:inline">Optimal </span>Schedule
        </Button>
        <Button
          variant={activeTab === 'motivation' ? 'default' : 'outline'}
          onClick={() => setActiveTab('motivation')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 lg:px-6"
          size="sm"
        >
          <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline md:hidden lg:inline">Motivation </span>Boost
        </Button>
        <Button
          variant={activeTab === 'weak-areas' ? 'default' : 'outline'}
          onClick={() => setActiveTab('weak-areas')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 lg:px-6"
          size="sm"
        >
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline md:hidden lg:inline">Weak </span>Areas
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/20 mx-2 sm:mx-0">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-start gap-2 text-red-400">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base break-words">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on active tab */}
      {activeTab === 'insights' && (
        <Card className="bg-gray-800/50 border-gray-700 mx-1 sm:mx-2 md:mx-0">
          <CardHeader>
            <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-3 lg:gap-4">
              <span className="break-words text-base sm:text-lg md:text-xl lg:text-2xl">Study Pattern Analysis</span>
              <Button
                onClick={() => handleGenerateInsights('study-insights')}
                disabled={loading}
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Generate </span>Insights
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              AI-powered analysis of your study patterns and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights ? (
              <>
                {/* Overall Assessment */}
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white break-words">Overall Assessment</h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg break-words leading-relaxed">{insights.overallAssessment}</p>
                </div>

                {/* Subject Analysis */}
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white break-words">Subject Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                    <div className="space-y-2 md:space-y-3">
                      <h4 className="text-green-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">Strengths</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
                        {insights.subjectAnalysis.strengths.map((subject, index) => (
                          <Badge key={index} className="bg-green-500/20 text-green-400 text-xs sm:text-sm break-words px-2 py-1">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <h4 className="text-red-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg">Areas for Improvement</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
                        {insights.subjectAnalysis.weaknesses.map((subject, index) => (
                          <Badge key={index} className="bg-red-500/20 text-red-400 text-xs sm:text-sm break-words px-2 py-1">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base break-words leading-relaxed">{insights.subjectAnalysis.details}</p>
                </div>

                {/* Study Patterns */}
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white break-words">Study Patterns</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                    <div className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-gray-700/20 rounded-lg">
                      <p className="text-xs sm:text-sm md:text-base text-gray-400">Consistency</p>
                      <p className={`font-semibold text-sm sm:text-base md:text-lg break-words ${getConsistencyColor(insights.studyPatterns.consistency)}`}>
                        {insights.studyPatterns.consistency.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-gray-700/20 rounded-lg">
                      <p className="text-xs sm:text-sm md:text-base text-gray-400">Question Volume</p>
                      <p className={`font-semibold text-sm sm:text-base md:text-lg break-words ${
                        insights.studyPatterns.questionVolume === 'above_target' ? 'text-green-400' :
                        insights.studyPatterns.questionVolume === 'on_target' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {insights.studyPatterns.questionVolume.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-gray-700/20 rounded-lg">
                      <p className="text-xs sm:text-sm md:text-base text-gray-400">Revision Quality</p>
                      <p className={`font-semibold text-sm sm:text-base md:text-lg break-words ${
                        insights.studyPatterns.revisionQuality === 'excellent' ? 'text-green-400' :
                        insights.studyPatterns.revisionQuality === 'good' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {insights.studyPatterns.revisionQuality.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base break-words leading-relaxed">{insights.studyPatterns.insights}</p>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white break-words">Recommendations</h3>
                  <div className="space-y-3">
                    {insights.recommendations.map((rec, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                          <h4 className="font-medium text-white text-sm sm:text-base break-words flex-1">{rec.action}</h4>
                          <Badge className={`${getPriorityColor(rec.priority)} text-xs flex-shrink-0`}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 mb-1 break-words">
                          <strong>Timeframe:</strong> {rec.timeframe}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 break-words leading-relaxed">{rec.expectedImpact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2 break-words">Motivational Message</h3>
                  <p className="text-gray-300 text-sm sm:text-base break-words leading-relaxed">{insights.motivationalMessage}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Brain className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base px-4 break-words">Click "Generate Insights" to get AI-powered study analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'schedule' && (
        <Card className="bg-gray-800/50 border-gray-700 mx-1 sm:mx-2 md:mx-0">
          <CardHeader>
            <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="break-words">Optimal Study Schedule</span>
              <Button
                onClick={() => handleGenerateInsights('optimal-schedule')}
                disabled={loading}
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  'Generate Schedule'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Personalized daily and weekly study schedule based on your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schedule ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white break-words">Daily Schedule</h3>
                  <div className="space-y-2">
                    {schedule.dailySchedule.map((slot, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-700/30 rounded-lg gap-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
                          <span className="text-blue-400 font-mono text-xs sm:text-sm break-words">{slot.timeSlot}</span>
                          <span className="text-white text-sm sm:text-base break-words">{slot.activity}</span>
                          <Badge variant="outline" className="text-xs break-words">
                            {slot.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`text-xs break-words ${
                            slot.focus === 'theory' ? 'bg-blue-500/20 text-blue-400' :
                            slot.focus === 'practice' ? 'bg-green-500/20 text-green-400' :
                            slot.focus === 'revision' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {slot.focus}
                          </Badge>
                          <span className="text-gray-400 text-xs sm:text-sm">{slot.duration}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white break-words">Weekly Focus</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {Object.entries(schedule.weeklyFocus).map(([day, focus]) => (
                      <div key={day} className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-400 capitalize break-words">{day}</p>
                        <p className="text-white font-medium text-xs sm:text-sm break-words">{focus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base px-4 break-words">Click "Generate Schedule" to get your personalized study plan</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'motivation' && (
        <Card className="bg-gray-800/50 border-gray-700 mx-1 sm:mx-2 md:mx-0">
          <CardHeader>
            <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="break-words">Motivational Boost</span>
              <Button
                onClick={() => handleGenerateInsights('motivational-boost')}
                disabled={loading}
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  'Get Motivation'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Personalized encouragement based on your recent achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {motivationalMessage ? (
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-4 sm:p-6">
                <div className="text-center">
                  <Target className="h-8 w-8 sm:h-12 sm:w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-lg text-white leading-relaxed break-words">{motivationalMessage}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Target className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base px-4 break-words">Click "Get Motivation" for a personalized boost</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'weak-areas' && (
        <Card className="bg-gray-800/50 border-gray-700 mx-1 sm:mx-2 md:mx-0">
          <CardHeader>
            <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="break-words">Weak Area Focus Plan</span>
              <Button
                onClick={() => handleGenerateInsights('weak-area-focus')}
                disabled={loading}
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  'Analyze Weak Areas'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Targeted improvement plan for your weakest subjects and chapters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weakAreaFocus ? (
              <div className="space-y-6">
                <div className="text-center p-4 rounded-lg border" style={{
                  backgroundColor: weakAreaFocus.riskAssessment === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                                   weakAreaFocus.riskAssessment === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                                   'rgba(34, 197, 94, 0.1)',
                  borderColor: weakAreaFocus.riskAssessment === 'high' ? 'rgba(239, 68, 68, 0.3)' :
                               weakAreaFocus.riskAssessment === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
                               'rgba(34, 197, 94, 0.3)'
                }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                  <Badge className={
                    weakAreaFocus.riskAssessment === 'high' ? 'bg-red-500' :
                    weakAreaFocus.riskAssessment === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }>
                    {weakAreaFocus.riskAssessment.toUpperCase()} RISK
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white break-words">Weekly Targets</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-xl sm:text-2xl font-bold text-blue-400">{weakAreaFocus.weeklyTargets.lectureCompletion}</p>
                      <p className="text-xs sm:text-sm text-gray-400 break-words">Lectures to Complete</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-xl sm:text-2xl font-bold text-green-400">{weakAreaFocus.weeklyTargets.questionsToSolve}</p>
                      <p className="text-xs sm:text-sm text-gray-400 break-words">Questions to Solve</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-xl sm:text-2xl font-bold text-yellow-400">{weakAreaFocus.weeklyTargets.chaptersToRevise}</p>
                      <p className="text-xs sm:text-sm text-gray-400 break-words">Chapters to Revise</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base px-4 break-words">Click "Analyze Weak Areas" to get targeted improvement recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}