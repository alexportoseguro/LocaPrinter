import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthForm } from './AuthForm'
import * as supabase from '@/lib/supabase'

// Mock do módulo supabase
vi.mock('@/lib/supabase', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}))

describe('AuthForm', () => {
  it('renders login form correctly', () => {
    render(<AuthForm type="login" />)
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Entrar')
  })

  it('shows validation errors for invalid inputs', async () => {
    render(<AuthForm type="login" />)
    
    const submitButton = screen.getByRole('button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
    })
  })

  it('calls signIn function on login form submission', async () => {
    const mockSignIn = vi.mocked(supabase.signIn)
    mockSignIn.mockResolvedValueOnce({ data: null, error: null })

    render(<AuthForm type="login" />)
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    })
    
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})
