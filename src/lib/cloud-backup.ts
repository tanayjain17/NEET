import { BackupSystem } from './backup-system'

export class CloudBackup {
  private backup = new BackupSystem()

  async createCloudBackup(): Promise<boolean> {
    try {
      const data = await this.backup.downloadBackup()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      
      // Store in Vercel KV or send via webhook
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/backup/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp,
          data: JSON.parse(data),
          key: `backup-${timestamp}`
        })
      })

      return response.ok
    } catch (error) {
      console.error('Cloud backup failed:', error)
      return false
    }
  }

  async sendBackupEmail(): Promise<boolean> {
    try {
      const data = await this.backup.downloadBackup()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/backup/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp,
          backup: data,
          filename: `backup-${timestamp}.json`
        })
      })

      return response.ok
    } catch (error) {
      console.error('Email backup failed:', error)
      return false
    }
  }
}