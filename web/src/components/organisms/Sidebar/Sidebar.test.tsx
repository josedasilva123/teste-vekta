import type { ComponentProps, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SidebarLayoutContext } from '@/components/templates/ChatLayout/sidebar-layout-context'
import { Sidebar } from '@/components/organisms/Sidebar'

function renderSidebar(
  props: Partial<ComponentProps<typeof Sidebar>> & { children?: ReactNode } = {},
) {
  const onNewChat = props.onNewChat ?? vi.fn()
  const onLogout = props.onLogout ?? vi.fn()

  return render(
    <SidebarLayoutContext.Provider value={{ closeSidebar: vi.fn(), isDrawer: false }}>
      <Sidebar
        userName={props.userName ?? 'Maria'}
        onNewChat={onNewChat}
        onLogout={onLogout}
      >
        {props.children ?? <p>Lista de conversas</p>}
      </Sidebar>
    </SidebarLayoutContext.Provider>,
  )
}

describe('Sidebar', () => {
  it('renderiza avatar, nome do usuário e ações', () => {
    renderSidebar()

    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Nova conversa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.getByText('Lista de conversas')).toBeInTheDocument()
  })

  it('dispara callbacks de nova conversa e logout', async () => {
    const user = userEvent.setup()
    const onNewChat = vi.fn()
    const onLogout = vi.fn()

    render(
      <SidebarLayoutContext.Provider value={{ closeSidebar: vi.fn(), isDrawer: false }}>
        <Sidebar userName="Maria" onNewChat={onNewChat} onLogout={onLogout}>
          {null}
        </Sidebar>
      </SidebarLayoutContext.Provider>,
    )

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(onNewChat).toHaveBeenCalledOnce()
    expect(onLogout).toHaveBeenCalledOnce()
  })

  it('exibe botão de fechar no modo drawer', () => {
    render(
      <SidebarLayoutContext.Provider value={{ closeSidebar: vi.fn(), isDrawer: true }}>
        <Sidebar userName="Maria" onNewChat={vi.fn()} onLogout={vi.fn()}>
          {null}
        </Sidebar>
      </SidebarLayoutContext.Provider>,
    )

    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
  })
})
