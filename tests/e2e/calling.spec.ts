import { test, expect } from '@playwright/test';
import { uniqueUser, signUp, setUsername, waitForOnline } from './helpers';

test.describe('calling', () => {
  test('caller can initiate a call and callee sees incoming call notification', async ({ browser }) => {
    // Set up two users in separate contexts
    const userA = uniqueUser('caller');
    const userB = uniqueUser('callee');

    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await signUp(pageA, userA);
    await signUp(pageB, userB);

    const usernameA = `caller${Date.now().toString().slice(-6)}`;
    const usernameB = `callee${Date.now().toString().slice(-6)}`;
    await setUsername(pageA, usernameA);
    const displayIdB = await setUsername(pageB, usernameB);

    // A adds B as a contact
    await pageA.goto('/');
    await pageA.getByPlaceholder('username#code or username').fill(displayIdB);
    await pageA.getByRole('button', { name: 'Find' }).click();
    const addBtnA = pageA.getByRole('button', { name: 'Add' });
    await expect(addBtnA).toBeVisible({ timeout: 5000 });
    await addBtnA.click();
    const contactsSectionA = pageA.locator('h2', { hasText: 'Contacts' }).locator('..');
    await expect(contactsSectionA.locator(`text=${displayIdB}`)).toBeVisible({ timeout: 5000 });

    // B should be online (waitForOnline puts B on contacts page)
    await waitForOnline(pageB);

    // A initiates a call by hovering and clicking the call button on the contact
    await pageA.goto('/');
    await pageA.locator(`text=${displayIdB}`).hover();
    await pageA.getByRole('button', { name: new RegExp(`Call ${usernameB}`) }).click();

    // B should see incoming call overlay
    await expect(pageB.locator('text=Incoming')).toBeVisible({ timeout: 10000 });

    // B answers
    await pageB.getByRole('button', { name: 'Answer call' }).click();

    // Both should see active call (hang up button visible)
    await expect(pageA.getByRole('button', { name: 'Hang up' })).toBeVisible({ timeout: 10000 });
    await expect(pageB.getByRole('button', { name: 'Hang up' })).toBeVisible({ timeout: 10000 });

    // A hangs up
    await pageA.getByRole('button', { name: 'Hang up' }).click();

    // B should return to contacts view
    await expect(pageB.getByRole('button', { name: 'Hang up' })).not.toBeVisible({ timeout: 5000 });

    await ctxA.close();
    await ctxB.close();
  });

  test('callee can decline a call', async ({ browser }) => {
    const userA = uniqueUser('caller2');
    const userB = uniqueUser('decliner');

    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await signUp(pageA, userA);
    await signUp(pageB, userB);

    const usernameA = `cal2${Date.now().toString().slice(-6)}`;
    const usernameB = `dec${Date.now().toString().slice(-6)}`;
    await setUsername(pageA, usernameA);
    const displayIdB = await setUsername(pageB, usernameB);

    // A adds B
    await pageA.goto('/');
    await pageA.getByPlaceholder('username#code or username').fill(displayIdB);
    await pageA.getByRole('button', { name: 'Find' }).click();
    const addBtnA2 = pageA.getByRole('button', { name: 'Add' });
    await expect(addBtnA2).toBeVisible({ timeout: 5000 });
    await addBtnA2.click();
    const contactsSectionA2 = pageA.locator('h2', { hasText: 'Contacts' }).locator('..');
    await expect(contactsSectionA2.locator(`text=${displayIdB}`)).toBeVisible({ timeout: 5000 });

    await waitForOnline(pageB);

    // A calls B
    await pageA.goto('/');
    await pageA.locator(`text=${displayIdB}`).hover();
    await pageA.getByRole('button', { name: new RegExp(`Call ${usernameB}`) }).click();

    // B sees incoming and declines
    await expect(pageB.locator('text=Incoming')).toBeVisible({ timeout: 10000 });
    await pageB.getByRole('button', { name: 'Decline call' }).click();

    // Incoming overlay should disappear on B
    await expect(pageB.locator('text=Incoming')).not.toBeVisible({ timeout: 5000 });

    // Active call shouldn't be active on A
    await expect(pageA.getByRole('button', { name: 'Hang up' })).not.toBeVisible({ timeout: 5000 });

    await ctxA.close();
    await ctxB.close();
  });
});
