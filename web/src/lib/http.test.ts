import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest, ApiError } from '@/lib/http'
import { setStoredToken, clearAuthStorage } from '@/lib/storage'

describe('apiRequest', () => {
  beforeEach(() => {
    clearAuthStorage()
    vi.restoreAllMocks()
  })

  it('envia Authorization quando auth é true', async () => {
    setStoredToken('token-teste')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: '1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/api/v1/auth/me', { auth: true })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/auth/me',
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    )

    const headers = fetchMock.mock.calls[0][1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer token-teste')
  })

  it('lança ApiError com detail da API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Credenciais inválidas' }),
      }),
    )

    await expect(apiRequest('/api/v1/auth/login', { method: 'POST', body: {} })).rejects.toEqual(
      expect.objectContaining<Partial<ApiError>>({
        message: 'Credenciais inválidas',
        status: 401,
      }),
    )
  })
})
