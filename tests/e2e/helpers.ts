import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  username?: string;
  displayId?: string;
}

let counter = 0;

export function uniqueUser(prefix = 'user'): TestUser {
  counter++;
  const id = `${Date.now()}-${counter}`;
  return {
    email: `${prefix}-${id}@test.com`,
    password: 'testpassword123',
    name: `${prefix} ${id}`,
  };
}

export async function signUp(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Create one' }).click();
  await page.getByPlaceholder('Name').fill(user.name);
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('/');
}

export async function signIn(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/');
}

export async function setUsername(page: Page, username: string): Promise<string> {
  await page.goto('/settings');
  await page.getByPlaceholder('username').fill(username);
  await page.getByRole('button', { name: 'Set' }).click();
  // Wait for display ID to appear
  const displayIdLocator = page.locator('text=/^' + username + '#[a-f0-9]{6}$/');
  await expect(displayIdLocator).toBeVisible({ timeout: 5000 });
  const displayId = await displayIdLocator.textContent();
  return displayId ?? '';
}

export async function waitForOnline(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.locator('text=ONLINE')).toBeVisible({ timeout: 10000 });
}
