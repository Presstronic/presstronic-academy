/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * @file register.dto.spec.ts — Presstronic Academy backend tests (type-safe, no `any`)
 */
import { describe, expect, it } from '@jest/globals';
import { validate } from 'class-validator';

import { RegisterDto } from './register.dto.js';

const buildDto = (password: string): RegisterDto => {
  const dto = new RegisterDto();
  dto.email = 'test@example.com';
  dto.username = 'tester';
  dto.password = password;
  return dto;
};

describe('RegisterDto password validation', () => {
  it('accepts passwords that meet complexity requirements', async () => {
    const errors = await validate(buildDto('StrongPass123!'));
    expect(errors).toHaveLength(0);
  });

  it('rejects passwords missing uppercase, lowercase, number, or special character', async () => {
    const errors = await validate(buildDto('password123'));
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError?.constraints?.matches).toBe(
      'Password must contain uppercase, lowercase, number, and special character',
    );
  });

  it('rejects passwords shorter than 8 characters', async () => {
    const errors = await validate(buildDto('P1!a'));
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError?.constraints?.minLength).toBe(
      'Password must be at least 8 characters long',
    );
  });
});
