import { describe, expect, it } from 'vitest'
import { getUserInitial } from '@/lib/userInitials'

describe('getUserInitial', () => {
  it('retorna a primeira letra em maiúscula', () => {
    expect(getUserInitial('Maria')).toBe('M')
    expect(getUserInitial('joão')).toBe('J')
  })

  it('ignora espaços no início', () => {
    expect(getUserInitial('  Ana')).toBe('A')
  })

  it('retorna U quando o nome está vazio', () => {
    expect(getUserInitial('')).toBe('U')
    expect(getUserInitial('   ')).toBe('U')
  })
})
