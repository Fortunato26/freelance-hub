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
import { projectSchema, ProjectInput } from '@/lib/validations'
import { ProjectsEmptyState } from '@/components/EmptyState'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
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
        className={`bg-white rounded-lg border border-border p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 ${
          isDragging ? 'opacity-50 shadow-xl scale-105 rotate-2' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground line-clamp-1">{project.name}</h4>
          <span className={`badge ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
        
        {project.description && (
          <p className="text-xs text-muted line-clamp-2 mb-3">{project.description}</p>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-medium">
            {client?.name?.charAt(0) || '?'}
          </div>
          <span className="text-xs text-muted">{client?.name || 'Sem contato'}</span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <span className="text-sm font-semibold text-foreground">{formatCurrency(project.value)}</span>
          {project.deadline && (
            <span className="text-xs text-muted-light">
              {new Date(project.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function KanbanColumn({ status, projects, clients }: { status: ProjectStatus; projects: Project[]; clients: Array<{ id: string; name: string }> }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = statusConfig[status]

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border border-border bg-gray-50/50 p-4 transition-all duration-200 ${
        isOver ? 'bg-primary/5 border-primary/30' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{config.label}</h3>
          <span className="text-xs text-muted bg-white px-2 py-0.5 rounded-full">{projects.length}</span>
        </div>
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} clients={clients} />
          ))}
        </SortableContext>
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-muted-light text-sm">
            Arraste um negócio aqui
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const { projects, clients, addProject, updateProject } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectInput>({ name: '', description: '', value: '', clientId: '', deadline: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInput, string>>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const columns: ProjectStatus[] = ['proposal', 'in_progress', 'delivered', 'paid']

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(p => p.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const project = projects.find(p => p.id === event.active.id)
    if (project) setActiveProject(project)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveProject(null)
    
    if (over && active.id !== over.id) {
      const projectId = active.id as string
      const newStatus = over.id as ProjectStatus
      if (columns.includes(newStatus)) {
        updateProject(projectId, { status: newStatus })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = projectSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProjectInput, string>> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof ProjectInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    addProject({ name: result.data.name, description: result.data.description, value: result.data.value, status: 'proposal', deadline: result.data.deadline ? new Date(result.data.deadline) : null, clientId: result.data.clientId })
    setFormData({ name: '', description: '', value: '', clientId: '', deadline: '' })
    setIsDialogOpen(false)
  }

  const totalValue = projects.reduce((sum, p) => sum + p.value, 0)

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 animate-slideUp">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Negócios</h1>
            <p className="text-muted mt-1">{projects.length} negócios · {formatCurrency(totalValue)} total</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Negócio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Negócio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="form-group">
                  <Label className="form-label">Nome do Negócio *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="Nome do negócio"
                    required 
                    error={!!errors.name}
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <Label className="form-label">Descrição</Label>
                  <Input 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Descreva o negócio"
                    error={!!errors.description}
                  />
                  {errors.description && <p className="form-error">{errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label className="form-label">Valor (R$) *</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={formData.value} 
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })} 
                      placeholder="0,00"
                      required 
                      error={!!errors.value}
                    />
                    {errors.value && <p className="form-error">{errors.value}</p>}
                  </div>
                  <div className="form-group">
                    <Label className="form-label">Prazo</Label>
                    <Input 
                      type="date" 
                      value={formData.deadline} 
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <Label className="form-label">Contato *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                    <SelectTrigger error={!!errors.clientId}>
                      <SelectValue placeholder="Selecione um contato" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.clientId && <p className="form-error">{errors.clientId}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Criar Negócio
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pipeline Board */}
        {projects.length === 0 ? (
          <ProjectsEmptyState onAdd={() => setIsDialogOpen(true)} />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
              {columns.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  projects={getProjectsByStatus(status)}
                  clients={clients}
                />
              ))}
            </div>

            <DragOverlay>
              {activeProject ? (
                <div className="bg-white rounded-lg border-2 border-primary p-4 shadow-xl rotate-3 opacity-90 max-w-xs">
                  <h4 className="font-medium text-sm text-foreground">{activeProject.name}</h4>
                  <span className="text-sm font-semibold text-foreground mt-2 block">{formatCurrency(activeProject.value)}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </DashboardLayout>
  )
}
