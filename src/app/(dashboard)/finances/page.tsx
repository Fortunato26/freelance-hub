'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'

export default function FinancesPage() {
  const { payments, projects, addPayment } = useApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'receive' as 'receive' | 'pay',
    projectId: '',
  })

  const totalReceive = payments.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0)
  const totalPay = payments.filter(t => t.type === 'pay').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalReceive - totalPay

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addPayment({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date(),
      projectId: formData.projectId,
    })
    setFormData({ description: '', amount: '', type: 'receive', projectId: '' })
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Financeiro</h1>
            <p className="text-[#a3a3a3]">Controle de receitas e despesas</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                + Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-[#262626]">
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tipo</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={formData.type === 'receive' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, type: 'receive' })}
                      className={formData.type === 'receive' ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      Receber
                    </Button>
                    <Button
                      type="button"
                      variant={formData.type === 'pay' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, type: 'pay' })}
                      className={formData.type === 'pay' ? 'bg-red-500 hover:bg-red-600' : ''}
                    >
                      Pagar
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0a0a0a] border-[#262626]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-[#0a0a0a] border-[#262626]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectId">Projeto</Label>
                  <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                    <SelectTrigger className="bg-[#0a0a0a] border-[#262626]">
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#262626]">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">
                  Salvar Transação
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">A Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(totalReceive)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">A Pagar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(totalPay)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#525252]">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-[#d4af37]' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1a1a1a] border-[#262626]">
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.length === 0 ? (
                <p className="text-center text-[#525252] py-8">Nenhuma transação registrada</p>
              ) : (
                payments.map((payment) => {
                  const project = projects.find(p => p.id === payment.projectId)
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-[#262626] hover:border-[#b8960f] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.type === 'receive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.type === 'receive' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-[#525252]">
                            {project?.name || 'Sem projeto'} • {new Date(payment.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold text-lg ${
                        payment.type === 'receive' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {payment.type === 'receive' ? '+' : '-'} {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
