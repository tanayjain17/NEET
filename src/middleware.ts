import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to landing page, auth pages, and root
        if (req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/landing') || 
            req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }
        
        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|landing|auth).*)',
  ],
}