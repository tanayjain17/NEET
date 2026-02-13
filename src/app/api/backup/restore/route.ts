import { NextResponse } from 'next/server'
import { BackupSystem } from '@/lib/backup-system'

export async function POST(request: Request) {
  try {
    const { backupData } = await request.json()
    const backup = new BackupSystem()
    
    const success = await backup.restoreFromData(backupData)
    
    return NextResponse.json({
      success,
      message: success ? 'Backup restored successfully' : 'Restore failed'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to restore backup'
    }, { status: 500 })
  }
}