import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Logo } from '@/components/atoms/Logo'
import { SidebarLayoutContext } from '@/components/templates/ChatLayout/sidebar-layout-context'

type ChatLayoutProps = {
  sidebar: ReactNode
  children: ReactNode
}

function MenuIcon() {
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
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  )
}

export function ChatLayout({ sidebar, children }: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const openSidebar = useCallback(() => setIsSidebarOpen(true), [])

  useEffect(() => {
    if (!isSidebarOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isSidebarOpen])

  const sidebarContextValue = useMemo(
    () => ({
      closeSidebar,
      isDrawer: true,
    }),
    [closeSidebar],
  )

  return (
    <SidebarLayoutContext.Provider value={sidebarContextValue}>
      <div className="relative flex h-full bg-surface">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={closeSidebar}
          />
        ) : null}

        <div
          className={`fixed inset-y-0 left-0 z-40 h-full w-[min(100%,16rem)] transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebar}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-sidebar px-3 py-3 safe-area-top lg:hidden">
            <button
              type="button"
              onClick={openSidebar}
              aria-label="Abrir menu"
              className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-surface-elevated"
            >
              <MenuIcon />
            </button>
            <Logo />
          </header>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
    </SidebarLayoutContext.Provider>
  )
}
