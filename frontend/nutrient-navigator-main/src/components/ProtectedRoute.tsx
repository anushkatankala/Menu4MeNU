// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react'
import { useAuth } from '@/context/useAuth'
import AuthModal from '@/components/AuthModal'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // If not loading and no user, show login modal
    if (!loading && !user) {
      setShowAuthModal(true)
    } else if (user) {
      setShowAuthModal(false)
    }
  }, [user, loading])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show the protected content
  if (user) {
    return <>{children}</>
  }

  // If not authenticated, show the auth modal
  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access this page
          </p>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          // Redirect to home if they close without logging in
          window.location.href = '/'
        }} 
      />
    </>
  )
}