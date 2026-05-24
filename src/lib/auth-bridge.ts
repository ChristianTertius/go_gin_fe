import type { TokenPair } from '../types'

type Handlers = {
  onForceLogout?: () => void
  onTokensRefreshed?: (tokens: TokenPair) => void
}

let tokens: TokenPair = { accessToken: null, refreshToken: null }
let handlers: Handlers = {}

export const authBridge = {
  setTokens(next: TokenPair) {
    tokens = next
  },
  getTokens(): TokenPair {
    return tokens
  },
  registerHandlers(next: Handlers) {
    handlers = next
  },
  clearHandlers() {
    handlers = {}
  },
  emitForceLogout() {
    handlers.onForceLogout?.()
  },
  emitTokensRefreshed(next: TokenPair) {
    handlers.onTokensRefreshed?.(next)
  },
}
