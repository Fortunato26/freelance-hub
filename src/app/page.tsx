'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { RevenueChart, ProjectsByStatusChart, TopClientsChart } from '@/components/dashboard/Charts'

export default function Home() {
  const { getDashboardStats, projects, payments, clients } = useApp()
  const stats = getDashboardStats()

  const recentProjects = projects.slice(0, 4)
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
          <RevenueChart />
          <ProjectsByStatusChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopClientsChart />
          </div>

          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader>
              <CardTitle className="text-lg">Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPayments.length === 0 ? (
                  <p className="text-center text-[#525252] py-8">Nenhuma transação</p>
                ) : (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          payment.type === 'receive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.type === 'receive' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{payment.description}</p>
                          <p className="text-xs text-[#525252]">{new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${payment.type === 'receive' ? 'text-green-500' : 'text-red-500'}`}>
                        {payment.type === 'receive' ? '+' : '-'} {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1a1a1a] border-[#262626]">
          <CardHeader>
            <CardTitle className="text-lg">Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentProjects.map((project) => {
                const client = clients.find(c => c.id === project.clientId)
                return (
                  <div key={project.id} className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 hover:border-[#b8960f] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                    </div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-[#525252] mt-1">{client?.name || 'Sem cliente'}</p>
                    <p className="text-lg font-bold text-[#d4af37] mt-3">{formatCurrency(project.value)}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
