import { NextResponse } from 'next/server'
import { BackupSystem } from '@/lib/backup-system'

export async function GET() {
  try {
    const backup = new BackupSystem()
    const data = await backup.downloadBackup()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${timestamp}.json"`
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create backup'
    }, { status: 500 })
  }
}