'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Client, Project, Payment, Task, DashboardStats } from '@/types'

interface AppContextType {
  clients: Client[]
  projects: Project[]
  payments: Payment[]
  tasks: Task[]
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void
  updateProject: (id: string, data: Partial<Project>) => void
  deleteProject: (id: string) => void
  addPayment: (payment: Omit<Payment, 'id'>) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  getDashboardStats: () => DashboardStats
  getClientById: (id: string) => Client | undefined
  getProjectById: (id: string) => Project | undefined
  getProjectsByClient: (clientId: string) => Project[]
  getTasksByProject: (projectId: string) => Task[]
  getPaymentsByProject: (projectId: string) => Payment[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialClients: Client[] = [
  { id: '1', name: 'TechCorp', email: 'contato@techcorp.com', phone: '(11) 99999-9999', company: 'TechCorp Ltda', notes: 'Cliente desde 2024', createdAt: new Date('2024-01-15'), userId: 'user1' },
  { id: '2', name: 'StartupXYZ', email: 'admin@startupxyz.com', phone: '(21) 88888-8888', company: 'StartupXYZ Inc', notes: 'Projeto de e-commerce', createdAt: new Date('2024-03-20'), userId: 'user1' },
  { id: '3', name: 'Digital Agency', email: 'hello@digital.com', phone: '(31) 77777-7777', company: 'Digital Agency', notes: 'Agência de marketing', createdAt: new Date('2024-06-10'), userId: 'user1' },
  { id: '4', name: 'E-commerce Plus', email: 'vendas@ecommerce.com', phone: '(41) 66666-6666', company: 'E-commerce Plus Ltda', notes: 'Loja virtual', createdAt: new Date('2024-09-05'), userId: 'user1' },
]

const initialProjects: Project[] = [
  { id: '1', name: 'Website Institucional', description: 'Redesign completo do site', value: 5000, status: 'in_progress', deadline: new Date('2026-06-15'), clientId: '1', userId: 'user1', createdAt: new Date('2026-05-01') },
  { id: '2', name: 'E-commerce Shopify', description: 'Loja virtual completa', value: 12000, status: 'proposal', deadline: new Date('2026-07-01'), clientId: '2', userId: 'user1', createdAt: new Date('2026-05-10') },
  { id: '3', name: 'App Mobile', description: 'Aplicativo React Native', value: 25000, status: 'delivered', deadline: new Date('2026-05-20'), clientId: '3', userId: 'user1', createdAt: new Date('2026-04-01') },
  { id: '4', name: 'Dashboard Analytics', description: 'Painel de métricas', value: 8000, status: 'paid', deadline: new Date('2026-04-30'), clientId: '1', userId: 'user1', createdAt: new Date('2026-03-15') },
  { id: '5', name: 'Sistema de Gestão', description: 'CRM personalizado', value: 18000, status: 'in_progress', deadline: new Date('2026-06-30'), clientId: '4', userId: 'user1', createdAt: new Date('2026-05-05') },
]

const initialPayments: Payment[] = [
  { id: '1', amount: 5000, date: new Date('2026-05-15'), type: 'receive', description: 'Website Institucional - TechCorp', projectId: '1' },
  { id: '2', amount: 150, date: new Date('2026-05-10'), type: 'pay', description: 'Hospedagem AWS', projectId: '1' },
  { id: '3', amount: 12000, date: new Date('2026-05-08'), type: 'receive', description: 'E-commerce Shopify - StartupXYZ', projectId: '2' },
  { id: '4', amount: 80, date: new Date('2026-05-05'), type: 'pay', description: 'Domínio e SSL', projectId: '2' },
  { id: '5', amount: 8000, date: new Date('2026-04-30'), type: 'receive', description: 'Dashboard Analytics - TechCorp', projectId: '4' },
]

const initialTasks: Task[] = [
  { id: '1', title: 'Criar wireframe do site', completed: true, createdAt: new Date('2026-05-01'), projectId: '1' },
  { id: '2', title: 'Desenvolver homepage', completed: true, createdAt: new Date('2026-05-05'), projectId: '1' },
  { id: '3', title: 'Implementar formulário de contato', completed: false, createdAt: new Date('2026-05-10'), projectId: '1' },
  { id: '4', title: 'Configurar SEO', completed: false, createdAt: new Date('2026-05-12'), projectId: '1' },
  { id: '5', title: 'Definir layout da loja', completed: true, createdAt: new Date('2026-05-10'), projectId: '2' },
  { id: '6', title: 'Cadastrar produtos', completed: false, createdAt: new Date('2026-05-15'), projectId: '2' },
  { id: '7', title: 'Configurar pagamentos', completed: false, createdAt: new Date('2026-05-18'), projectId: '2' },
  { id: '8', title: 'Prototipar telas', completed: true, createdAt: new Date('2026-04-01'), projectId: '3' },
  { id: '9', title: 'Desenvolver frontend', completed: true, createdAt: new Date('2026-04-10'), projectId: '3' },
  { id: '10', title: 'Integrar API', completed: true, createdAt: new Date('2026-04-20'), projectId: '3' },
]

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = { ...clientData, id: generateId(), createdAt: new Date() }
    setClients(prev => [newClient, ...prev])
  }

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
    setProjects(prev => prev.filter(p => p.clientId !== id))
  }

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = { ...projectData, id: generateId(), createdAt: new Date() }
    setProjects(prev => [newProject, ...prev])
  }

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setTasks(prev => prev.filter(t => t.projectId !== id))
    setPayments(prev => prev.filter(p => p.projectId !== id))
  }

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...paymentData, id: generateId() }
    setPayments(prev => [newPayment, ...prev])
  }

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: generateId(), createdAt: new Date() }
    setTasks(prev => [newTask, ...prev])
  }

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const getDashboardStats = (): DashboardStats => {
    const totalClients = clients.length
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'proposal').length
    const totalRevenue = payments.filter(p => p.type === 'receive').reduce((sum, p) => sum + p.amount, 0)
    const totalPaid = payments.filter(p => p.type === 'receive').reduce((sum, p) => sum + p.amount, 0)
    const totalPending = projects.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.value, 0)
    return { totalClients, totalProjects, activeProjects, totalRevenue, totalPaid, totalPending }
  }

  const getClientById = (id: string) => clients.find(c => c.id === id)
  const getProjectById = (id: string) => projects.find(p => p.id === id)
  const getProjectsByClient = (clientId: string) => projects.filter(p => p.clientId === clientId)
  const getTasksByProject = (projectId: string) => tasks.filter(t => t.projectId === projectId)
  const getPaymentsByProject = (projectId: string) => payments.filter(p => p.projectId === projectId)

  return (
    <AppContext.Provider value={{
      clients, projects, payments, tasks,
      addClient, updateClient, deleteClient,
      addProject, updateProject, deleteProject,
      addPayment, addTask, updateTask, deleteTask,
      getDashboardStats, getClientById, getProjectById,
      getProjectsByClient, getTasksByProject, getPaymentsByProject,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
