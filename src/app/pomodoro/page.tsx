'use client'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import PomodoroTimer from '@/components/enhanced/pomodoro-timer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PomodoroPage() {
  return (
    <DashboardLayout 
      title="🍅 Pomodoro Focus Timer"
      subtitle="Customizable focus sessions for maximum NEET preparation efficiency"
    >
      <div className="space-y-8">
        {/* Main Timer Component */}
        <PomodoroTimer />
        
        {/* Instructions & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* How to Use */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                📚 How to Use Pomodoro Technique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="text-red-400 border-red-400 mt-1">1</Badge>
                  <p>Choose your session duration (10min to 2 hours)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="text-red-400 border-red-400 mt-1">2</Badge>
                  <p>Set subject and chapter for focused study</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="text-red-400 border-red-400 mt-1">3</Badge>
                  <p>Work with complete focus until timer ends</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="text-red-400 border-red-400 mt-1">4</Badge>
                  <p>Take breaks and track your progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NEET-Specific Tips */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🎯 NEET Preparation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                  <h4 className="text-blue-300 font-medium mb-2">⚡ Quick Focus (10min)</h4>
                  <p className="text-sm text-gray-300">Perfect for revision, formula practice, or quick concept review</p>
                </div>
                
                <div className="p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
                  <h4 className="text-green-300 font-medium mb-2">🍅 Standard (25min)</h4>
                  <p className="text-sm text-gray-300">Ideal for DPP solving (aim for 50+ questions per session)</p>
                </div>
                
                <div className="p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                  <h4 className="text-purple-300 font-medium mb-2">🧠 Deep Work (45min)</h4>
                  <p className="text-sm text-gray-300">Best for learning new chapters or complex problem solving</p>
                </div>
                
                <div className="p-3 bg-orange-500/10 border border-orange-400/20 rounded-lg">
                  <h4 className="text-orange-300 font-medium mb-2">🚀 Extended (2hr)</h4>
                  <p className="text-sm text-gray-300">For mock tests or intensive chapter completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">🌟 Benefits of Pomodoro for NEET Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="text-white font-semibold mb-2">Enhanced Focus</h4>
                <p className="text-gray-400 text-sm">Eliminates distractions and improves concentration during study sessions</p>
              </div>
              
              <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="text-white font-semibold mb-2">Progress Tracking</h4>
                <p className="text-gray-400 text-sm">Monitor daily study hours and session completion rates</p>
              </div>
              
              <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="text-white font-semibold mb-2">Prevents Burnout</h4>
                <p className="text-gray-400 text-sm">Regular breaks maintain energy and prevent mental fatigue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}