'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { emailTemplates, getTemplate, renderTemplate } from '@/lib/emailTemplates'

export default function TemplatesPage() {
  const { clients, projects } = useApp()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [preview, setPreview] = useState<{ subject: string; body: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handlePreview = () => {
    const template = getTemplate(selectedTemplate)
    const client = clients.find(c => c.id === selectedClient)
    const project = projects.find(p => p.id === selectedProject)

    if (!template || !client || !project) return

    const rendered = renderTemplate(template, {
      clientName: client.name,
      projectName: project.name,
      projectDescription: project.description || '',
      projectValue: `R$ ${project.value.toLocaleString('pt-BR')}`,
      projectDeadline: project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : 'A definir',
      senderName: 'Gabriel Fortunato',
      projectStatus: project.status,
      projectProgress: '50%',
      additionalInfo: '',
      paymentValue: `R$ ${project.value.toLocaleString('pt-BR')}`,
      dueDate: new Date().toLocaleDateString('pt-BR'),
      paymentDetails: 'Dados bancários...',
      deliverySummary: 'Todos os arquivos foram entregues conforme especificado.',
    })

    setPreview(rendered)
  }

  const handleCopy = async () => {
    if (!preview) return
    const text = `Assunto: ${preview.subject}\n\n${preview.body}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Templates de E-mail</h1>
          <p className="text-gray-500">Templates prontos para envio</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Configurar Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Cliente</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Projeto</label>
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

              <Button onClick={handlePreview} disabled={!selectedTemplate || !selectedClient || !selectedProject} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                Gerar Preview
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Assunto</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                      {preview.subject}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Corpo</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm whitespace-pre-wrap">
                      {preview.body}
                    </div>
                  </div>
                  <Button onClick={handleCopy} className="w-full" variant="outline">
                    {copied ? '✓ Copiado!' : 'Copiar para Área de Transferência'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>Selecione um template, cliente e projeto</p>
                  <p className="text-sm mt-2">para visualizar o preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer" onClick={() => setSelectedTemplate(template.id)}>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{template.variables.length} variáveis</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
