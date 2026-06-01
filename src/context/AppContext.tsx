'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Client, Project, Payment, Task, DashboardStats } from '@/types'

interface AppContextType {
  userId: string | null
  clients: Client[]
  projects: Project[]
  payments: Payment[]
  tasks: Task[]
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'userId'>) => void
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'userId'>) => void
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

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function loadFromStorage<T>(key: string, userId: string): T[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(`${key}_${userId}`)
  return data ? JSON.parse(data) : []
}

function saveToStorage<T>(key: string, userId: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${key}_${userId}`, JSON.stringify(data))
}

export function AppProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [clients, setClients] = useState<Client[]>(() => userId ? loadFromStorage('fh_clients', userId) : [])
  const [projects, setProjects] = useState<Project[]>(() => userId ? loadFromStorage('fh_projects', userId) : [])
  const [payments, setPayments] = useState<Payment[]>(() => userId ? loadFromStorage('fh_payments', userId) : [])
  const [tasks, setTasks] = useState<Task[]>(() => userId ? loadFromStorage('fh_tasks', userId) : [])

  const saveClients = useCallback((data: Client[]) => {
    if (userId) saveToStorage('fh_clients', userId, data)
  }, [userId])

  const saveProjects = useCallback((data: Project[]) => {
    if (userId) saveToStorage('fh_projects', userId, data)
  }, [userId])

  const savePayments = useCallback((data: Payment[]) => {
    if (userId) saveToStorage('fh_payments', userId, data)
  }, [userId])

  const saveTasks = useCallback((data: Task[]) => {
    if (userId) saveToStorage('fh_tasks', userId, data)
  }, [userId])

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return
    const newClient: Client = { ...clientData, id: generateId(), createdAt: new Date(), userId }
    const updated = [newClient, ...clients]
    setClients(updated)
    saveClients(updated)
  }

  const updateClient = (id: string, data: Partial<Client>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...data } : c)
    setClients(updated)
    saveClients(updated)
  }

  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id)
    setClients(updated)
    saveClients(updated)
    const updatedProjects = projects.filter(p => p.clientId !== id)
    setProjects(updatedProjects)
    saveProjects(updatedProjects)
  }

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'userId'>) => {
    if (!userId) return
    const newProject: Project = { ...projectData, id: generateId(), createdAt: new Date(), userId }
    const updated = [newProject, ...projects]
    setProjects(updated)
    saveProjects(updated)
  }

  const updateProject = (id: string, data: Partial<Project>) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...data } : p)
    setProjects(updated)
    saveProjects(updated)
  }

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id)
    setProjects(updatedProjects)
    saveProjects(updatedProjects)
    const updatedTasks = tasks.filter(t => t.projectId !== id)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    const updatedPayments = payments.filter(p => p.projectId !== id)
    setPayments(updatedPayments)
    savePayments(updatedPayments)
  }

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = { ...paymentData, id: generateId() }
    const updated = [newPayment, ...payments]
    setPayments(updated)
    savePayments(updated)
  }

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: generateId(), createdAt: new Date() }
    const updated = [newTask, ...tasks]
    setTasks(updated)
    saveTasks(updated)
  }

  const updateTask = (id: string, data: Partial<Task>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...data } : t)
    setTasks(updated)
    saveTasks(updated)
  }

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    saveTasks(updated)
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
