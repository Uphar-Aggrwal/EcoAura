import { test, expect } from '@playwright/test';

test('full user flow: questionnaire -> persona card -> share', async ({ page }) => {
  // Navigate to home
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Carbon Persona');

  // Click start button
  await page.locator('#start-journey-btn').click();
  await page.waitForURL('**/questionnaire');

  // Commute step
  await page.locator('button:has-text("Public Transit")').click();
  await page.locator('#next-step-btn').click();

  // Diet step
  await page.locator('button:has-text("Vegetarian")').click();
  await page.locator('#next-step-btn').click();

  // Energy step
  await page.locator('button:has-text("Solar")').click();
  await page.locator('#next-step-btn').click();

  // Shopping step
  await page.locator('button:has-text("Medium")').click();
  await page.locator('#next-step-btn').click();

  // Flights step (number input)
  await page.fill('input[type="number"]', '2');
  await page.locator('#see-persona-btn').click();

  // Wait for persona card page
  await page.waitForURL('**/persona-card');
  
  // Card title check
  await expect(page.locator('h1')).toBeVisible();

  // Check download button exists
  const downloadBtn = page.locator('#download-card-btn');
  await expect(downloadBtn).toBeVisible();

  // Check share button exists
  const shareBtn = page.locator('#share-btn');
  await expect(shareBtn).toBeVisible();
});
