import { test, expect } from '@playwright/test';

test.describe('Home Featured Blogs Carousel', () => {
  test('ArchiveCard renders with correct alternating layout and interactions', async ({ page }) => {
    await page.goto('/');
    const secondaryRail = page.getByTestId('home-secondary-blogs-rail');
    await expect(secondaryRail).toBeVisible();
    
    // Check for alternating layout attribute or class (will implement this in Task 2)
    const firstCard = page.getByTestId('home-secondary-blog-card-0');
    const secondCard = page.getByTestId('home-secondary-blog-card-1');
    
    await expect(firstCard).toHaveAttribute('data-image-side', 'left');
    await expect(secondCard).toHaveAttribute('data-image-side', 'right');
  });
});
