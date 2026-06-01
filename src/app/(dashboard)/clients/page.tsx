'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function ClientsPage() {
  const { clients, addClient, deleteClient } = useApp()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', notes: '' })

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.company?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addClient({ ...formData, userId: 'user1' })
    setFormData({ name: '', email: '', phone: '', company: '', notes: '' })
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-[#a3a3a3]">{clients.length} clientes cadastrados</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">+ Novo Cliente</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-[#262626]">
              <DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" required /></div>
                <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" /></div>
                <div><Label>Telefone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" /></div>
                <div><Label>Empresa</Label><Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" /></div>
                <div><Label>Observações</Label><Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" /></div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">Salvar Cliente</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Input placeholder="Buscar clientes..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#1a1a1a] border-[#262626] pl-10" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="bg-[#1a1a1a] border-[#262626] hover:border-[#b8960f] transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0a0a0a] font-bold text-lg">{client.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        {client.company && <p className="text-sm text-[#525252]">{client.company}</p>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); if (confirm('Tem certeza que deseja excluir este cliente?')) { deleteClient(client.id); } }} className="text-red-500 hover:text-red-400 hover:bg-red-500/10" aria-label="Excluir cliente">✕</Button>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {client.email && <p className="text-[#a3a3a3]"><span className="text-[#525252]">Email:</span> {client.email}</p>}
                    {client.phone && <p className="text-[#a3a3a3]"><span className="text-[#525252]">Tel:</span> {client.phone}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-[#525252]">
            <p className="text-lg">Nenhum cliente encontrado</p>
            <p className="text-sm mt-2">Adicione seu primeiro cliente clicando no botão acima</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
