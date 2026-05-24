import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { jwtDecode } from 'jwt-decode'
import toast from 'react-hot-toast'

import { loginRequest, refreshRequest, registerRequest } from '../api/auth'
import { authBridge } from '../lib/auth-bridge'
import { getErrorMessage } from '../lib/api'
import type { LoginPayload, RegisterPayload, TokenPair, UserProfile } from '../types'

type AuthContextValue = {
  user: UserProfile | null
  tokens: TokenPair
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

type StoredAuth = TokenPair

const STORAGE_KEY = 'go-gin-auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readFromStorage = (): StoredAuth => {
  if (typeof localStorage === 'undefined') return { accessToken: null, refreshToken: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { accessToken: null, refreshToken: null }
  } catch (error) {
    console.warn('Failed to read auth from storage', error)
    return { accessToken: null, refreshToken: null }
  }
}

const decodeUser = (token: string | null): UserProfile | null => {
  if (!token) return null
  try {
    const parsed = jwtDecode<{ id: number; username: string }>(token)
    return { id: parsed.id, username: parsed.username }
  } catch (error) {
    console.warn('Failed to decode token', error)
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<TokenPair>(() => readFromStorage())
  const [user, setUser] = useState<UserProfile | null>(() => decodeUser(readFromStorage().accessToken))
  const [loading, setLoading] = useState(false)

  const persistTokens = useCallback((next: TokenPair) => {
    setTokens(next)
    setUser(decodeUser(next.accessToken))
    authBridge.setTokens(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const logout = useCallback(() => {
    setTokens({ accessToken: null, refreshToken: null })
    setUser(null)
    authBridge.setTokens({ accessToken: null, refreshToken: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  useEffect(() => {
    authBridge.setTokens(tokens)
  }, [tokens])

  useEffect(() => {
    authBridge.registerHandlers({
      onForceLogout: logout,
      onTokensRefreshed: persistTokens,
    })

    return () => authBridge.clearHandlers()
  }, [logout, persistTokens])

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true)
    try {
      const data = await loginRequest(payload)
      persistTokens({ accessToken: data.token, refreshToken: data.refresh_token })
      toast.success('Berhasil masuk')
    } catch (error) {
      toast.error(getErrorMessage(error))
      throw error
    } finally {
      setLoading(false)
    }
  }, [persistTokens])

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true)
    try {
      await registerRequest(payload)
      toast.success('Registrasi berhasil, silakan masuk')
    } catch (error) {
      toast.error(getErrorMessage(error))
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!tokens.refreshToken) return
    try {
      const data = await refreshRequest(tokens.refreshToken)
      persistTokens({ accessToken: data.token, refreshToken: data.refresh_token })
      toast.success('Token diperbarui')
    } catch (error) {
      toast.error('Sesi kadaluarsa, silakan masuk lagi')
      logout()
    }
  }, [logout, persistTokens, tokens.refreshToken])

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: Boolean(tokens.accessToken && user),
      loading,
      login,
      register,
      logout,
      refresh,
    }),
    [loading, login, logout, refresh, register, tokens, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
