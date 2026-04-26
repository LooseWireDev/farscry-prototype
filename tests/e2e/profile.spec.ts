import { test, expect } from '@playwright/test';
import { uniqueUser, signUp, setUsername } from './helpers';

test.describe('user profile', () => {
  test('user can set a username and gets a display ID', async ({ page }) => {
    const user = uniqueUser('profile');
    await signUp(page, user);

    const username = `tester${Date.now().toString().slice(-6)}`;
    const displayId = await setUsername(page, username);

    expect(displayId).toMatch(new RegExp(`^${username}#[a-f0-9]{6}$`));
  });

  test('username cannot be changed once set', async ({ page }) => {
    const user = uniqueUser('lock');
    await signUp(page, user);

    const username = `locked${Date.now().toString().slice(-6)}`;
    await setUsername(page, username);

    // The username input should no longer be visible
    await page.goto('/settings');
    await expect(page.getByPlaceholder('username')).not.toBeVisible();
  });

  test('display ID has the username#hexcode format', async ({ page }) => {
    const user = uniqueUser('format');
    await signUp(page, user);

    const username = `fmt${Date.now().toString().slice(-6)}`;
    const displayId = await setUsername(page, username);

    const [name, code] = displayId.split('#');
    expect(name).toBe(username);
    expect(code).toMatch(/^[a-f0-9]{6}$/);
  });
});
