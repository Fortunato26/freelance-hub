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

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  proposal: { label: 'Proposta', color: 'text-amber-700', bg: 'bg-amber-100' },
  in_progress: { label: 'Em Andamento', color: 'text-blue-700', bg: 'bg-blue-100' },
  delivered: { label: 'Entregue', color: 'text-purple-700', bg: 'bg-purple-100' },
  paid: { label: 'Pago', color: 'text-green-700', bg: 'bg-green-100' },
}

function KanbanCard({ project, clients }: { project: Project; clients: Array<{ id: string; name: string }> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const client = clients.find(c => c.id === project.clientId)
  const config = statusConfig[project.status]

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white rounded-lg border border-gray-200 p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-blue-200 ${
          isDragging ? 'opacity-50 shadow-lg scale-105 rotate-2' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{project.name}</h4>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
        
        {project.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-medium">
            {client?.name?.charAt(0) || '?'}
          </div>
          <span className="text-xs text-gray-500">{client?.name || 'Sem contato'}</span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(project.value)}</span>
          {project.deadline && (
            <span className="text-xs text-gray-400">
              {new Date(project.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          )}
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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const columns: ProjectStatus[] = ['proposal', 'in_progress', 'delivered', 'paid']
  const getProjectsByStatus = (status: ProjectStatus) => projects.filter(p => p.status === status)
  const activeProject = projects.find(p => p.id === activeId)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const activeProject = projects.find(p => p.id === active.id)
    if (!activeProject) return
    const overId = over.id as string
    const overColumn = columns.find(s => overId === `column-${s}`)
    if (overColumn) {
      updateProject(activeProject.id, { status: overColumn })
      return
    }
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
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Negócios</h1>
            <p className="text-gray-500 mt-1">{projects.length} negócios · {formatCurrency(totalValue)} total</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Negócio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Novo Negócio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label className="text-gray-700">Nome do Negócio *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required />
                </div>
                <div>
                  <Label className="text-gray-700">Descrição</Label>
                  <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Valor (R$) *</Label>
                    <Input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="mt-1" required />
                  </div>
                  <div>
                    <Label className="text-gray-700">Prazo</Label>
                    <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Contato *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione um contato" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Criar Negócio
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pipeline Board */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((status) => {
              const config = statusConfig[status]
              const statusProjects = getProjectsByStatus(status)
              const statusValue = statusProjects.reduce((sum, p) => sum + p.value, 0)
              
              return (
                <div key={status} className="pipeline-column">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{config.label}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {statusProjects.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatCurrency(statusValue)}</p>
                  </div>
                  
                  <SortableContext items={statusProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="p-3 space-y-3 min-h-[300px]">
                      {statusProjects.map((project) => (
                        <KanbanCard key={project.id} project={project} clients={clients} />
                      ))}
                      
                      {statusProjects.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          Arraste um negócio para cá
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              )
            })}
          </div>

          <DragOverlay>
            {activeProject ? (
              <div className="bg-white rounded-lg border-2 border-blue-500 p-4 shadow-xl rotate-3 opacity-90 max-w-xs">
                <h4 className="font-medium text-sm text-gray-900">{activeProject.name}</h4>
                <span className="text-sm font-semibold text-gray-900 mt-2 block">{formatCurrency(activeProject.value)}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </DashboardLayout>
  )
}
