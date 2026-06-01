'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils/format'
import { RevenueChart, ProjectsByStatusChart, TopClientsChart } from '@/components/dashboard/Charts'

export default function Home() {
  const { getDashboardStats, projects, payments, clients } = useApp()
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
    proposal: 'badge-proposal',
    in_progress: 'badge-in-progress',
    delivered: 'badge-delivered',
    paid: 'badge-paid',
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visão geral do seu negócio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Total de Clientes</span>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Negócios Ativos</span>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">Receita Total</span>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">A Receber</span>
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalPending)}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-rd p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Receitas vs Despesas</h3>
            <div className="h-[280px]">
              <RevenueChart />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-rd p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Negócios por Status</h3>
            <div className="h-[280px]">
              <ProjectsByStatusChart />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-rd">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Negócios Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Negócio</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentProjects.map((project) => {
                    const client = clients.find(c => c.id === project.clientId)
                    return (
                      <tr key={project.id} className="table-row cursor-pointer">
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-500">{client?.name || '-'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                            {statusLabels[project.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(project.value)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-rd">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Últimas Transações</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPayments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhuma transação
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        payment.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {payment.type === 'receive' ? '↑' : '↓'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{payment.description}</p>
                        <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${payment.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.type === 'receive' ? '+' : '-'} {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
