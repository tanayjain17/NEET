'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import AchievementSystem from '@/components/enhanced/achievement-system'

export default function AchievementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/landing')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-xl">Loading achievements... 🏆</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout 
      title="🏆 Achievements & Badges"
      subtitle="Track your progress and unlock amazing rewards!"
    >
      <AchievementSystem />
    </DashboardLayout>
  )
}