/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { execSync } from 'child_process';
import { existsSync, rmSync, statSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

/**
 * Tests for bundle analyzer configuration
 *
 * These tests verify that the bundle analyzer is properly configured
 * and generates the expected output files.
 */
describe('Bundle Analyzer', () => {
  const workspaceRoot = process.cwd();
  const statsPath = resolve(workspaceRoot, 'dist/stats.html');

  it('should generate stats.html when ANALYZE=true', () => {
    // Remove existing stats.html if present
    if (existsSync(statsPath)) {
      rmSync(statsPath);
    }

    // Run build with ANALYZE flag
    execSync('ANALYZE=true pnpm build', {
      cwd: workspaceRoot,
      stdio: 'pipe',
      env: { ...process.env, ANALYZE: 'true' },
    });

    // Verify stats.html was created
    expect(existsSync(statsPath)).toBe(true);

    // Verify the file has content (should be several MB)
    const stats = statSync(statsPath);
    expect(stats.size).toBeGreaterThan(1000000); // At least 1MB

    console.log(`Bundle stats generated: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }, 180000); // 3 minute timeout for build

  it('should not generate stats.html in normal build', () => {
    // Remove existing stats.html if present
    if (existsSync(statsPath)) {
      rmSync(statsPath);
    }

    // Run normal build (without ANALYZE flag)
    execSync('pnpm build', {
      cwd: workspaceRoot,
      stdio: 'pipe',
      env: { ...process.env, ANALYZE: undefined },
    });

    // Stats file should not be created in normal build
    expect(existsSync(statsPath)).toBe(false);
  }, 180000);
});
