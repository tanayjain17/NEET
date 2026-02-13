'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { CloudArrowDownIcon, CloudArrowUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function BackupManager() {
  const [isCreating, setIsCreating] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const createBackup = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/backup/download')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Backup downloaded successfully')
      } else {
        toast.error('Failed to create backup')
      }
    } catch (error) {
      toast.error('Backup creation failed')
    } finally {
      setIsCreating(false)
    }
  }

  const handleFileRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsRestoring(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      const response = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupData: data })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Backup restored successfully')
        window.location.reload()
      } else {
        toast.error('Failed to restore backup')
      }
    } catch (error) {
      toast.error('Invalid backup file')
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <Card className="glass-effect border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <ShieldCheckIcon className="h-5 w-5" />
          <span>Backup Manager</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={createBackup}
            disabled={isCreating}
            className="flex items-center space-x-2"
          >
            <CloudArrowUpIcon className="h-4 w-4" />
            <span>{isCreating ? 'Creating...' : 'Create Backup'}</span>
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleFileRestore}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isRestoring}
            />
            <Button
              disabled={isRestoring}
              variant="outline"
              className="flex items-center space-x-2 w-full"
            >
              <CloudArrowDownIcon className="h-4 w-4" />
              <span>{isRestoring ? 'Restoring...' : 'Restore Backup'}</span>
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>• Backups are emailed weekly on Sunday at 2 AM IST</p>
          <p>• No PC required - runs on Vercel servers</p>
          <p>• Manual backups download to your device</p>
        </div>
      </CardContent>
    </Card>
  )
}