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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function FinancesPage() {
  const { payments, projects, addPayment } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'receive' | 'pay'>('all')
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'receive' as 'receive' | 'pay',
    projectId: '',
  })

  const filteredPayments = payments.filter(p => filterType === 'all' || p.type === filterType)

  const totalReceive = payments.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0)
  const totalPay = payments.filter(t => t.type === 'pay').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalReceive - totalPay

  const monthlyData = payments.reduce((acc, payment) => {
    const month = new Date(payment.date).toLocaleDateString('pt-BR', { month: 'short' })
    if (!acc[month]) acc[month] = { month, receive: 0, pay: 0 }
    if (payment.type === 'receive') acc[month].receive += payment.amount
    else acc[month].pay += payment.amount
    return acc
  }, {} as Record<string, { month: string; receive: number; pay: number }>)

  const chartData = Object.values(monthlyData).slice(-6)

  if (chartData.length === 0) {
    chartData.push(
      { month: 'Jan', receive: 5000, pay: 200 },
      { month: 'Fev', receive: 8000, pay: 350 },
      { month: 'Mar', receive: 6000, pay: 150 },
      { month: 'Abr', receive: 12000, pay: 500 },
      { month: 'Mai', receive: 9000, pay: 280 },
      { month: 'Jun', receive: 15000, pay: 400 },
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) return
    addPayment({
      description: formData.description,
      amount,
      type: formData.type,
      date: new Date(),
      projectId: formData.projectId,
    })
    setFormData({ description: '', amount: '', type: 'receive', projectId: '' })
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-500 mt-1">Controle de receitas e despesas</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Nova Transação</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label className="text-gray-700">Tipo</Label>
                  <div className="flex gap-3 mt-2">
                    <Button type="button" variant={formData.type === 'receive' ? 'default' : 'outline'} onClick={() => setFormData({ ...formData, type: 'receive' })} className={formData.type === 'receive' ? 'bg-green-600 hover:bg-green-700' : ''}>
                      Receber
                    </Button>
                    <Button type="button" variant={formData.type === 'pay' ? 'default' : 'outline'} onClick={() => setFormData({ ...formData, type: 'pay' })} className={formData.type === 'pay' ? 'bg-red-600 hover:bg-red-700' : ''}>
                      Pagar
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Descrição *</Label>
                  <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1" required />
                </div>
                <div>
                  <Label className="text-gray-700">Valor (R$) *</Label>
                  <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="mt-1" required />
                </div>
                <div>
                  <Label className="text-gray-700">Negócio</Label>
                  <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione um negócio" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Salvar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd">
            <span className="text-gray-500 text-sm">A Receber</span>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalReceive)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd">
            <span className="text-gray-500 text-sm">A Pagar</span>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalPay)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-rd">
            <span className="text-gray-500 text-sm">Saldo</span>
            <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-rd p-5 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Fluxo Mensal</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} formatter={(value) => [formatCurrency(Number(value))]} />
                <Bar dataKey="receive" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pay" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant={filterType === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterType('all')} className={filterType === 'all' ? 'bg-gray-900' : ''}>Todas</Button>
          <Button variant={filterType === 'receive' ? 'default' : 'outline'} size="sm" onClick={() => setFilterType('receive')} className={filterType === 'receive' ? 'bg-green-600' : ''}>Receber</Button>
          <Button variant={filterType === 'pay' ? 'default' : 'outline'} size="sm" onClick={() => setFilterType('pay')} className={filterType === 'pay' ? 'bg-red-600' : ''}>Pagar</Button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-rd overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Negócio</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const project = projects.find(p => p.id === payment.projectId)
                  return (
                    <tr key={payment.id} className="table-row">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            payment.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {payment.type === 'receive' ? '↑' : '↓'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{payment.description}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{project?.name || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{new Date(payment.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={`text-sm font-semibold ${payment.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.type === 'receive' ? '+' : '-'} {formatCurrency(payment.amount)}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
