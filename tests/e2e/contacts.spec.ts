import { test, expect } from '@playwright/test';
import { uniqueUser, signUp, setUsername } from './helpers';

test.describe('contacts', () => {
  test('user can search and add another user as a contact', async ({ browser }) => {
    // Create user A
    const userA = uniqueUser('alice');
    const ctxA = await browser.newContext();
    const pageA = await ctxA.newPage();
    await signUp(pageA, userA);
    const aliceUsername = `alice${Date.now().toString().slice(-6)}`;
    const aliceDisplayId = await setUsername(pageA, aliceUsername);

    // Create user B
    const userB = uniqueUser('bob');
    const ctxB = await browser.newContext();
    const pageB = await ctxB.newPage();
    await signUp(pageB, userB);
    const bobUsername = `bob${Date.now().toString().slice(-6)}`;
    await setUsername(pageB, bobUsername);

    // Bob searches for Alice and adds her
    await pageB.goto('/');
    await pageB.getByPlaceholder('username#code or username').fill(aliceDisplayId);
    await pageB.getByRole('button', { name: 'Find' }).click();

    // Add button appears once Alice is found
    const addBtn = pageB.getByRole('button', { name: 'Add' });
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    // Alice should appear in Bob's contacts list (under the Contacts heading)
    const contactsSection = pageB.locator('h2', { hasText: 'Contacts' }).locator('..');
    await expect(contactsSection.locator(`text=${aliceDisplayId}`)).toBeVisible({ timeout: 5000 });

    await ctxA.close();
    await ctxB.close();
  });

  test('user cannot add themselves as a contact', async ({ page }) => {
    const user = uniqueUser('self');
    await signUp(page, user);
    const username = `self${Date.now().toString().slice(-6)}`;
    const displayId = await setUsername(page, username);

    // Search for self
    await page.goto('/');
    await page.getByPlaceholder('username#code or username').fill(displayId);
    await page.getByRole('button', { name: 'Find' }).click();

    // Self should NOT appear in search results (filtered out by API)
    await page.waitForTimeout(1000);
    const resultsLocator = page.locator('text=Results');
    expect(await resultsLocator.isVisible()).toBe(false);
  });
});
