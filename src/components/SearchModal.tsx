'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils/format'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { clients, projects } = useApp()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(query.toLowerCase()) ||
    client.email?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  return (
    <div className="mobile-search-overlay" onClick={onClose}>
      <div className="mobile-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-search-header">
          <div className="mobile-search-input-container">
            <svg className="w-5 h-5 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar contatos, negócios..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button onClick={onClose} className="mobile-search-cancel">
              Cancelar
            </button>
          </div>
        </div>

        <div className="mobile-search-content">
          {query.length > 0 ? (
            <>
              {filteredClients.length > 0 && (
                <div className="mobile-search-section">
                  <h3 className="mobile-search-section-title">Contatos</h3>
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleNavigate(`/clients/${client.id}`)}
                      className="mobile-search-item"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted">{client.email || 'Sem email'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div className="mobile-search-section">
                  <h3 className="mobile-search-section-title">Negócios</h3>
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleNavigate(`/projects/${project.id}`)}
                      className="mobile-search-item"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-sm text-muted">{formatCurrency(project.value)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredClients.length === 0 && filteredProjects.length === 0 && (
                <div className="mobile-search-empty">
                  <p>Nenhum resultado para "{query}"</p>
                </div>
              )}
            </>
          ) : (
            <div className="mobile-search-hints">
              <p className="text-sm text-muted">Busque por contatos ou negócios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
