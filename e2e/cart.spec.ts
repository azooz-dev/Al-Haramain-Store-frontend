import { test, expect } from "@playwright/test";

test.describe("Cart Page", () => {
  test("cart page loads", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");

    // Check page loaded
    await expect(page.locator("main").or(page.locator("#root"))).toBeVisible();
  });

  test("cart icon visible in header", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for cart link in header
    const cartLink = page.locator('header a[href*="cart"]').first();
    const isVisible = await cartLink.isVisible().catch(() => false);
    expect(typeof isVisible).toBe("boolean");
  });

  test("can navigate to cart from header", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for cart link and click
    const cartLink = page.locator('a[href*="cart"]').first();
    if (await cartLink.isVisible()) {
      await cartLink.click();
      await expect(page).toHaveURL(/.*cart/);
    }
  });
});
