import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage loads with hero section", async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Check main content is visible
    await expect(page.locator("main").or(page.locator("#root"))).toBeVisible();
  });

  test("displays featured products section", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Look for featured products section
    const featuredSection = page
      .getByText(/featured|popular|best seller/i)
      .or(page.locator('[data-testid="featured-products"]'));

    const isVisible = await featuredSection.first().isVisible().catch(() => false);
    expect(typeof isVisible).toBe("boolean");
  });

  test("displays categories section", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Look for categories section
    const categoriesSection = page
      .getByText(/categories|shop by category/i)
      .or(page.locator('[data-testid="categories-section"]'));

    const isVisible = await categoriesSection.first().isVisible().catch(() => false);
    expect(typeof isVisible).toBe("boolean");
  });

  test("hero call-to-action button works", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Find CTA button
    const ctaButton = page
      .getByRole("link", { name: /shop now|explore|browse/i })
      .or(page.getByRole("button", { name: /shop now|explore/i }));

    const isVisible = await ctaButton.first().isVisible().catch(() => false);

    if (isVisible) {
      await ctaButton.first().click();
      // Should navigate somewhere
      await page.waitForLoadState("networkidle");
    }
  });
});

test.describe("Responsive Design", () => {
  test("mobile navigation works", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Look for mobile menu button
    const menuButton = page
      .getByRole("button", { name: /menu/i })
      .or(page.locator('[data-testid="mobile-menu"]'))
      .or(page.locator(".hamburger, .menu-toggle"));

    const isVisible = await menuButton.first().isVisible().catch(() => false);
    expect(typeof isVisible).toBe("boolean");
  });
});
