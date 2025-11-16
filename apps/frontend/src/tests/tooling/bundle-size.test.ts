/**
 * @file
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Tests for bundle size budgets
 *
 * These tests verify that our production bundles stay within
 * acceptable size limits to ensure good performance.
 *
 * NOTE: These tests require a production build to exist.
 * Run `pnpm build` before running these tests.
 */
describe('Bundle Size Budgets', () => {
  // Use process.cwd() to get the working directory (should be workspace root)
  const workspaceRoot = process.cwd();
  const distPath = resolve(workspaceRoot, 'dist/assets');

  // Helper to get gzipped size estimate (roughly 30% of original)
  const estimateGzipSize = (bytes: number) => bytes * 0.3;

  beforeAll(() => {
    // Verify dist folder exists before running tests
    if (!existsSync(distPath)) {
      throw new Error(`Build output not found at ${distPath}. Please run 'pnpm build' first.`);
    }
  });

  it('should keep total JavaScript bundle under 500 KB (gzipped)', () => {
    const files = readdirSync(distPath);
    const jsFiles = files.filter((f) => f.endsWith('.js'));

    let totalSize = 0;
    jsFiles.forEach((file) => {
      const filePath = resolve(distPath, file);
      const stats = statSync(filePath);
      totalSize += stats.size;
    });

    const estimatedGzipSize = estimateGzipSize(totalSize);
    const limitBytes = 500 * 1024; // 500 KB

    expect(estimatedGzipSize).toBeLessThan(limitBytes);
    console.log(
      `Total JS bundle size: ${(estimatedGzipSize / 1024).toFixed(2)} KB (gzipped estimate)`,
    );
  }, 120000);

  it('should keep total CSS bundle under 50 KB (gzipped)', () => {
    const files = readdirSync(distPath);
    const cssFiles = files.filter((f) => f.endsWith('.css'));

    let totalSize = 0;
    cssFiles.forEach((file) => {
      const filePath = resolve(distPath, file);
      const stats = statSync(filePath);
      totalSize += stats.size;
    });

    const estimatedGzipSize = estimateGzipSize(totalSize);
    const limitBytes = 50 * 1024; // 50 KB

    expect(estimatedGzipSize).toBeLessThan(limitBytes);
    console.log(
      `Total CSS bundle size: ${(estimatedGzipSize / 1024).toFixed(2)} KB (gzipped estimate)`,
    );
  });

  it('should split vendor chunks appropriately', () => {
    const files = readdirSync(distPath);
    const jsFiles = files.filter((f) => f.endsWith('.js'));

    // Check that we have vendor chunks
    const hasVendorReact = jsFiles.some((f) => f.includes('vendor-react'));
    const hasVendorMui = jsFiles.some((f) => f.includes('vendor-mui'));
    const hasVendor = jsFiles.some(
      (f) => f.includes('vendor') && !f.includes('vendor-react') && !f.includes('vendor-mui'),
    );

    expect(hasVendorReact).toBe(true);
    expect(hasVendorMui).toBe(true);
    expect(hasVendor).toBe(true);

    console.log('Vendor chunks found:');
    jsFiles
      .filter((f) => f.includes('vendor'))
      .forEach((file) => {
        const size = statSync(resolve(distPath, file)).size;
        console.log(`  ${file}: ${(size / 1024).toFixed(2)} KB`);
      });
  });

  it('should keep individual chunks under chunk size warning limit', () => {
    const files = readdirSync(distPath);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const chunkLimit = 500 * 1024; // 500 KB (our configured limit)

    jsFiles.forEach((file) => {
      const filePath = resolve(distPath, file);
      const stats = statSync(filePath);

      // Only vendor-react is expected to be large
      if (!file.includes('vendor-react')) {
        expect(stats.size).toBeLessThan(chunkLimit);
      }
    });
  });

  it('should not have excessive number of chunks', () => {
    const files = readdirSync(distPath);
    const jsFiles = files.filter((f) => f.endsWith('.js'));

    // We should have a reasonable number of chunks (not too fragmented)
    // Current setup: vendor-react, vendor-mui, vendor, index, and route chunks
    // Let's say max 20 chunks to allow for route splitting
    expect(jsFiles.length).toBeLessThan(20);
    console.log(`Total JavaScript chunks: ${jsFiles.length}`);
  });

  it('should document current bundle sizes for regression tracking', () => {
    const files = readdirSync(distPath);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const cssFiles = files.filter((f) => f.endsWith('.css'));

    console.log('\n=== Current Bundle Sizes ===');

    let totalJsSize = 0;
    console.log('\nJavaScript files:');
    jsFiles.forEach((file) => {
      const size = statSync(resolve(distPath, file)).size;
      totalJsSize += size;
      const gzipEstimate = estimateGzipSize(size);
      console.log(
        `  ${file}: ${(size / 1024).toFixed(2)} KB (${(gzipEstimate / 1024).toFixed(2)} KB gzipped)`,
      );
    });

    let totalCssSize = 0;
    console.log('\nCSS files:');
    cssFiles.forEach((file) => {
      const size = statSync(resolve(distPath, file)).size;
      totalCssSize += size;
      const gzipEstimate = estimateGzipSize(size);
      console.log(
        `  ${file}: ${(size / 1024).toFixed(2)} KB (${(gzipEstimate / 1024).toFixed(2)} KB gzipped)`,
      );
    });

    console.log('\nTotals:');
    console.log(
      `  JavaScript: ${(totalJsSize / 1024).toFixed(2)} KB (${(estimateGzipSize(totalJsSize) / 1024).toFixed(2)} KB gzipped)`,
    );
    console.log(
      `  CSS: ${(totalCssSize / 1024).toFixed(2)} KB (${(estimateGzipSize(totalCssSize) / 1024).toFixed(2)} KB gzipped)`,
    );
    console.log(
      `  Total: ${((totalJsSize + totalCssSize) / 1024).toFixed(2)} KB (${(estimateGzipSize(totalJsSize + totalCssSize) / 1024).toFixed(2)} KB gzipped)`,
    );

    // This test always passes - it's just for documentation
    expect(true).toBe(true);
  });
});
