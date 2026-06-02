'use client'

import { useAuth } from '@/hooks/useAuth'

interface MobileHeaderProps {
  onSearchClick: () => void
}

export function MobileHeader({ onSearchClick }: MobileHeaderProps) {
  const { user } = useAuth()
  const userName = user?.name || 'Usuário'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <header className="mobile-header mobile-safe-top">
      <div className="mobile-header-logo">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
          <span className="text-white font-bold text-xs">FH</span>
        </div>
        <span className="font-semibold text-foreground">FreelanceHub</span>
      </div>

      <div className="mobile-header-actions">
        <button 
          onClick={onSearchClick}
          className="mobile-header-btn"
          aria-label="Buscar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-medium">
          {userInitials}
        </div>
      </div>
    </header>
  )
}
