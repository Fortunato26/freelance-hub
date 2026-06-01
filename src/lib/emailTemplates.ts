export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'proposal',
    name: 'Proposta Comercial',
    subject: 'Proposta Comercial - {{projectName}}',
    body: `Prezado(a) {{clientName}},

Espero que esta mensagem o(a) encontre bem.

Segue em anexo a proposta comercial para o projeto "{{projectName}}".

Resumo do projeto:
- Descrição: {{projectDescription}}
- Valor: {{projectValue}}
- Prazo: {{projectDeadline}}

Estou à disposição para esclarecer quaisquer dúvidas.

Atenciosamente,
{{senderName}}`,
    variables: ['clientName', 'projectName', 'projectDescription', 'projectValue', 'projectDeadline', 'senderName'],
  },
  {
    id: 'follow-up',
    name: 'Follow-up',
    subject: 'Follow-up - {{projectName}}',
    body: `Prezado(a) {{clientName}},

Espero que esteja bem!

Gostaria de saber se teve a oportunidade de analisar a proposta para o projeto "{{projectName}}".

Caso tenha alguma dúvida ou queira ajustar algo, fico à disposição.

Abraços,
{{senderName}}`,
    variables: ['clientName', 'projectName', 'senderName'],
  },
  {
    id: 'project-update',
    name: 'Atualização do Projeto',
    subject: 'Atualização - {{projectName}}',
    body: `Prezado(a) {{clientName}},

Segue atualização do projeto "{{projectName}}":

Status: {{projectStatus}}
Progresso: {{projectProgress}}

{{additionalInfo}}

Qualquer dúvida, estou à disposição.

Atenciosamente,
{{senderName}}`,
    variables: ['clientName', 'projectName', 'projectStatus', 'projectProgress', 'additionalInfo', 'senderName'],
  },
  {
    id: 'payment-reminder',
    name: 'Lembrete de Pagamento',
    subject: 'Lembrete de Pagamento - {{projectName}}',
    body: `Prezado(a) {{clientName}},

Espero que esteja bem!

Gostaria de lembrar sobre o pagamento referente ao projeto "{{projectName}}".

Valor: {{paymentValue}}
Data de vencimento: {{dueDate}}

Segue os dados para pagamento:
{{paymentDetails}}

Agradeço a atenção.

Atenciosamente,
{{senderName}}`,
    variables: ['clientName', 'projectName', 'paymentValue', 'dueDate', 'paymentDetails', 'senderName'],
  },
  {
    id: 'project-delivered',
    name: 'Projeto Entregue',
    subject: 'Projeto Entregue - {{projectName}}',
    body: `Prezado(a) {{clientName}},

Tenho o prazer de informar que o projeto "{{projectName}}" foi finalizado e está pronto para entrega.

Resumo da entrega:
{{deliverySummary}}

Ficou à disposição para ajustes ou esclarecimentos.

Agradeço a confiança e a oportunidade de trabalhar juntos.

Atenciosamente,
{{senderName}}`,
    variables: ['clientName', 'projectName', 'deliverySummary', 'senderName'],
  },
]

export function getTemplate(id: string): EmailTemplate | undefined {
  return emailTemplates.find(t => t.id === id)
}

export function renderTemplate(template: EmailTemplate, variables: Record<string, string>): { subject: string; body: string } {
  let subject = template.subject
  let body = template.body

  for (const [key, value] of Object.entries(variables)) {
    subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value)
    body = body.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }

  return { subject, body }
}
