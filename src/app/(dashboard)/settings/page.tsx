'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Gabriel Fortunato',
    email: 'gabrielfsc26@gmail.com',
    company: 'FreelanceHub',
    phone: '(11) 99999-9999',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  })

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-[#a3a3a3]">Gerencie suas preferências</p>
        </div>

        <Card className="bg-[#1a1a1a] border-[#262626]">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="bg-[#0a0a0a] border-[#262626]" />
            </div>
            <Button className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#262626]">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como deseja receber alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-[#525252]">Receba atualizações por email</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`w-12 h-6 rounded-full transition-colors ${notifications.email ? 'bg-[#d4af37]' : 'bg-[#262626]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações Push</p>
                <p className="text-sm text-[#525252]">Receba alertas no navegador</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`w-12 h-6 rounded-full transition-colors ${notifications.push ? 'bg-[#d4af37]' : 'bg-[#262626]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatório Semanal</p>
                <p className="text-sm text-[#525252]">Receba um resumo toda segunda</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, weekly: !notifications.weekly })}
                className={`w-12 h-6 rounded-full transition-colors ${notifications.weekly ? 'bg-[#d4af37]' : 'bg-[#262626]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.weekly ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#262626]">
          <CardHeader>
            <CardTitle>Plano</CardTitle>
            <CardDescription>Gerencie sua assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-[#262626]">
              <div>
                <p className="font-medium">Plano Gratuito</p>
                <p className="text-sm text-[#525252]">3 de 5 clientes utilizados</p>
              </div>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#262626]">
          <CardHeader>
            <CardTitle>Exportar Dados</CardTitle>
            <CardDescription>Baixe seus dados em CSV</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline" className="border-[#262626]">Exportar Clientes</Button>
            <Button variant="outline" className="border-[#262626]">Exportar Projetos</Button>
            <Button variant="outline" className="border-[#262626]">Exportar Financeiro</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
