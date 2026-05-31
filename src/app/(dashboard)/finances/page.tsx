'use client'

import { DashboardLayout } from '@/components/DashboardLayout'

export default function FinancesPage() {
  const transactions = [
    { id: '1', description: 'Website Institucional - TechCorp', amount: 5000, type: 'receive', date: '2026-05-15' },
    { id: '2', description: 'Hospedagem AWS', amount: 150, type: 'pay', date: '2026-05-10' },
    { id: '3', description: 'E-commerce Shopify - StartupXYZ', amount: 12000, type: 'receive', date: '2026-05-08' },
    { id: '4', description: 'Domínio e SSL', amount: 80, type: 'pay', date: '2026-05-05' },
    { id: '5', description: 'Dashboard Analytics - TechCorp', amount: 8000, type: 'receive', date: '2026-04-30' },
  ]

  const totalReceive = transactions.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0)
  const totalPay = transactions.filter(t => t.type === 'pay').reduce((sum, t) => sum + t.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Financeiro</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <p className="text-[#525252] text-sm">A Receber</p>
            <p className="text-2xl font-bold text-green-500 mt-1">R$ {totalReceive.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <p className="text-[#525252] text-sm">A Pagar</p>
            <p className="text-2xl font-bold text-red-500 mt-1">R$ {totalPay.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
            <p className="text-[#525252] text-sm">Saldo</p>
            <p className="text-2xl font-bold text-[#d4af37] mt-1">R$ {(totalReceive - totalPay).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262626]">
            <h3 className="font-semibold">Últimas Transações</h3>
          </div>
          <div className="divide-y divide-[#262626]">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'receive' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {transaction.type === 'receive' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-[#525252]">{transaction.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'receive' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'receive' ? '+' : '-'} R$ {transaction.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
