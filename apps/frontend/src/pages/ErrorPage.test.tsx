/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import ErrorPage from './ErrorPage';

function renderWithRouter(ui: ReactNode) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('ErrorPage', () => {
  it('renders with default props', () => {
    renderWithRouter(<ErrorPage />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Server Error')).toBeInTheDocument();
    expect(screen.getByText(/We're experiencing technical difficulties/)).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    renderWithRouter(<ErrorPage title="Custom Error" message="Custom error message" />);

    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('shows reload button by default', () => {
    renderWithRouter(<ErrorPage />);

    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  it('hides reload button when showReload is false', () => {
    renderWithRouter(<ErrorPage showReload={false} />);

    expect(screen.queryByRole('button', { name: /reload page/i })).not.toBeInTheDocument();
  });

  it('always shows go home button', () => {
    renderWithRouter(<ErrorPage />);

    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
  });

  it('reloads page when reload button is clicked', async () => {
    const user = userEvent.setup();
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    renderWithRouter(<ErrorPage />);

    const reloadButton = screen.getByRole('button', { name: /reload page/i });
    await user.click(reloadButton);

    expect(reloadSpy).toHaveBeenCalled();
  });
});
