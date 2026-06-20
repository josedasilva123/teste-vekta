export function getUserInitial(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'U'
  return trimmed.charAt(0).toUpperCase()
}
