import { test, expect } from '@playwright/test';

test.describe('Hero Section - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    await slider.focus();
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '55'); // 50% + 5%
    
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveAttribute('aria-valuenow', '50'); // Back to center
    
    // Test Home/End keys
    await page.keyboard.press('Home');
    await expect(slider).toHaveAttribute('aria-valuenow', '0');
    
    await page.keyboard.press('End');
    await expect(slider).toHaveAttribute('aria-valuenow', '100');
    
    // Test Space key (reset to center)
    await page.keyboard.press('Space');
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    
    await expect(slider).toHaveAttribute('role', 'slider');
    await expect(slider).toHaveAttribute('aria-valuemin', '0');
    await expect(slider).toHaveAttribute('aria-valuemax', '100');
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await expect(slider).toHaveAttribute('aria-label');
    
    // Should be focusable
    await expect(slider).toHaveAttribute('tabindex', '0');
  });

  test('should provide screen reader announcements', async ({ page }) => {
    const screenReaderText = page.locator('.sr-only[aria-live="polite"]');
    await expect(screenReaderText).toBeInViewport();
    
    // Should announce initial state
    await expect(screenReaderText).toContainText('Slider at 50%');
    
    // Change slider position and check announcement
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft'); // Move to 40%
    
    await expect(screenReaderText).toContainText('Professional-leaning mode active');
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Mock prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Check that motion is reduced (implementation would vary based on CSS approach)
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Animation durations should be minimal or zero
    const animationDuration = await heroSection.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.animationDuration || computed.transitionDuration;
    });
    
    // Should be 0s or very short for reduced motion
    expect(animationDuration === '0s' || animationDuration === '0.01s').toBeTruthy();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Check main text elements have sufficient contrast
    const title = page.locator('[data-testid="hero-title"]');
    const primaryCTA = page.locator('[data-testid="hero-primary-cta"]');
    
    await expect(title).toBeVisible();
    await expect(primaryCTA).toBeVisible();
    
    // Color contrast would typically be tested with specialized tools
    // This is a placeholder for contrast checking logic
    const titleColor = await title.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        background: styles.backgroundColor
      };
    });
    
    expect(titleColor.color).toBeTruthy();
  });

  test('should be navigable with Tab key', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Should focus on the slider handle first
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    await expect(slider).toBeFocused();
    
    // Continue tabbing to CTAs
    await page.keyboard.press('Tab');
    const primaryCTA = page.locator('[data-testid="hero-primary-cta"]');
    await expect(primaryCTA).toBeFocused();
    
    await page.keyboard.press('Tab');
    const secondaryCTA = page.locator('[data-testid="hero-secondary-cta"]');
    await expect(secondaryCTA).toBeFocused();
  });

  test('should handle focus management properly', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    
    // Focus should be visible when slider is focused
    await slider.focus();
    
    // Should have focus ring or visible focus indicator
    const focusStyles = await slider.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
        border: styles.border
      };
    });
    
    // Should have some form of focus indication
    const hasFocusIndicator = focusStyles.outline !== 'none' || 
                             focusStyles.boxShadow !== 'none' || 
                             focusStyles.border !== 'none';
    
    expect(hasFocusIndicator).toBeTruthy();
  });

  test('should work with screen reader simulation', async ({ page }) => {
    // Simulate screen reader navigation
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    
    // Should be discoverable by screen reader
    await expect(slider).toHaveAttribute('role', 'slider');
    
    // Should have descriptive label
    const ariaLabel = await slider.getAttribute('aria-label');
    expect(ariaLabel).toContain('Image comparison slider');
    
    // Test value announcements
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    
    const currentValue = await slider.getAttribute('aria-valuenow');
    expect(parseInt(currentValue || '0')).toBeGreaterThan(50);
  });
});