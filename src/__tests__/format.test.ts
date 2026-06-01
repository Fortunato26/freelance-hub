import { formatCurrency, formatDate } from '@/utils/format'

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
})
