import { apiRequest } from '@/lib/http'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/domains/auth/types'

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export async function meRequest(): Promise<User> {
  return apiRequest<User>('/api/v1/auth/me', {
    method: 'GET',
    auth: true,
  })
}
