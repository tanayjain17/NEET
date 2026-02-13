'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useProductionSync } from '@/hooks/use-production-sync'

export default function SyncIndicator() {
  const { isOnline, syncCount, lastSync } = useProductionSync()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Track sync status with dashboard queries
  const { isFetching: subjectsFetching } = useQuery({
    queryKey: ['subjects-dashboard'],
    queryFn: () => null,
    enabled: false // Don't auto-fetch, just track status
  })

  const { isFetching: analyticsFetching } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => null,
    enabled: false // Don't auto-fetch, just track status
  })

  const isFetching = subjectsFetching || analyticsFetching

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (isFetching) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (isFetching) return 'Syncing...'
    return 'Live'
  }

  const getTimeSinceSync = () => {
    if (!lastSync) return '0s'
    return `${Math.floor((Date.now() - lastSync) / 1000)}s`
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50 glass-effect rounded-full px-3 py-2 border border-white/10"
    >
      <div className="flex items-center gap-2 text-xs text-white">
        <motion.div
          className={`w-2 h-2 rounded-full ${getStatusColor()}`}
          animate={isFetching ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span>{getStatusText()}</span>
        <span className="text-gray-400">
          {syncCount > 0 && !isFetching ? getTimeSinceSync() : ''}
        </span>
        {process.env.NODE_ENV === 'development' && (
          <span className="text-xs text-blue-400">#{syncCount}</span>
        )}
      </div>
    </motion.div>
  )
}