import { test, expect } from '@playwright/test';
import { uniqueUser, signUp, signIn } from './helpers';

test.describe('authentication', () => {
  test('user can sign up and lands on contacts page', async ({ page }) => {
    const user = uniqueUser('signup');
    await signUp(page, user);

    await expect(page.locator('text=ONLINE')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('header').getByText('Sign out')).toBeVisible();
  });

  test('user can sign out and back in', async ({ page }) => {
    const user = uniqueUser('signin');
    await signUp(page, user);

    await page.getByRole('button', { name: 'Sign out' }).click();
    await page.waitForURL('/login');

    await signIn(page, user);
    await expect(page.locator('header').getByText('Sign out')).toBeVisible();
  });

  test('login page rejects invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('nonexistent@test.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('text=/invalid|failed|unauthorized/i')).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('protected routes redirect to login when signed out', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login');
  });

  test('login page redirects to home when already signed in', async ({ page }) => {
    const user = uniqueUser('redirect');
    await signUp(page, user);

    await page.goto('/login');
    await page.waitForURL('/');
  });
});
