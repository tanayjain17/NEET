import { NextResponse } from 'next/server'
import { BackupSystem } from '@/lib/backup-system'

export async function POST() {
  try {
    const backup = new BackupSystem()
    const filepath = await backup.createBackup()
    
    return NextResponse.json({
      success: true,
      filepath,
      message: 'Backup created successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create backup'
    }, { status: 500 })
  }
}