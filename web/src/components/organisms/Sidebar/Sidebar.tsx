import type { ReactNode } from 'react'
import { Logo } from '@/components/atoms/Logo'
import { UserAvatar } from '@/components/atoms/UserAvatar'
import { useSidebarLayout } from '@/components/templates/ChatLayout/sidebar-layout-context'

type SidebarProps = {
  userName: string
  onNewChat: () => void
  onLogout: () => void
  children: ReactNode
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function Sidebar({ userName, onNewChat, onLogout, children }: SidebarProps) {
  const { closeSidebar, isDrawer } = useSidebarLayout()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-border p-4">
        <Logo />
        {isDrawer ? (
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Fechar menu"
            className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-elevated hover:text-white lg:hidden"
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full rounded-lg border border-border px-3 py-2.5 text-left text-sm text-white transition hover:bg-surface-elevated"
        >
          + Nova conversa
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-2">{children}</div>

      <div className="border-t border-border p-3 safe-area-bottom">
        <div className="mb-2 flex min-w-0 items-center gap-2.5">
          <UserAvatar name={userName} />
          <span className="truncate text-sm text-white">{userName}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-muted transition hover:bg-surface-elevated hover:text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
