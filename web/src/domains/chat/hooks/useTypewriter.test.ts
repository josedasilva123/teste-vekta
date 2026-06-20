import { renderHook, act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTypewriter } from '@/domains/chat/hooks/useTypewriter'

describe('useTypewriter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('revela o texto gradualmente quando ativo', async () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()

    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, { enabled: true, intervalMs: 10, onComplete }),
      { initialProps: { text: 'Olá' } },
    )

    expect(result.current.displayed).toBe('')

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.displayed).toBe('Olá')
    expect(onComplete).toHaveBeenCalledOnce()

    rerender({ text: 'Olá mundo' })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.displayed).toBe('Olá mundo')
  })

  it('exibe o texto completo imediatamente quando inativo', () => {
    const { result } = renderHook(() =>
      useTypewriter('Resposta completa', { enabled: false }),
    )

    expect(result.current.displayed).toBe('Resposta completa')
    expect(result.current.isTyping).toBe(false)
  })
})
