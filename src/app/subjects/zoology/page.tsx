'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ZoologyPage() {
  const router = useRouter()

  useEffect(() => {
    const fetchSubjectId = async () => {
      try {
        const response = await fetch('/api/subjects/dashboard')
        if (response.ok) {
          const subjects = await response.json()
          const zoologySubject = subjects.find((s: any) => s.name === 'Zoology')
          if (zoologySubject) {
            router.replace(`/subjects/${zoologySubject.id}`)
          } else {
            router.replace('/')
          }
        } else {
          router.replace('/')
        }
      } catch (error) {
        console.error('Error fetching subjects:', error)
        router.replace('/')
      }
    }

    fetchSubjectId()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}