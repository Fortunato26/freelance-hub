import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1.500')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats decimal values', () => {
    const result = formatCurrency(99.9)
    expect(result).toContain('99')
  })

  it('formats negative values', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('500')
  })

  it('formats large values', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('1.000.000')
  })
})

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date(2026, 4, 15)
    const result = formatDate(date)
    expect(result).toBe('15/05/2026')
  })

  it('handles string dates', () => {
    const result = formatDate(new Date(2026, 0, 1).toISOString())
    expect(result).toBe('01/01/2026')
  })

  it('handles today date', () => {
    const today = new Date()
    const result = formatDate(today)
    expect(result).toContain(today.getDate().toString().padStart(2, '0'))
  })
})

describe('formatDateTime', () => {
  it('formats date and time correctly', () => {
    const date = new Date('2026-05-15T14:30:00')
    const result = formatDateTime(date)
    expect(result).toContain('15/05/2026')
    expect(result).toContain('14:30')
  })

  it('handles string dates', () => {
    const result = formatDateTime('2026-01-01T10:00:00')
    expect(result).toContain('01/01/2026')
    expect(result).toContain('10:00')
  })
})
