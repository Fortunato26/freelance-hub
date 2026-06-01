'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils/format'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { projects } = useApp()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day)
    return projects.filter(p => {
      if (!p.deadline) return false
      const deadline = new Date(p.deadline)
      return deadline.getDate() === day && deadline.getMonth() === month && deadline.getFullYear() === year
    })
  }

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevMonth} className="text-gray-500 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <CardTitle className="text-lg">{monthNames[month]} {year}</CardTitle>
        <Button variant="ghost" size="sm" onClick={nextMonth} className="text-gray-500 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs text-gray-400 py-2 font-medium">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const events = getEventsForDay(day)
            
            return (
              <div
                key={day}
                className={`h-10 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors ${
                  isToday(day) ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{day}</span>
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {events.slice(0, 2).map((_, j) => (
                      <div key={j} className="w-1 h-1 rounded-full bg-blue-600" />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Prazos deste mês</h4>
          <div className="space-y-2">
            {projects
              .filter(p => {
                if (!p.deadline) return false
                const d = new Date(p.deadline)
                return d.getMonth() === month && d.getFullYear() === year
              })
              .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
              .map((project) => (
                <div key={project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-500">{project.name}</span>
                  <span className="text-blue-600">{new Date(project.deadline!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                </div>
              ))
            }
            {projects.filter(p => p.deadline && new Date(p.deadline).getMonth() === month && new Date(p.deadline).getFullYear() === year).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">Nenhum prazo este mês</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
