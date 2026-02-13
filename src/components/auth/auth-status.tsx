'use client'

import { useAuth } from '@/hooks/use-auth'

export default function AuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <div className="text-gray-400">Checking authentication...</div>
  }

  if (!isAuthenticated) {
    return <div className="text-red-400">Not authenticated</div>
  }

  return (
    <div className="text-green-400">
      Authenticated as {user?.name} ({user?.email})
    </div>
  )
}