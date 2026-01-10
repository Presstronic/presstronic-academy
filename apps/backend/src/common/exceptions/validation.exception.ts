/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, type ValidationErrorDetail } from '@presstronic/shared';

/**
 * Custom exception for validation errors
 * Provides detailed field-level validation error information
 *
 * @example
 * throw new ValidationException([
 *   { field: 'email', message: 'Invalid email format', value: 'not-an-email' },
 *   { field: 'age', message: 'Must be at least 18', value: 15 }
 * ]);
 */
export class ValidationException extends HttpException {
  constructor(
    public readonly validationErrors: ValidationErrorDetail[],
    message = 'Validation failed',
    public readonly errorCode: ErrorCode = ErrorCode.VALIDATION_ERROR,
  ) {
    super(
      {
        message,
        errorCode,
        validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
