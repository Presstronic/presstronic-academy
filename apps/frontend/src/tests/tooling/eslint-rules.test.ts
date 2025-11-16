/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

/**
 * Tests for React performance linting rules
 *
 * These tests verify that our ESLint configuration includes
 * the necessary React performance rules.
 */
describe('React Performance Linting Rules', () => {
  // ESLint config is at workspace root (two levels up from apps/frontend)
  const workspaceRoot = resolve(process.cwd(), '../..');
  const eslintConfigPath = resolve(workspaceRoot, 'eslint.config.js');

  it('should have eslint-plugin-react configured', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');

    // Verify plugin is imported
    expect(config).toContain("import react from 'eslint-plugin-react'");

    // Verify plugin is used in frontend config
    expect(config).toContain('react,');
  });

  it('should configure react/jsx-key rule', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/jsx-key': 'error'");
  });

  it('should configure react/no-array-index-key rule', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/no-array-index-key': 'warn'");
  });

  it('should configure react/jsx-no-constructed-context-values rule', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/jsx-no-constructed-context-values': 'error'");
  });

  it('should configure react/jsx-no-bind with allowArrowFunctions', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/jsx-no-bind'");
    expect(config).toContain('allowArrowFunctions: true');
  });

  it('should configure react/self-closing-comp rule', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/self-closing-comp': 'warn'");
  });

  it('should configure react/jsx-no-target-blank for security', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/jsx-no-target-blank': 'error'");
  });

  it('should detect React version automatically', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("version: 'detect'");
  });

  it('should disable react-in-jsx-scope for React 17+', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/react-in-jsx-scope': 'off'");
  });

  it('should disable prop-types in favor of TypeScript', () => {
    const config = readFileSync(eslintConfigPath, 'utf-8');
    expect(config).toContain("'react/prop-types': 'off'");
  });
});
