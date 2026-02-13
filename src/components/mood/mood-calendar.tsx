'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/24/solid'
import { FaceSmileIcon as FaceNeutralIcon } from '@heroicons/react/24/outline'

interface MoodEntry {
  id: string
  date: string
  mood: 'sad' | 'neutral' | 'happy'
}

interface MoodCalendarProps {
  moodEntries: MoodEntry[]
  onMoodSelect: (date: string, mood: 'sad' | 'neutral' | 'happy') => void
}

const MOOD_OPTIONS = [
  { value: 'sad', label: 'Sad', icon: FaceFrownIcon, color: 'text-red-500', bgColor: 'bg-red-500/20' },
  { value: 'neutral', label: 'Neutral', icon: FaceNeutralIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
  { value: 'happy', label: 'Happy', icon: FaceSmileIcon, color: 'text-green-500', bgColor: 'bg-green-500/20' }
] as const

export default function MoodCalendar({ moodEntries, onMoodSelect }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Create mood entries map for quick lookup
  const moodMap = new Map(
    moodEntries.map(entry => [entry.date, entry.mood])
  )

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(day)
    setSelectedDate(dateStr)
  }

  const handleMoodSelect = (mood: 'sad' | 'neutral' | 'happy') => {
    if (selectedDate) {
      onMoodSelect(selectedDate, mood)
      setSelectedDate(null)
    }
  }

  const getMoodForDate = (day: number) => {
    const dateStr = formatDate(day)
    return moodMap.get(dateStr)
  }

  const getMoodStyle = (mood: string | undefined) => {
    if (!mood) return ''
    
    switch (mood) {
      case 'sad':
        return 'bg-red-500/20 border-red-500/50 text-red-400'
      case 'neutral':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
      case 'happy':
        return 'bg-green-500/20 border-green-500/50 text-green-400'
      default:
        return ''
    }
  }

  // Generate calendar days
  const calendarDays = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="glass-effect rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 sm:p-2 rounded-md sm:rounded-lg bg-background-secondary/50 border border-gray-700 text-gray-300 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
        >
          <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        
        <h2 className="text-lg sm:text-xl font-semibold text-white break-words">
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 sm:p-2 rounded-md sm:rounded-lg bg-background-secondary/50 border border-gray-700 text-gray-300 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
        >
          <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-400 py-1 sm:py-2 break-words">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="aspect-square min-h-[32px] sm:min-h-[40px]" />
          }

          const dateStr = formatDate(day)
          const mood = getMoodForDate(day)
          const isSelected = selectedDate === dateStr
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square min-h-[32px] sm:min-h-[40px] rounded-md sm:rounded-lg border transition-all duration-200 hover:scale-105
                flex items-center justify-center text-xs sm:text-sm font-medium
                ${isSelected 
                  ? 'bg-primary/30 border-primary text-primary' 
                  : mood 
                    ? getMoodStyle(mood)
                    : 'bg-background-secondary/30 border-gray-700 text-gray-300 hover:bg-primary/10 hover:border-primary/30'
                }
                ${isToday ? 'ring-2 ring-primary/50' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Mood Selection */}
      {selectedDate && (
        <div className="border-t border-gray-700 pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 break-words">
            How are you feeling on {new Date(selectedDate).toLocaleDateString()}?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {MOOD_OPTIONS.map(option => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleMoodSelect(option.value)}
                  className={`
                    p-4 rounded-lg border transition-all duration-200 hover:scale-105
                    ${option.bgColor} border-gray-600 hover:border-opacity-70
                    flex flex-col items-center space-y-2
                  `}
                >
                  <Icon className={`h-8 w-8 ${option.color}`} />
                  <span className={`text-sm font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-3 sm:mt-4 w-full py-2 px-3 sm:px-4 rounded-md sm:rounded-lg bg-background-secondary/50 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-all duration-200 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-gray-700 pt-4 sm:pt-6 mt-4 sm:mt-6">
        <h4 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3 break-words">Mood Legend</h4>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
          {MOOD_OPTIONS.map(option => {
            const Icon = option.icon
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${option.bgColor} border border-gray-600`} />
                <Icon className={`h-4 w-4 ${option.color}`} />
                <span className="text-sm text-gray-300">{option.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}