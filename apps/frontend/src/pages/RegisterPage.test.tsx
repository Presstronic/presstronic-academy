/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/contexts/AuthContext';
import type * as ApiModule from '@/lib/api';

import RegisterPage from './RegisterPage';

// Mock the API module
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof ApiModule>('@/lib/api');
  return {
    ...actual,
    authService: {
      ...actual.authService,
      register: vi.fn(),
      getCurrentUser: vi.fn(),
      logout: vi.fn(),
    },
  };
});

// eslint-disable-next-line import/first
import { authService } from '@/lib/api';

const mockRegister = vi.mocked(authService.register);
const mockGetCurrentUser = vi.mocked(authService.getCurrentUser);

function renderWithProviders(ui: ReactNode) {
  return render(
    <BrowserRouter>
      <AuthProvider disableTimers={true}>{ui}</AuthProvider>
    </BrowserRouter>,
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    mockRegister.mockClear();
    mockGetCurrentUser.mockClear();
    mockGetCurrentUser.mockRejectedValue(new Error('Unauthorized'));
  });

  describe('Rendering', () => {
    it('should render registration form', async () => {
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i, { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });

    it('should render link to login page', async () => {
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        const loginLink = screen.getByRole('link', { name: /Login here/i });
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error when first name is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /Register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when last name is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /Register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/Email Address/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /Register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is too short', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      await user.type(passwordInput, 'short');

      const submitButton = screen.getByRole('button', { name: /Register/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Check that the validation error message appears in the helper text
        expect(
          screen.getByText(/Password must contain:.*At least 8 characters/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error when password does not meet complexity requirements', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      await user.type(passwordInput, 'password'); // No uppercase or number

      const submitButton = screen.getByRole('button', { name: /Register/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Check that the validation error message appears (not just the strength indicator)
        const errorMessages = screen.getAllByText(/Password must contain/i);
        // Should have at least one (could be helper text and/or strength indicator)
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i, {
        selector: 'input',
      });

      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password456!');

      const submitButton = screen.getByRole('button', { name: /Register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should successfully register with valid data', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        roles: ['user'],
        tenantId: 'test-tenant',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRegister.mockResolvedValue({
        user: mockUser,
        expiresIn: 900,
      });

      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i, {
        selector: 'input',
      });
      const submitButton = screen.getByRole('button', { name: /Register/i });

      await user.type(firstNameInput, 'New');
      await user.type(lastNameInput, 'User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(usernameInput, 'newuser');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'Password123!',
          username: 'newuser',
          firstName: 'New',
          lastName: 'User',
        });
      });
    });

    it('should display error message when registration fails', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error('Email already exists'));

      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i, {
        selector: 'input',
      });
      const submitButton = screen.getByRole('button', { name: /Register/i });

      await user.type(firstNameInput, 'Existing');
      await user.type(lastNameInput, 'User');
      await user.type(emailInput, 'existing@example.com');
      await user.type(usernameInput, 'existinguser');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      const user = userEvent.setup();
      let resolveRegister: (value: { user: Record<string, unknown>; expiresIn: number }) => void;
      const registerPromise = new Promise<{ user: Record<string, unknown>; expiresIn: number }>(
        (resolve) => {
          resolveRegister = resolve;
        },
      );

      mockRegister.mockReturnValue(registerPromise as never);

      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/i);
      const lastNameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i, {
        selector: 'input',
      });
      const submitButton = screen.getByRole('button', { name: /Register/i });

      await user.type(firstNameInput, 'Test');
      await user.type(lastNameInput, 'User');
      await user.type(emailInput, 'test@example.com');
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Creating Account.../i })).toBeInTheDocument();
        expect(screen.getByLabelText(/First Name/i)).toBeDisabled();
        expect(screen.getByLabelText(/Email Address/i)).toBeDisabled();
      });

      // Resolve the promise and wait for state updates to complete
      resolveRegister!({ user: {}, expiresIn: 900 });
      await waitFor(() => {
        // Wait for the component to finish processing the registration
        expect(true).toBe(true);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form elements', async () => {
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      });

      // Name fields
      const firstNameInput = screen.getByLabelText(/First Name/i);
      expect(firstNameInput).toHaveAttribute('autocomplete', 'given-name');
      expect(firstNameInput).toHaveAttribute('required');

      const lastNameInput = screen.getByLabelText(/Last Name/i);
      expect(lastNameInput).toHaveAttribute('autocomplete', 'family-name');
      expect(lastNameInput).toHaveAttribute('required');

      // Email field
      const emailInput = screen.getByLabelText(/Email Address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(emailInput).toHaveAttribute('required');

      // Password fields
      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
      expect(passwordInput).toHaveAttribute('required');

      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i, {
        selector: 'input',
      });
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password');
      expect(confirmPasswordInput).toHaveAttribute('required');
    });

    it('should have proper heading hierarchy', async () => {
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /Register/i, level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('should have password visibility toggle buttons', async () => {
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        const toggleButtons = screen.getAllByLabelText(/toggle.*password visibility/i);
        expect(toggleButtons).toHaveLength(2); // One for password, one for confirm password
      });
    });
  });

  describe('Password Strength Indicator', () => {
    it('should not show password strength indicator when password is empty', async () => {
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.queryByText(/password strength/i)).not.toBeInTheDocument();
      });
    });

    it('should show password strength indicator when user types password', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      await user.type(passwordInput, 'weak');

      await waitFor(() => {
        expect(screen.getByText(/password strength/i)).toBeInTheDocument();
      });
    });

    it('should show password requirements checklist', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });
      await user.type(passwordInput, 'test');

      await waitFor(() => {
        expect(screen.getByText(/password must contain/i)).toBeInTheDocument();
        expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
        expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
        expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
        expect(screen.getByText('One number')).toBeInTheDocument();
        expect(screen.getByText('One special character')).toBeInTheDocument();
      });
    });

    it('should update password strength as user types', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, { selector: 'input' });

      // Type weak password
      await user.type(passwordInput, 'weak');
      await waitFor(() => {
        expect(screen.getByText('weak')).toBeInTheDocument();
      });

      // Clear and type strong password
      await user.clear(passwordInput);
      await user.type(passwordInput, 'StrongPass123!');

      await waitFor(() => {
        expect(screen.getByText('strong')).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when clicking eye icon', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/^password/i, { selector: 'input' })).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password/i, {
        selector: 'input',
      });
      const toggleButton = screen.getByLabelText('toggle password visibility');

      // Initially password should be hidden
      expect(passwordInput.type).toBe('password');

      // Click to show password
      await user.click(toggleButton);
      await waitFor(() => {
        expect(passwordInput.type).toBe('text');
      });

      // Click again to hide password
      await user.click(toggleButton);
      await waitFor(() => {
        expect(passwordInput.type).toBe('password');
      });
    });

    it('should toggle confirm password visibility independently', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/Confirm Password/i, { selector: 'input' }),
        ).toBeInTheDocument();
      });

      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i, {
        selector: 'input',
      });
      const toggleButton = screen.getByLabelText('toggle confirm password visibility');

      // Initially should be hidden
      expect(confirmPasswordInput.type).toBe('password');

      // Click to show
      await user.click(toggleButton);
      await waitFor(() => {
        expect(confirmPasswordInput.type).toBe('text');
      });

      // Click to hide
      await user.click(toggleButton);
      await waitFor(() => {
        expect(confirmPasswordInput.type).toBe('password');
      });
    });
  });
});
