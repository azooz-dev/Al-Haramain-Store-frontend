import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");

    // Check page loaded
    await page.waitForLoadState("networkidle");

    // Check header is visible
    await expect(page.locator("header").first()).toBeVisible();
  });

  test("can navigate to products page", async ({ page }) => {
    await page.goto("/");

    // Click products link (try different selectors)
    const productsLink = page.locator('a[href*="products"]').first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/.*products/);
    }
  });

  test("footer is visible on homepage", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check footer is visible
    await expect(page.locator("footer").first()).toBeVisible();
  });
});
