export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
} as const

export function buildWsUrl(path: string, token: string): string {
  const base = env.apiUrl.replace(/^http/, 'ws')
  const separator = path.includes('?') ? '&' : '?'
  return `${base}${path}${separator}token=${encodeURIComponent(token)}`
}
