import { createContext, useContext } from 'react'

type SidebarLayoutContextValue = {
  closeSidebar: () => void
  isDrawer: boolean
}

export const SidebarLayoutContext = createContext<SidebarLayoutContextValue>({
  closeSidebar: () => {},
  isDrawer: false,
})

export function useSidebarLayout(): SidebarLayoutContextValue {
  return useContext(SidebarLayoutContext)
}
