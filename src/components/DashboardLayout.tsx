'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { MobileNav } from '@/components/MobileNav'
import { MobileHeader } from '@/components/MobileHeader'
import { SearchModal } from '@/components/SearchModal'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <div className="desktop-header">
          <Header onSearchClick={() => setIsSearchOpen(true)} />
        </div>
        
        {/* Mobile Header */}
        <MobileHeader onSearchClick={() => setIsSearchOpen(true)} />
        
        <main className="flex-1 overflow-auto main-content mobile-no-bounce">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav onFabClick={() => setIsFabMenuOpen(true)} />
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* FAB Menu */}
      {isFabMenuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsFabMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-2 w-64 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsFabMenuOpen(false)
                window.location.href = '/clients'
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Novo Contato</span>
            </button>
            <button
              onClick={() => {
                setIsFabMenuOpen(false)
                window.location.href = '/projects'
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Novo Negócio</span>
            </button>
            <button
              onClick={() => {
                setIsFabMenuOpen(false)
                window.location.href = '/finances'
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-success">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Novo Pagamento</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
