'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'

export default function ProposalsPage() {
  const { clients, projects } = useApp()
  const [selectedProject, setSelectedProject] = useState('')
  const [items, setItems] = useState<Array<{ description: string; value: number }>>([])
  const [newItem, setNewItem] = useState({ description: '', value: '' })

  const project = projects.find(p => p.id === selectedProject)
  const client = project ? clients.find(c => c.id === project.clientId) : null

  const addItem = () => {
    if (newItem.description && newItem.value) {
      setItems([...items, { description: newItem.description, value: parseFloat(newItem.value) }])
      setNewItem({ description: '', value: '' })
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + item.value, 0)

  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation with @react-pdf/renderer
    alert('Funcionalidade de PDF será implementada em breve!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Propostas Comerciais</h1>
          <p className="text-[#a3a3a3]">Gere propostas profissionais para seus clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader>
              <CardTitle>Nova Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Projeto *</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="bg-[#0a0a0a] border-[#262626]">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#262626]">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {client && (
                <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                  <p className="text-sm text-[#525252]">Cliente</p>
                  <p className="font-medium">{client.name}</p>
                  {client.email && <p className="text-sm text-[#a3a3a3]">{client.email}</p>}
                </div>
              )}

              <div className="border-t border-[#262626] pt-4">
                <Label>Itens da Proposta</Label>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Descrição" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="flex-1 bg-[#0a0a0a] border-[#262626]" />
                  <Input type="number" placeholder="Valor" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} className="w-32 bg-[#0a0a0a] border-[#262626]" />
                  <Button onClick={addItem} variant="outline" className="border-[#262626]">+</Button>
                </div>

                <div className="space-y-2 mt-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#0a0a0a] rounded border border-[#262626]">
                      <span className="text-sm">{item.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#d4af37]">{formatCurrency(item.value)}</span>
                        <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t border-[#262626]">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-[#d4af37]">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button onClick={handleGeneratePDF} disabled={!selectedProject || items.length === 0} className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#0a0a0a]">
                Gerar Proposta PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#262626]">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {project && client ? (
                <div className="space-y-4 p-4 bg-white rounded-lg text-black">
                  <div className="flex justify-between items-start border-b-2 border-[#d4af37] pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#d4af37]">FreelanceHub</h2>
                      <p className="text-sm text-gray-500">PROPOSTA COMERCIAL</p>
                    </div>
                    <div className="text-right text-sm">
                      <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">Proposta: {project.name}</h3>
                    <p className="text-sm text-gray-600">Prezado(a) {client.name},</p>
                    <p className="text-sm mt-2">
                      Segue abaixo nossa proposta para o projeto "{project.name}".
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Cliente:</strong> {client.name}</p>
                    {client.company && <p className="text-sm"><strong>Empresa:</strong> {client.company}</p>}
                  </div>

                  {items.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm mb-2">Itens da Proposta</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-2">Descrição</th>
                            <th className="text-right p-2">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{item.description}</td>
                              <td className="text-right p-2">{formatCurrency(item.value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex justify-end mt-2 pt-2 border-t">
                        <span className="font-bold">Total: {formatCurrency(total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-[#525252]">
                  <p>Selecione um projeto para visualizar</p>
                  <p className="text-sm mt-2">a proposta</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
