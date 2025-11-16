/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/**
 * Password requirement definition
 */
export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Password strength level
 */
export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

/**
 * Password strength result
 */
export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number;
  color: 'error' | 'warning' | 'success';
}

/**
 * Standard password requirements for the application
 */
export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (password) => password.length >= 8 },
  { label: 'One uppercase letter', test: (password) => /[A-Z]/.test(password) },
  { label: 'One lowercase letter', test: (password) => /[a-z]/.test(password) },
  { label: 'One number', test: (password) => /[0-9]/.test(password) },
  {
    label: 'One special character',
    test: (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  },
];

/**
 * Validates a password against standard requirements
 * @param password - Password to validate
 * @returns Validation result with valid flag and list of unmet requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors = PASSWORD_REQUIREMENTS.filter((req) => !req.test(password)).map((req) => req.label);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates password strength on a 0-100 scale
 * @param password - Password to evaluate
 * @returns Strength score (0-100)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  // Length-based scoring
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 20;

  // Character type scoring
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 10;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 10;

  return Math.min(strength, 100);
}

/**
 * Gets password strength level with color coding
 * @param password - Password to evaluate
 * @returns Strength result with level, score, and MUI color
 */
export function getPasswordStrengthResult(password: string): PasswordStrengthResult {
  const score = getPasswordStrength(password);

  if (score < 40) {
    return { level: 'weak', score, color: 'error' };
  } else if (score < 80) {
    return { level: 'medium', score, color: 'warning' };
  } else {
    return { level: 'strong', score, color: 'success' };
  }
}

/**
 * Checks if passwords match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns True if passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}
