'use client'

import { use } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/utils/format'
import Link from 'next/link'

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

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getClientById, getProjectsByClient } = useApp()
  
  const client = getClientById(id)
  const clientProjects = getProjectsByClient(id)
  
  const totalValue = clientProjects.reduce((sum, p) => sum + p.value, 0)
  const paidValue = clientProjects.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.value, 0)

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Cliente não encontrado</h1>
          <Link href="/clients">
            <Button>Voltar para clientes</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/clients" className="text-gray-400 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{client.name}</h1>
              {client.company && <p className="text-gray-500">{client.company}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total de Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{clientProjects.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalValue)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Valor Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{formatCurrency(paidValue)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500">{client.email || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-500">{client.phone || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500">Cliente desde {formatDate(client.createdAt)}</span>
              </div>
              {client.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-400 mb-1">Observações</p>
                  <p className="text-gray-500">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projetos</CardTitle>
              <Link href="/projects">
                <Button variant="outline" size="sm" className="border-gray-200">Ver todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientProjects.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">Nenhum projeto</p>
                ) : (
                  clientProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-blue-600">{formatCurrency(project.value)}</span>
                          {project.deadline && (
                            <span className="text-xs text-gray-400">Prazo: {formatDate(project.deadline)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
