'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { clients, projects, payments } = useApp()
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    phone: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n')
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportClients = () => {
    exportToCSV(clients.map(c => ({
      nome: c.name,
      email: c.email || '',
      telefone: c.phone || '',
      empresa: c.company || '',
      notas: c.notes || '',
    })), 'clientes')
  }

  const handleExportProjects = () => {
    exportToCSV(projects.map(p => ({
      nome: p.name,
      descricao: p.description || '',
      valor: p.value,
      status: p.status,
      prazo: p.deadline ? new Date(p.deadline).toLocaleDateString('pt-BR') : '',
    })), 'projetos')
  }

  const handleExportFinances = () => {
    exportToCSV(payments.map(p => ({
      descricao: p.description || '',
      valor: p.amount,
      tipo: p.type === 'receive' ? 'Receita' : 'Despesa',
      data: new Date(p.date).toLocaleDateString('pt-BR'),
    })), 'financeiro')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500">Gerencie suas preferências</p>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1" />
            </div>
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saved ? '✓ Salvo!' : 'Salvar Alterações'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como deseja receber alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notificações por Email</p>
                <p className="text-sm text-gray-500">Receba atualizações por email</p>
              </div>
              <button
                role="switch"
                aria-checked={notifications.email}
                aria-label="Notificações por email"
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`w-12 h-6 rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notificações Push</p>
                <p className="text-sm text-gray-500">Receba alertas no navegador</p>
              </div>
              <button
                role="switch"
                aria-checked={notifications.push}
                aria-label="Notificações push"
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`w-12 h-6 rounded-full transition-colors ${notifications.push ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow ${notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Relatório Semanal</p>
                <p className="text-sm text-gray-500">Receba um resumo toda segunda</p>
              </div>
              <button
                role="switch"
                aria-checked={notifications.weekly}
                aria-label="Relatório semanal"
                onClick={() => setNotifications({ ...notifications, weekly: !notifications.weekly })}
                className={`w-12 h-6 rounded-full transition-colors ${notifications.weekly ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow ${notifications.weekly ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Plano</CardTitle>
            <CardDescription>Gerencie sua assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Plano Gratuito</p>
                <p className="text-sm text-gray-500">{clients.length} de 5 clientes utilizados</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Exportar Dados</CardTitle>
            <CardDescription>Baixe seus dados em CSV</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={handleExportClients} variant="outline" className="border-gray-200">Exportar Clientes</Button>
            <Button onClick={handleExportProjects} variant="outline" className="border-gray-200">Exportar Projetos</Button>
            <Button onClick={handleExportFinances} variant="outline" className="border-gray-200">Exportar Financeiro</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
