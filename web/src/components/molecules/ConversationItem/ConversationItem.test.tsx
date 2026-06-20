import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConversationItem } from '@/components/molecules/ConversationItem'

describe('ConversationItem', () => {
  it('renderiza o título da conversa', () => {
    render(
      <ConversationItem id="1" title="Conversa sobre React" isActive={false} onSelect={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Conversa sobre React' })).toBeInTheDocument()
  })

  it('dispara onSelect ao clicar', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <ConversationItem id="conv-1" title="Minha conversa" isActive={false} onSelect={onSelect} />,
    )

    await user.click(screen.getByRole('button', { name: 'Minha conversa' }))
    expect(onSelect).toHaveBeenCalledWith('conv-1')
  })
})
