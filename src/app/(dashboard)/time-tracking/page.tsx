'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { TimeTracker } from '@/components/TimeTracker'

export default function TimeTrackingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Controle de Horas</h1>
          <p className="text-[#a3a3a3]">Registre o tempo gasto em cada projeto</p>
        </div>
        <TimeTracker />
      </div>
    </DashboardLayout>
  )
}
