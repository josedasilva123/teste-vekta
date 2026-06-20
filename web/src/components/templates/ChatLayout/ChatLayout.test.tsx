import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ChatLayout } from '@/components/templates/ChatLayout'

describe('ChatLayout', () => {
  it('renderiza sidebar e conteúdo principal', () => {
    render(
      <ChatLayout sidebar={<aside>Barra lateral</aside>}>
        <div>Conteúdo principal</div>
      </ChatLayout>,
    )

    expect(screen.getByText('Barra lateral')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo principal')).toBeInTheDocument()
  })

  it('abre a sidebar no mobile ao clicar no menu', async () => {
    const user = userEvent.setup()

    render(
      <ChatLayout sidebar={<aside>Barra lateral</aside>}>
        <div>Conteúdo principal</div>
      </ChatLayout>,
    )

    const sidebarWrapper = screen.getByText('Barra lateral').parentElement
    expect(sidebarWrapper).toHaveClass('-translate-x-full')

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    expect(sidebarWrapper).toHaveClass('translate-x-0')
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
  })
})
