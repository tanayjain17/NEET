'use client'

import { useAuth } from '@/hooks/use-auth'
import LogoutButton from '@/components/auth/logout-button'
import Link from 'next/link'

export default function ProtectedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Protected Page</h1>
          <p className="text-gray-300 mb-4">
            This page is only accessible to authenticated users.
          </p>
          <div className="bg-green-900/20 border border-green-500 text-green-200 p-4 rounded-md mb-4">
            <p>✅ Authentication successful!</p>
            <p>User: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Back to Home
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}