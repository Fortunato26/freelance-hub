'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        return
      }

      router.push('/login')
    } catch (err) {
      setError('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">Freelance</span>
            <span className="text-white">Hub</span>
          </h1>
          <p className="text-[#525252] mt-2">Crie sua conta</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-[#a3a3a3]">Nome</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#0a0a0a] border-[#262626] mt-1" placeholder="Seu nome" required />
            </div>
            <div>
              <Label className="text-[#a3a3a3]">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#0a0a0a] border-[#262626] mt-1" placeholder="seu@email.com" required />
            </div>
            <div>
              <Label className="text-[#a3a3a3]">Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#0a0a0a] border-[#262626] mt-1" placeholder="••••••••" required minLength={6} />
            </div>
            <div>
              <Label className="text-[#a3a3a3]">Confirmar Senha</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-[#0a0a0a] border-[#262626] mt-1" placeholder="••••••••" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] font-semibold">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#525252]">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#d4af37] hover:underline">Entre</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
