'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { clientSchema, ClientInput } from '@/lib/validations'
import { ClientsEmptyState, SearchEmptyState } from '@/components/EmptyState'

export default function ClientsPage() {
  const { clients, addClient, deleteClient } = useApp()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ClientInput>({ name: '', email: '', phone: '', company: '', notes: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInput, string>>>({})

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.company?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = clientSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ClientInput, string>> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof ClientInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    addClient(result.data)
    setFormData({ name: '', email: '', phone: '', company: '', notes: '' })
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 animate-slideUp">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
            <p className="text-muted mt-1">{clients.length} contatos cadastrados</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Contato</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="form-group">
                  <Label className="form-label">Nome *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Nome do contato"
                    required 
                    error={!!errors.name}
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <Label className="form-label">Email</Label>
                  <Input 
                    type="email" 
                    value={formData.email ?? ''} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    placeholder="email@exemplo.com"
                    error={!!errors.email}
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <Label className="form-label">Telefone</Label>
                  <Input 
                    value={formData.phone ?? ''} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="(00) 00000-0000"
                    error={!!errors.phone}
                  />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
                <div className="form-group">
                  <Label className="form-label">Empresa</Label>
                  <Input 
                    value={formData.company ?? ''} 
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                    placeholder="Nome da empresa"
                    error={!!errors.company}
                  />
                  {errors.company && <p className="form-error">{errors.company}</p>}
                </div>
                <div className="form-group">
                  <Label className="form-label">Observações</Label>
                  <Input 
                    value={formData.notes ?? ''} 
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                    placeholder="Notas sobre o contato"
                    error={!!errors.notes}
                  />
                  {errors.notes && <p className="form-error">{errors.notes}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Salvar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-slideUp" style={{ animationDelay: '50ms' }}>
          <div className="relative">
            <Input
              placeholder="Buscar contatos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Contacts Table */}
        {clients.length === 0 ? (
          <ClientsEmptyState onAdd={() => setIsDialogOpen(true)} />
        ) : filteredClients.length === 0 ? (
          <SearchEmptyState query={search} />
        ) : (
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-slideUp" style={{ animationDelay: '100ms' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Contato</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Empresa</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light stagger">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="table-row">
                    <td>
                      <Link href={`/clients/${client.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground hover:text-primary transition-colors">{client.name}</span>
                      </Link>
                    </td>
                    <td className="text-muted">{client.email || '-'}</td>
                    <td className="text-muted">{client.phone || '-'}</td>
                    <td className="text-muted">{client.company || '-'}</td>
                    <td className="text-right">
                      <button
                        onClick={() => { if (confirm('Tem certeza que deseja excluir este contato?')) { deleteClient(client.id); } }}
                        className="text-muted-light hover:text-danger transition-colors p-2 rounded-lg hover:bg-danger-light"
                        aria-label="Excluir contato"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
