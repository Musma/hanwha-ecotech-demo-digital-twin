import { create } from 'axios'

const DEFAULT_API_BASE_URL = 'https://api-playground.musma.net'

function resolveBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL
  if (explicit && explicit.length > 0) return explicit
  return DEFAULT_API_BASE_URL
}

export const tabletHttp = create({
  baseURL: resolveBaseUrl(),
  withCredentials: false,
})
