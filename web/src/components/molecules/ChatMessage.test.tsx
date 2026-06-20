import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatMessage } from '@/components/molecules/ChatMessage'

describe('ChatMessage', () => {
  it('renderiza mensagem do usuário', () => {
    render(<ChatMessage sender="USER" content="Olá!" />)
    expect(screen.getByText('Olá!')).toBeInTheDocument()
    expect(screen.getByText('V')).toBeInTheDocument()
  })

  it('renderiza indicador de streaming para a IA', () => {
    render(<ChatMessage sender="AI" content="Resposta parcial" streaming />)
    expect(screen.getByText('Resposta parcial')).toBeInTheDocument()
    expect(screen.getByText('▍')).toBeInTheDocument()
  })
})
