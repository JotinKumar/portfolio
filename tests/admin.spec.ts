import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should redirect to login when accessing admin without authentication', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Admin Login')).toBeVisible();
  });

  test('should login successfully with correct credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with seeded admin credentials
    await page.getByPlaceholder('admin@jotin.in').fill('admin@jotin.in');
    await page.getByPlaceholder('Enter your password').fill('admin123');
    
    // Submit login
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should be redirected to admin dashboard
    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  test('should show dashboard stats with seeded data', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('admin@jotin.in').fill('admin@jotin.in');
    await page.getByPlaceholder('Enter your password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check dashboard stats
    await expect(page.getByText('Total Articles')).toBeVisible();
    await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('Messages')).toBeVisible();
    
    // Should show recent articles
    await expect(page.getByText('Recent Articles')).toBeVisible();
    await expect(page.getByText('AI Transformation in Business Processes')).toBeVisible();
  });

  test('should navigate to articles admin page', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('admin@jotin.in').fill('admin@jotin.in');
    await page.getByPlaceholder('Enter your password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to articles
    await page.getByRole('link', { name: 'Articles' }).click();
    await expect(page).toHaveURL('/admin/articles');
    
    // Should show articles management page
    await expect(page.getByText('Manage your blog posts')).toBeVisible();
    await expect(page.getByText('New Article')).toBeVisible();
    
    // Should show seeded articles
    await expect(page.getByText('AI Transformation in Business Processes')).toBeVisible();
    await expect(page.getByText('Remote Work Productivity Tips')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('admin@jotin.in').fill('admin@jotin.in');
    await page.getByPlaceholder('Enter your password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Try to login with invalid credentials
    await page.getByPlaceholder('admin@jotin.in').fill('wrong@email.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should show error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});