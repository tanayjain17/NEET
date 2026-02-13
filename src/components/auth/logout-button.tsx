'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/landing' })
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 transition-all duration-200"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm font-medium">Logout</span>
    </motion.button>
  )
}