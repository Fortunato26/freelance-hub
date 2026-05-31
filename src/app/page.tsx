'use client'

import { DashboardLayout } from '@/components/DashboardLayout'

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Bem-vindo ao FreelanceHub</h1>
        <p className="text-[#a3a3a3]">Gerencie seus clientes, projetos e finanças.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-[#b8960f] transition-colors">
            <p className="text-[#525252] text-sm">Total de Clientes</p>
            <p className="text-3xl font-bold text-[#d4af37] mt-1">12</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-[#b8960f] transition-colors">
            <p className="text-[#525252] text-sm">Projetos Ativos</p>
            <p className="text-3xl font-bold text-[#d4af37] mt-1">8</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-[#b8960f] transition-colors">
            <p className="text-[#525252] text-sm">Receita Total</p>
            <p className="text-3xl font-bold text-[#d4af37] mt-1">R$ 45.200</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-[#b8960f] transition-colors">
            <p className="text-[#525252] text-sm">A Receber</p>
            <p className="text-3xl font-bold text-[#d4af37] mt-1">R$ 12.800</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
