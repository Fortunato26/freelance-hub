export interface User {
  id: string
  email: string
  name: string | null
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
  createdAt: Date
  userId: string
  _count?: {
    projects: number
  }
}

export interface Project {
  id: string
  name: string
  description: string | null
  value: number
  status: ProjectStatus
  deadline: Date | null
  createdAt: Date
  clientId: string
  userId: string
  client?: Client
  tasks?: Task[]
  payments?: Payment[]
  _count?: {
    tasks: number
    payments: number
  }
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  projectId: string
}

export interface Payment {
  id: string
  amount: number
  date: Date
  type: 'receive' | 'pay'
  description: string | null
  projectId: string
}

export type ProjectStatus = 'proposal' | 'in_progress' | 'delivered' | 'paid'

export interface DashboardStats {
  totalClients: number
  totalProjects: number
  activeProjects: number
  totalRevenue: number
  totalPaid: number
  totalPending: number
}

export interface ChartData {
  month: string
  revenue: number
  expenses: number
}
