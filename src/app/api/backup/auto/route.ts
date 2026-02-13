import { NextResponse } from 'next/server'
import { AutoBackup } from '@/lib/auto-backup'

export async function GET() {
  try {
    const { CloudBackup } = await import('@/lib/cloud-backup')
    const cloudBackup = new CloudBackup()
    
    const success = await cloudBackup.sendBackupEmail()
    
    return NextResponse.json({
      success,
      message: success ? 'Weekly backup emailed successfully' : 'Weekly backup failed',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Automated backup failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Automated backup failed'
    }, { status: 500 })
  }
}