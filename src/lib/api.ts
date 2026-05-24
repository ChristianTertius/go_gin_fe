import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { authBridge } from './auth-bridge'
import type { TokenPair, TokenResponse } from '../types'

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080'

type AxiosRequestConfigWithRetry = AxiosRequestConfig & { _retry?: boolean }

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const { accessToken } = authBridge.getTokens()

  if (accessToken && !config.headers?.Authorization) {
    config.headers = config.headers || {}
    config.headers.Authorization = accessToken
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest = error.config as AxiosRequestConfigWithRetry

    const isAuthPath = originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register')

    if (status === 401 && !originalRequest?._retry && !isAuthPath) {
      const { refreshToken } = authBridge.getTokens()
      if (!refreshToken) {
        authBridge.emitForceLogout()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const refreshResponse = await api.post<TokenResponse>(
          '/auth/refresh',
          { refresh_token: refreshToken },
          { headers: { Authorization: refreshToken } },
        )

        const nextTokens: TokenPair = {
          accessToken: refreshResponse.data.token,
          refreshToken: refreshResponse.data.refresh_token,
        }

        authBridge.setTokens(nextTokens)
        authBridge.emitTokensRefreshed(nextTokens)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = refreshResponse.data.token

        return api(originalRequest)
      } catch (refreshError) {
        authBridge.emitForceLogout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message || error.message
  }
  if (error instanceof Error) return error.message
  return 'Unexpected error'
}
