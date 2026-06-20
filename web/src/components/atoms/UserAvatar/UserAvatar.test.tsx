import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UserAvatar } from '@/components/atoms/UserAvatar'

describe('UserAvatar', () => {
  it('exibe a inicial do nome', () => {
    render(<UserAvatar name="Maria" />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })
})
