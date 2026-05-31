'use client'

import { use, useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/utils/format'
import { ProjectStatus } from '@/types'
import Link from 'next/link'

const statusLabels: Record<ProjectStatus, string> = {
  proposal: 'Proposta',
  in_progress: 'Em Andamento',
  delivered: 'Entregue',
  paid: 'Pago',
}

const statusColors: Record<ProjectStatus, string> = {
  proposal: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  delivered: 'bg-purple-500/20 text-purple-400',
  paid: 'bg-green-500/20 text-green-400',
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getProjectById, getClientById, getTasksByProject, getPaymentsByProject, updateProject, addTask, updateTask, deleteTask, addPayment } = useApp()
  
  const project = getProjectById(id)
  const client = project ? getClientById(project.clientId) : null
  const projectTasks = getTasksByProject(id)
  const projectPayments = getPaymentsByProject(id)
  
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', type: 'receive' as 'receive' | 'pay' })

  const completedTasks = projectTasks.filter(t => t.completed).length
  const totalTasks = projectTasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const totalReceived = projectPayments.filter(p => p.type === 'receive').reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = projectPayments.filter(p => p.type === 'pay').reduce((sum, p) => sum + p.amount, 0)

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
          <Link href="/projects"><Button>Voltar para projetos</Button></Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle, completed: false, projectId: id })
      setNewTaskTitle('')
      setIsTaskDialogOpen(false)
    }
  }

  const handleAddPayment = () => {
    if (newPayment.description && newPayment.amount) {
      addPayment({
        description: newPayment.description,
        amount: parseFloat(newPayment.amount),
        type: newPayment.type,
        date: new Date(),
        projectId: id,
      })
      setNewPayment({ description: '', amount: '', type: 'receive' })
      setIsPaymentDialogOpen(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="text-[#525252] hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-[#a3a3a3]">{client?.name || 'Sem cliente'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
            <Select value={project.status} onValueChange={(value) => updateProject(id, { status: value as ProjectStatus })}>
              <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#262626]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#262626]">
                <SelectItem value="proposal">Proposta</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Valor do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#d4af37]">{formatCurrency(project.value)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Recebido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(totalReceived)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Prazo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#d4af37]">
                {project.deadline ? formatDate(project.deadline) : 'Sem prazo'}
              </p>
            </CardContent>
          </Card>
        </div>

        {project.description && (
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#a3a3a3]">{project.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tarefas</CardTitle>
                <p className="text-sm text-[#525252] mt-1">{completedTasks}/{totalTasks} concluídas</p>
              </div>
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#d4af37] text-[#0a0a0a]">+ Tarefa</Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-[#262626]">
                  <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Título da tarefa"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="bg-[#0a0a0a] border-[#262626]"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <Button onClick={handleAddTask} className="w-full bg-[#d4af37] text-[#0a0a0a]">Adicionar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#525252]">Progresso</span>
                  <span className="text-[#d4af37]">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-[#262626] rounded-full h-2">
                  <div className="bg-[#d4af37] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                {projectTasks.length === 0 ? (
                  <p className="text-center text-[#525252] py-4">Nenhuma tarefa</p>
                ) : (
                  projectTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                      <button
                        onClick={() => updateTask(task.id, { completed: !task.completed })}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.completed ? 'bg-[#d4af37] border-[#d4af37]' : 'border-[#525252]'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 ${task.completed ? 'line-through text-[#525252]' : 'text-[#a3a3a3]'}`}>
                        {task.title}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-[#525252] hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pagamentos</CardTitle>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#d4af37] text-[#0a0a0a]">+ Pagamento</Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-[#262626]">
                  <DialogHeader>
                    <DialogTitle>Novo Pagamento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Button variant={newPayment.type === 'receive' ? 'default' : 'outline'} onClick={() => setNewPayment({ ...newPayment, type: 'receive' })} className={newPayment.type === 'receive' ? 'bg-green-500' : ''}>Receber</Button>
                      <Button variant={newPayment.type === 'pay' ? 'default' : 'outline'} onClick={() => setNewPayment({ ...newPayment, type: 'pay' })} className={newPayment.type === 'pay' ? 'bg-red-500' : ''}>Pagar</Button>
                    </div>
                    <Input placeholder="Descrição" value={newPayment.description} onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" />
                    <Input type="number" placeholder="Valor" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" />
                    <Button onClick={handleAddPayment} className="w-full bg-[#d4af37] text-[#0a0a0a]">Adicionar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projectPayments.length === 0 ? (
                  <p className="text-center text-[#525252] py-4">Nenhum pagamento</p>
                ) : (
                  projectPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${payment.type === 'receive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {payment.type === 'receive' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{payment.description}</p>
                          <p className="text-xs text-[#525252]">{formatDate(payment.date)}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${payment.type === 'receive' ? 'text-green-500' : 'text-red-500'}`}>
                        {payment.type === 'receive' ? '+' : '-'} {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
