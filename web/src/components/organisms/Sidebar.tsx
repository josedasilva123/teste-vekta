import type { ReactNode } from 'react'
import { Logo } from '@/components/atoms/Logo'

type SidebarProps = {
  userName: string
  onNewChat: () => void
  onLogout: () => void
  children: ReactNode
}

export function Sidebar({ userName, onNewChat, onLogout, children }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border p-4">
        <Logo />
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-white transition hover:bg-surface-elevated"
        >
          + Nova conversa
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-2">{children}</div>

      <div className="border-t border-border p-3">
        <div className="mb-2 truncate text-sm text-muted">{userName}</div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-surface-elevated hover:text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
