'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'

export default function Home() {
  const { getDashboardStats, projects, payments } = useApp()
  const stats = getDashboardStats()

  const recentProjects = projects.slice(0, 5)
  const recentPayments = payments.slice(0, 5)

  const statusLabels: Record<string, string> = {
    proposal: 'Proposta',
    in_progress: 'Em Andamento',
    delivered: 'Entregue',
    paid: 'Pago',
  }

  const statusColors: Record<string, string> = {
    proposal: 'bg-yellow-500/20 text-yellow-400',
    in_progress: 'bg-blue-500/20 text-blue-400',
    delivered: 'bg-purple-500/20 text-purple-400',
    paid: 'bg-green-500/20 text-green-400',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[#a3a3a3]">Visão geral do seu negócio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1a1a1a] border-[#262626] hover:border-[#b8960f] transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">{stats.totalClients}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#262626] hover:border-[#b8960f] transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Projetos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">{stats.activeProjects}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#262626] hover:border-[#b8960f] transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{formatCurrency(stats.totalRevenue)}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#262626] hover:border-[#b8960f] transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">A Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">{formatCurrency(stats.totalPending)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader>
              <CardTitle>Projetos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-[#525252]">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                      <p className="text-sm text-[#d4af37] mt-1">{formatCurrency(project.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader>
              <CardTitle>Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        payment.type === 'receive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {payment.type === 'receive' ? '↑' : '↓'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{payment.description}</p>
                        <p className="text-xs text-[#525252]">{new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${payment.type === 'receive' ? 'text-green-500' : 'text-red-500'}`}>
                      {payment.type === 'receive' ? '+' : '-'} {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
