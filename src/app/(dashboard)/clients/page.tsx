'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import Link from 'next/link'

export default function ClientsPage() {
  const clients = [
    { id: '1', name: 'TechCorp', email: 'contato@techcorp.com', company: 'TechCorp Ltda', projects: 3 },
    { id: '2', name: 'StartupXYZ', email: 'admin@startupxyz.com', company: 'StartupXYZ Inc', projects: 2 },
    { id: '3', name: 'Digital Agency', email: 'hello@digital.com', company: 'Digital Agency', projects: 5 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Link
            href="/clients/new"
            className="bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a] font-semibold px-4 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
          >
            + Novo Cliente
          </Link>
        </div>

        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262626]">
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2 text-white placeholder-[#525252] focus:border-[#d4af37] focus:outline-none transition-colors"
            />
          </div>

          <div className="divide-y divide-[#262626]">
            {clients.map((client) => (
              <div key={client.id} className="p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0a0a0a] font-bold">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-[#525252]">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#a3a3a3]">{client.projects} projetos</span>
                  <Link
                    href={`/clients/${client.id}`}
                    className="text-[#d4af37] hover:underline text-sm"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
