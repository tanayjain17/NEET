'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useSubjectChanges } from '@/contexts/subject-changes-context'
import { useState } from 'react'

export default function FloatingSaveButton() {
  const { hasChanges, saveAllChanges, isSaving, pendingChanges } = useSubjectChanges()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    try {
      setSaveStatus('idle')
      await saveAllChanges()
      setSaveStatus('success')
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('chapterProgressUpdated'))
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <AnimatePresence>
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className={`
              relative flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg
              transition-all duration-300 font-medium text-white text-sm
              ${saveStatus === 'success' 
                ? 'bg-green-500 hover:bg-green-600' 
                : saveStatus === 'error'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary hover:bg-primary-hover'
              }
              ${isSaving ? 'cursor-not-allowed opacity-75' : 'hover:scale-105'}
            `}
            whileHover={!isSaving ? { scale: 1.05 } : {}}
            whileTap={!isSaving ? { scale: 0.95 } : {}}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-pink-500/50 blur-lg opacity-75" />
            
            {/* Content */}
            <div className="relative flex items-center space-x-2">
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : saveStatus === 'success' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckIcon className="w-5 h-5" />
                </motion.div>
              ) : (
                <CloudArrowUpIcon className="w-5 h-5" />
              )}
              
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                  {isSaving ? 'Saving...' : 
                   saveStatus === 'success' ? 'Saved!' :
                   saveStatus === 'error' ? 'Save Failed' :
                   'Save Changes'}
                </span>
                <span className="text-xs opacity-90">
                  {pendingChanges.length} change{pendingChanges.length !== 1 ? 's' : ''} pending
                </span>
              </div>
            </div>

            {/* Pulse animation for unsaved changes */}
            {!isSaving && saveStatus === 'idle' && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Change count indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center z-10"
          >
            {pendingChanges.length}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}