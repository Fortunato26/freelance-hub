'use client'

import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils/format'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#d4af37', '#f4d03f', '#c9a227', '#b8960f', '#a38900']

export function RevenueChart() {
  const { payments } = useApp()

  const monthlyData = payments.reduce((acc, payment) => {
    const month = new Date(payment.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    if (!acc[month]) acc[month] = { month, revenue: 0, expenses: 0 }
    if (payment.type === 'receive') acc[month].revenue += payment.amount
    else acc[month].expenses += payment.amount
    return acc
  }, {} as Record<string, { month: string; revenue: number; expenses: number }>)

  const data = Object.values(monthlyData).slice(-6)

  if (data.length === 0) {
    data.push(
      { month: 'Jan', revenue: 5000, expenses: 200 },
      { month: 'Fev', revenue: 8000, expenses: 350 },
      { month: 'Mar', revenue: 6000, expenses: 150 },
      { month: 'Abr', revenue: 12000, expenses: 500 },
      { month: 'Mai', revenue: 9000, expenses: 280 },
      { month: 'Jun', revenue: 15000, expenses: 400 },
    )
  }

  return (
    <Card className="bg-[#1a1a1a] border-[#262626]">
      <CardHeader>
        <CardTitle className="text-lg">Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" stroke="#525252" fontSize={12} />
              <YAxis stroke="#525252" fontSize={12} tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [formatCurrency(Number(value))]}
              />
              <Legend wrapperStyle={{ color: '#a3a3a3' }} />
              <Bar dataKey="revenue" name="Receita" fill="#d4af37" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectsByStatusChart() {
  const { projects } = useApp()

  const statusLabels: Record<string, string> = {
    proposal: 'Proposta',
    in_progress: 'Em Andamento',
    delivered: 'Entregue',
    paid: 'Pago',
  }

  const data = Object.entries(
    projects.reduce((acc, project) => {
      const label = statusLabels[project.status] || project.status
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    data.push(
      { name: 'Proposta', value: 2 },
      { name: 'Em Andamento', value: 3 },
      { name: 'Entregue', value: 1 },
      { name: 'Pago', value: 4 },
    )
  }

  return (
    <Card className="bg-[#1a1a1a] border-[#262626]">
      <CardHeader>
        <CardTitle className="text-lg">Projetos por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px' }}
                formatter={(value) => [`${value} projetos`]}
              />
              <Legend
                wrapperStyle={{ color: '#a3a3a3' }}
                formatter={(value) => <span style={{ color: '#a3a3a3' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function TopClientsChart() {
  const { clients, projects } = useApp()

  const clientData = clients.map(client => ({
    name: client.name.substring(0, 10),
    value: projects
      .filter(p => p.clientId === client.id)
      .reduce((sum, p) => sum + p.value, 0),
  }))
  .filter(c => c.value > 0)
  .sort((a, b) => b.value - a.value)
  .slice(0, 5)

  if (clientData.length === 0) {
    clientData.push(
      { name: 'TechCorp', value: 13000 },
      { name: 'StartupXYZ', value: 12000 },
      { name: 'Digital', value: 25000 },
      { name: 'E-com+', value: 18000 },
    )
  }

  return (
    <Card className="bg-[#1a1a1a] border-[#262626]">
      <CardHeader>
        <CardTitle className="text-lg">Top Clientes por Valor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis type="number" stroke="#525252" fontSize={12} tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#525252" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px' }}
                formatter={(value) => [formatCurrency(Number(value))]}
              />
              <Bar dataKey="value" fill="#d4af37" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
