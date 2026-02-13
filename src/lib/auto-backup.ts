import { BackupSystem } from './backup-system'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'
import path from 'path'

export class AutoBackup {
  private backup = new BackupSystem()
  private maxBackups = 7 // Keep 7 days of backups

  async scheduleDaily() {
    try {
      await this.backup.createBackup()
      await this.cleanOldBackups()
      console.log('Daily backup completed')
    } catch (error) {
      console.error('Daily backup failed:', error)
    }
  }

  private async cleanOldBackups() {
    const backupDir = path.join(process.cwd(), 'backups')
    
    try {
      if (!existsSync(backupDir)) return
      
      const files = readdirSync(backupDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(backupDir, f),
          time: statSync(path.join(backupDir, f)).mtime
        }))
        .sort((a, b) => b.time.getTime() - a.time.getTime())

      if (files.length > this.maxBackups) {
        files.slice(this.maxBackups).forEach(f => unlinkSync(f.path))
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error)
    }
  }
}