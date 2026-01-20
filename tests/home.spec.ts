import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Save Point Apparel/i)
  await expect(page.getByRole('heading', { name: 'Save Point Apparel' })).toBeVisible()
})
