import { NextAuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma' // Singleton instance
import bcrypt from 'bcryptjs'

// 1. Type Augmentation (Fixes TS Errors)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession['user']
  }
  interface User {
    id: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role?: string
  }
}

// 2. Clinical Authentication Logic
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Clinical Access',
      credentials: {
        email: { label: 'Professional ID', type: 'email', placeholder: 'aspirant@medical.com' },
        password: { label: 'Security Token', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Authentication parameters missing.')
        }

        // A. Clinical Registry Lookup
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Access Denied: Identifier not found in clinical registry.')
        }

        // B. Token Verification
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Access Denied: Invalid security token.')
        }

        // C. Session Grant
        return {
          id: user.id,
          email: user.email,
          name: user.name || 'Medical Aspirant',
          role: 'aspirant', // Can extend this later
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Day Clinical Cycle
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Enforce Clinical Dashboard as primary entry point
      if (url.startsWith(baseUrl)) {
        return url === baseUrl ? `${baseUrl}/dashboard` : url
      }
      return `${baseUrl}/dashboard`
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}