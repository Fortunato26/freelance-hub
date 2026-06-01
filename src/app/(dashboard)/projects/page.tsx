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
import { ProjectStatus, Project } from '@/types'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const statusLabels: Record<ProjectStatus, string> = {
  proposal: 'Proposta',
  in_progress: 'Em Andamento',
  delivered: 'Entregue',
  paid: 'Pago',
}

const statusColors: Record<ProjectStatus, string> = {
  proposal: 'border-yellow-500 bg-yellow-500/10',
  in_progress: 'border-blue-500 bg-blue-500/10',
  delivered: 'border-purple-500 bg-purple-500/10',
  paid: 'border-green-500 bg-green-500/10',
}

const statusDotColors: Record<ProjectStatus, string> = {
  proposal: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  delivered: 'bg-purple-500',
  paid: 'bg-green-500',
}

function KanbanCard({ project, clients }: { project: Project; clients: Array<{ id: string; name: string }> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const client = clients.find(c => c.id === project.clientId)

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-[#1a1a1a] border border-[#262626] rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-[#b8960f] transition-all ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}`}
      >
        <h4 className="font-medium text-sm">{project.name}</h4>
        {project.description && <p className="text-xs text-[#525252] mt-1 line-clamp-2">{project.description}</p>}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-[10px] text-[#a3a3a3]">{client?.name?.charAt(0) || '?'}</div>
          <span className="text-xs text-[#525252]">{client?.name || 'Sem cliente'}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#262626]">
          <span className="text-sm font-semibold text-[#d4af37]">{formatCurrency(project.value)}</span>
          {project.deadline && <span className="text-xs text-[#525252]">{new Date(project.deadline).toLocaleDateString('pt-BR')}</span>}
        </div>
      </div>
    </Link>
  )
}

export default function ProjectsPage() {
  const { projects, clients, addProject, updateProject } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', value: '', clientId: '', deadline: '' })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const columns: ProjectStatus[] = ['proposal', 'in_progress', 'delivered', 'paid']
  const getProjectsByStatus = (status: ProjectStatus) => projects.filter(p => p.status === status)
  const activeProject = projects.find(p => p.id === activeId)

  function handleDragStart(event: DragStartEvent) { setActiveId(event.active.id as string) }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const activeProject = projects.find(p => p.id === active.id)
    if (!activeProject) return
    const overId = over.id as string
    const overColumn = columns.find(s => overId === `column-${s}`)
    if (overColumn) { updateProject(activeProject.id, { status: overColumn }); return }
    const overProject = projects.find(p => p.id === overId)
    if (overProject && activeProject.id !== overProject.id && activeProject.status !== overProject.status) {
      updateProject(activeProject.id, { status: overProject.status })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(formData.value)
    if (isNaN(value) || value <= 0) return
    addProject({ name: formData.name, description: formData.description, value, status: 'proposal', deadline: formData.deadline ? new Date(formData.deadline) : null, clientId: formData.clientId, userId: 'user1' })
    setFormData({ name: '', description: '', value: '', clientId: '', deadline: '' })
    setIsDialogOpen(false)
  }

  const totalValue = projects.reduce((sum, p) => sum + p.value, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projetos</h1>
            <p className="text-[#a3a3a3]">{projects.length} projetos • {formatCurrency(totalValue)} total</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">+ Novo Projeto</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-[#262626]">
              <DialogHeader><DialogTitle>Novo Projeto</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Nome *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" required /></div>
                <div><Label>Descrição</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Valor (R$) *</Label><Input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" required /></div>
                  <div><Label>Prazo</Label><Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" /></div>
                </div>
                <div><Label>Cliente *</Label><Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}><SelectTrigger className="bg-[#0a0a0a] border-[#262626]"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent className="bg-[#1a1a1a] border-[#262626]">{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">Criar Projeto</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((status) => (
              <div key={status} className={`rounded-xl border-t-2 ${statusColors[status]} p-4 min-h-[400px]`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusDotColors[status]}`} />
                    <h3 className="font-semibold">{statusLabels[status]}</h3>
                  </div>
                  <span className="text-sm text-[#525252] bg-[#0a0a0a] px-2 py-1 rounded-full">{getProjectsByStatus(status).length}</span>
                </div>
                <SortableContext items={getProjectsByStatus(status).map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {getProjectsByStatus(status).map((project) => (
                      <KanbanCard key={project.id} project={project} clients={clients} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeProject ? (
              <div className="bg-[#1a1a1a] border border-[#d4af37] rounded-lg p-4 shadow-xl rotate-3 opacity-90">
                <h4 className="font-medium text-sm">{activeProject.name}</h4>
                <span className="text-sm font-semibold text-[#d4af37] mt-2 block">{formatCurrency(activeProject.value)}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </DashboardLayout>
  )
}
