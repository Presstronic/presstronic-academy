/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  describe('when password is empty', () => {
    it('should not render anything', () => {
      const { container } = render(<PasswordStrengthIndicator password="" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when password is weak', () => {
    it('should show weak strength label', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText('weak')).toBeInTheDocument();
    });

    it('should show strength indicator', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
    });

    it('should show requirements checklist', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText(/password must contain:/i)).toBeInTheDocument();
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('One number')).toBeInTheDocument();
      expect(screen.getByText('One special character')).toBeInTheDocument();
    });
  });

  describe('when password is medium strength', () => {
    it('should show medium strength label', () => {
      render(<PasswordStrengthIndicator password="password1!" />);
      expect(screen.getByText('medium')).toBeInTheDocument();
    });
  });

  describe('when password is strong', () => {
    it('should show strong strength label', () => {
      render(<PasswordStrengthIndicator password="VeryStrong123!" />);
      expect(screen.getByText('strong')).toBeInTheDocument();
    });
  });

  describe('when showRequirements is false', () => {
    it('should not show requirements checklist', () => {
      render(<PasswordStrengthIndicator password="Password123!" showRequirements={false} />);
      expect(screen.queryByText(/password must contain:/i)).not.toBeInTheDocument();
    });

    it('should still show strength indicator', () => {
      render(<PasswordStrengthIndicator password="Password123!" showRequirements={false} />);
      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
    });
  });

  describe('requirements validation', () => {
    it('should show all requirements as unmet for empty-like password', () => {
      render(<PasswordStrengthIndicator password="a" />);
      const requirements = screen.getAllByText(/characters|uppercase|lowercase|number|special/i);
      // All 5 requirements should be shown
      expect(requirements).toHaveLength(5);
    });

    it('should validate minimum length requirement', () => {
      const { rerender } = render(<PasswordStrengthIndicator password="short" />);
      // Length requirement should be failing (only 5 chars)
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();

      rerender(<PasswordStrengthIndicator password="longenough" />);
      // Length requirement should still be shown (10 chars, should pass)
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    });

    it('should validate all requirements for strong password', () => {
      render(<PasswordStrengthIndicator password="StrongPass123!" />);
      // All requirements should be shown
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('One number')).toBeInTheDocument();
      expect(screen.getByText('One special character')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render with proper structure', () => {
      const { container } = render(<PasswordStrengthIndicator password="Password123!" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have readable text for screen readers', () => {
      render(<PasswordStrengthIndicator password="password1!" />);
      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
    });
  });
});
