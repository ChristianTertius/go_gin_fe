import { api } from '../lib/api'
import type { LoginPayload, RegisterPayload, TokenResponse } from '../types'

export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await api.post<TokenResponse>('/auth/login', payload)
  return data
}

export const registerRequest = async (payload: RegisterPayload) => {
  const { data } = await api.post<{ id: number }>('/auth/register', payload)
  return data
}

export const refreshRequest = async (refreshToken: string) => {
  const { data } = await api.post<TokenResponse>(
    '/auth/refresh',
    { refresh_token: refreshToken },
    { headers: { Authorization: refreshToken } },
  )
  return data
}
