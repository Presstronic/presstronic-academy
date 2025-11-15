/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { BrowserRouter, createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { ErrorBoundary, RouterErrorElement } from './ErrorBoundary';

// Component that throws an error for testing
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
}

// Helper to render with router context
function renderWithRouter(ui: ReactNode) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests since we expect errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error fallback when child component throws', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('ERROR')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows error message in development mode', () => {
    // Mock dev environment
    vi.stubEnv('DEV', true);

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Error message appears in both the paragraph and stack trace
    const errorMessages = screen.getAllByText(/Error: Test error message/);
    expect(errorMessages.length).toBeGreaterThan(0);

    vi.unstubAllEnvs();
  });

  it('shows generic message in production mode', () => {
    // Mock production environment
    vi.stubEnv('DEV', false);

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/We're experiencing technical difficulties/)).toBeInTheDocument();
    expect(screen.queryByText(/Test error message/)).not.toBeInTheDocument();

    vi.unstubAllEnvs();
  });

  it('provides reload and home buttons', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
  });

  it('reloads page when reload button is clicked', async () => {
    const user = userEvent.setup();
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const reloadButton = screen.getByRole('button', { name: /reload page/i });
    await user.click(reloadButton);

    expect(reloadSpy).toHaveBeenCalled();
  });
});

describe('RouterErrorElement', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('handles router errors gracefully', async () => {
    // Create a router that will trigger an error
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <div>Home</div>,
          errorElement: <RouterErrorElement />,
          loader: () => {
            throw new Error('Test loader error');
          },
        },
      ],
      {
        initialEntries: ['/'],
      },
    );

    render(<RouterProvider router={router} />);

    // Should show error page
    await screen.findByText('ERROR');
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
