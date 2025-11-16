/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { describe, expect, it } from 'vitest';

import {
  getPasswordStrength,
  getPasswordStrengthResult,
  PASSWORD_REQUIREMENTS,
  passwordsMatch,
  validatePassword,
} from './passwordValidation';

describe('passwordValidation', () => {
  describe('PASSWORD_REQUIREMENTS', () => {
    it('should have 5 requirements', () => {
      expect(PASSWORD_REQUIREMENTS).toHaveLength(5);
    });

    it('should test minimum length', () => {
      const req = PASSWORD_REQUIREMENTS[0];
      expect(req.label).toBe('At least 8 characters');
      expect(req.test('short')).toBe(false);
      expect(req.test('longenough')).toBe(true);
    });

    it('should test uppercase letter', () => {
      const req = PASSWORD_REQUIREMENTS[1];
      expect(req.label).toBe('One uppercase letter');
      expect(req.test('lowercase')).toBe(false);
      expect(req.test('Uppercase')).toBe(true);
    });

    it('should test lowercase letter', () => {
      const req = PASSWORD_REQUIREMENTS[2];
      expect(req.label).toBe('One lowercase letter');
      expect(req.test('UPPERCASE')).toBe(false);
      expect(req.test('Lowercase')).toBe(true);
    });

    it('should test number', () => {
      const req = PASSWORD_REQUIREMENTS[3];
      expect(req.label).toBe('One number');
      expect(req.test('noNumbers')).toBe(false);
      expect(req.test('has1Number')).toBe(true);
    });

    it('should test special character', () => {
      const req = PASSWORD_REQUIREMENTS[4];
      expect(req.label).toBe('One special character');
      expect(req.test('NoSpecial123')).toBe(false);
      expect(req.test('HasSpecial!')).toBe(true);
      expect(req.test('HasSpecial@')).toBe(true);
      expect(req.test('HasSpecial#')).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should return invalid for empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(5);
    });

    it('should return invalid for password missing uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('One uppercase letter');
    });

    it('should return invalid for password missing lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('One lowercase letter');
    });

    it('should return invalid for password missing number', () => {
      const result = validatePassword('Password!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('One number');
    });

    it('should return invalid for password missing special character', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('One special character');
    });

    it('should return invalid for password too short', () => {
      const result = validatePassword('Pass1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least 8 characters');
    });

    it('should return valid for password meeting all requirements', () => {
      const result = validatePassword('Password123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for complex password', () => {
      const result = validatePassword('MyStr0ng!Pass');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return 0 for empty password', () => {
      expect(getPasswordStrength('')).toBe(0);
    });

    it('should return low score for weak password', () => {
      const score = getPasswordStrength('weak');
      expect(score).toBeLessThan(40);
    });

    it('should return medium score for medium password', () => {
      const score = getPasswordStrength('password1!');
      expect(score).toBeGreaterThanOrEqual(40);
      expect(score).toBeLessThan(80);
    });

    it('should return high score for strong password', () => {
      const score = getPasswordStrength('VeryStrong123!');
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should cap score at 100', () => {
      const score = getPasswordStrength('SuperLongAndComplexPassword123!@#');
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give bonus for length >= 12', () => {
      const short = getPasswordStrength('Pass123!'); // 8 chars
      const long = getPasswordStrength('Password123!'); // 12 chars
      expect(long).toBeGreaterThan(short);
    });
  });

  describe('getPasswordStrengthResult', () => {
    it('should return weak for weak password', () => {
      const result = getPasswordStrengthResult('weak');
      expect(result.level).toBe('weak');
      expect(result.color).toBe('error');
      expect(result.score).toBeLessThan(40);
    });

    it('should return medium for medium password', () => {
      const result = getPasswordStrengthResult('password1!');
      expect(result.level).toBe('medium');
      expect(result.color).toBe('warning');
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThan(80);
    });

    it('should return strong for strong password', () => {
      const result = getPasswordStrengthResult('VeryStrong123!');
      expect(result.level).toBe('strong');
      expect(result.color).toBe('success');
      expect(result.score).toBeGreaterThanOrEqual(80);
    });

    it('should include score in result', () => {
      const result = getPasswordStrengthResult('Password123!');
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('passwordsMatch', () => {
    it('should return false for empty passwords', () => {
      expect(passwordsMatch('', '')).toBe(false);
    });

    it('should return false for non-matching passwords', () => {
      expect(passwordsMatch('password1', 'password2')).toBe(false);
    });

    it('should return true for matching passwords', () => {
      expect(passwordsMatch('password', 'password')).toBe(true);
    });

    it('should return true for matching complex passwords', () => {
      expect(passwordsMatch('MyStr0ng!Pass', 'MyStr0ng!Pass')).toBe(true);
    });

    it('should be case sensitive', () => {
      expect(passwordsMatch('Password', 'password')).toBe(false);
    });
  });
});
