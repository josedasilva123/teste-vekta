import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm text-muted">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
