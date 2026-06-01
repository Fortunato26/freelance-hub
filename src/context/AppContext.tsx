'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { Client, Project, Payment, Task, DashboardStats } from '@/types'

interface AppContextType {
  userId: string | null
  clients: Client[]
  projects: Project[]
  payments: Payment[]
  tasks: Task[]
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'userId'>) => Promise<void>
  updateClient: (id: string, data: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'userId'>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  getDashboardStats: () => DashboardStats
  getClientById: (id: string) => Client | undefined
  getProjectById: (id: string) => Project | undefined
  getProjectsByClient: (clientId: string) => Project[]
  getTasksByProject: (projectId: string) => Task[]
  getPaymentsByProject: (projectId: string) => Payment[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const [clientsRes, projectsRes, paymentsRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/projects'),
        fetch('/api/payments'),
      ])
      if (clientsRes.ok) setClients(await clientsRes.json())
      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (paymentsRes.ok) setPayments(await paymentsRes.json())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...clientData, userId }),
    })
    if (res.ok) {
      const newClient = await res.json()
      setClients(prev => [newClient, ...prev])
    }
  }

  const updateClient = async (id: string, data: Partial<Client>) => {
    const res = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    }
  }

  const deleteClient = async (id: string) => {
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setClients(prev => prev.filter(c => c.id !== id))
      setProjects(prev => prev.filter(p => p.clientId !== id))
    }
  }

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, userId }),
    })
    if (res.ok) {
      const newProject = await res.json()
      setProjects(prev => [newProject, ...prev])
    }
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    }
  }

  const deleteProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id))
      setTasks(prev => prev.filter(t => t.projectId !== id))
      setPayments(prev => prev.filter(p => p.projectId !== id))
    }
  }

  const addPayment = async (paymentData: Omit<Payment, 'id'>) => {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })
    if (res.ok) {
      const newPayment = await res.json()
      setPayments(prev => [newPayment, ...prev])
    }
  }

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    if (res.ok) {
      const newTask = await res.json()
      setTasks(prev => [newTask, ...prev])
    }
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    }
  }

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
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
      userId: userId || null,
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
