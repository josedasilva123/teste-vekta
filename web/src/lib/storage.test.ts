import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/lib/storage'

describe('storage', () => {
  beforeEach(() => {
    clearAuthStorage()
  })

  it('persiste e recupera token', () => {
    setStoredToken('abc123')
    expect(getStoredToken()).toBe('abc123')
  })

  it('persiste e recupera usuário', () => {
    const user = { id: '1', email: 'a@b.com', name: 'Ana', created_at: '2026-01-01' }
    setStoredUser(user)
    expect(getStoredUser()).toEqual(user)
  })

  it('limpa dados de autenticação', () => {
    setStoredToken('abc123')
    setStoredUser({ id: '1' })
    clearAuthStorage()
    expect(getStoredToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
  })
})
