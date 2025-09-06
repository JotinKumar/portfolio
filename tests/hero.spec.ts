import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test('should toggle between professional and tech modes', async ({ page }) => {
    await page.goto('/');
    
    // Use more specific selectors to target hero section
    const heroSection = page.locator('section').first();
    
    // Check initial state - should show Professional mode by default
    await expect(heroSection.getByRole('heading', { level: 2 })).toContainText('Business Process Expert');
    await expect(heroSection.getByText('Transforming operations through intelligent automation')).toBeVisible();
    
    // Toggle to tech mode
    await page.getByRole('switch').click();
    await expect(heroSection.getByRole('heading', { level: 2 })).toContainText('Full Stack Developer');
    await expect(heroSection.getByText('Building scalable solutions with modern technologies')).toBeVisible();
    
    // Check persistence - reload page and should still be in tech mode
    await page.reload();
    await expect(heroSection.getByRole('heading', { level: 2 })).toContainText('Full Stack Developer');
    
    // Toggle back to professional mode
    await page.getByRole('switch').click();
    await expect(heroSection.getByRole('heading', { level: 2 })).toContainText('Business Process Expert');
  });

  test('should display correct skills and CTAs for each mode', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('section').first();
    
    // Professional mode skills and CTAs
    await expect(heroSection.getByText('Process Optimization')).toBeVisible();
    await expect(heroSection.getByText('Team Leadership')).toBeVisible();
    await expect(heroSection.getByText('Download Resume')).toBeVisible();
    await expect(heroSection.getByText('Get in Touch')).toBeVisible();
    
    // Toggle to tech mode
    await page.getByRole('switch').click();
    
    // Tech mode skills and CTAs
    await expect(heroSection.getByText('Next.js')).toBeVisible();
    await expect(heroSection.getByText('React')).toBeVisible();
    await expect(heroSection.getByText('TypeScript')).toBeVisible();
    await expect(heroSection.getByText('View Projects')).toBeVisible();
    await expect(heroSection.getByText('Read Articles')).toBeVisible();
  });

  test('should have proper accessibility features', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('section').first();
    
    // Check that the switch has proper ARIA attributes
    const toggleSwitch = page.getByRole('switch');
    await expect(toggleSwitch).toBeVisible();
    
    // Test keyboard navigation
    await toggleSwitch.focus();
    await page.keyboard.press('Space');
    await expect(heroSection.getByRole('heading', { level: 2 })).toContainText('Full Stack Developer');
  });
});