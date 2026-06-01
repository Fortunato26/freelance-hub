'use client'

import { SessionProvider } from 'next-auth/react'
import { AppProvider } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'

function AppProviderWithAuth({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()
  return <AppProvider userId={userId}>{children}</AppProvider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProviderWithAuth>{children}</AppProviderWithAuth>
    </SessionProvider>
  )
}
