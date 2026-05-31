'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency } from '@/utils/format'
import { ProjectStatus } from '@/types'

const statusLabels: Record<ProjectStatus, string> = {
  proposal: 'Proposta',
  in_progress: 'Em Andamento',
  delivered: 'Entregue',
  paid: 'Pago',
}

const statusColors: Record<ProjectStatus, string> = {
  proposal: 'border-yellow-500',
  in_progress: 'border-blue-500',
  delivered: 'border-purple-500',
  paid: 'border-green-500',
}

const statusBgColors: Record<ProjectStatus, string> = {
  proposal: 'bg-yellow-500/10',
  in_progress: 'bg-blue-500/10',
  delivered: 'bg-purple-500/10',
  paid: 'bg-green-500/10',
}

export default function ProjectsPage() {
  const { projects, clients, addProject, updateProject } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    clientId: '',
    deadline: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProject({
      name: formData.name,
      description: formData.description,
      value: parseFloat(formData.value),
      status: 'proposal',
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      clientId: formData.clientId,
      userId: 'user1',
    })
    setFormData({ name: '', description: '', value: '', clientId: '', deadline: '' })
    setIsDialogOpen(false)
  }

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, { status: newStatus })
  }

  const columns: ProjectStatus[] = ['proposal', 'in_progress', 'delivered', 'paid']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projetos</h1>
            <p className="text-[#a3a3a3]">{projects.length} projetos cadastrados</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                + Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-[#262626]">
              <DialogHeader>
                <DialogTitle>Novo Projeto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Projeto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#0a0a0a] border-[#262626]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0a0a0a] border-[#262626]"
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor (R$) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="bg-[#0a0a0a] border-[#262626]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientId">Cliente *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                    <SelectTrigger className="bg-[#0a0a0a] border-[#262626]">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#262626]">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="bg-[#0a0a0a] border-[#262626]"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">
                  Criar Projeto
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((status) => (
            <div key={status} className={`rounded-xl p-4 ${statusBgColors[status]} border-t-2 ${statusColors[status]}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{statusLabels[status]}</h3>
                <span className="text-sm text-[#525252]">
                  {projects.filter(p => p.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {projects
                  .filter(p => p.status === status)
                  .map((project) => {
                    const client = clients.find(c => c.id === project.clientId)
                    return (
                      <div
                        key={project.id}
                        className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 hover:border-[#b8960f] transition-colors cursor-pointer"
                      >
                        <h4 className="font-medium text-sm">{project.name}</h4>
                        <p className="text-xs text-[#525252] mt-1">{client?.name || 'Sem cliente'}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-semibold text-[#d4af37]">
                            {formatCurrency(project.value)}
                          </span>
                          {project.deadline && (
                            <span className="text-xs text-[#525252]">
                              {new Date(project.deadline).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          {columns.filter(s => s !== status).map((newStatus) => (
                            <button
                              key={newStatus}
                              onClick={() => handleStatusChange(project.id, newStatus)}
                              className="text-xs px-2 py-1 rounded bg-[#262626] text-[#a3a3a3] hover:bg-[#404040] transition-colors"
                            >
                              → {statusLabels[newStatus].substring(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
