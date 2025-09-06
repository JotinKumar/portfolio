import { test, expect } from '@playwright/test';

test.describe('Portfolio Website E2E Tests', () => {
  test('should navigate through all main pages successfully', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    
    // Check hero section is visible
    await expect(page.getByText('Jotin Kumar Madugula')).toBeVisible();
    
    // Navigate to Profile page
    await page.getByText('Profile').first().click();
    await expect(page.getByText('About Me')).toBeVisible();
    await expect(page.getByText('Work Experience')).toBeVisible();
    
    // Navigate to Articles page
    await page.getByText('Articles').first().click();
    await expect(page.getByText('Thoughts on business processes')).toBeVisible();
    
    // Navigate to Projects page
    await page.getByText('Projects').first().click();
    await expect(page.getByText('A showcase of my latest work')).toBeVisible();
    
    // Navigate to Contact page
    await page.getByText('Contact').first().click();
    await expect(page.getByText('Get in Touch')).toBeVisible();
    await expect(page.getByText('Send a Message')).toBeVisible();
  });

  test('should display seeded articles and projects', async ({ page }) => {
    // Check articles page has content
    await page.goto('/articles');
    await expect(page.getByText('AI Transformation in Business Processes')).toBeVisible();
    await expect(page.getByText('Remote Work Productivity Tips')).toBeVisible();
    
    // Check projects page has content
    await page.goto('/projects');
    await expect(page.getByText('Personal Portfolio Website')).toBeVisible();
    await expect(page.getByText('Business Process Automation Dashboard')).toBeVisible();
  });

  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out contact form
    await page.getByPlaceholder('Your full name').fill('Test User');
    await page.getByPlaceholder('your.email@example.com').fill('test@example.com');
    await page.getByPlaceholder('Tell me about your project').fill('This is a test message for the contact form.');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for success message (toast)
    await expect(page.getByText('Message sent successfully!')).toBeVisible();
  });

  test('should toggle theme correctly', async ({ page }) => {
    await page.goto('/');
    
    // Find and click theme toggle
    const themeToggle = page.getByRole('button').filter({ hasText: /Toggle theme/ });
    await themeToggle.click();
    
    // Check if dark mode is applied (by checking if html has dark class)
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test('should show work timeline with sample data', async ({ page }) => {
    await page.goto('/');
    
    // Check work timeline section
    await expect(page.getByText('Work Experience')).toBeVisible();
    await expect(page.getByText('Tech Solutions Inc.')).toBeVisible();
    await expect(page.getByText('Innovation Corp')).toBeVisible();
    await expect(page.getByText('Senior Business Process Analyst')).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu should be visible
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu
    await mobileMenuButton.click();
    
    // Check if menu items are visible
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
  });

  test('should display proper meta information', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Jotin Kumar Madugula/);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Business Process Expert/);
  });
});