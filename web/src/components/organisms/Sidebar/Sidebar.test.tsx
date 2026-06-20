import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Sidebar } from '@/components/organisms/Sidebar'

describe('Sidebar', () => {
  it('renderiza nome do usuário e ações', () => {
    render(
      <Sidebar userName="Maria" onNewChat={vi.fn()} onLogout={vi.fn()}>
        <p>Lista de conversas</p>
      </Sidebar>,
    )

    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Nova conversa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.getByText('Lista de conversas')).toBeInTheDocument()
  })

  it('dispara callbacks de nova conversa e logout', async () => {
    const user = userEvent.setup()
    const onNewChat = vi.fn()
    const onLogout = vi.fn()

    render(
      <Sidebar userName="Maria" onNewChat={onNewChat} onLogout={onLogout}>
        {null}
      </Sidebar>,
    )

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(onNewChat).toHaveBeenCalledOnce()
    expect(onLogout).toHaveBeenCalledOnce()
  })
})
