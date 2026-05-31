'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
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

export default function ProjectsPage() {
  const projects = [
    { id: '1', name: 'Website Institucional', client: 'TechCorp', value: 5000, status: 'in_progress', deadline: '2026-06-15' },
    { id: '2', name: 'E-commerce Shopify', client: 'StartupXYZ', value: 12000, status: 'proposal', deadline: '2026-07-01' },
    { id: '3', name: 'App Mobile', client: 'Digital Agency', value: 25000, status: 'delivered', deadline: '2026-05-20' },
    { id: '4', name: 'Dashboard Analytics', client: 'TechCorp', value: 8000, status: 'paid', deadline: '2026-04-30' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projetos</h1>
          <Link
            href="/projects/new"
            className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] font-semibold px-4 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
          >
            + Novo Projeto
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['proposal', 'in_progress', 'delivered', 'paid'].map((status) => (
            <div key={status} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{statusLabels[status]}</h3>
                <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
                  {projects.filter(p => p.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {projects.filter(p => p.status === status).map((project) => (
                  <div key={project.id} className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 hover:border-[#b8960f] transition-colors cursor-pointer">
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-[#525252] mt-1">{project.client}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-[#d4af37]">R$ {project.value.toLocaleString()}</span>
                      <span className="text-xs text-[#525252">{project.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
