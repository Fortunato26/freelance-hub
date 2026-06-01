import { emailTemplates, getTemplate, renderTemplate } from '@/lib/emailTemplates'

describe('emailTemplates', () => {
  it('has all required templates', () => {
    expect(emailTemplates.length).toBe(5)
    expect(emailTemplates.map(t => t.id)).toContain('proposal')
    expect(emailTemplates.map(t => t.id)).toContain('follow-up')
    expect(emailTemplates.map(t => t.id)).toContain('project-update')
    expect(emailTemplates.map(t => t.id)).toContain('payment-reminder')
    expect(emailTemplates.map(t => t.id)).toContain('project-delivered')
  })

  it('each template has required fields', () => {
    emailTemplates.forEach(template => {
      expect(template.id).toBeDefined()
      expect(template.name).toBeDefined()
      expect(template.subject).toBeDefined()
      expect(template.body).toBeDefined()
      expect(template.variables).toBeDefined()
      expect(Array.isArray(template.variables)).toBe(true)
    })
  })
})

describe('getTemplate', () => {
  it('returns template by id', () => {
    const template = getTemplate('proposal')
    expect(template).toBeDefined()
    expect(template?.name).toBe('Proposta Comercial')
  })

  it('returns undefined for non-existent template', () => {
    const template = getTemplate('non-existent')
    expect(template).toBeUndefined()
  })
})

describe('renderTemplate', () => {
  it('renders template with variables', () => {
    const template = getTemplate('proposal')!
    const result = renderTemplate(template, {
      clientName: 'TechCorp',
      projectName: 'Website Institucional',
      projectDescription: 'Redesign completo',
      projectValue: 'R$ 5.000',
      projectDeadline: '15/06/2026',
      senderName: 'Gabriel',
    })

    expect(result.subject).toContain('Website Institucional')
    expect(result.body).toContain('TechCorp')
    expect(result.body).toContain('Website Institucional')
    expect(result.body).toContain('R$ 5.000')
    expect(result.body).toContain('Gabriel')
  })

  it('renders template with missing variables', () => {
    const template = getTemplate('proposal')!
    const result = renderTemplate(template, {
      clientName: 'TechCorp',
    })

    expect(result.subject).toContain('{{projectName}}')
    expect(result.body).toContain('TechCorp')
  })
})
