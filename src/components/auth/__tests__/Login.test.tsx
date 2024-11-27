import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { authService } from '../../../services/authService';
import { auditService } from '../../../services/auditService';

// Mock the services
jest.mock('../../../services/authService');
jest.mock('../../../services/auditService');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockUser = {
      id: '123',
      user_metadata: { organization_id: 'org123' },
    };

    (authService.login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(auditService.logAction).toHaveBeenCalledWith(
        'LOGIN',
        'USER',
        mockUser.id,
        {},
        mockUser.id,
        mockUser.user_metadata.organization_id
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles forgot password', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const email = 'test@example.com';
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: email },
    });

    const forgotPasswordLink = screen.getByText(/esqueceu a senha/i);
    fireEvent.click(forgotPasswordLink);

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith(email);
    });
  });
});
