// Smoke tests for production
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

test.describe('Smoke Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should show login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should access health endpoint', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/health`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('should redirect unauthenticated to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/workspace`);
    expect(page.url()).toContain('/login');
  });

  test('should load chat interface after login', async ({ page }) => {
    // This would require actual login credentials
    // For smoke testing, we skip this or use test user
  });
});
