import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthSessionProvider from '@/components/providers/session-provider'
import QueryProvider from '@/components/providers/query-client-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// 1. Clinical & SEO Metadata Strategy (Combined)
export const metadata: Metadata = {
  title: {
    template: '%s | NEET Clinical Intelligence',
    default: 'NEET Clinical Intelligence Engine | Target: AIIMS 2026',
  },
  description: 'High-precision diagnostic engine for NEET UG trajectory optimization. Neural consolidation protocols, mistake auditing, and bio-rhythm synchronization active.',
  keywords: ['NEET 2026', 'AIIMS Delhi', 'Medical Entrance', 'Clinical Analytics', 'Study Tracker', 'Performance Audit'],
  authors: [{ name: 'Clinical Systems Architects' }],
  openGraph: {
    title: 'NEET Clinical Intelligence Engine',
    description: 'Advanced analytics and strategic planning for high-stakes medical aspirants.',
    type: 'website',
    siteName: 'NEET Command Center',
  },
  icons: {
    icon: '/favicon.ico', // Ensure you have a medical cross or brain icon here
  }
}

// 2. Mobile Optimization (From Option 2)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617', // Slate-950 for seamless status bars
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full">
      <body 
        className={`${inter.className} h-full bg-slate-950 text-slate-200 antialiased selection:bg-blue-500/30 selection:text-blue-200`}
      >
        <AuthSessionProvider>
          <QueryProvider>
            {/* 3. The "Tactical Blueprint" Background Layer */}
            <div className="fixed inset-0 z-[-1] h-full w-full bg-slate-950">
              {/* Technical Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
              
              {/* Ambient Clinical Glow (Top Center) */}
              <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/20 via-slate-950/0 to-slate-950/0 opacity-60 blur-3xl" />
            </div>

            {/* Main Content Area */}
            <main className="relative flex min-h-screen flex-col">
              {children}
            </main>
            
            {/* System Alerts Layer (Essential for Logic) */}
            <Toaster />
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}