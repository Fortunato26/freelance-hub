'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils/format'

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Array<{ type: string; id: string; name: string; description?: string; href: string }>>([])
  const { clients, projects } = useApp()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults: Array<{ type: string; id: string; name: string; description?: string; href: string }> = []

    clients.forEach(client => {
      if (client.name.toLowerCase().includes(query.toLowerCase()) ||
          client.email?.toLowerCase().includes(query.toLowerCase()) ||
          client.company?.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          type: 'Cliente',
          id: client.id,
          name: client.name,
          description: client.company || client.email || undefined,
          href: `/clients/${client.id}`,
        })
      }
    })

    projects.forEach(project => {
      if (project.name.toLowerCase().includes(query.toLowerCase()) ||
          project.description?.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          type: 'Projeto',
          id: project.id,
          name: project.name,
          description: formatCurrency(project.value),
          href: `/projects/${project.id}`,
        })
      }
    })

    setResults(searchResults)
  }, [query, clients, projects])

  const handleSelect = (href: string) => {
    router.push(href)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar... (Ctrl+K)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          className="bg-[#0a0a0a] border-[#262626] pl-10 pr-4"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#262626] rounded-lg shadow-xl z-50 max-h-96 overflow-auto">
          {results.length === 0 && query.trim() ? (
            <div className="p-4 text-center text-[#525252]">
              Nenhum resultado para "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result.href)}
                  className="w-full px-4 py-3 text-left hover:bg-[#0a0a0a] transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-xs text-[#a3a3a3]">
                    {result.type === 'Cliente' ? '👤' : '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{result.name}</p>
                    <p className="text-xs text-[#525252] truncate">{result.type}{result.description && ` • ${result.description}`}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
