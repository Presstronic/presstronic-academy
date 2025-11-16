/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { Check as CheckIcon } from '@mui/icons-material';
import { Box, LinearProgress, Typography } from '@mui/material';
import type { FC } from 'react';

import {
  getPasswordStrengthResult,
  PASSWORD_REQUIREMENTS,
} from '@/lib/validation/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

/**
 * Password strength indicator with optional requirements checklist
 *
 * Displays a visual strength meter and optionally shows which password
 * requirements are met with green checkmarks.
 */
export const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const { level, score, color } = getPasswordStrengthResult(password);

  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      {/* Strength Label and Progress Bar */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Password strength:{' '}
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: `${color}.main`,
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          >
            {level}
          </Typography>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={score}
          color={color}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </Box>

      {/* Password Requirements Checklist */}
      {showRequirements && (
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Password must contain:
          </Typography>
          {PASSWORD_REQUIREMENTS.map((requirement) => {
            const isMet = requirement.test(password);
            return (
              <Box
                key={requirement.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isMet ? 'success.main' : 'text.disabled',
                  fontSize: '0.75rem',
                }}
              >
                <CheckIcon sx={{ fontSize: 16, mr: 1 }} />
                {requirement.label}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
