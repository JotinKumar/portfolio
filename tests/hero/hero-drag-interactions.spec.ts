import { test, expect } from '@playwright/test';

test.describe('Hero Section - Drag Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });

  test('should initialize slider at neutral position (50%)', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    await expect(slider).toBeVisible();
    
    // Check initial aria-valuenow attribute
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  test('should change to professional mode when dragged left (<25%)', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    // Get container bounds for relative positioning
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    // Drag to 20% position (professional mode)
    await slider.dragTo(container, {
      targetPosition: { 
        x: containerBox.width * 0.2, 
        y: containerBox.height / 2 
      }
    });
    
    // Check professional mode is active
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Business Process Expert');
    await expect(page.locator('[data-testid="hero-primary-cta"]')).toContainText('Download Resume');
    
    // Verify slider position
    await expect(slider).toHaveAttribute('aria-valuenow', /^(1[0-9]|2[0-4])$/); // 10-24
  });

  test('should change to tech mode when dragged right (>75%)', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    // Drag to 80% position (tech mode)  
    await slider.dragTo(container, {
      targetPosition: { 
        x: containerBox.width * 0.8, 
        y: containerBox.height / 2 
      }
    });
    
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Full Stack Developer');
    await expect(page.locator('[data-testid="hero-primary-cta"]')).toContainText('View Projects');
    
    // Verify slider position is >75%
    const sliderValue = await slider.getAttribute('aria-valuenow');
    expect(parseInt(sliderValue || '0')).toBeGreaterThan(75);
  });

  test('should show neutral-center mode in dead zone (45-55%)', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    // Drag to 50% position (neutral center)
    await slider.dragTo(container, {
      targetPosition: { 
        x: containerBox.width * 0.5, 
        y: containerBox.height / 2 
      }
    });
    
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Multi-faceted Professional');
    await expect(page.locator('[data-testid="hero-primary-cta"]')).toContainText('Explore My Work');
    
    // Check dead zone overlay is visible
    await expect(page.locator('[data-testid="dead-zone-overlay"]')).toBeVisible();
    
    // Verify slider position is in dead zone (45-55%)
    const sliderValue = await slider.getAttribute('aria-valuenow');
    const value = parseInt(sliderValue || '0');
    expect(value).toBeGreaterThanOrEqual(45);
    expect(value).toBeLessThanOrEqual(55);
  });

  test('should show professional-lean mode (25-44%)', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    await slider.dragTo(container, { 
      targetPosition: { 
        x: containerBox.width * 0.35, // 35%
        y: containerBox.height / 2 
      } 
    });
    
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Business Expert with Tech Edge');
    
    // Verify slider position is in professional-lean range
    const sliderValue = await slider.getAttribute('aria-valuenow');
    const value = parseInt(sliderValue || '0');
    expect(value).toBeGreaterThanOrEqual(25);
    expect(value).toBeLessThanOrEqual(44);
  });

  test('should show tech-lean mode (56-75%)', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    await slider.dragTo(container, { 
      targetPosition: { 
        x: containerBox.width * 0.65, // 65%
        y: containerBox.height / 2 
      } 
    });
    
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Developer with Business Insight');
    
    // Verify slider position is in tech-lean range  
    const sliderValue = await slider.getAttribute('aria-valuenow');
    const value = parseInt(sliderValue || '0');
    expect(value).toBeGreaterThanOrEqual(56);
    expect(value).toBeLessThanOrEqual(75);
  });

  test('should support touch interactions on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Touch test only runs on mobile');
    }
    
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    // Touch drag to tech mode
    await page.touchscreen.tap(containerBox.x + containerBox.width * 0.8, containerBox.y + containerBox.height / 2);
    
    // Should update to tech mode
    await expect(page.locator('[data-testid="mobile-hero-content"] [data-testid="hero-title"]')).toContainText('Full Stack Developer');
  });

  test('should persist slider position in localStorage', async ({ page }) => {
    const slider = page.locator('[data-testid="image-comparison-handle"]');
    const container = page.locator('[data-testid="image-comparison-container"]');
    
    const containerBox = await container.boundingBox();
    if (!containerBox) throw new Error('Container not found');
    
    // Drag to 80% position
    await slider.dragTo(container, {
      targetPosition: { 
        x: containerBox.width * 0.8, 
        y: containerBox.height / 2 
      }
    });
    
    // Reload page
    await page.reload();
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    // Should maintain tech mode
    await expect(page.locator('[data-testid="hero-subtitle"]')).toContainText('Full Stack Developer');
  });
});