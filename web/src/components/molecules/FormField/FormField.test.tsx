import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/atoms/Input'

describe('FormField', () => {
  it('renderiza label e campo filho', () => {
    render(
      <FormField label="E-mail" htmlFor="email">
        <Input id="email" />
      </FormField>,
    )

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando informada', () => {
    render(
      <FormField label="Senha" htmlFor="password" error="Senha inválida">
        <Input id="password" />
      </FormField>,
    )

    expect(screen.getByText('Senha inválida')).toBeInTheDocument()
  })
})
