import type { ReactNode } from 'react'

type ChatLayoutProps = {
  sidebar: ReactNode
  children: ReactNode
}

export function ChatLayout({ sidebar, children }: ChatLayoutProps) {
  return (
    <div className="flex h-full bg-surface">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}
