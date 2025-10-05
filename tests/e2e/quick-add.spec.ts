import { test, expect } from '@playwright/test';

test.describe('Quick Add Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for app to load
    await page.waitForSelector('[data-testid="quick-add-form"]');
  });

  test('should add expense with amount and category', async ({ page }) => {
    // Fill amount
    await page.fill('[data-testid="amount-input"]', '250');

    // Select category
    await page.click('[data-testid="category-select"]');
    await page.selectOption('[data-testid="category-select"]', { label: 'Food & Dining' });

    // Submit
    await page.click('[data-testid="submit-button"]');

    // Verify form reset
    await expect(page.locator('[data-testid="amount-input"]')).toHaveValue('');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without amount
    await page.click('[data-testid="submit-button"]');

    // Button should be disabled
    await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
  });
});