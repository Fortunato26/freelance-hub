'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Senhas não coincidem')
      return
    }
    // TODO: Implement register with NextAuth
    console.log('Register:', { name, email, password })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
              Freelance
            </span>
            <span className="text-white">Hub</span>
          </h1>
          <p className="text-[#525252] mt-2">Crie sua conta</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-[#525252] focus:border-[#d4af37] focus:outline-none transition-colors"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-[#525252] focus:border-[#d4af37] focus:outline-none transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-[#525252] focus:border-[#d4af37] focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white placeholder-[#525252] focus:border-[#d4af37] focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] font-semibold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
            >
              Criar Conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#525252] text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#d4af37] hover:underline">
                Entre
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
