'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/context/AppContext'

interface TimeEntry {
  id: string
  projectId: string
  startTime: Date
  endTime?: Date
  duration: number // in seconds
  description: string
}

interface TimerState {
  isRunning: boolean
  projectId: string | null
  startTime: Date | null
  elapsed: number
}

export function TimeTracker() {
  const { projects } = useApp()
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    projectId: null,
    startTime: null,
    elapsed: 0,
  })
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [description, setDescription] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timer.isRunning && timer.startTime) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsed: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000),
        }))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer.isRunning, timer.startTime])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    if (!timer.projectId) return
    setTimer({
      isRunning: true,
      projectId: timer.projectId,
      startTime: new Date(),
      elapsed: 0,
    })
  }, [timer.projectId])

  const stopTimer = useCallback(() => {
    if (!timer.isRunning) return
    
    const newEntry: TimeEntry = {
      id: Math.random().toString(36).substring(7),
      projectId: timer.projectId!,
      startTime: timer.startTime!,
      endTime: new Date(),
      duration: timer.elapsed,
      description,
    }
    
    setEntries(prev => [newEntry, ...prev])
    setTimer({
      isRunning: false,
      projectId: null,
      startTime: null,
      elapsed: 0,
    })
    setDescription('')
  }, [timer, description])

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Projeto não encontrado'
  }

  const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 3600

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Timer de Horas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={timer.projectId || ''} onValueChange={(value) => setTimer(prev => ({ ...prev, projectId: value }))} disabled={timer.isRunning}>
              <SelectTrigger className="flex-1 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <input
            type="text"
            placeholder="Descrição da atividade (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none"
            disabled={timer.isRunning}
          />

          <div className="flex items-center justify-center gap-6">
            <div className="text-5xl font-mono font-bold text-blue-600">
              {formatTime(timer.elapsed)}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!timer.isRunning ? (
              <Button 
                onClick={startTimer} 
                disabled={!timer.projectId}
                className="bg-green-500 hover:bg-green-600 text-white px-8"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Iniciar
              </Button>
            ) : (
              <Button 
                onClick={stopTimer}
                className="bg-red-500 hover:bg-red-600 text-white px-8"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                Parar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Histórico</CardTitle>
          <span className="text-sm text-gray-400">{entries.length} registros • {totalHours.toFixed(1)}h total</span>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {entries.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Nenhum registro de horas</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium">{getProjectName(entry.projectId)}</p>
                    <p className="text-sm text-gray-400">
                      {entry.description && `${entry.description} • `}
                      {new Date(entry.startTime).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className="font-mono text-blue-600">{formatTime(entry.duration)}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
