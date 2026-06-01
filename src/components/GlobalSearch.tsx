'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
          type: 'Contato',
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
          type: 'Negócio',
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
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar contatos, negócios..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded">
          ⌘K
        </kbd>
      </div>

      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-auto">
          {results.length === 0 && query.trim() ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Nenhum resultado para "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resultados</p>
              </div>
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result.href)}
                  className="w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                    {result.type === 'Contato' ? '👤' : '💼'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{result.name}</p>
                    <p className="text-xs text-gray-500 truncate">{result.type}{result.description && ` · ${result.description}`}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
