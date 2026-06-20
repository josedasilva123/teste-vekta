import type { ReactNode } from 'react'
import { Logo } from '@/components/atoms/Logo'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full items-center justify-center bg-sidebar px-4 py-6 safe-area-top safe-area-bottom sm:py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
