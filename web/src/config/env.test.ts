import { describe, expect, it } from 'vitest'
import { buildWsUrl } from '@/config/env'

describe('buildWsUrl', () => {
  it('converte http para ws e inclui token', () => {
    const url = buildWsUrl('/api/v1/conversations/abc/ws', 'jwt-token')
    expect(url).toBe('ws://localhost:8000/api/v1/conversations/abc/ws?token=jwt-token')
  })
})
