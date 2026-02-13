import { AutoBackup } from './auto-backup'

const autoBackup = new AutoBackup()

// Run daily at 2 AM
const BACKUP_HOUR = 2
let backupInterval: NodeJS.Timeout | null = null

export function startBackupScheduler() {
  if (backupInterval) return

  const scheduleNextBackup = () => {
    const now = new Date()
    const next = new Date()
    next.setHours(BACKUP_HOUR, 0, 0, 0)
    
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }
    
    const msUntilNext = next.getTime() - now.getTime()
    
    setTimeout(async () => {
      await autoBackup.scheduleDaily()
      scheduleNextBackup()
    }, msUntilNext)
  }

  scheduleNextBackup()
}

export function stopBackupScheduler() {
  if (backupInterval) {
    clearTimeout(backupInterval)
    backupInterval = null
  }
}