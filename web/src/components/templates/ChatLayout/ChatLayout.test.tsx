import { render, screen } from '@testing-library/react'
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
})
