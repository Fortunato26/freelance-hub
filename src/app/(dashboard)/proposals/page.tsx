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
      const value = parseFloat(newItem.value)
      if (!isNaN(value) && value > 0) {
        setItems([...items, { description: newItem.description, value }])
        setNewItem({ description: '', value: '' })
      }
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + item.value, 0)

  const handleGeneratePDF = async () => {
    if (!project || !client || items.length === 0) return
    
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(24)
    doc.setTextColor(212, 175, 55)
    doc.text('FreelanceHub', 20, 20)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('PROPOSTA COMERCIAL', 20, 28)
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 150, 28)
    
    // Line
    doc.setDrawColor(212, 175, 55)
    doc.line(20, 32, 190, 32)
    
    // Title
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text(`Proposta: ${project.name}`, 20, 45)
    
    // Client info
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Cliente: ${client.name}`, 20, 55)
    if (client.email) doc.text(`Email: ${client.email}`, 20, 62)
    if (client.company) doc.text(`Empresa: ${client.company}`, 20, 69)
    
    // Description
    if (project.description) {
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text('Descrição:', 20, 85)
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      const splitDescription = doc.splitTextToSize(project.description, 170)
      doc.text(splitDescription, 20, 92)
    }
    
    // Items table
    let y = project.description ? 110 : 90
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('Itens da Proposta:', 20, y)
    y += 8
    
    // Table header
    doc.setFillColor(26, 26, 26)
    doc.rect(20, y, 170, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('Descrição', 22, y + 5.5)
    doc.text('Valor', 150, y + 5.5)
    y += 10
    
    // Table rows
    doc.setTextColor(0, 0, 0)
    items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245)
        doc.rect(20, y - 4, 170, 8, 'F')
      }
      doc.text(item.description, 22, y + 2)
      doc.text(formatCurrency(item.value), 150, y + 2)
      y += 8
    })
    
    // Total
    y += 5
    doc.setDrawColor(212, 175, 55)
    doc.line(20, y, 190, y)
    y += 8
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('TOTAL:', 130, y)
    doc.setTextColor(212, 175, 55)
    doc.text(formatCurrency(total), 155, y)
    
    // Deadline
    if (project.deadline) {
      y += 15
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Prazo de entrega: ${new Date(project.deadline).toLocaleDateString('pt-BR')}`, 20, y)
    }
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('FreelanceHub - CRM para Freelancers', 20, 280)
    doc.text('Este documento foi gerado automaticamente', 20, 285)
    
    doc.save(`proposta-${project.name.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Propostas Comerciais</h1>
          <p className="text-gray-500">Gere propostas profissionais para seus clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Nova Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Projeto *</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {client && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="font-medium">{client.name}</p>
                  {client.email && <p className="text-sm text-gray-500">{client.email}</p>}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <Label>Itens da Proposta</Label>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Descrição" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="flex-1 bg-gray-50 border-gray-200" />
                  <Input type="number" placeholder="Valor" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} className="w-32 bg-gray-50 border-gray-200" />
                  <Button onClick={addItem} variant="outline" className="border-gray-200">+</Button>
                </div>

                <div className="space-y-2 mt-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="text-sm">{item.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600">{formatCurrency(item.value)}</span>
                        <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400" aria-label="Remover item">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button onClick={handleGeneratePDF} disabled={!selectedProject || items.length === 0} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                Gerar Proposta PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {project && client ? (
                <div className="space-y-4 p-4 bg-white rounded-lg text-black">
                  <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-blue-600">FreelanceHub</h2>
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
                        Segue abaixo nossa proposta para o projeto &quot;{project.name}&quot;
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
                <div className="text-center py-12 text-gray-400">
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
