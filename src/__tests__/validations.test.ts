import { clientSchema, projectSchema, paymentSchema, taskSchema, registerSchema, loginSchema } from '@/lib/validations'

describe('clientSchema', () => {
  it('validates a valid client', () => {
    const result = clientSchema.safeParse({
      name: 'TechCorp',
      email: 'contato@techcorp.com',
      phone: '(11) 99999-9999',
      company: 'TechCorp Ltda',
      notes: 'Cliente desde 2024',
    })
    expect(result.success).toBe(true)
  })

  it('requires name', () => {
    const result = clientSchema.safeParse({
      name: '',
      email: 'test@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('validates email format', () => {
    const result = clientSchema.safeParse({
      name: 'Test',
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
  })

  it('allows optional fields to be empty', () => {
    const result = clientSchema.safeParse({
      name: 'Test',
      email: '',
      phone: '',
      company: '',
      notes: '',
    })
    expect(result.success).toBe(true)
  })
})

describe('projectSchema', () => {
  it('validates a valid project', () => {
    const result = projectSchema.safeParse({
      name: 'Website Institucional',
      description: 'Redesign completo do site',
      value: 5000,
      deadline: '2026-06-15',
      clientId: '1',
    })
    expect(result.success).toBe(true)
  })

  it('requires name', () => {
    const result = projectSchema.safeParse({
      name: '',
      value: 5000,
      clientId: '1',
    })
    expect(result.success).toBe(false)
  })

  it('requires positive value', () => {
    const result = projectSchema.safeParse({
      name: 'Test',
      value: -100,
      clientId: '1',
    })
    expect(result.success).toBe(false)
  })

  it('requires clientId', () => {
    const result = projectSchema.safeParse({
      name: 'Test',
      value: 5000,
      clientId: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('paymentSchema', () => {
  it('validates a valid payment', () => {
    const result = paymentSchema.safeParse({
      description: 'Website Institucional - TechCorp',
      amount: 5000,
      type: 'receive',
      projectId: '1',
    })
    expect(result.success).toBe(true)
  })

  it('requires description', () => {
    const result = paymentSchema.safeParse({
      description: '',
      amount: 5000,
      type: 'receive',
      projectId: '1',
    })
    expect(result.success).toBe(false)
  })

  it('requires positive amount', () => {
    const result = paymentSchema.safeParse({
      description: 'Test',
      amount: -100,
      type: 'receive',
      projectId: '1',
    })
    expect(result.success).toBe(false)
  })

  it('validates type enum', () => {
    const result = paymentSchema.safeParse({
      description: 'Test',
      amount: 5000,
      type: 'invalid',
      projectId: '1',
    })
    expect(result.success).toBe(false)
  })
})

describe('taskSchema', () => {
  it('validates a valid task', () => {
    const result = taskSchema.safeParse({
      title: 'Criar wireframe do site',
    })
    expect(result.success).toBe(true)
  })

  it('requires title', () => {
    const result = taskSchema.safeParse({
      title: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('validates a valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Gabriel',
      email: 'gabriel@example.com',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('requires matching passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Gabriel',
      email: 'gabriel@example.com',
      password: '123456',
      confirmPassword: '654321',
    })
    expect(result.success).toBe(false)
  })

  it('requires minimum password length', () => {
    const result = registerSchema.safeParse({
      name: 'Gabriel',
      email: 'gabriel@example.com',
      password: '123',
      confirmPassword: '123',
    })
    expect(result.success).toBe(false)
  })

  it('requires valid email', () => {
    const result = registerSchema.safeParse({
      name: 'Gabriel',
      email: 'invalid-email',
      password: '123456',
      confirmPassword: '123456',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('validates a valid login', () => {
    const result = loginSchema.safeParse({
      email: 'gabriel@example.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('requires email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('requires password', () => {
    const result = loginSchema.safeParse({
      email: 'gabriel@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})
