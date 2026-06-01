'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Calendar } from '@/components/Calendar'

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calendário</h1>
          <p className="text-[#a3a3a3]">Visualize prazos e atividades</p>
        </div>
        <Calendar />
      </div>
    </DashboardLayout>
  )
}
